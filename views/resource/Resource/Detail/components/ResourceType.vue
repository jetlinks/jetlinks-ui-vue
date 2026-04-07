<script setup lang="ts">

defineProps({
  type: {
    type: Object,
    default: () => ({})
  },
})

const typeColor = {
  device: '#52C41A',
  collector: '#1677FF', // 数采
  protocol: '#FAAD14', // 协议
}

const typeIcon = {
  device: 'icon-a-rongqi21',
  collector: 'icon-rongqi3', // 数采
  protocol: 'icon-a-rongqi11', // 协议
}
</script>

<template>
  <div class="table-item-tag">
    <a-space>
      <AIcon style='font-size: 16px' :type="typeIcon[type.value]" :style="{ color: typeColor[type.value]}" />
      <span class="fc-600"> {{ type?.text || '-' }}</span>
    </a-space>
  </div>

</template>

<style scoped lang="less">
.table-item-tag {
  display: inline-block;
  border-radius: 4px;
  background-color: @font-gray-50;
  padding: 4px 8px;
  font-size: 14px;
}
</style>
