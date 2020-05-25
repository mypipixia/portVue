import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import api from '@/api/index';
import '@/assets/style/index.scss';
import "font-awesome/css/font-awesome.css";
import '@/router/hooks';
//引入插件
import '@/plugins/index';
//引入组件
import '@/components/index';
Vue.config.productionTip = false;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
