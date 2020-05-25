var api = {};
const defaultALL = require.context('./modules', false, /\.js$/);
defaultALL.keys().forEach((item) => {
    Object.assign(api, defaultALL(item).default);
});

export default api;
