
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
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  data: { type: Array, required: true },
  itemHeight: { type: Number, default: 50 }
})

const viewport = ref(null)
const startIndex = ref(0)
const offset = ref(0)

// 计算总高度
const totalHeight = computed(() => props.data.length * props.itemHeight)

// 计算可见项数量
const visibleCount = computed(() => {
  return Math.ceil(viewport.value?.clientHeight / props.itemHeight) || 10
})

// 计算可见数据
const visibleData = computed(() => {
  return props.data.slice(
      startIndex.value,
      Math.min(startIndex.value + visibleCount.value, props.data.length)
  )
})

// 滚动事件处理
const handleScroll = () => {
  const scrollTop = viewport.value.scrollTop
  startIndex.value = Math.floor(scrollTop / props.itemHeight)
  offset.value = scrollTop - (scrollTop % props.itemHeight)
}

onMounted(() => {
  // 初始化容器高度
  if (!viewport.value.style.height) {
    viewport.value.style.height = '100%'
  }
})
</script>

<style scoped>
.viewport {
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
}
</style>
