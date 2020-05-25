import until from '../until';
var api = {};

//登录
until.until(api, 'xUserCreat', 'xUser/xUserCreat', 'post');
until.until(api, 'findTablexUser', 'xUser/findTable', 'post');
until.until(api, 'xUserDelete', 'xUser/delete', 'post');
export default api;
