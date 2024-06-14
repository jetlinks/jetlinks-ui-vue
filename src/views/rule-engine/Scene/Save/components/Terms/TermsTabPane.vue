<template>
  <div class="terms-tab-pane" @mouseleave="mouseleave" @mouseover="mouseover">
    <div class="terms-tab-pane-content">
      <slot />
    </div>

    <div class="terms-tab-pane-btn" @click="close">
      <AIcon v-show="showClose && showIcon" type="CloseOutlined" />
    </div>
  </div>
</template>

<script setup name="TermsTabPane">

const emit = defineEmits('close')

const props = defineProps({
  showClose: {
    type: Boolean,
    default: true
  }
})

const showIcon = ref(false)
const mouseleave = () => {
  showIcon.value = false
}

const mouseover = () => {
  showIcon.value = true
}

const close = (e) => {
  console.log(e)
  e.stopPropagation()
  if (props.showClose && showIcon.value) {
    emit('close')
  }
}
</script>

<style scoped lang="less">
.terms-tab-pane {
  display: flex;
  gap: 8px;

  .terms-tab-pane-btn {
    width: 14px;
    >span {
      margin: 0;
    }
  }
}
</style>
