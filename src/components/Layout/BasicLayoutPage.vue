<template>
  <ProLayout
    v-bind='layoutConf'
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
    :pure='state.pure'
  >
    <router-view v-slot='{ Component}'>
      <component :is='Component' />
    </router-view>
  </ProLayout>
</template>

<script setup lang="ts" name='BasicLayoutPage'>
import { ProLayout } from '@/components/Layout'
import DefaultSetting from '../../../config/config'
import { useMenuStore } from '@/store/menu'

type StateType = {
  collapsed: boolean
  openKeys: string[]
  selectedKeys: string[]
  pure: boolean
}

const router = useRouter()

const menu = useMenuStore()

const layoutConf = reactive({
  navTheme: DefaultSetting.layout.theme,
  siderWidth: DefaultSetting.layout.siderWidth,
  logo: DefaultSetting.layout.logo,
  title: DefaultSetting.layout.title,
  menuData: menu.menus,
});

const state = reactive<StateType>({
  pure: false,
  collapsed: false, // default value
  openKeys: [],
  selectedKeys: [],
});

watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat()
    state.selectedKeys = matched.map(r => r.path)
    state.openKeys = matched.filter((r) => r.path !== router.currentRoute.value.path).map(r => r.path)
    console.log(state.selectedKeys)
  }
  // TODO 获取当前路由中参数，用于控制pure
})

</script>

<style scoped>
</style>
