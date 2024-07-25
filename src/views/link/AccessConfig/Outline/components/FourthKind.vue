<template>
    <div>
        <a-descriptions bordered :column="1">
            <a-descriptions-item label="消息协议">
                {{ data?.provider }}
            </a-descriptions-item>
        </a-descriptions>
    </div>
</template>

<script setup>

const props = defineProps({
    data: {
        type: Object,
    },
});
</script>
<style lang="less" scoped></style>
