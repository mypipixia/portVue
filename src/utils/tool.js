//工具类二次封装
const _ = require('lodash');

//深度拷贝
export const cloneDeep = (value) => {
    return _.cloneDeep(value);
};
