import router from './index'
import { judgeLogin, handlerRouter } from '@/common/login.js';

const goBackLoad = (next) => {
    next({
        path: '/login'
    });
};

router.beforeEach((to, _from, next) => {
    let { path = '', meta } = to;
    handlerRouter(path);
    let status = judgeLogin();
    if (!status && !meta.NoAuth) {
        goBackLoad(next);
    } else {
        next();
    }
});

router.beforeResolve((to, _from, next) => {
    next();
});

// router.afterEach((to, from, next) => {});
