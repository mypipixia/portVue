import store from '@/store/index.js';

//判断用户登录状态
export const judgeLogin = () => {
    return !!store.state.user.token;
};

//缓存用户登录的路由
export const handlerRouter = (v) => {
    store.dispatch('common/setSelDropListA', v);
};
