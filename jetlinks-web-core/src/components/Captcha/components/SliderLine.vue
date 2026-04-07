<script setup lang="ts">
import { ref } from 'vue'
import { TrackRecorder } from '../utils'

defineProps({
  tip: {
    type: String,
    default: '',
  }
})

const trackRecorder = new TrackRecorder()

const status = ref<'ready' | 'moving' | 'validating' | 'success' | 'fail'>('ready')
const isDragging = ref(false)
const sliderPercent = ref(0)
const trackWidth = ref(0)
const startX = ref(0)

const emits = defineEmits(['end', 'move'])

const handleDragMove = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  if ('touches' in e && e.cancelable) e.preventDefault()

  trackRecorder.handleMove(e)

  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const deltaX = clientX - startX.value
  const percent = Math.max(0, Math.min(deltaX / trackWidth.value, 1))

  sliderPercent.value = percent * 100

  emits('move', percent)
}

const handleDragEnd = async (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return

  isDragging.value = false
  removeEventListeners()

  const trackData = trackRecorder.stopTracking(e)
  status.value = 'validating'
  emits('end', trackData)
}

const handleDragStart = (e: MouseEvent | TouchEvent) => {
  if (status.value === 'validating' || status.value === 'success') return

  e.preventDefault()
  isDragging.value = true
  status.value = 'moving'
  trackRecorder.startTracking(e)

  const trackEl = (e.currentTarget as HTMLElement).parentElement
  trackWidth.value = trackEl?.offsetWidth || 0
  startX.value = 'touches' in e ? e.touches[0].clientX : e.clientX

  document.addEventListener('mousemove', handleDragMove)
  document.addEventListener('mouseup', handleDragEnd)
  document.addEventListener('touchmove', handleDragMove, { passive: false })
  document.addEventListener('touchend', handleDragEnd)
}

const removeEventListeners = () => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
}

defineExpose({
  reset: () => {
    console.log(sliderPercent.value)
    status.value = 'ready'
    sliderPercent.value = 0
  }
})

</script>

<template>
  <div class="track">
    <div class="track-mask" :style="{ width: `${sliderPercent}%` }"></div>
    <span v-if="!isDragging" class="track-tip">{{ tip || '拖动滑块旋转图片' }}</span>
    <div
      class="slider-btn"
      :class="{ active: isDragging }"
      :style="{ left: `${sliderPercent}%` }"
      @mousedown="handleDragStart"
      @touchstart.passive="handleDragStart"
    >
      <AIcon type="ArrowRightOutlined" />
    </div>
  </div>
</template>

<style scoped lang="less">

.track {
  position: relative;
  height: 40px;
  background: #f7f9fa;
  border: 1px solid #e4e7eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.track-mask {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #0298f8;
  opacity: 0.2;
  border-radius: 4px 0 0 4px;
}

.track-tip {
  font-size: 14px;
  color: #999;
  user-select: none;
  pointer-events: none;
}

.slider-btn {
  position: absolute;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e4e7eb;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: background 0.2s;
  z-index: 2;
}

.slider-btn:hover,
.slider-btn.active {
  background: #0298f8;
  border-color: #0298f8;
  color: white;
  cursor: grabbing;
}
</style>