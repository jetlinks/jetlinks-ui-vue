<template>
<j-form-item name="type" label="读写类型" required>
  <j-select
    :options="[
        { label: '', value: '' }
    ]"
    placeholder="请选择读写类型"
  />
</j-form-item>
</template>

<script setup lang="ts" name="ReadType">

</script>

<style scoped>

</style>