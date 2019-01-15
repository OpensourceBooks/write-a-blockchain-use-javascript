# alpha


### 安装

```
npm install
```

### 启动

启动节点1
```
HTTP_PORT=3001 P2P_PORT=6001 npm start
```

启动节点2
```
HTTP_PORT=3002 P2P_PORT=6002 npm start
```

启动节点3
```
HTTP_PORT=3003 P2P_PORT=6003 npm start
```

### 配置节点

```
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6001"}' http://localhost:3001/addPeer
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6002"}' http://localhost:3001/addPeer
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6003"}' http://localhost:3001/addPeer
```

### 查看节点

```
curl http://localhost:3001/peers
```

### 创世

```
curl http://localhost:3001/g
```

### 增加区块

```
curl -H "Content-type:application/json" --data '{"data":"haha"}' http://localhost:3001/block

```

### 查询区块

curl http://localhost:3001/blocks/all
curl http://localhost:3002/blocks/all
curl http://localhost:3003/blocks/all


区块链的部分是我自己写的，p2p 这部分主要来源于 https://github.com/zfzGit/P2PNodejs/blob/master/main.js  项目。

### 交流

欢迎关注公众号 ForkChain

欢迎进入芥末圈

![](qrcode.jpg)