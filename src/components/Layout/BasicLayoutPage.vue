<template>
    <j-pro-layout
        v-bind="layoutConf"
        v-model:openKeys="state.openKeys"
        v-model:collapsed="state.collapsed"
        v-model:selectedKeys="state.selectedKeys"
        :pure="state.pure"
        :breadcrumb="{ routes: breadcrumb }"
    >
        <template #breadcrumbRender="slotProps">
            <a v-if="slotProps.route.index !== 0">{{
                slotProps.route.breadcrumbName
            }}</a>
            <span v-else>{{ slotProps.route.breadcrumbName }}</span>
        </template>
        <template #rightContentRender> 
          <div style="margin-right: 24px;display: flex;align-items: center;">
            <AIcon type="QuestionCircleOutlined" @click="toDoc" />
            <Notice style="margin: 0 24px;" />
            <UserInfo />
          </div>
        </template>
        <router-view v-slot="{ Component }">
            <component :is="Component" />
        </router-view>
    </j-pro-layout>
</template>

<script setup lang="ts" name="BasicLayoutPage">
import UserInfo from './components/UserInfo.vue';
import Notice from './components/Notice.vue'
import DefaultSetting from '../../../config/config';
import { useMenuStore } from '@/store/menu';
import { clearMenuItem } from 'jetlinks-ui-components/es/ProLayout/util';

type StateType = {
    collapsed: boolean;
    openKeys: string[];
    selectedKeys: string[];
    pure: boolean;
};

const router = useRouter();
const route = useRoute();

const menu = useMenuStore();

const layoutConf = reactive({
    theme: DefaultSetting.layout.theme,
    siderWidth: DefaultSetting.layout.siderWidth,
    logo: DefaultSetting.layout.logo,
    title: DefaultSetting.layout.title,
    menuData: menu.siderMenus,
    splitMenus: true,
});

const state = reactive<StateType>({
    pure: false,
    collapsed: false, // default value
    openKeys: [],
    selectedKeys: [],
});

const breadcrumb = computed(() =>
    router.currentRoute.value.matched.concat().map((item, index) => {
        return {
            index,
            path: item.path,
            breadcrumbName: item.meta.title || '',
        };
    }),
);

watchEffect(() => {
    if (router.currentRoute) {
        const matched = router.currentRoute.value.matched.concat();
        state.selectedKeys = matched.map((r) => r.path);
        state.openKeys = matched
            .filter((r) => r.path !== router.currentRoute.value.path)
            .map((r) => r.path);
        console.log(state.selectedKeys);
    }
    // TODO 获取当前路由中参数，用于控制pure
});

watchEffect(() => {
    if (
        route.query &&
        'layout' in route.query &&
        route.query.layout === 'false'
    ) {
        state.pure = true;
    } else {
        state.pure = false;
    }
});


const toDoc = ()=>window.open('http://doc.v2.jetlinks.cn/')
</script>

<style scoped></style>
