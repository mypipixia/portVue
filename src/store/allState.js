const requireModule = require.context('./module', true, /\.js$/);
const modules = {};

requireModule.keys().forEach((fileName) => {
    if (fileName === './index.js') {
        return;
    }

    const path = fileName.replace(/(\.\/|\.js)/g, '');

    const moduleName = path;

    if (!modules[moduleName]) {
        modules[moduleName] = {
            namespaced: true,
            ...requireModule(fileName).default
        };
    }
});
export default modules;
