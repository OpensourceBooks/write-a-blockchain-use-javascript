'use strict';
var express = require("express");
var WebSocket = require("ws");
var bodyParser = require('body-parser');
var http_port = process.env.HTTP_PORT || 3001;//环境变量 HTTP服务器
var p2p_port = process.env.P2P_PORT || 6001;//环境变量 P2P服务器
var crypto = require("./lib/crypto");
var { PublicKey, Signature } = require("bitsharesjs");
var nStore = require('nstore');
nStore = nStore.extend(require('nstore/query')());

//var blockchain = [];//blockchain

function make_a_block(data, pre_hash, index) {
    var timetamp = Date.now();
    var hash_text = crypto.hash(data + pre_hash + timetamp);
    var block = {
        pre_hash: pre_hash,
        index: index,
        data: data,
        timetamp: timetamp,
        hash: hash_text
    };
    return block;
}

//创世
function g() {
    var pre_hash = "";
    var data = "Genesis";
    var block_g = make_a_block(data, pre_hash, 0);

    block_db.save("block_0", block_g, function (err) {
        if (err) { throw err; }
        // The save is finished and written to disk safely
    });
    block_db.save("index", 0, function (err) {
        if (err) { throw err; }
        // The save is finished and written to disk safely

    });
    broadcast(block_g);//广播
    //blockchain.push(make_a_block(data, pre_hash, 0));
}

function add_a_block_to_blockchain(data,res) {
    block_db.get("index", function (err, doc, key) {
        var index = 0;
        if (err) {
            //throw err; 
        } else {
            index = parseInt(doc);
        }
        block_db.get("block_" + index, function (err, doc, key) {
            if (err) { throw err; }
            var last_block = doc;
            var pre_hash = last_block.hash;
            var block = make_a_block(data, pre_hash, last_block.index + 1)
            //blockchain.push(block);
            broadcast(block);//广播
            block_db.save("block_" + block.index, block, function (err) {
                if (err) { throw err; }
                // The save is finished and written to disk safely
                block_db.save("index", block.index, function (err) {
                    if (err) { throw err; }
                    // The save is finished and written to disk safely
                    res.json({
                        texthash:data.texthash,
                        deskey:data.deskey,
                        index:block.index,
                        blockhash:block.hash
                    });
                });
            });
        });
    });

}

function get_all_blocks() {
    //return blockchain;
}

function verify_text(text, signedHex, publicKey) {
    //检测内容是不是具有签名的人签名的
    var signed2 = Signature.fromHex(signedHex);
    var publicKey = PublicKey.fromPublicKeyString(publicKey);
    return signed2.verifyBuffer(text, publicKey);
}

var sockets = [];//节点连接库

var initHttpServer = () => {//控制节点的HTTP服务器  类似节点操作
    var app = express();
    app.use(bodyParser.json());

    app.get('/peers', (req, res) => {//获取显示网络中存在的节点，
        res.send(sockets.map(s => s._socket.remoteAddress + ':' + s._socket.remotePort));
    });

    app.post('/addPeer', (req, res) => {//请求添加新的节点{"peer" : "ws://localhost:6001"}
        connectToPeers([req.body.peer]);//添加新节点
        res.send([req.body.peer]);
    });

    app.get('/g', (req, res) => {
        g();

        res.send("ok");
    });

    app.get('/blocks/all', (req, res) => {
        block_db.all(function (err, results) {
            res.json(results);
        });
    });

    app.post('/block', (req, res) => {//
        var text = req.body.text;
        var address = req.body.address;
        var publicKey = req.body.publicKey;
        var signedHex = req.body.signedHex;

        
        //检验
        if (verify_text(text, signedHex, publicKey)) {
            const des = crypto.encrypt(text);
            const texthash = crypto.hash(text);
            var data = {
                destext:des.value,
                deskey:des.key,
                texthash: texthash,
                address: address,
                publicKey: publicKey,
                signedHex: signedHex
            }
    
            add_a_block_to_blockchain(data,res);

            
        } else {
            res.send("error with verify text");
        }
        //

    });

    app.listen(http_port, () => console.log('Listening http on port: ' + http_port));//监听端口
}

//---建立P2P网络
var initP2PServer = () => {//P2P websocket全双工  服务器
    var server = new WebSocket.Server({ port: p2p_port });
    server.on('connection', ws => initConnection(ws));
    console.log('listening websocket p2p port on: ' + p2p_port);
};

var initConnection = (ws) => {//初始化连接
    sockets.push(ws);//压入已连接的节点堆栈
    initMessageHandler(ws);//信息处理
    initErrorHandler(ws);//错误状态处理
    //write(ws, blockchain[blockchain.length - 1]);//广播
    //write(ws, null);//广播
    console.log('new peer:' + ws._socket.remoteAddress + ':' + ws._socket.remotePort)
};

var initMessageHandler = (ws) => {//同步信息处理
    ws.on('message', (data) => {

        if (data) {

            var block = JSON.parse(data);
            handleBlock(block);//写入blockchain
        }

    });
};

var initErrorHandler = (ws) => {//错误信息处理
    var closeConnection = (ws) => {
        console.log('connection failed to peer: ' + ws.url + " " + ws._socket.remoteAddress + ':' + ws._socket.remotePort);
        sockets.splice(sockets.indexOf(ws), 1);
    };
    ws.on('close', () => closeConnection(ws));
    ws.on('error', () => closeConnection(ws));
};

var handleBlock = (block) => {//同步区块链信息

    console.log("sync:", block);



    block_db.get("index", function (err, doc, key) {
        var index = 0;
        if (err) {
            //throw err; 
            //说明之前没有，那么就把创世区块存进来。

            if (block.index == 0) {
                //如果同步的是创世区块
                block_db.save("block_0", block, function (err) {
                    if (err) { throw err; }
                    // The save is finished and written to disk safely
                });
                block_db.save("index", 0, function (err) {
                    if (err) { throw err; }
                    // The save is finished and written to disk safely

                });
                broadcast(block);//向临近节点广播
            }


        } else {
            index = parseInt(doc);
            //是新的区块
            if (block.index > index) {
                //hash 和 pre hash 能对上

                block_db.get("block_" + index, function (err, doc, key) {
                    if (err) {
                        throw err;
                    }
                    var last_block = doc;
                    console.log("last_block", last_block);
                    if (block.pre_hash == last_block.hash) {
                        block_db.save("block_" + block.index, block, function (err) {
                            if (err) { throw err; }
                            // The save is finished and written to disk safely
                        });
                        block_db.save("index", block.index, function (err) {
                            if (err) { throw err; }
                            // The save is finished and written to disk safely

                        });
                        broadcast(block);//向临近节点广播
                    }
                });


                //
            }

        }

    });



};

var connectToPeers = (newPeers) => {//连接新节点  客户端
    newPeers.forEach((peer) => {
        var ws = new WebSocket(peer);
        ws.on('open', () => initConnection(ws));
        ws.on('error', () => {
            console.log('connection failed')
        });
    });
};


var write = (ws, block) => ws.send(JSON.stringify(block));
var broadcast = (block) => sockets.forEach(socket => write(socket, block));





var block_db = nStore.new("block" + http_port + ".db", function () {
    // It's loaded now
    initHttpServer();
    initP2PServer();
});