<template>
  <a-dropdown placement="bottomRight">
    <div class="user-info">
      <a-avatar :size="28">
        <template #icon>
          <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo?.avatar" alt="">
          <AIcon v-else type="UserOutlined"></AIcon>
        </template>  
      </a-avatar> 
      <span class="name">{{ userName }}</span>
    </div>
    <template #overlay>
      <a-menu @click="click">
        <a-menu-item key="userCenter">
          <AIcon type="UserOutlined" style="margin-right: 8px;" />
          <span>{{ $t('components.User.635192-0') }}</span>
        </a-menu-item>
        <a-menu-item key="logout">
          <AIcon type="LogoutOutlined" style="margin-right: 8px;" />
          <span>{{ $t('components.User.635192-1') }}</span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts" name="HeaderUser">
import { computed } from "vue";
import { jumpLogin } from '@/router'
import { useUserStore } from '@/store/user'
import { logout } from '@/api/login'

const userStore = useUserStore()
const router = useRouter()
const click = (e: { key: string }) => {
  switch (e.key) {
    case 'userCenter':
      router.push('/account/center')
      return;
    case 'logout':
      logout().then((resp) => {
        if (resp.success) {
          jumpLogin()
        }
      })
      return;
    default:
      return
  }
}

const userName = computed(() => {
  return userStore.userInfo.name
})

</script>

<style scoped lang="less">
.user-info {
  cursor: pointer;

  .name {
    padding: 0 12px;
  }
}
</style>
