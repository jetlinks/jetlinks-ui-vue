<!-- 基础内容 -->
<template>
  <BasicForm
    ref="formRef"
    hideSubmitBtn
  />
</template>
<script setup lang="ts">
import BasicForm from '../../system/Basis/Form.vue'

const formRef = ref()
/**
 * 提交数据
 */
const saveBasicInfo = () => formRef.value.submit()

defineExpose({
  submitBasic: saveBasicInfo,
});

</script>
<style scoped lang="less">

</style>
