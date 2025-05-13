<script setup name="ScanTree">
import { inject } from 'vue'

const setting = inject('scan-tree-setting', {})
const collectionData = inject('collector-data', {})

setting.request = {
  type: 'BrowseNodes',
}

setting.handleDataSourceItem = (info) => {
  return {
    features: {
      value: (info.features || []).includes('changedOnly'),
      check: true,
    },
    accessModes: {
      value: info.accessModes || [],
      check: true,
    },
    configuration: {
      ...(info.configuration || {}),
      interval: {
        value: info.configuration?.interval || 3000,
        check: true,
      },
      nodeId: info.id,
    }
  }
}
</script>

<template>

</template>

<style scoped lang="less">

</style>
