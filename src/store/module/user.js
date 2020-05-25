import Cache from '@/utils/Cache';
import { cookie_user_key, cookie_time, vuex_key } from '@/common/consts.js';

const storage = new Cache();
/**
 * 删除信息
 */
const clearInfo = async (commit) => {
  sessionStorage.removeItem(vuex_key);
  localStorage.removeItem(vuex_key);
  // 设置token
  await commit('saveToken', '');
  // 设置用户信息
  await commit('saveUserInfo', {});
  return;
};
/**
 * 跳转首页
 * @param {*} vm
 */
const goHome = (vm) => {
  vm.$router.push({
    path: '/index'
  });
};
/**
 * cookie 缓存账号密码
 */
const handleCookie = (info) => {
  let { reacco, repass } = info;
  //移除账号密码的cookie
  storage.removeCookie(cookie_user_key);
  if (reacco || repass) {
    let { password, mobileNo } = info;
    let parm = {
      password: repass ? password : '',
      mobileNo: reacco ? mobileNo : '',
      reacco,
      repass
    };
    //cookie 缓存账号密码
    storage.setCookie(cookie_user_key, parm, cookie_time);
  }
};

//操作数据信息
let actions = {
  //用户登录方法
  loginTo: async ({ commit }, { vm, loginInfo } = {}) => {
    try {
      const res = await vm.$api.userslogin(vm, loginInfo);
      //缓存用户信息
      commit('saveUserInfo', res.userInfo);
      //设置token
      commit('saveToken', res.token);
      //处理记住密码
      handleCookie(loginInfo);
      // const auth = await vm.$api.findRoleID(vm, { rid: res.userInfo.rid });
      //前往首页
      goHome(vm);
      commit('saveRoleInfo', res.userInfo.auth);
      vm.$message.success(res.desc);
    } catch (error) {
      clearInfo(commit);
      vm.$message.error(error.desc);
    }
  },
  //清除用户信息
  removeUserInfoA: ({ commit }) => {
    clearInfo(commit);
  }
};
//操作状态信息
let mutations = {
  //存储用户信息
  saveUserInfo: (state, info) => {
    state.userInfo = info;
  },
  //设置token
  saveToken: (state, token) => {
    state.token = token;
  },
  saveRoleInfo: (state, roleInfo) => {
    state.roleInfo = roleInfo;
  }
};
//计算用户状态信息
let getters = {
  getUserInfo: (state) => {
    return state.userInfo;
  },
  getToken: (state) => {
    return state.token;
  },
  getRoleInfo: (state) => {
    return state.roleInfo;
  }
};
//用于存储数据
let state = {
  //用户信息
  userInfo: {},
  token: '',
  //用户权限管理
  roleInfo: ''
};
export default {
  actions,
  mutations,
  getters,
  state
};
