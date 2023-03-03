<template>
    <div>
        <a-dropdown placement="bottomRight">
            <div style="cursor: pointer;height: 100%;">
                <img
                    :src="userInfo.avatar"
                    alt=""
                    style="width: 24px; margin-right: 12px"
                />
                <span>{{ userInfo.name }}</span>
            </div>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="push('/account/center')" style="width: 160px;">
                        <AIcon type="UserOutlined" style="margin-right: 8px;" />
                        <span>个人中心</span>
                    </a-menu-item>
                    <a-menu-item @click="logOut">
                        <AIcon type="LogoutOutlined" style="margin-right: 8px;" />
                        <span>退出登录</span>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup lang="ts">
import { loginout_api } from '@/api/login';
import { useUserInfo } from '@/store/userInfo';

const {push} = useRouter();

const userInfo = useUserInfo().$state.userInfos as any;


const logOut = () => {
    loginout_api().then(() => {
        localStorage.clear();
        push('/user/login');
    });
};
</script>

<style scoped></style>
