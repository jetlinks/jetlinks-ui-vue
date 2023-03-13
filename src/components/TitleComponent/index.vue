<template>
  <div class="title" :style='style'>
    <span>{{ data }}</span>
    <slot name="extra"></slot>
  </div>
</template>

<script setup lang='ts' name='TitleComponent'>
import type { CSSProperties, PropType } from 'vue'

const props = defineProps({
  data: {
    type: String,
    default: ""
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({})
  }
})

</script>

<style lang="less" scoped>
.title {
    position: relative;
    width: 100%;
    margin-bottom: 10px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    font-size: 16px;
    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background-color: @primary-color;
        content: '';
    }
}
</style>