<template>
    <j-pro-layout
        v-bind="layoutConf"
        v-model:openKeys="state.openKeys"
        v-model:collapsed="state.collapsed"
        v-model:selectedKeys="state.selectedKeys"
        :pure="state.pure"
        :breadcrumb="{ routes: breadcrumb }"
        @backClick='routerBack'
    >
        <template #breadcrumbRender="slotProps">
            <a
              v-if="slotProps.route.index !== 0 && !slotProps.route.isLast"
              @click='jump(slotProps.route)'
            >
              {{ slotProps.route.breadcrumbName }}
            </a>
            <span v-else style='cursor: default' >{{ slotProps.route.breadcrumbName }}</span>
        </template>
        <template #rightContentRender>
            <div class="right-content">
                <AIcon type="QuestionCircleOutlined" @click="toDoc" />
                <Notice style="margin: 0 24px" />
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
import Notice from './components/Notice.vue';
import DefaultSetting from '../../../config/config';
import { useMenuStore } from '@/store/menu';
import { clearMenuItem } from 'jetlinks-ui-components/es/ProLayout/util';
import { AccountMenu } from '@/router/menu'
import { useSystem } from '@/store/system';
import { storeToRefs } from 'pinia';

type StateType = {
    collapsed: boolean;
    openKeys: string[];
    selectedKeys: string[];
    pure: boolean;
};

const router = useRouter();
const route = useRoute();

const menu = useMenuStore();

const system = useSystem();
const {configInfo} = storeToRefs(system);

const layoutConf = reactive({
    theme: DefaultSetting.layout.theme,
    siderWidth: DefaultSetting.layout.siderWidth,
    logo: DefaultSetting.layout.logo,
    title: DefaultSetting.layout.title,
    menuData: [...clearMenuItem(menu.siderMenus), AccountMenu],
    // menuData: menu.siderMenus,
    splitMenus: true,
});

watchEffect(() => {
    layoutConf.theme = configInfo.value.front?.headerTheme || DefaultSetting.layout.theme;
    layoutConf.title = configInfo.value.front?.title || DefaultSetting.layout.title;
    layoutConf.logo = configInfo.value.front?.logo || DefaultSetting.layout.logo;
})

const state = reactive<StateType>({
    pure: false,
    collapsed: false, // default value
    openKeys: [],
    selectedKeys: [],
});

const routerBack = () => {
  router.go(-1)
}

const findRouteMeta = (code: string) => {
  let meta = []
  let menuItem: any = menu.menus[code]
  while (menuItem) {
    meta.unshift(menuItem)
    if (menuItem.parentName) {
      menuItem = menu.menus[menuItem.parentName]
    } else {
      menuItem = false
    }
  }
  return meta
}

const jump = (item: any) => {
  let path = history.state.back
  if (path) {
    // 包含query参数,清除？参数
    if (path.includes('?')) {
      const _path = path.split('?')[0]
      path = _path === item.path ? path : item.path
    } else if (path !== item.path) {
      path = item.path
    }
  } else {
    path = item.path
  }

  // jumpPage(slotProps.route.path)
  router.push(path)
}

const breadcrumb = computed(() =>
  {
    const paths = router.currentRoute.value.name as string

    const metas = findRouteMeta(paths)
    return metas.map((item, index) => {
      return {
        index,
        isLast: index === (metas.length - 1),
        path: item.path,
        breadcrumbName: item.title || '',
      };
    })
  }
);

watchEffect(() => {
    if (router.currentRoute) {
      const paths = router.currentRoute.value.name as string
      console.log(paths)
      if (paths) {
        const _metas = findRouteMeta(paths)
        state.selectedKeys = _metas.map(item => item.path)
        state.openKeys = _metas.filter((r) => r !== router.currentRoute.value.path).map(item => item.path)
      }
    }
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

const toDoc = () => window.open('http://doc.v2.jetlinks.cn/');
</script>

<style scoped>
.right-content {
    margin-right: 24px;
    display: flex;
    align-items: center;
}
</style>
