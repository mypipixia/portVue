import Encryption from './encrypt';
let encryption = null;
/**
 *	缓存类
 *	构造参数可以传入 sessionStorage,localStorage,
 * @class Cache
 * @example
 */
export default class Cache {
    /**
     *
     * @param {*} storage
     */
    constructor({ storage = sessionStorage, hasEncrypt = true } = {}) {
        this.storage = storage;
        encryption = new Encryption(hasEncrypt);
        this.encryption = encryption;
    }

    /**
     *
     *  设置缓存
     * @param {string} key 缓存键
     * @param {*} value 缓存值
     * @memberof Cache
     */
    setItem(key, value) {
        const message = this.encryption.encryptByDES(JSON.stringify(value));
        this.storage.setItem(key, message);
    }
    /**
     * 添加cookie
     * @param name cookie名字
     * @param value cookie内容
     * @param day 过期时间
     * 如果过期时间未设置,默认管理浏览器自动删除
     * 例子:
     *  cookieData.set('name','value',)
     */
    setCookie(name, value, day, hasEncrypt = true) {
        const setting = arguments[0];
        if (Object.prototype.toString.call(setting).slice(8, -1) === 'Object') {
            for (let i in setting) {
                const oDate = new Date();
                oDate.setDate(oDate.getDate() + day);
                document.cookie = i + '=' + setting[i] + ';expires=' + oDate;
            }
        } else {
            const oDate = new Date();
            oDate.setDate(oDate.getDate() + day);
            value = hasEncrypt
                ? this.encryption.encryptByDES(JSON.stringify(value))
                : value;
            document.cookie = name + '=' + value + ';expires=' + oDate;
        }
    }
    /**
     *
     *读取缓存
     * @param {string} key 缓存键
     * @returns 缓存值
     * @memberof Cache
     */
    getItem(key) {
        const str = this.storage.getItem(key);
        let message = null;
        if (str) {
            message = this.encryption.decryptByDES(str);
            try {
                return JSON.parse(message);
            } catch (e) {
                return str;
            }
        }
        return null;
    }
    /**
     * 根据名字获取cooki值
     * @param name cookie名
     * @returns {*} cookie值
     */
    getCookie(name, hasEncrypt = true) {
        const arr = document.cookie.split('; ');
        for (let i = 0; i < arr.length; i++) {
            const arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                let message = null;
                const str = arr2[1];
                if (hasEncrypt && str) {
                    message = this.encryption.decryptByDES(str);
                    try {
                        return JSON.parse(message);
                    } catch (e) {
                        return str;
                    }
                }
                return str;
            }
        }
        return '';
    }
    /**
     *
     *删除缓存
     * @param {string} key 缓存键
     * @memberof Cache
     */
    removeItem(key) {
        this.storage.removeItem(key);
    }
    /**
     * 根据cookie名字删除cookie
     * @param name cookie名字
     */
    removeCookie(name) {
        this.setCookie(name, 1, -1);
    }
    /**
     *
     *删除该实例所有缓存
     * @memberof Cache
     */
    removeAll() {
        this.storage.clear();
    }

    /**
     *
     * 快速获取缓存
     * @param {string} key 缓存键
     * @param {*} name 缓存名字
     * @returns {*}
     * @memberof Cache
     */
    queryOfkey(key, name) {
        const obj = this.storage.getItem(key);
        if (obj) {
            return obj[name];
        }
        return null;
    }
}
