<template>
    <a-modal
        v-if="modalVisible"
        visible
        :closable="false"
        @cancel="modalVisible = false"
        @ok="modalConfirm"
        :confirmLoading="confirmLoading"
        :width="300"
        centered
        ><div class="modalContent">
            {{ title }}
        </div>
    </a-modal>
    <span @click="modalVisible = true" :class="props.className" v-show="show">
        {{ props.class }}
        <slot></slot>
    </span>
</template>

<script setup>
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    onConfirm: {
        type: Object,
        default: {},
    },
    className: {
        type: String,
    },
    show: {
        type: Boolean,
        default: true,
    },
});
const confirmLoading = ref(false);
const modalVisible = ref(false);
const modalConfirm = () => {
    if (typeof props.onConfirm === 'function') {
        confirmLoading.value = true;
        const res = props.onConfirm();
        confirmLoading.value = false;
        modalVisible.value = false;
    } else {
        modalVisible.value = false;
    }
};
</script>
<style lang="less" scoped>
.modalContent {
    text-align: center;
}
</style>
