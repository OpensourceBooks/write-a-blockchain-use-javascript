var { PrivateKey, key, Address, Signature } = require("bitsharesjs");
var seedrandom = require('seedrandom');
var bip39 = require("bip39");

//var rng = seedrandom();
//let seed = rng().toString();
// let privateKey = PrivateKey.fromSeed(key.normalize_brainKey(seed));
var mnemonic = bip39.generateMnemonic();
let privateKey = PrivateKey.fromSeed(key.normalize_brainKey(mnemonic));
let publicKey = privateKey.toPublicKey();
let address = Address.fromPublic(publicKey);


var text = "ello";

var signed = Signature.signBuffer(text, privateKey);
var signedHex = signed.toHex();


console.log("\nmnemonic:", mnemonic.toString());
console.log("\nPrivate key:", privateKey.toWif().toString());
console.log("\nPublic key :", publicKey.toString(), "\n");
console.log("\naddress:", address.toString());


console.log("\nsigned:", signedHex);

var signed2 = Signature.fromHex(signedHex);

console.log("\nv:", signed2.verifyBuffer("ello", publicKey))
