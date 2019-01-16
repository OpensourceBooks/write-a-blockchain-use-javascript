var { PrivateKey, key, Address, Signature } = require("bitsharesjs");
var seedrandom = require('seedrandom');
var bip39 = require("bip39");
var fs = require('fs');

var mnemonic = bip39.generateMnemonic();
let privateKey = PrivateKey.fromSeed(key.normalize_brainKey(mnemonic));
let publicKey = privateKey.toPublicKey();
let address = Address.fromPublic(publicKey);


var space_count = 85 - mnemonic.length;
var spaceStr="";
for (let index = 0; index < space_count; index++) {
    spaceStr = spaceStr + " ";
}
spaceStr = spaceStr + "|";

console.log("\n 你要把助忆词和地址抄在安全的地方，key文件里仅仅保存私钥。 \n");
console.log("+--------------+---------------------------------------------------------------------------------------+");
console.log("|  mnemonic    |", mnemonic.toString(),spaceStr);
console.log("|  Privatekey  |", privateKey.toWif().toString(),"                                  |");
console.log("|  Publickey   |", publicKey.toString(), "                                |");
console.log("|  Address     |", address.toString(),"                                                 |");
console.log("+------------  +---------------------------------------------------------------------------------------+");

fs.writeFile('./key',privateKey.toWif().toString(),function (err) {
    if (err) {
        throw err;
    }
});