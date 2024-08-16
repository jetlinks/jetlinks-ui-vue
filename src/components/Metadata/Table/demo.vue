<template>
  <Table
      ref="tableRef"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      @scroll-down="onScrollDown"
    >
    <template #string="{record}">
      <div>
        <a-input />
        <StringParams v-model:value="record.string"/>
      </div>
    </template>
    <template #double="{record}">
      <DoubleParams v-model:value="record.double"/>
    </template>
    <template #integer="{record}">
      <IntegerParams v-model:value="record.integer"/>
    </template>
    <template #date="{record}">
      <DateParams v-model:value="record.date"/>
    </template>
    <template #boolean="{record}">
      <BooleanParams v-model:value="record.boolean"/>
    </template>
    <template #file="{record}">
      <FileParams v-model:value="record.file"/>
    </template>
    <template #enum="{record}">
      <EnumParams v-model:value="record.enum"/>
    </template>
    <template #object="{record}">
      <ObjectParams v-model:value="record.object"/>
    </template>
    <template #array="{record}">
      <ArrayParams v-model:value="record.array"/>
    </template>
  </Table>
  <a-button @click="addItem">{{ $t('Table.demo.4348551-0') }}</a-button>
  <a-button @click="validate">{{ $t('Table.demo.4348551-1') }}</a-button>
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const tableRef = ref()
const dataSource = ref(new Array(10).fill(0).map((_, index) => {
  return {
    string: undefined,
    double: undefined,
    integer: undefined,
    object: undefined,
    file: undefined,
    date: undefined,
    boolean: undefined,
    enum: undefined,
    array: undefined,
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
            return Promise.reject($t('Table.demo.4348551-2'))
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
            return Promise.reject($t('Table.demo.4348551-3'))
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
            return Promise.reject($t('Table.demo.4348551-4'))
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
            return Promise.reject($t('Table.demo.4348551-4'))
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
            return Promise.reject($t('Table.demo.4348551-4'))
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
            return Promise.reject($t('Table.demo.4348551-4'))
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
            return Promise.reject($t('Table.demo.4348551-4'))
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
            return Promise.reject($t('Table.demo.4348551-5'))
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
            return Promise.reject($t('Table.demo.4348551-6'))
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

const onScrollDown = () => {
  dataSource.value.push(...(new Array(10).fill(1).map(() =>({
    string: undefined,
    double: undefined,
    integer: undefined,
    object: undefined,
    file: undefined,
    date: undefined,
    boolean: undefined,
    enum: undefined,
    array: undefined,
  }))))
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
