var CryptoJS = require("crypto-js");
const stringRandom = require('string-random');

exports.encrypt = function (message) {
    var passwd = stringRandom(16);
    var keyHex = CryptoJS.enc.Utf8.parse(passwd);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return {
        key: keyHex,
        value: encrypted.toString()
    }
}

exports.decrypt = function (message, key) {
    var plaintext = CryptoJS.DES.decrypt(message, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return plaintext.toString(CryptoJS.enc.Utf8)
}

exports.hash = function (text) {
    return CryptoJS.MD5(text).toString();
}