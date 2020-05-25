import until from '../until';
var api = {};

//登录
until.until(api, 'userslogin', 'user/login', 'post');

//查找
until.until(api, 'getAllTable', 'user/getAllTable', 'post');

until.until(api, 'registUser', 'user/regist', 'post');

until.until(api, 'delUser', 'user/del', 'post');

until.until(api, 'upload', 'user/upload', 'post');

until.until(api, 'updateUser', 'user/update', 'post');

until.until(api, 'findNotUser', 'user/findNotUser', 'get');
until.until(api, 'changeUserInfo', 'user/changeUserInfo', 'post');

export default api;
