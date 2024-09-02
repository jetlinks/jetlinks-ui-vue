<template>
  <div ref='fullPage' :style="styles" :class="{ 'full-page-warp': true, 'scroll': showScroll }" >
    <slot></slot>
  </div>
</template>

<script setup name='FullPage'>

const props = defineProps({
  extraHeight: {
    type: Number,
    default: 0
  },
  showScroll: {
    type: Boolean,
    default: false
  },
  padding: {
    type: Number,
    default: 24
  },
  fixed: {
    type: Boolean,
    default: true
  },
  margin: {
    type: String,
    default: undefined
  }
})

const fullPage = ref(null)
const MinHeight = ref(`0`)

const styles = computed(() => {
  let _style = { height: '100%'}

  if (props.fixed !== false) {
    _style = {
      height: MinHeight.value
    }
  } else {
    _style = {
      minHeight: MinHeight.value,
      margin: props.margin || '0 0 24px 0'
    }
  }

  return _style
})

onMounted(() => {
  setTimeout(() => {
    const top = fullPage.value.getBoundingClientRect().top
    const _y = top < 0 ? 0 : top
    const height = _y + props.extraHeight + props.padding

    MinHeight.value = `calc(100vh - ${height}px)`
  }, 10)
})

</script>

<style scoped lang="less">
.full-page-warp {
  background: #fff;

  &.scroll {
    overflow-y: auto;
  }
}

</style>
