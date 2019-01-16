var { PrivateKey, key, Address, Signature } = require("bitsharesjs");
var seedrandom = require('seedrandom');
var bip39 = require("bip39");
var fs = require('fs');
var request = require('request');
var FormData = require('form-data');

var text = "test"
var node_host = "localhost";
var node_port = 3001;

fs.readFile('./key', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    }

    let privateKey = PrivateKey.fromWif(data);
    let publicKey = privateKey.toPublicKey();
    let address = Address.fromPublic(publicKey);
    var signed = Signature.signBuffer(text, privateKey);
    var signedHex = signed.toHex();


    var requestData = {
        text: text,
        address: address.toString(),
        publicKey: publicKey.toString(),
        signedHex: "1f5e1322e687bcb3b72f677e2bb12c2cb65bab43add250b955a96bd5d63189cc1546ca7109d96aff71b63a90f20e727a0c601dedd8b7b736da21d0d1a9cf717ba5"
    }

    httprequest(requestData);
});


var url = "http://" + node_host + ":" + node_port + "/block";
function httprequest(requestData) {
    request({
        url: url,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log(body);
        }
    });
};