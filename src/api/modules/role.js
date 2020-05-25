import until from '../until';
var api = {};
until.until(api, 'roleFind', 'role/find', 'get');
until.until(api, 'roleCreate', 'role/create', 'post');
until.until(api, 'changeStatus', 'role/changeStatus', 'post');
until.until(api, 'setAuthArr', 'role/setAuthArr', 'post');
until.until(api, 'delRole', 'role/delRole', 'post');
until.until(api, 'findRoleID', 'role/findRoleID', 'post');

export default api;
