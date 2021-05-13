<template>
  <a-table
    :loading="loading"
    :columns="columns"
    :data-source="data"
    :rowKey="data.id"
  >
  </a-table>
</template>

<script>
  export default {
    name: 'PerComTable',
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      columns: {
        type: Array,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      },
      rowKey: {
        type: String,
        default: 'id'
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
