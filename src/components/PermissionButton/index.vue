<template>
  <template v-if="isPermission">
    <template v-if="popConfirm">
      <a-popconfirm v-bind="popConfirm" :disabled="!isPermission || props.disabled">
        <a-tooltip v-if="tooltip" v-bind="tooltip">
          <slot v-if="noButton"></slot>
          <a-button v-else v-bind="_buttonProps" :disabled="_isPermission" >
            <slot></slot>
            <template #icon>
              <slot name="icon"></slot>
            </template>
          </a-button>
        </a-tooltip>
        <a-button v-else v-bind="_buttonProps" :disabled="_isPermission" >
          <slot></slot>
          <template #icon>
            <slot name="icon"></slot>
          </template>
        </a-button>
      </a-popconfirm>
    </template>
    <template v-else-if="tooltip">
      <a-tooltip v-bind="tooltip">
        <slot v-if="noButton"></slot>
        <a-button v-else v-bind="_buttonProps" :disabled="_isPermission" >
          <slot></slot>
          <template #icon>
            <slot name="icon"></slot>
          </template>
        </a-button>
      </a-tooltip>
    </template>
    <template v-else>
      <slot v-if="noButton"></slot>
      <a-button v-else v-bind="_buttonProps" :disabled="_isPermission" >
        <slot></slot>
        <template #icon>
          <slot name="icon"></slot>
        </template>
      </a-button>
    </template>
  </template>
  <a-tooltip v-else title="没有权限">
    <slot v-if="noButton"></slot>
    <a-button v-else v-bind="_buttonProps" :disabled="_isPermission" >
      <slot></slot>
      <template #icon>
        <slot name="icon"></slot>
      </template>
    </a-button>
  </a-tooltip>
</template>
<script setup lang="ts" name="PermissionButton">
import { PropType } from 'vue'
import { TooltipProps, PopconfirmProps } from 'ant-design-vue/es'
import { buttonProps } from 'ant-design-vue/es/button/button'
import { usePermissionStore } from '@/store/permission';

// interface PermissionButtonEmits {
//   (e: 'click', data: MouseEvent): void;
// }

// const emits = defineEmits<PermissionButtonEmits>()

// interface PermissionButtonProps extends ButtonProps {
//   tooltip?: TooltipProps;
//   popConfirm?: PopconfirmProps;
//   hasPermission?: string | Array<string>;
//   noButton?: boolean;
// }
// const props = withDefaults(defineProps<PermissionButtonProps>(), {
//   noButton: false,
// })
const props = defineProps({
  noButton: {
    type: Boolean,
    default: () => false
  },
  tooltip: {
    type: Object as PropType<TooltipProps>,
  },
  popConfirm: {
    type: Object as PropType<PopconfirmProps>,
  },
  hasPermission: {
    type: String || Array,
  },
  ...buttonProps()
})

const { tooltip, popConfirm, hasPermission, noButton, ..._buttonProps } = props;

const permissionStore = usePermissionStore()

const isPermission = computed(() => {
  if (!props.hasPermission) {
    return true
  }
  return permissionStore.hasPermission(props.hasPermission)
})
const _isPermission = computed(() =>
  'hasPermission' in props && isPermission.value
    ? 'disabled' in _buttonProps
      ? _buttonProps.disabled as boolean
      : false
    : true
)

// const conform = (e: MouseEvent) => {
//   props.popConfirm?.onConfirm?.(e)
// }
</script>
<style scoped lang="less">

</style>