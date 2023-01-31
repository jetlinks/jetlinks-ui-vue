<template>
  <page-container>
    <InitHome v-if="currentView === 'init'" @refresh='setCurrentView' />
    <DeviceHome v-else-if="currentView === 'device'" />
    <DevOpsHome v-else-if="currentView === 'ops'" />
    <ComprehensiveHome v-else-if="currentView === 'comprehensive'" />
  </page-container>

</template>

<script lang='ts' setup name='IotHome'>
import InitHome from './components/InitHome/index.vue'
import DeviceHome from './components/DeviceHome/index.vue'
import DevOpsHome from './components/DevOpsHome/index.vue'
import ComprehensiveHome from './components/ComprehensiveHome/index.vue'
import PageContainer from 'components/Layout/components/PageContainer'
import { isNoCommunity } from '@/utils/utils'
import { getMe_api, getView_api } from '@/api/home'

const router = useRouter()

const currentView = ref<string>('')
const loading = ref<boolean>(true)

// 获取选择的视图
const setCurrentView = () => {
  getView_api().then((resp: any) => {
    if (resp.status === 200) {
      if (resp.result) currentView.value = resp.result?.content
      else if (resp.result.username === 'admin') {
        currentView.value = 'comprehensive'
      } else currentView.value = 'init'
    }
  })
}

if (isNoCommunity) {
  // 判断是否是api用户   是则跳转  否则获取选中的视图
  getMe_api().then((resp: any) => {
    if (resp && resp.status === 200) {
      const isApiUser = resp.result.dimensions.find(
        (item: any) =>
          item.type === 'api-client' || item.type.id === 'api-client'
      )

      isApiUser ? router.push('/system/api') : setCurrentView()
    }
  })
} else setCurrentView()

</script>

<style lang='less' scoped>
.container {
  background: #f0f2f5;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;

  .header {
    height: 48px;
    background: #7e1c1c;
    width: 100vw;
  }

  .left {
    background: #352d85;
    width: 210px;
    min-height: calc(100vh - 48px);
  }

  .content {
    margin: 24px;
    width: calc(100vw - 280px);
    overflow: hidden;
    min-height: calc(100vh - 96px);
  }
}
</style>
