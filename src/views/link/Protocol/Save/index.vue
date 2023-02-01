<template lang="">
    <a-modal
        :title="data.id ? '编辑' : '新增'"
        ok-text="确认"
        cancel-text="取消"
        :visible="true"
        width="600px"
        :confirm-loading="loading"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        123
    </a-modal>
</template>
<script lang="ts" setup>
const loading = ref(false);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const handleOk = () => {
    console.log(2);
    emit('change', true);
};
const handleCancel = () => {
    console.log(1);
    emit('change', false);
};
</script>

<style lang=""></style>
