<template>
  <div class="api-example">
    <monaco-editor
      v-if="loading"
      language="json"
      :model-value="codeText"
      :init="init"
    />
    <div class="api-example-tips" :style="{ transform: `translateY(${scrollTop}px)`}" v-if="loading">
      <div class="tips-line" v-for="tip in tips">
        <span v-if="tip">//{{tip}}</span>
      </div>
    </div>
  </div>
</template>

<script setup name="ApiMonaco">

defineProps({
  tips: {
    type: Array,
    default: () => []
  },
  codeText: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const scrollTop = ref(0)
const init = (editor) => {
  editor.onDidScrollChange(e => {
    scrollTop.value = 0 - e.scrollTop
  })
}

</script>

<style scoped lang="less">
.api-example {
  height: 350px;
  position: relative;
  overflow: hidden;

  .api-example-tips {
    position: absolute;
    left: 50%;
    top: 19px;
    bottom: 0;
    right: 0;
    pointer-events: none;
    color: #608b4e;

    .tips-line {
      height: 19px;
    }
  }
}
</style>
