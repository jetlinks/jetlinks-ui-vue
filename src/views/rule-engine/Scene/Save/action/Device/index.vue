<template>
    <j-modal
        title="执行动作"
        visible
        :width="860"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        device
    </j-modal>
</template>

<script lang="ts" setup>
const emit = defineEmits(['cancel', 'save']);
const onCancel = () => {
    emit('cancel');
};
const onOk = () => {
    emit('save');
};
</script>