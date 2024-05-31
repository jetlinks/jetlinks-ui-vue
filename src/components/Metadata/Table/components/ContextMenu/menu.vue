<template>
  <div
    class="metadata-context-menu"
    ref="contextMenu"
    @blur="onClose"
  >
    <a-menu @click="clickFunc">
      <a-menu-item key="add">
        <AIcon type="PlusSquareOutlined" /> 新增行
      </a-menu-item>
      <a-menu-item key="copy">
        <AIcon type="CopyOutlined" /> 复制行
      </a-menu-item>
      <a-menu-item key="paste">
        粘贴行
      </a-menu-item>
      <a-menu-item key="detail">
        <AIcon type="FileSearchOutlined" /> 查看详情
      </a-menu-item>
      <a-menu-item key="delete">
        <AIcon type="DeleteOutlined" />删除
      </a-menu-item>
    </a-menu>
  </div>
</template>

<script setup name="MetadataContextMenu">
import { onMounted, ref, nextTick } from "vue";

const props = defineProps({
  data: { default: null },
  onClose: { type: Function, default: () => {} },
});

const contextMenu = ref(null);

const clickFunc = ({ key }) => {
  props.onClose();
  console.log(props.data)
};

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

  :deep(.ant-menu-item-active) {
    background-color: var(--ant-primary-1);;
  }
}
</style>
