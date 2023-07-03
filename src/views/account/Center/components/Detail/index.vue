<template>
    <j-modal visible title="查看详情" @cancel="emit('close')">
        <j-descriptions :column="1">
            <j-descriptions-item label="用户名">{{ userInfos?.username }}</j-descriptions-item>
            <j-descriptions-item label="账号ID">{{ userInfos?.id }}</j-descriptions-item>
            <j-descriptions-item label="姓名">{{ userInfos.name }}</j-descriptions-item>
            <j-descriptions-item label="角色">{{ role }}</j-descriptions-item>
            <j-descriptions-item label="组织">{{ org }}</j-descriptions-item>
            <j-descriptions-item label="手机号">{{ userInfos?.telephone || '--' }}</j-descriptions-item>
            <j-descriptions-item label="邮箱">{{ userInfos?.email || '--' }}</j-descriptions-item>
        </j-descriptions>
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
    const _role = userInfos?.roleList.map((item: any) => item?.name).join(',') 
    return _role || '暂无角色'
})

const org = computed(() => {
    const _role = userInfos?.orgList.map((item: any) => item?.name).join(',') 
    return _role || '暂无组织'
})
</script>