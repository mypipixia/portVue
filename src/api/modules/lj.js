import until from '../until';
var api = {};
until.until(api, 'ljAdd', 'lj/create', 'post');
until.until(api, 'ljUpdate', 'lj/update', 'post');
until.until(api, 'ljUpdateStatus', 'lj/updateStatus', 'post');
until.until(api, 'ljDel', 'lj/del', 'post');
until.until(api, 'ljGetAllTable', 'lj/getAllTable', 'post');
until.until(api, 'ljFindOnlyID', 'lj/findOnlyID', 'post');

export default api;
