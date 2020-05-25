import until from '../until';
var api = {};
until.until(api, 'proAdd', 'profit/create', 'post');
until.until(api, 'proUpdate', 'profit/update', 'post');
until.until(api, 'proUpdateStatus', 'profit/updateStatus', 'post');
until.until(api, 'proDel', 'profit/del', 'post');
until.until(api, 'proGetAllTable', 'profit/getAllTable', 'post');
until.until(api, 'proFindOnlyID', 'profit/findOnlyID', 'post');

export default api;
