import { createRouter, createWebHashHistory } from 'vue-router';
import menus, { LoginPath } from './menu'
import {LocalStore} from "@/utils/comm";
import {TOKEN_KEY} from "@/utils/variable";

const router = createRouter({
    history: createWebHashHistory(),
    routes: menus
})

router.beforeEach((to, from, next) => {
    const token = LocalStore.get(TOKEN_KEY)
    if (token) {
        next()
    } else {
        if(to.path === LoginPath) {
            next()
        } else {
            next({ path: LoginPath})
        }
    }
})

export default router