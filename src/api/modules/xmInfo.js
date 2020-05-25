import until from '../until';
var api = {};

//获取项目详情表格
until.until(api, 'xmInfoFind', 'xmInfo/find', 'get');
//新增项目详情
until.until(api, 'xmInfoAdd', 'xmInfo/add', 'post');
//删除
until.until(api, 'xmInfoDelete', 'xmInfo/delete', 'post');

export default api;
