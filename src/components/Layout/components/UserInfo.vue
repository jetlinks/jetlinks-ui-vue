<template>
    <div>
        <j-dropdown placement="bottomRight">
            <div style="cursor: pointer;height: 100%;">
                <img
                    :src="userInfo.avatar"
                    alt=""
                    style="width: 24px; margin-right: 12px"
                />
                <span>{{ userInfo.name }}</span>
            </div>
            <template #overlay>
                <j-menu>
                    <j-menu-item @click="push('/account/center')" style="width: 160px;">
                        <AIcon type="UserOutlined" style="margin-right: 8px;" />
                        <span>个人中心</span>
                    </j-menu-item>
                    <j-menu-item @click="logOut">
                        <AIcon type="LogoutOutlined" style="margin-right: 8px;" />
                        <span>退出登录</span>
                    </j-menu-item>
                </j-menu>
            </template>
        </j-dropdown>
    </div>
</template>

<script setup lang="ts">
import { loginout_api } from '@/api/login';
import { useUserInfo } from '@/store/userInfo';
import { LoginPath } from '@/router/menu'

const {push} = useRouter();

const userInfo = useUserInfo().$state.userInfos as any;


const logOut = () => {
    loginout_api().then(() => {
        localStorage.clear();
        push(LoginPath);
    });
};
</script>

<style scoped></style>
