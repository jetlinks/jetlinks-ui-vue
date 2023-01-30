<template>
  <template v-if="isPermission">
    <template v-if="popConfirm">
      <a-popconfirm v-bind="popConfirm" :disabled="!isPermission || props.disabled">
        <a-tooltip v-if="tooltip" v-bind="tooltip">
          <slot v-if="noButton"></slot>
          <a-button v-else v-bind="buttonProps" :disabled="_isPermission" @click="handleClick">
            <slot></slot>
            <template #icon>
              <slot name="icon"></slot>
            </template>
          </a-button>
        </a-tooltip>
        <a-button v-else v-bind="buttonProps" :disabled="_isPermission" @click="handleClick">
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
        <a-button v-else v-bind="buttonProps" :disabled="_isPermission" @click="handleClick">
          <slot></slot>
          <template #icon>
            <slot name="icon"></slot>
          </template>
        </a-button>
      </a-tooltip>
    </template>
    <template v-else>
      <slot v-if="noButton"></slot>
      <a-button v-else v-bind="buttonProps" :disabled="_isPermission" @click="handleClick">
        <slot></slot>
        <template #icon>
          <slot name="icon"></slot>
        </template>
      </a-button>
    </template>
  </template>
  <a-tooltip v-else title="没有权限">
    <slot v-if="noButton"></slot>
    <a-button v-else v-bind="buttonProps" :disabled="_isPermission" @click="handleClick">
      <slot></slot>
      <template #icon>
        <slot name="icon"></slot>
      </template>
    </a-button>
  </a-tooltip>
</template>
<script setup lang="ts" name="PermissionButton">
import type { ButtonProps, TooltipProps, PopconfirmProps } from 'ant-design-vue'
import { usePermissionStore } from '@/store/permission';

interface PermissionButtonEmits {
  (e: 'click', data: MouseEvent): void;
}

const emits = defineEmits<PermissionButtonEmits>()

interface PermissionButtonProps extends ButtonProps {
  tooltip?: TooltipProps;
  popConfirm?: PopconfirmProps;
  hasPermission?: string | Array<string>;
  noButton?: boolean;
}
const props = withDefaults(defineProps<PermissionButtonProps>(), {
  noButton: false
})
const { tooltip, popConfirm, hasPermission, noButton, ...buttonProps } = props;

const permissionStore = usePermissionStore()

const isPermission = computed(() => {
  if (!props.hasPermission) {
    return true
  }
  return permissionStore.hasPermission(props.hasPermission)
})
const _isPermission = computed(() =>
  'hasPermission' in props && isPermission.value
    ? 'disabled' in buttonProps
      ? buttonProps.disabled
      : false
    : true
)
const handleClick = (e: MouseEvent) => {
  emits('click', e)
}
</script>
<style scoped lang="less">

</style>