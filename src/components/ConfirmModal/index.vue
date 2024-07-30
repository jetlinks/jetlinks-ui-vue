<template>
    <!-- <a-tooltip v-if="toolTip" v-bind="toolTip">
        <span @click="showConfirm" :class="props.className" v-show="show">
            {{ props.class }}
            <slot></slot>
        </span>
    </a-tooltip> -->
    <span @click="showConfirm" :class="props.className" v-show="show">
        {{ props.class }}
        <slot></slot>
    </span>
</template>

<script setup>
import { Modal } from 'ant-design-vue';
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
    disabled: {
        type: Boolean,
        default: false,
    },
    toolTip: {
        type: Object
    },
});
// const confirmLoading = ref(false);
// const modalVisible = ref(false);
// const modalConfirm = async() => {
//     if (typeof props.onConfirm === 'function') {
//         confirmLoading.value = true;
//         const res = await props.onConfirm()?.finally(()=>{
//             confirmLoading.value = false;
//             modalVisible.value = false;
//             return
//         });
//         if(!res?.finally){
//             confirmLoading.value = false;
//             modalVisible.value = false;
//         }
//     } else {
//         modalVisible.value = false;
//     }
// };
const showConfirm = () => {
    if (props.disabled) {
        return;
    }
    Modal.confirm({
        title: props.title,
        content: props?.content,
        onOk() {
            return props?.onConfirm();
        },
        onCancel() {},
    });
};
</script>
<style lang="less" scoped>
.modalContent {
    text-align: center;
}
</style>
