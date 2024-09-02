<template>
  <div class="person">
    <div class="person-header">
      <div class="person-header-item">
        <div class="person-header-item-info">
          <div class="person-header-item-info-left">
            <UploadAvatar
              :accept="
                imageTypes && imageTypes.length ? imageTypes.toString() : ''
              "
              :modelValue="user.userInfo?.avatar"
              @change="onAvatarChange"
            />
          </div>
          <div class="person-header-item-info-right">
            <div class="person-header-item-info-right-top">
              <j-ellipsis> Hi, {{ user.userInfo?.name }} </j-ellipsis>
            </div>
            <div class="person-header-item-info-right-info">
              <RoleShow :value="user.userInfo?.roleList || []" />
            </div>
          </div>
        </div>
        <div class="person-header-item-action">
          <a-space :size="24">
            <a-button class="btn" @click="visible = true">查看详情 </a-button>
            <a-button @click="editInfoVisible = true">编辑资料 </a-button>
            <a-button v-if="hasPerm" @click="editPasswordVisible = true">
              修改密码
            </a-button>
          </a-space>
        </div>
      </div>
    </div>
    <div class="person-content">
      <div class="person-content-item">
        <div class="person-content-item-content">
          <a-tabs v-model:activeKey="user.tabKey" type="card">
            <a-tab-pane
              v-for="item in tabList"
              :key="item.key"
              :tab="item.title"
            />
          </a-tabs>
          <component :is="tabs[user.tabKey]" />
        </div>
      </div>
    </div>
    <Detail v-if="visible" @close="visible = false" />
    <EditInfo
      v-if="editInfoVisible"
      :data="user.userInfo"
      @close="editInfoVisible = false"
      @save="onSave"
    />
    <EditPassword
      v-if="editPasswordVisible"
      @close="editPasswordVisible = false"
    />
  </div>
</template>

<script setup lang="ts" name="Center">
import HomeView from './components/HomeView/index.vue'
import BindThirdAccount from './components/BindThirdAccount/index.vue'
import Subscribe from './components/Subscribe/index.vue'
import StationMessage from './components/StationMessage/index.vue'
import Detail from './components/Detail/index.vue'
import EditInfo from './components/EditInfo/index.vue'
import EditPassword from './components/EditPassword/index.vue'
import { useUserStore } from '@/store/user'
import UploadAvatar from './components/UploadAvatar/index.vue'
import { updateMeInfo_api } from '@/api/account/center'
import { onlyMessage } from '@jetlinks-web/utils'
import { useRouterParams } from '@jetlinks-web/hooks'
import {
  USER_CENTER_MENU_BUTTON_CODE,
  USER_CENTER_MENU_CODE,
} from '@/utils/consts'
import { usePermission } from '@jetlinks-web/hooks'
import RoleShow from './components/RoleShow/index.vue'
import { tabList } from '@/views/account/center/data'

const imageTypes = reactive([
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/jfif',
  'image/pjp',
  'image/pjpeg',
])

const user = useUserStore()

const tabs = {
  HomeView,
  BindThirdAccount,
  Subscribe,
  StationMessage,
}

const router = useRouterParams()

const visible = ref<boolean>(false)
const editInfoVisible = ref<boolean>(false)
const editPasswordVisible = ref<boolean>(false)

const { hasPerm } = usePermission(
  `${USER_CENTER_MENU_CODE}:${USER_CENTER_MENU_BUTTON_CODE}`,
)

const onSave = () => {
  user.getUserInfo()
  editInfoVisible.value = false
}

// const onPasswordSave = () => {
//     editPasswordVisible.value = false;
// };

const onAvatarChange = (url: string) => {
  updateMeInfo_api({
    ...user.userInfo,
    avatar: url,
  }).then((resp) => {
    if (resp.status === 200) {
      onlyMessage('操作成功', 'success')
      user.getUserInfo()
    }
  })
}

watchEffect(() => {
  if (router.params.value?.tabKey) {
    user.tabKey = router.params.value?.tabKey
  }
})

onMounted(() => {
  user.getUserInfo()
})

onUnmounted(() => {
  user.tabKey = tabList?.[0]?.key || 'HomeView'
  user.other.tabKey = ''
})
</script>

<style lang="less" scoped>
@padding: 14%;
.person {
  .person-header {
    width: 100%;
    height: 156px;
    padding: 0 @padding;
    background-color: #fff;

    .person-header-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      gap: 12px;

      .person-header-item-info {
        display: flex;
        width: calc(100% - 380px);

        .person-header-item-info-left {
          margin-right: 30px;
        }

        .person-header-item-info-right {
          display: flex;
          flex-direction: column;
          width: calc(100% - 126px);

          .person-header-item-info-right-top {
            display: flex;
            font-size: 26px;
            color: #1d2129;
            font-weight: 500;
            width: 100%;
            margin-top: 10px;
          }

          .person-header-item-info-right-info {
            width: 100%;
          }
        }
      }

      .person-header-item-action {
        button {
          width: 110px;
          background-color: #ebeef4;
          color: #333333;
          border: none;
        }

        .btn {
          background-color: @primary-color;
          color: #fff;
        }
      }
    }
  }

  .person-content-item {
    padding: 10px 20px;
    background-color: #fff;
    // overflow: hidden;
  }

  .person-content {
    width: 100%;
    padding: 0 @padding;
    margin-top: 15px;
  }

  .person-content-item-content {
    // height: calc(100vh - 251px);
    width: 100%;
    padding: 10px 0;
  }
}
</style>
