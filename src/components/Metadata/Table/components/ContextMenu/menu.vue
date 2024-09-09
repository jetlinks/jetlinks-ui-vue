<template>
  <div
    class="metadata-context-menu"
    ref="contextMenu"
    tabindex="-1"
    @blur="close"
  >
    <a-menu @click="clickFunc">
      <a-menu-item key="add">
        <template #icon>
          <AIcon type="PlusSquareOutlined" />
        </template>
        新增行
      </a-menu-item>
      <a-menu-item key="copy">
        <template #icon>
          <AIcon type="icon-copy" />
        </template>
         复制行
      </a-menu-item>
      <a-menu-item key="paste" :disabled="showPaste">
        <template #icon>
          <AIcon type="icon-paste" />
        </template>
        粘贴行
      </a-menu-item>
      <a-menu-item key="detail" :disabled="showDetail">
        <template #icon>
          <AIcon type="icon-chakan" />
        </template>
        查看详情
      </a-menu-item>
      <a-menu-item key="delete" class="danger" :disabled="showDelete">
        <template #icon>
          <AIcon type="DeleteOutlined" />
        </template>
        删除
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup name="MetadataContextMenu">
import { onMounted, ref, nextTick } from "vue";
import { AIcon } from 'jetlinks-ui-components'

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

<style scoped lang="less">
.metadata-context-menu{
  position: fixed;
  box-shadow: 0 0 12px rgba(0, 0, 0 ,.2);
  border-radius: 4px;
  overflow: hidden;
  width: 192px;
  padding: 4px;
  background-color: #fff;
  :deep(.ant-menu) {
    border-right: none;

    .ant-menu-item {
      margin: 0;
      height: 32px;

      &.danger {
        color: @error-color;
      }
    }
  }

  :deep(.ant-menu-item-active) {
    background-color: var(--ant-primary-1);;
  }
}
</style>
