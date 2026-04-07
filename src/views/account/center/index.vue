<template>
  <div class="person">
    <div class="person-inner">
      <div class="person-sider">
        <a-menu
          mode="inline"
          :selectedKeys="[user.tabKey]"
          @click="onMenuClick"
        >
          <a-menu-item
            v-for="item in _tabList"
            :key="item.key"
          >
            {{ item.title }}
          </a-menu-item>
        </a-menu>
      </div>
      <div class="person-main">
        <div class="person-main-content">
          <component
            :is="tabs[user.tabKey]"
            @open-edit-password="editPasswordVisible = true"
          />
        </div>
      </div>
    </div>
  </div>
  <EditPassword
    v-if="editPasswordVisible"
    @close="editPasswordVisible = false"
  />
</template>

<script setup lang="ts" name="Center">
import HomeView from './components/HomeView/index.vue'
import AccountInfo from './components/AccountInfo/index.vue'
import Subscribe from './components/Subscribe/index.vue'
import StationMessage from './components/StationMessage/index.vue'
import EditPassword from './components/EditPassword/index.vue'
import PersonalToken from './components/PersonalToken/index.vue'
import { useUserStore } from '@jetlinks-web-core/store'
import { useRouterParams } from '@jetlinks-web/hooks'
import { tabList } from '@jetlinks-web-core/views/account/center/data'
import { isNoCommunity } from '@jetlinks-web-core/utils'

const user = useUserStore()

const tabs = {
  HomeView,
  BindThirdAccount: AccountInfo,
  Subscribe,
  StationMessage,
  PersonalToken
}

const router = useRouterParams()

const editPasswordVisible = ref<boolean>(false)

const onMenuClick = (info: any) => {
  if (info?.key) {
    user.tabKey = info.key
  }
}

const _tabList = computed(() => {
  return tabList.filter(i => (i.key !== 'BindThirdAccount' || isNoCommunity) && (!user.isApplicationUser || i.key !== 'HomeView'))
})

const getTabKey = () => {
  if (router.params.value?.tabKey) return
  user.tabKey = _tabList.value[0]?.key ?? (user.isApplicationUser ? (!isNoCommunity ? 'Subscribe' : 'BindThirdAccount') : 'HomeView')
}

watchEffect(() => {
  if (router.params.value?.tabKey) {
    user.tabKey = router.params.value?.tabKey
  }
})

onMounted(async () => {
  await user.getUserInfo()
  getTabKey()
})

onUnmounted(() => {
  user.tabKey = tabList?.[0]?.key || (user.isApplicationUser ? 'BindThirdAccount' : 'HomeView')
  user.other.tabKey = ''
})
</script>

<style lang="less" scoped>
.person {
  width: 100%;
  padding: 24px 16px;
  box-sizing: border-box;

  .person-inner {
    max-width: 1120px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .person-sider {
    width: 220px;
    background-color: #fff;
    border-radius: 8px;
    padding: 8px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }

  .person-main {
    flex: 1;
    max-width: 860px;
  }

  .person-main-content {
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  }
}
</style>
