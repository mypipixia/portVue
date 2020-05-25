import axios from 'axios';
import store from '@/store';
/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const apiUrl = window.apiUrl;

// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 });

//默认请求地址
instance.defaults.baseURL = apiUrl;

// 设置post请求头
instance.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded';
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  (config) => {
    const token = store.state.user.token;
    token && (config.headers.Authorization = token);
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  (res) => {
    return res.status === 200 ? Promise.resolve(res) : Promise.reject(res);
  },
  // 请求失败
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误';
          break;

        case 401:
          error.message = '未授权，请登录';
          break;

        case 403:
          error.message = '拒绝访问';
          break;

        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;

        case 408:
          error.message = '请求超时';
          break;

        case 500:
          error.message = '服务器内部错误';
          break;

        case 501:
          error.message = '服务未实现';
          break;

        case 502:
          error.message = '网关错误';
          break;

        case 503:
          error.message = '服务不可用';
          break;

        case 504:
          error.message = '网关超时';
          break;

        case 505:
          error.message = 'HTTP版本不受支持';
          break;

        default:
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
