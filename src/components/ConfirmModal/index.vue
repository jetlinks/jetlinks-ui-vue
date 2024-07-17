<template>
    <!-- <a-modal
        v-if="modalVisible"
        visible
        :closable="false"
        @cancel="modalVisible = false"
        @ok="modalConfirm"
        :confirmLoading="confirmLoading"
        :width="300"
        centered
        :maskClosable="false"
        z-index="9999"
        ><div class="modalContent">
            {{ title }}
        </div>
    </a-modal> -->
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
const showConfirm = () =>{
    Modal.confirm({
        title: props.title,
        content: props?.content,
        onOk() {
          return props?.onConfirm()
        },
        onCancel() {},
      });
}
</script>
<style lang="less" scoped>
.modalContent {
    text-align: center;
}
</style>
