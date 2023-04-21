<template>
  <div style=''>
    <InklingDevice
      :accessId='accessId'
      :multiple='true'
      @change='change'
    />
  </div>
</template>

<script setup lang='ts' name='DeviceImportPlugin'>
import InklingDevice from '@/views/device/components/InklingDevice'

type Emit = {
  (e: 'change', data: any[]): void
}

const props = defineProps({
  accessId: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits<Emit>()

const change = (options: any[]) => {
  emit('change', options)
}

</script>

<style scoped lang='less'>
:deep(.device-import-product) {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
  padding-top: 6px;
}
</style>