<template>
  <j-input @click="showTagSearch === true" v-model="searchValue">

  </j-input>
  <j-modal v-if="showTagSearch" title="设备标签" visible>
    
  </j-modal>
</template>

<script lang="ts" setup>
const showTagSearch = ref(false)
const searchValue = ref('')
</script>
<style lang="less" scoped>
</style>