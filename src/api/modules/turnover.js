import until from '../until';
var api = {};
until.until(api, 'turnAdd', 'turnover/create', 'post');
until.until(api, 'turnUpdate', 'turnover/update', 'post');
until.until(api, 'turnUpdateStatus', 'turnover/updateStatus', 'post');
until.until(api, 'turnDel', 'turnover/del', 'post');
until.until(api, 'turnGetAllTable', 'turnover/getAllTable', 'post');
until.until(api, 'turnFindOnlyID', 'turnover/findOnlyID', 'post');

export default api;
