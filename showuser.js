var { PrivateKey, Address } = require("bitsharesjs");
var seedrandom = require('seedrandom');
var bip39 = require("bip39");
var fs = require('fs');

fs.readFile('./key', 'utf-8', function (err, data) {
    if (err) {
        throw err;
    }
    let privateKey = PrivateKey.fromWif(data);
    let publicKey = privateKey.toPublicKey();
    let address = Address.fromPublic(publicKey);
    console.log("\n 这是你的信息 \n");
    console.log("+--------------+---------------------------------------------------------------------------------------+");
    console.log("|  Privatekey  |", privateKey.toWif().toString(),"                                  |");
    console.log("|  Publickey   |", publicKey.toString(), "                                |");
    console.log("|  Address     |", address.toString(),"                                                 |");
    console.log("+------------  +---------------------------------------------------------------------------------------+");
});