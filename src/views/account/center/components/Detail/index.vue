<template>
    <a-modal visible @cancel="emit('close')" :closable="false">
        <div style="padding: 30px;">
            <div style="display: flex; padding-bottom: 24px; margin-bottom: 24px; border-bottom: 1px solid #E4E7F6">
                <a-avatar :size="100" :src="userInfo.avatar"></a-avatar>
                <div style="margin-left: 24px;  max-width: 280px;" >
                    <div class="name"><j-ellipsis>{{ userInfo.name }}</j-ellipsis></div>
                    <div class="subTitle"><j-ellipsis>用户名: {{ userInfo?.username }}</j-ellipsis></div>
                    <!-- <div class="subTitle">账号ID: {{ userInfo?.id }}</div> -->
                </div>
            </div>
            <a-descriptions
                :column="1"
                :labelStyle="{
                    color: 'rgba(0, 0, 0, 0.6)',
                    width: '70px',
                }"
                :contentStyle="{
                    color: '#333333',
                }"
            >
                <a-descriptions-item label="角色">
                    <j-ellipsis :lineClamp="2">
                        {{ role }}
                    </j-ellipsis>
                </a-descriptions-item>
                <a-descriptions-item label="组织">
                    <j-ellipsis :lineClamp="2">
                        {{ org }}
                    </j-ellipsis>
                </a-descriptions-item>
                <a-descriptions-item label="手机号">
                    <j-ellipsis :lineClamp="2">
                        {{ userInfo?.telephone }}
                    </j-ellipsis>
                </a-descriptions-item>
                <a-descriptions-item label="邮箱">
                    <j-ellipsis :lineClamp="2">
                        {{ userInfo?.email }}
                    </j-ellipsis>
                </a-descriptions-item>
            </a-descriptions>
        </div>
        <template #footer>
            <a-button type="primary" @click="emit('close')">关闭</a-button>
        </template>
    </a-modal>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'

const { userInfo } = useUserStore();
const emit = defineEmits(['close', 'save']);

const role = computed(() => {
    const _role = userInfo?.roleList.map((item: any) => item?.name).join(';');
    return _role || '暂无角色';
});

const org = computed(() => {
    const _role = userInfo?.orgList.map((item: any) => item?.name).join(';');
    return _role || '暂无组织';
});
</script>

<style lang="less" scoped>
.name {
    color: #1D2129;
    font-weight: 500;
    font-size: 26px;
    margin: 15px 0 10px 0;
}

.subTitle {
    color: rgba(0, 0, 0, 0.6);
}
</style>
