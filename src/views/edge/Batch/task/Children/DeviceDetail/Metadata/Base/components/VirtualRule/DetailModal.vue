<template>
  <a-modal
    visible
    title="规则"
    :maskClosable="false"
    :width="1000"
    :getContainer="getPopupContainer"
    :footer="false"
    @cancel="emit('cancel')"
  >
    <div class="rule-detail-warp">
      <j-monaco-editor
        :model-value="value" theme="vs" ref="editor" language="javascript" :readOnly="true"
      />
    </div>
  </a-modal>
</template>

<script setup name="DetailModal">
defineProps({
  value: {
    type: String,
    default: undefined
  },
  getPopupContainer: {
    type: Function,
    default: undefined
  },
})

const emit = defineEmits(['cancel'])

</script>

<style scoped lang="less">

.rule-detail-warp {
  position: relative;
  height: 500px;

  :deep(.monaco-editor-overlaymessage) {
    display: none !important;
  }
  .rule-detail-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
