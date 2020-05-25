//操作数据信息
let actions = {

    setSelDropListA: ({ commit }, v) => {
        commit('setSelDropList', v);
    }
};
//操作状态信息
let mutations = {
    //设置选中的操作列
    setSelDropList: (state, value) => {
        state.selDropList = value;
    },
};
//计算属性
let getters = {
    //获取选中的操作列
    getSelDropList: (state) => {
        return state.selDropList;
    },
};
//用于存储数据
let state = {
    //选中的列
    selDropList: ''
};
export default {
    actions,
    mutations,
    getters,
    state
};
