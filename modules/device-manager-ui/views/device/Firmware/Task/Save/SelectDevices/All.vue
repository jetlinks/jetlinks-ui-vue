<template>
  <DeviceTable ref="tableRef" type="All" :productId="productId" :data="data" />
</template>

<script setup>
import DeviceTable from './DeviceTable.vue';

const props = defineProps({
  productId: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => ({})
  },
});

const tableRef = ref()
const onSave = () => {
  return new Promise((resolve, reject) => {
    tableRef.value
        .onSave()
        .then((dt) => {
          resolve(dt);
        })
        .catch((err) => {
          reject(err);
        });
  });
};

defineExpose({ onSave })
</script>

<style lang="less" scoped>

</style>
