<template>
    <template v-if="isPermission">
        <template v-if="popConfirm">
            <j-tooltip v-if="tooltip" v-bind="tooltip">
                <slot v-if="noButton"></slot>
                <j-button
                    v-else
                    v-bind="props"
                    :disabled="_isPermission"
                    :style="props.style"
                    @click="showConfirm"
                >
                    <slot></slot>
                    <template #icon>
                        <slot name="icon"></slot>
                    </template>
                </j-button>
            </j-tooltip>
            <j-button
                v-else
                v-bind="props"
                :disabled="_isPermission"
                @click="showConfirm"
            >
                <slot></slot>
                <template #icon>
                    <slot name="icon"></slot>
                </template>
            </j-button>
        </template>
        <template v-else-if="tooltip">
            <j-tooltip v-bind="tooltip">
                <slot v-if="noButton"></slot>
                <j-button
                    v-else
                    v-bind="props"
                    :disabled="_isPermission"
                    :style="props.style"
                >
                    <slot></slot>
                    <template #icon>
                        <slot name="icon"></slot>
                    </template>
                </j-button>
            </j-tooltip>
        </template>
        <template v-else>
            <slot v-if="noButton"></slot>
            <j-button
                v-else
                v-bind="props"
                :disabled="_isPermission"
                :style="props.style"
            >
                <slot></slot>
                <template #icon>
                    <slot name="icon"></slot>
                </template>
            </j-button>
        </template>
    </template>
    <j-tooltip v-else title="暂无权限，请联系管理员" :placement="placement">
        <slot v-if="noButton"></slot>
        <j-button
            v-else
            v-bind="props"
            :disabled="_isPermission"
            :style="props.style"
        >
            <slot></slot>
            <template #icon>
                <slot name="icon"></slot>
            </template>
        </j-button>
    </j-tooltip>
</template>
<script setup lang="ts" name="PermissionButton">
import { CSSProperties, PropType } from 'vue';
import { TooltipProps, PopconfirmProps } from 'ant-design-vue/es';
import { buttonProps } from 'ant-design-vue/es/button/button';
import { usePermissionStore } from '@/store/permission';
import { omit } from 'lodash-es';
import { Modal } from 'ant-design-vue';

const props = defineProps({
    noButton: {
        type: Boolean,
        default: () => false,
    },
    tooltip: {
        type: Object as PropType<TooltipProps>,
    },
    popConfirm: {
        type: Object as PropType<PopconfirmProps>,
    },
    hasPermission: {
        type: [String, Array, Boolean],
    },
    style: {
        type: Object as PropType<CSSProperties>,
    },
    placement: {
        type: String,
        default: 'top',
    },
    ...omit(buttonProps(), 'icon'),
});
// const modalVisible = ref(false);
// const confirmLoading = ref(false);
const permissionStore = usePermissionStore();

const isPermission = computed(() => {
    if (!props.hasPermission || props.hasPermission === true) {
        return true;
    }
    return permissionStore.hasPermission(props.hasPermission);
});
const _isPermission = computed(() =>
    'hasPermission' in props && isPermission.value
        ? 'disabled' in props
            ? (props.disabled as boolean)
            : false
        : true,
);

// const modalConfirm =  async (e: MouseEvent) => {
//     if (typeof props.popConfirm?.onConfirm === 'function') {
//         confirmLoading.value = true;
//         const res: any =  await props.popConfirm?.onConfirm(e)?.finally(()=>{
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
    Modal.confirm({
        title: props.popConfirm?.title,
        content: props.popConfirm?.content,
        zIndex: 2000,
        onOk() {
            return props.popConfirm?.onConfirm();
        },
        onCancel() {},
    });
};
</script>
<style scoped lang="less">
// .modalContent {
//     text-align: center;
// }
// .control {
//     margin-top: 20px;
//     display: flex;
//     justify-content: space-between;
// }
</style>
