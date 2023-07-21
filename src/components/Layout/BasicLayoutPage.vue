<template>
    <j-pro-layout
        v-bind="layoutConf"
        v-model:collapsed="basicLayout.collapsed"
        v-model:openKeys="basicLayout.openKeys"
        v-model:selectedKeys="basicLayout.selectedKeys"
        :headerHeight='layout.headerHeight'
        :breadcrumb="{ routes: breadcrumbs }"
        :pure="basicLayout.pure"
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
        <component :is="components || Component" />
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
const {configInfo,layout, basicLayout} = storeToRefs(system);

const layoutConf = reactive({
    theme: DefaultSetting.layout.theme,
    siderWidth: layout.value.siderWidth,
    logo: DefaultSetting.layout.logo,
    title: DefaultSetting.layout.title,
    menuData: [...menu.siderMenus, AccountMenu],
    // menuData: menu.siderMenus,
    splitMenus: true,
});

watchEffect(() => {
    layoutConf.theme = configInfo.value.front?.headerTheme || DefaultSetting.layout.theme;
    layoutConf.title = configInfo.value.front?.title || DefaultSetting.layout.title;
    layoutConf.logo = configInfo.value.front?.logo || DefaultSetting.layout.logo;
})

const components = computed(() => {
  const componentName = route.matched[route.matched.length - 1]?.components?.default?.name
  if (componentName !== 'BasicLayoutPage') {
    return route.matched[route.matched.length - 1]?.components?.default
  }
  return undefined
})

/**
 * 面包屑
 */
const breadcrumbs = computed(() =>
    {
      const paths = router.currentRoute.value.matched

      return paths.map((item, index) => {
        return {
          index,
          isLast: index === (paths.length -1),
          path: item.path,
          breadcrumbName: (item.meta as any).title || '',
        }
      })
    }
);

const routerBack = () => {
  router.go(-1)
}


const jump = (item: any) => {
  router.push(item.path)
}



watchEffect(() => {
  if (router.currentRoute) {
    const paths = router.currentRoute.value.matched
    basicLayout.value.selectedKeys = paths.map(item => item.path)
    basicLayout.value.openKeys = paths.map(item => item.path)
    console.log(paths) //
  }
})

const toDoc = () => window.open('http://doc.v2.jetlinks.cn/');
</script>

<style scoped>
.right-content {
    margin-right: 24px;
    display: flex;
    align-items: center;
}
</style>
