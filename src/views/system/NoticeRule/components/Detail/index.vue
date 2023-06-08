<template>
    <j-modal :width="700" visible title="配置详情" @cancel="emit('close')">
        <j-descriptions bordered :column="2">
            <j-descriptions-item label="通知方式">Cloud Database</j-descriptions-item>
            <j-descriptions-item label="通知配置">Cloud Database</j-descriptions-item>
            <j-descriptions-item label="通知模板">Cloud Database</j-descriptions-item>
            <j-descriptions-item label="通知内容">Cloud Database</j-descriptions-item>
            <j-descriptions-item label="模板变量">Cloud Database</j-descriptions-item>
            <j-descriptions-item label="用户权限">Cloud Database</j-descriptions-item>
        </j-descriptions>
        <template #footer>
            <j-button type="primary" @click="emit('close')">确定</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emit = defineEmits(['close', 'save']);
</script>