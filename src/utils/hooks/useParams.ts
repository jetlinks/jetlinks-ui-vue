import {useMenuStore} from "store/menu";
import { onBeforeUnmount } from 'vue'

export const useRouterParams = () => {
    const params = ref<Record<string, any>>({})
    const menu = useMenuStore();

    const router = useRouter();
    const routeName = router.currentRoute.value.name as string

    params.value = routeName && menu.params[routeName] ? menu.params[routeName] : {}

    onBeforeUnmount(() => {
        if (routeName && menu.params[routeName]) { // 如果当前路由params参数，离开页面清除掉
            menu.params = {}
        }
    })

    return {
        params
    }
}