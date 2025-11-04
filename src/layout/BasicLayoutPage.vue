<template>
  <j-pro-layout
    v-bind="config"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    :selectedKeys="state.selectedKeys"
    :breadcrumb="{ routes: route.meta.breadcrumb }"
    :pure="state.pure"
    :layoutType="layoutType"
    @backClick='routerBack'
  >
    <template #breadcrumbRender="slotProps">
      <a v-if="slotProps.route.index !== 0 && !slotProps.route.isLast" @click="() => jumpPage(slotProps)" >
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
    <router-view />
  </j-pro-layout>
  <AiChat />
</template>

<script setup name="BasicLayoutPage" lang="ts">
import { reactive, computed, watchEffect } from 'vue'
import { useSystemStore } from '@/store/system'
import { useMenuStore } from '@/store/menu'
import { User, Notice, Language, Resource, AiChat } from './components'
import { storeToRefs } from 'pinia'

const router = useRouter();
const route = useRoute();
const systemStore = useSystemStore()
const menuStore = useMenuStore()
const layoutType = ref('list')

const { theme, layout, language, systemInfo } = storeToRefs(systemStore)

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
 * 路由跳转
 */
const jumpPage = (record: any) => {
  menuStore.jumpPage(record.route.name, {})
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

/**
 * 处理菜单选中，展开状态
 */
watchEffect(() => {
  if (router.currentRoute) {
    const paths = route.meta.breadcrumb || []
    state.selectedKeys = paths.map(item => item.path)
    state.openKeys = paths.map(item => item.path)
  }
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
