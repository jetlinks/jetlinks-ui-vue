<template>
  <div :style="colorStyle" class="item">
    <AIcon :type="statusIcon.get(value)"/>
  </div>
</template>

<script setup>
import {statusColor, statusIcon} from "@/views/link/Resource/Install/data";

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})

const colorStyle = computed(() => {
  return {
    color: statusColor.get(props.value) ,
  }
})
</script>

<style lang="less" scoped>
.item {
  font-size: 20px;
}
</style>
