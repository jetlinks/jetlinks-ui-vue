<template>
  <div>
    <AIcon :type="statusIcon.get(value)"/>
  </div>
</template>

<script setup>
import {statusIcon} from "@/views/link/Resource/Install/data";

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
</script>

<style lang="less" scoped>

</style>
