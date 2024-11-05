// Thanks, Venator!

const CryptoJS = require("crypto-js");

function encrypt(username, password) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);

    const key = CryptoJS.PBKDF2(username, salt, {
        keySize: 256 / 32,
        iterations: 1000
    });

    const encrypted = CryptoJS.AES.encrypt(password, key, { iv: iv });

    return `${salt.toString(CryptoJS.enc.Hex)}${iv.toString(CryptoJS.enc.Hex)}${encrypted.toString()}`;
}

function decrypt(encryptData, username) {
    const saltHex = encryptData.substr(0, 32);
    const ivHex = encryptData.substr(32, 32);
    const ciphertext = encryptData.substr(64);

    const salt = CryptoJS.enc.Hex.parse(saltHex);
    const iv = CryptoJS.enc.Hex.parse(ivHex);

    const key = CryptoJS.PBKDF2(username, salt, {
        keySize: 256 / 32,
        iterations: 1000
    });

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

module.exports = { encrypt, decrypt };