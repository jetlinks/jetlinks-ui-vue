<template>
  <Table
      ref="tableRef"
      :columns="columns"
      :dataSource="dataSource"
    >
      <template #bodyCell="{ column, record, index }">
        <TableFormItem
          v-if="column.dataIndex === 'name'"
          :name="[index, 'name']"
        >
          <a-input v-model:value="record.name"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'age'"
          :name="[index, 'age']"
        >
          <a-input v-model:value="record.age"/>
        </TableFormItem>
      </template>
  </Table>
  <a-button @click="() => tableRef.validate()">校验</a-button>
</template>

<script setup name="demo">
import Table from './Table.vue'
import TableFormItem from './TableFormItem.vue'

const tableRef = ref()
const dataSource = ref([
  { name: '', age: 0 },
  { name: '', age: 0 },
])

const columns = [
  {
    dataIndex: 'name',
    title: '姓名',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入列名')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    dataIndex: 'age',
    title: '年龄',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入age')
          }
          return Promise.resolve()
        }
      }
    }
  }
]
</script>

<style scoped>

</style>
