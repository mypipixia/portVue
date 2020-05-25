import createPersistedState from 'vuex-persistedstate';
import Cache from '@/utils/Cache';
import cloneDeep from 'lodash/cloneDeep';
import reducer from './reducer';
import { vuex_key } from '@/common/consts.js';
// 持久化配置
const persisted = new Cache({
    storage: sessionStorage
});

/**
 * 删除属性
 * @param {*} target
 * @param {*} key
 */
const deleteProperty = (target, key) => {
    Reflect.has(target, key) && Reflect.deleteProperty(target, key);
};
export const createPersisted = createPersistedState({
    key: vuex_key,
    storage: {
        getItem: (key) => persisted.getItem(key),
        setItem: (key, value) => persisted.setItem(key, value),
        removeItem: (key) => persisted.removeItem(key)
    },
    // 该参数配置需要单独存入storage的state对象
    reducer: (state) => {
        const cloneState = cloneDeep(state);
        reducer &&
            reducer.forEach((value, key) => {
                if (value === '*') {
                    deleteProperty(cloneState, key);
                } else {
                    deleteProperty(cloneState[key], value);
                }
            });
        return cloneState;
    }
});
