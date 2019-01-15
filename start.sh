HTTP_PORT=3001 P2P_PORT=6001 npm start;
HTTP_PORT=3002 P2P_PORT=6002 npm start;
HTTP_PORT=3003 P2P_PORT=6003 npm start;
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6001"}' http://localhost:3001/addPeer
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6002"}' http://localhost:3001/addPeer
curl -H "Content-type:application/json" --data '{"peer" : "ws://localhost:6003"}' http://localhost:3001/addPeer
