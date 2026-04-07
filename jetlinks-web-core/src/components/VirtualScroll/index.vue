
<template>
  <div class="viewport" ref="viewport" @scroll="handleScroll">
    <!-- 占位容器，高度为所有项总高度 -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>
    <!-- 实际渲染的可见项 -->
    <div class="list" :style="{ transform: `translateY(${offset}px)` }">
      <div
          v-for="item in visibleData"
          :key="item.id || item.key"
          class="list-item"
          :style="{ height: itemHeight + 'px' }"
      >
        <slot name="renderItem" v-bind="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  itemHeight: { type: Number, default: 50 }
})
const emit = defineEmits(['reachBottom', 'horizontalScroll'])

const viewport = ref(null)
const startIndex = ref(0)
const offset = ref(0)
const hasEmittedBottom = ref(false)
const bottomThreshold = 20
const viewportHeight = ref(0)
const previousScrollLeft = ref(0) // 记录上一次的横向滚动位置

// 计算总高度
const totalHeight = computed(() => props.data.length * props.itemHeight)

// 计算可见项数量
const visibleCount = computed(() => {
  return Math.ceil(viewportHeight.value / props.itemHeight) || 10
})

// 计算可见数据
const visibleData = computed(() => {
  return props.data.slice(
      startIndex.value,
      Math.min(startIndex.value + visibleCount.value, props.data.length)
  )
})

// 更新视口高度
const updateViewportHeight = () => {
  if (viewport.value) {
    viewportHeight.value = viewport.value.clientHeight
  }
}

// 滚动事件处理
const handleScroll = () => {
  const element = viewport.value
  if (!element) return

  // 纵向滚动处理
  const scrollTop = element.scrollTop
  startIndex.value = Math.floor(scrollTop / props.itemHeight)
  offset.value = scrollTop - (scrollTop % props.itemHeight)

  const reachedBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - bottomThreshold
  if (reachedBottom && !hasEmittedBottom.value) {
    hasEmittedBottom.value = true
    emit('reachBottom')
  } else if (!reachedBottom) {
    hasEmittedBottom.value = false
  }

  // 横向滚动处理
  const scrollLeft = element.scrollLeft
  if (scrollLeft !== previousScrollLeft.value) {
    emit('horizontalScroll', scrollLeft)
    previousScrollLeft.value = scrollLeft
  }
}

// 窗口大小变化处理（使用防抖优化性能）
let resizeTimer = null
const handleResize = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  resizeTimer = setTimeout(() => {
    updateViewportHeight()
  }, 100)
}

watch(() => props.data.length, () => {
  // 数据列表变化时允许再次触发底部事件
  hasEmittedBottom.value = false
})

onMounted(() => {
  // 初始化容器高度
  if (!viewport.value.style.height) {
    viewport.value.style.height = '100%'
  }
  // 初始化视口高度
  updateViewportHeight()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 清理定时器和事件监听
  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.viewport {
  width: 100%;
  position: relative;
  overflow-y: auto;
  &:not(:last-child){
    border-bottom: 1px solid #eee;
  }
}
.phantom {
  position: absolute;
  width: 100%;
}
.list {
  position: absolute;
  width: 100%;
}
.list-item {
  box-sizing: border-box;
  width: 100%;
}
</style>
