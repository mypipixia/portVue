import until from '../until';
var api = {};

//获取项目详情表格
until.until(api, 'xmInfoJdFind', 'xmInfoJd/find', 'get');
//新增项目详情
until.until(api, 'xmInfoJdAdd', 'xmInfoJd/add', 'post');
//删除
until.until(api, 'xmInfoJdDelete', 'xmInfoJd/delete', 'post');

export default api;
