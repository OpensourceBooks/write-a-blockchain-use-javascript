# alpha


### 安装

```
npm install
```

### 启动

```
HTTP_PORT=3001 P2P_PORT=6001 npm start
HTTP_PORT=3002 P2P_PORT=6002 npm start
HTTP_PORT=3003 P2P_PORT=6003 npm start
```

### 增加节点

```
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6001"}' http://localhost:3001/addPeer
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6002"}' http://localhost:3001/addPeer
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6003"}' http://localhost:3001/addPeer
```

### 增加数字

```
curl -H "Content-type:application/json" --data '{"data":"haha"}' http://localhost:3001/block
curl -X POST -d "data=haha" http://localhost:3001/block

```

### 查询数字

curl http://localhos:3001/getNum
curl http://localhos:3002/getNum
curl http://localhos:3003/getNum


区块链的部分是我自己写的，p2p 这部分主要来源于 https://github.com/zfzGit/P2PNodejs/blob/master/main.js  项目。