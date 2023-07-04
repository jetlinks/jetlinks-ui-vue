<template>
    <j-modal visible @cancel="emit('close')" :closable="false">
        <div style="padding: 30px;">
            <div style="display: flex; margin-bottom: 32px">
                <j-avatar :size="100" :src="userInfos.avatar"></j-avatar>
                <div style="margin-left: 24px;">
                    <div class="name">{{ userInfos.name }}</div>
                    <div class="subTitle">用户名: {{ userInfos?.username }}</div>
                    <div class="subTitle">账号ID: {{ userInfos?.id }}</div>
                </div>
            </div>
            <j-descriptions
                :column="1"
                :labelStyle="{
                    color: 'rgba(0, 0, 0, 0.6)',
                    width: '70px',
                }"
                :contentStyle="{
                    color: '#333333',
                }"
            >
                <j-descriptions-item label="角色">
                    <j-ellipsis :lineClamp="2">
                        {{ role }}
                    </j-ellipsis>
                </j-descriptions-item>
                <j-descriptions-item label="组织">
                    <j-ellipsis :lineClamp="2">
                        {{ org }}
                    </j-ellipsis>
                </j-descriptions-item>
                <j-descriptions-item label="手机号">
                    <j-ellipsis :lineClamp="2">
                        {{ userInfos?.telephone }}
                    </j-ellipsis>
                </j-descriptions-item>
                <j-descriptions-item label="邮箱">
                    <j-ellipsis :lineClamp="2">
                        {{ userInfos?.email }}
                    </j-ellipsis>
                </j-descriptions-item>
            </j-descriptions>
        </div>
        <template #footer>
            <j-button type="primary" @click="emit('close')">关闭</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { useUserInfo } from '@/store/userInfo';

const { userInfos } = useUserInfo();
const emit = defineEmits(['close', 'save']);

const role = computed(() => {
    const _role = userInfos?.roleList.map((item: any) => item?.name).join(';');
    return _role || '暂无角色';
});

const org = computed(() => {
    const _role = userInfos?.orgList.map((item: any) => item?.name).join(';');
    return _role || '暂无组织';
});
</script>

<style lang="less" scoped>
.name {
    color: #1D2129;
    font-weight: 500;
    font-size: 26px;
}

.subTitle {
    color: rgba(0, 0, 0, 0.6);
    margin-top: 5px;
}
</style>