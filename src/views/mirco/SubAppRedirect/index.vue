<template>
  <div></div>
</template>
<script setup name="Micro">

</script>

<style scoped lang="less">
.micro-app-container, .micro-app-content {
  width: 100%;
  height: 100%;

  .micro-app-spin {
    height: 100%;
    width: 100%;
    > div {
      height: 100%;
      width: 100%;
    }
  }
  :deep(.ant-spin-container) {
    height: 100%;
  }
}
</style>
