import until from '../until';
var api = {};

//登录
until.until(api, 'xmMgrGetAllTable', 'xmMgr/getAllTable', 'post');
until.until(api, 'xmMgrAdd', 'xmMgr/create', 'post');
until.until(api, 'xmMgrUpdate', 'xmMgr/update', 'post');
until.until(api, 'xmMgrDel', 'xmMgr/del', 'post');
export default api;
