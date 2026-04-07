<template>
  <div class="slider-captcha" ref="containerRef">
    <div :class="{ 'image-container': true, 'rotate-box': !isSlider }" :style="{ width: `${captchaData.backgroundImageWidth}px`, height: `${captchaData.backgroundImageHeight}px` }">
      <img
        ref="bgImageRef"
        :src="captchaData.backgroundImage"
        class="bg-image"
        :style="{ width: `100%`, height: `100%` }"
        alt="background"
      />
      <img
        v-if="captchaData.templateImage"
        :src="captchaData.templateImage"
        :class="{
          'slider-image': type === 'SLIDER',
          'rotate-image': type === 'ROTATE'
        }"
        :style="styles"
        alt="slider"
      />
      <div v-if="showResult" class="result" :class="status">
        <AIcon type="RedoOutlined" />
        <span>{{ resultText }}</span>
      </div>
    </div>
    <SliderLine
      ref="sliderLineRef"
      :tip="captchaData.tip"
      @move="handleDragMove"
      @end="handleDragEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CaptchaData, TrackData } from './captcha'
import SliderLine from './components/SliderLine.vue'

interface Props {
  captchaData: CaptchaData
  validate: (trackData: TrackData) => Promise<boolean>
  type: String
}

interface Emits {
  (e: 'success', response: any): void
  (e: 'fail', response: any): void
  (e: 'error', error: Error): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const containerRef = ref<HTMLElement>()
const bgImageRef = ref<HTMLImageElement>()

const status = ref<'ready' | 'moving' | 'validating' | 'success' | 'fail'>('ready')
const moveValue = ref(0)
const sliderLineRef = ref()

const isSlider = computed(() => props.type === 'SLIDER')
const styles = computed(() => {
  if (isSlider.value) {
    return {
      left: `${moveValue.value}%`,
      top: `${props.captchaData.randomY || 0}px`,
      width: `${props.captchaData.templateImageWidth}px`,
      height: `${props.captchaData.templateImageHeight}px`,
    }
  } else if (props.type === 'ROTATE') {
    return {
      transform: `translate(-50%, -50%) rotate(${moveValue.value}deg)`,
      width: `${props.captchaData.templateImageWidth}px`,
      height: `${props.captchaData.templateImageHeight}px`,
    }
  }
})

const showResult = computed(() => status.value === 'success' || status.value === 'fail')
const resultText = computed(() => {
  if (status.value === 'success') return '验证成功'
  if (status.value === 'fail') return '验证失败'
  return ''
})

const handleDragMove = (e: number) => {
  moveValue.value = e * (isSlider.value ? 100 : 360)
}

const handleDragEnd = async (e: TrackData) => {
  status.value = 'validating'

  try {
    const resp = await props.validate(e)
    if (resp) {
      status.value = 'success'
      emit('success', resp)
    } else {
      status.value = 'fail'
      emit('fail', resp)
      setTimeout(reset, 1000)
    }
  } catch (error) {
    status.value = 'fail'
    emit('error', error instanceof Error ? error : new Error('Validation failed'))
    setTimeout(reset, 1000)
  }
}


const reset = () => {
  status.value = 'ready'
  moveValue.value = 0
  sliderLineRef.value.reset()
}

</script>

<style scoped>
.slider-captcha {
  width: 100%;
  margin: 0 auto;
}

.image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  background: #f0f0f0;

  &.rotate-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.bg-image {
  display: block;
}

.slider-image {
  position: absolute;
  z-index: 2;
}

.rotate-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center;
  transition: transform 0.05s;
}

.result {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  z-index: 3;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.result.success {
  background: rgba(103, 194, 58, 0.9);
  color: white;
}

.result.fail {
  background: rgba(245, 108, 108, 0.9);
  color: white;
}
</style>
