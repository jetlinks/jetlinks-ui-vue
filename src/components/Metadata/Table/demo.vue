<template>
  <Table
      ref="tableRef"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
    >
      <template #bodyCell="{ column, record, index }">
        <StringParams v-if="column.dataIndex === 'string'" v-model:value="record[column.dataIndex]"/>
        <TableFormItem
          v-else-if="column.dataIndex === 'double'"
          :name="[index, column.dataIndex]"
        >
          <DoubleParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'integer'"
          :name="[index, column.dataIndex]"
        >
          <IntegerParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'date'"
          :name="[index, column.dataIndex]"
        >
          <DateParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'boolean'"
          :name="[index, column.dataIndex]"
        >
          <BooleanParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'file'"
          :name="[index, column.dataIndex]"
        >
          <FileParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'enum'"
          :name="[index, column.dataIndex]"
        >
          <EnumParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'object'"
          :name="[index, column.dataIndex]"
        >
          <ObjectParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
        <TableFormItem
          v-else-if="column.dataIndex === 'array'"
          :name="[index, column.dataIndex]"
        >
          <ArrayParams v-model:value="record[column.dataIndex]"/>
        </TableFormItem>
      </template>
  </Table>
  <a-button @click="addItem">新增</a-button>
  <a-button @click="validate">校验</a-button>
</template>

<script setup name="demo">
import Table from './Table.vue'
import TableFormItem from './TableFormItem.vue'
import {
  ArrayParams,
  ObjectParams,
  DateParams,
  BooleanParams,
  EnumParams,
  FileParams,
  IntegerParams,
  DoubleParams,
  StringParams
} from './components'

const tableRef = ref()
const dataSource = ref(new Array(0).fill(0).map((_, index) => {
  return {
    string: `string-${index}`,
    double: `double-${index}`,
    integer: `integer-${index}`,
    object: `object-${index}`,
    file: `file-${index}`,
    date: `date-${index}`,
    boolean: `boolean-${index}`,
    enum: `enum-${index}`,
    array: `array-${index}`,
  }
}))

const columns = [
  {
    dataIndex: 'string',
    title: 'string',
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
    dataIndex: 'double',
    title: 'double',
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
  },
  {
    dataIndex: 'integer',
    title: 'integer',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入类型')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    dataIndex: 'date',
    title: 'date',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入类型')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    dataIndex: 'boolean',
    title: 'boolean',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入类型')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    dataIndex: 'file',
    title: 'file',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入类型')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    dataIndex: 'enum',
    title: 'enum',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入类型')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    dataIndex: 'object',
    title: 'object',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入属性')
          }
          return Promise.resolve()
        }
      }
    }
  },
  {
    dataIndex: 'array',
    title: 'array',
    form: {
      rules: {
        asyncValidator: (rule, value, cb) => {
          if (!value) {
            return Promise.reject('请输入其它')
          }
          return Promise.resolve()
        }
      }
    }
  }
]

const addItem = async () => {
  if (dataSource.length) {
    await validate()
  }

  dataSource.value.push({
    string: undefined,
    double: undefined,
    integer: undefined,
    object: undefined,
    file: undefined,
    date: undefined,
    boolean: undefined,
    enum: undefined,
    array: undefined,
  })
}

const validate = async () => {
  const data = await tableRef.value.validate().catch((error) => {
    console.log(error)
  })
  console.log(data, dataSource.value)
}
</script>

<style scoped>

</style>
