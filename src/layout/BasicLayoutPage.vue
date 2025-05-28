<template>
  <j-pro-layout
    v-bind="config"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    :selectedKeys="state.selectedKeys"
    :breadcrumb="{ routes: breadcrumb }"
    :pure="state.pure"
    :layoutType="layoutType"
    @backClick='routerBack'
  >
    <template #breadcrumbRender="slotProps">
      <a v-if="slotProps.route.index !== 0 && !slotProps.route.isLast" @click="() => jumpPage(slotProps.route)" >
        {{ slotProps.route.breadcrumbName }}
      </a>
      <span v-else style='cursor: default' >{{ slotProps.route.breadcrumbName }}</span>
    </template>

    <template #rightContentRender>
      <div class="right-content">
        <Language />
        <Resource v-if="systemInfo?.['front']?.resources"/>
        <Notice />
        <User />
      </div>
    </template>

      <router-view v-if="updateRoute" v-slot="{ Component }">
        <component :is="components || Component" />
      </router-view>
  </j-pro-layout>
</template>

<script setup name="BasicLayoutPage" lang="ts">
import { reactive, computed, watchEffect } from 'vue'
import { useSystemStore } from '@/store/system'
import { useMenuStore } from '@/store/menu'
import { User, Notice, Language, Resource } from './components'
import { storeToRefs } from 'pinia'

const router = useRouter();
const route = useRoute();
const systemStore = useSystemStore()
const menuStore = useMenuStore()
const layoutType = ref('list')
const updateRoute = ref(true)

const { theme, layout, language, systemInfo } = storeToRefs(systemStore)

const components = computed(() => {
  const componentName = route.matched[route.matched.length - 1]?.components?.default?.name
  if (componentName !== 'BasicLayoutPage') {
    return route.matched[route.matched.length - 1]?.components?.default
  }
  return undefined
})

const config = computed(() => ({
  ...layout.value,
  theme: theme.value,
  menuData: menuStore.siderMenus,
  splitMenus: layout.value.layout === 'mix'
}))

const state = reactive({
  pure: false,
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
});

/**
 * 面包屑
 */
const breadcrumb = computed(() =>
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

/**
 * 路由跳转
 */
const jumpPage = (route: { path: string}) => {
  router.push(route.path)
}

const routerBack = () => {
  router.go(-1)
}

const init = () => {
  (window as any).microApp?.addDataListener((data: any) => {
    if (data.layoutType) {
      layoutType.value = data.layoutType
    }
  }, true)
}

init()

// watch(() => systemStore.language, () => {
//   updateRoute.value = false
//   nextTick(() => {
//     updateRoute.value = true
//   })
// })

/**
 * 处理菜单选中，展开状态
 */
watchEffect(() => {
  if (router.currentRoute) {
    const paths = router.currentRoute.value.matched
    state.selectedKeys = paths.map(item => item.path)
    state.openKeys = paths.map(item => item.path)
    // console.log(paths) //
  }
  // if (route.query?.layout === 'false' || self.frameElement?.tagName === 'IFRAME') {
  if (route.query?.layout === 'false') {
    state.pure = true
  }
})

</script>

<style scoped>
.right-content {
  margin-right: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
}
</style>
