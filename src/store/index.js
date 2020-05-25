import Vue from 'vue';
import Vuex from 'vuex';
import modules from './allState';
import { createPersisted } from './plugins';

import createLogger from 'vuex/dist/logger';

const debug = process.env.NODE_ENV !== 'production';
Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: debug ? [createLogger(), createPersisted] : [createPersisted]
});
