<template lang="">
    <a-modal
        title="查看"
        ok-text="确认"
        cancel-text="取消"
        :visible="true"
        width="500px"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <span>失败原因：{{ data }}</span>
    </a-modal>
</template>
<script lang="ts" setup name="TaskDetailSavePage">
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const handleOk = () => {
    handleCancel();
};
const handleCancel = () => {
    emit('change', false);
};
</script>

<style lang="less" scoped></style>
