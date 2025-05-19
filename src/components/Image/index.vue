<template>
  <div class="image-container">
    <a-spin :spinning="isLoading && !url.length">
      <img
        ref="imgRef"
        :src="src"
        :width="width"
        :height="height"
        :alt="alt"
      />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { imageProps } from 'ant-design-vue/es/vc-image/src/Image'

const props = defineProps({
  ...imageProps(),
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  preview: {
    type: Boolean,
    default: false
  },
  alt: {
    type: String,
    default: ''
  },
})

const url = ref(''); //存储图片地址，用于判断图片是否加载成功
const isLoading = ref(false); //是否显示加载状态
const loadTimer = ref(); //加载图片的定时器
const imgRef = ref();

onMounted(() => {
  loadImage();
})

onBeforeUnmount(() => {
  if (loadTimer.value) {
    clearTimeout(loadTimer.value);
  }
})

const loadImage = () => {
  // 设置短暂延迟后显示加载状态
  loadTimer.value = setTimeout(() => {
    if(!isLoading.value) {
      isLoading.value = true;
    }
  }, 300);
  // 加载图片
  imgRef.value.src = props.src;
  imgRef.value.onerror = () => {
    //加载失败替换图片为默认图片
    imgRef.value.src = 'data:image/png;base64,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';
    clearTimeout(loadTimer.value);
    isLoading.value = false;
  }
  imgRef.value.onload = () => {
    url.value = imgRef.value.src;
    clearTimeout(loadTimer.value);
    isLoading.value = false;
  }
}
</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block;
}
</style>