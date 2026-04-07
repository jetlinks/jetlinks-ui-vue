<template>
  <div
    class="metadata-context-menu"
    ref="contextMenu"
    tabindex="-1"
    @blur="close"
  >
    <Menu @click="clickFunc">
      <MenuItem key="add">
        <template #icon>
          <AIcon type="PlusSquareOutlined" />
        </template>
        {{ i18n.global.t('ContextMenu.menu.906418-0') }}
      </MenuItem>
      <MenuItem key="copy">
        <template #icon>
          <AIcon type="icon-copy" />
        </template>
         {{ i18n.global.t('ContextMenu.menu.906418-1') }}
      </MenuItem>
      <MenuItem key="paste" :disabled="showPaste">
        <template #icon>
          <AIcon type="icon-paste" />
        </template>
        {{ i18n.global.t('ContextMenu.menu.906418-2') }}
      </MenuItem>
      <MenuItem key="detail" :disabled="showDetail">
        <template #icon>
          <AIcon type="icon-chakan" />
        </template>
        {{ i18n.global.t('ContextMenu.menu.906418-3') }}
      </MenuItem>
      <MenuItem key="delete" class="danger" :disabled="showDelete">
        <template #icon>
          <AIcon type="DeleteOutlined" />
        </template>
        {{ i18n.global.t('ContextMenu.menu.906418-4') }}
      </MenuItem>
    </Menu>
  </div>
</template>

<script setup name="MetadataContextMenu">
import { onMounted, ref, nextTick } from "vue";
import i18n from "@jetlinks-web-core/locales";
import { Menu, MenuItem} from 'ant-design-vue'
import {AIcon } from '@jetlinks-web/components'

const props = defineProps({
  data: {type: Object, default: () => ({})},
  onClose: { type: Function, default: () => {} },
  onClick: { type: Function, default: () => {} },
  onCopy: { type: Function, default: () => {} },
  paste: { type: Object, default: () => ({}) }
});

const contextMenu = ref(null);

const showDetail = computed(() => {
  return !props.data.id
})

const showPaste = computed(() => {
  return !props.paste
})

const showDelete = computed(() => {
  return props.data.expands?.isProduct
})

const clickFunc = ({ key }) => {
  if (key === 'copy') {
    props.onCopy(props.data)
  }
  props.onClick(key)
};

const close = (e) => {
  setTimeout(() => {
    props.onClose()
  }, 300)
}

onMounted(async () => {
// 确保组件已经渲染
  await nextTick();
// 触发组件focus
  contextMenu.value.focus();
});

</script>

<style lang="less">
.metadata-context-menu{
  position: fixed;
  box-shadow: 0 0 12px rgba(0, 0, 0 ,.2);
  border-radius: 4px;
  overflow: hidden;
  width: 192px;
  padding: 4px;
  background-color: #fff;
  .ant-menu {
    border-right: none;

    .ant-menu-item {
      margin: 0;
      height: 32px;
      display: flex;
      align-items: center;

      &.danger {
        color: @error-color;
      }
    }
  }

  .ant-menu-item-active {
    background-color: var(--ant-primary-1);;
  }
}
</style>
