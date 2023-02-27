<template>
  <a-table
    :data-source='dataSource'
    :columns='columns'
  >
    <template #bodyCell="{ column, record, index }">
      <template v-if='column.key'>

      </template>
    </template>
  </a-table>
</template>

<script setup lang='ts' name='FunctionCall'>

const dataSource = []

const columns = [
  {
    title: '参数名称',
    dataIndex: 'name'
  },
  {
    title: '参数名称',
    dataIndex: 'name'
  },
  {
    title: '值',
    dataIndex: 'value',
    align: 'center',
    width: 260
  },
]
</script>

<style scoped>

</style>