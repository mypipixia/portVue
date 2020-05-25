const CryptoJS = require('crypto-js'); // 引用AES源码js
const key = 'Yang2019Qiao01Feng'; // 加密秘钥
const iv = 'Y1007Q2018F0908H'; //  矢量
class Encryption {
    constructor(hasEncrypt = true) {
        // 是否加密
        this.hasEncrypt = hasEncrypt;
    }

    // 加密
    encryptByDES(str) {
        if (typeof this.hasEncrypt === 'boolean' && this.hasEncrypt) {
            const KeyHex = CryptoJS.enc.Utf8.parse(key);
            const encrypted = CryptoJS.TripleDES.encrypt(str, KeyHex, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: CryptoJS.enc.Utf8.parse(iv)
            });
            const hexstr = encrypted.ciphertext.toString().toUpperCase();
            return hexstr;
        } else {
            return str;
        }
    }
    // 解密
    decryptByDES(str) {
        if (typeof this.hasEncrypt === 'boolean' && this.hasEncrypt) {
            const KeyHex = CryptoJS.enc.Utf8.parse(key);
            const WordArray = CryptoJS.enc.Hex.parse(str);
            const base64str = CryptoJS.enc.Base64.stringify(WordArray);
            const decrypted = CryptoJS.TripleDES.decrypt(base64str, KeyHex, {
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: CryptoJS.enc.Utf8.parse(iv)
            });
            return decrypted.toString(CryptoJS.enc.Utf8);
        } else {
            return str;
        }
    }
}
export default Encryption;
