<template>
  <ResizeObserver
    :onResize="onResize"
  >
    <div class="tags-warp" :style="styles">
        <div v-for="item in tagOptions" class="tags-item">
          <Ellipsis>
            {{ item }}
          </Ellipsis>
        </div>
        <div v-if="showMore" class="tags-item">
          <AIcon type="EllipsisOutlined"/>
        </div>
    </div>
  </ResizeObserver>
</template>

<script setup name="tags">
import ResizeObserver from 'ant-design-vue/lib/vc-resize-observer';

const props = defineProps({
  tags: {
    type: Array,
    default: () => ([])
  },
  styles: {
    type: Object,
    default: () => ({})
  }
})

const showMore = ref(false)
const warpWidth = ref(0)

const onResize = ({ width }) => {
  warpWidth.value = width
}

const tagOptions = computed(() => {
  showMore.value = false
  if (warpWidth.value) {
    let max = warpWidth.value / (80 + 8)
    if (max > props.tags.length) {
      return props.tags
    } else {
      showMore.value = true
      return props.tags.slice(0, max - 1)
    }
  }
  return props.tags
})

</script>

<style scoped lang="less">
.tags-warp {
  display: flex;
  gap: 8px;
  width: 100%;

  .tags-item {
    text-align: center;
    color: #4096FF;
    background-color: #F0F0F0;
    border-radius: 2px;
    padding: 4px 4px;
    width: 80px;
  }
}
</style>
