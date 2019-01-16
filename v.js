var { PublicKey,Signature } = require("bitsharesjs");

var signed2 = Signature.fromHex("2044c24ed4b006605c40d383a5575be7a6176db023ba9730722d55355566bcdc77296ed2b48e9d8b3b99f775aa5393cde73130fbdc94eb959f459bc160b9643a3a");
var publicKey = PublicKey.fromPublicKeyString("GPH8bX96YHfKKM64fRBW9bWgKcibvnNsdfhrwPwimLtR7zQMreVNG");
console.log("\nv:", signed2.verifyBuffer("ello", publicKey));