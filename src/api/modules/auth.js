import until from '../until';
var api = {};

//登录
until.until(api, 'authFind', 'auth/find', 'get');
export default api;
