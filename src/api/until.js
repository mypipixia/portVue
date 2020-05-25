import axios from './http';
export default {
    until(api, name, url, method = 'get') {
        api[name] = (_context, body) => {
            return new Promise((resolve, reject) => {
                if (method.toLocaleLowerCase().includes('get')) {
                    let parms;
                    if (body) {
                        parms = url + '?' + body;
                    } else {
                        parms = url;
                    }
                    axios[method](parms)
                        .then((res) => {
                            resolve(res.data);
                        })
                        .catch((err) => {
                            reject(err.response.data);
                        });
                } else {
                    let parm = null;
                    if (method == 'delete') {
                        parm = { data: body };
                    } else {
                        parm = body;
                    }
                    axios[method](url, parm)
                        .then((res) => {
                            resolve(res.data);
                        })
                        .catch((err) => {
                            reject(err.response.data);
                        });
                }
            });
        };
    }
};
