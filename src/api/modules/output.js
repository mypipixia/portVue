import until from '../until';
var api = {};
until.until(api, 'outAdd', 'output/create', 'post');
until.until(api, 'outUpdate', 'output/update', 'post');
until.until(api, 'outUpdateStatus', 'output/updateStatus', 'post');
until.until(api, 'outDel', 'output/del', 'post');
until.until(api, 'outputGetAllTable', 'output/getAllTable', 'post');
until.until(api, 'outputFindOnlyID', 'output/findOnlyID', 'post');

export default api;
