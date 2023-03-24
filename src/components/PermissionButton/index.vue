<template>
  <template v-if="isPermission">
    <template v-if="popConfirm">
      <j-popconfirm :overlayStyle='{minWidth: "180px"}' v-bind="popConfirm" :disabled="!isPermission || props.disabled">
        <j-tooltip v-if="tooltip" v-bind="tooltip">
          <slot v-if="noButton"></slot>
          <j-button v-else v-bind="props" :disabled="_isPermission" :style="props.style">
            <slot></slot>
            <template #icon>
              <slot name="icon"></slot>
            </template>
          </j-button>
        </j-tooltip>
        <j-button v-else v-bind="props" :disabled="_isPermission" >
          <slot></slot>
          <template #icon>
            <slot name="icon"></slot>
          </template>
        </j-button>
      </j-popconfirm>
    </template>
    <template v-else-if="tooltip">
      <j-tooltip v-bind="tooltip">
        <slot v-if="noButton"></slot>
        <j-button v-else v-bind="props" :disabled="_isPermission" :style="props.style">
          <slot></slot>
          <template #icon>
            <slot name="icon"></slot>
          </template>
        </j-button>
      </j-tooltip>
    </template>
    <template v-else>
      <slot v-if="noButton"></slot>
      <j-button v-else v-bind="props" :disabled="_isPermission" :style="props.style">
        <slot></slot>
        <template #icon>
          <slot name="icon"></slot>
        </template>
      </j-button>
    </template>
  </template>
  <j-tooltip v-else title="暂无权限，请联系管理员">
    <slot v-if="noButton"></slot>
    <j-button v-else v-bind="props" :disabled="_isPermission" :style="props.style">
      <slot></slot>
      <template #icon>
        <slot name="icon"></slot>
      </template>
    </j-button>
  </j-tooltip>
</template>
<script setup lang="ts" name="PermissionButton">
import { CSSProperties, PropType } from 'vue'
import { TooltipProps, PopconfirmProps } from 'ant-design-vue/es'
import { buttonProps } from 'ant-design-vue/es/button/button'
import { usePermissionStore } from '@/store/permission';
import { omit } from 'lodash-es';

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
    type: String || Array || Boolean,
  },
  style: {
    type: Object as PropType<CSSProperties>
  },
  ...omit(buttonProps(), 'icon')
})

// const { tooltip, popConfirm, hasPermission, noButton, ..._buttonProps } = props;

const permissionStore = usePermissionStore()

const isPermission = computed(() => {
  if (!props.hasPermission || props.hasPermission === true) {
    return true
  }
  return permissionStore.hasPermission(props.hasPermission)
})
const _isPermission = computed(() =>
  'hasPermission' in props && isPermission.value
    ? 'disabled' in props
      ? props.disabled as boolean
      : false
    : true
)

// const conform = (e: MouseEvent) => {
//   props.popConfirm?.onConfirm?.(e)
// }
</script>
<style scoped lang="less">

</style>