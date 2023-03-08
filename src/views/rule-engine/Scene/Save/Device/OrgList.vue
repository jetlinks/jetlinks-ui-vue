<template>
  <j-advanced-search
    :columns="columns"
    type='simple'
    @search="handleSearch"
    class='search'
    target="scene-triggrt-device-category"
  />
  <a-divider style='margin: 0' />
  <j-pro-table
    ref="instanceRef"
    model='TABLE'
    type='TREE'
    :columns="columns"
    :request="query"
    :scroll="{
        y: 350
    }"
    :expandable='{
      expandedRowKeys: openKeys,
      onExpandedRowsChange: expandedRowChange,
    }'
    :rowSelection='{
      type: "radio",
      selectedRowKeys: orgRowKeys,
      onChange: selectedRowChange
    }'
    :onChange='tableChange'
    @selectCancel='cancelAll'
  >

  </j-pro-table>

</template>

<script setup lang='ts' name='OrgList'>
import type { PropType } from 'vue'
import { getExpandedRowById } from './util'
import { getTreeData_api } from '@/api/system/department'
import { SelectorValuesItem } from '@/views/rule-engine/Scene/typings'

type Emit = {
  (e: 'update', data: SelectorValuesItem[]): void
}

const props = defineProps({
  rowKeys: {
    type: Array as PropType<SelectorValuesItem[]>,
    default: () => ([])
  },
  productId: {
    type: String,
    default: ''
  }
})
const emit = defineEmits<Emit>()

const params = ref()
const openKeys = ref<string[]>([])
const selectedRowKeys = ref(props.rowKeys.map(item => item.value))
const sortParam = ref<{ name:string, order: string }>({ name: 'sortIndex', order: 'asc' })
const iniPage = ref(true)

const orgRowKeys = computed(() => {
  return props.rowKeys.map(item => item.value)
})

const columns = [
  {
    title: '名称',
    width: 300,
    ellipsis: true,
    dataIndex: 'name',
    search: {
      type: 'string'
    }
  },
  {
    title: '排序',
    dataIndex: 'sortIndex',
    sorter: true,
  },
]

const handleSearch = (p: any) => {
  params.value = p
}

const tableChange = (_: any, f: any, sorter: any) => {
  if (sorter.order) {
    sortParam.value = { name: sorter.columnKey, order: (sorter.order as string).replace('end', ''), }
  } else {
    sortParam.value = { name: 'sortIndex', order: 'asc' }
  }
}

const query = async (p: any) => {
  const _params: any = {
    paging: false,
    sorts: [sortParam.value],
  }

  if (p.terms && p.terms.length) {
    _params.terms = p.terms
  }

  const resp = await getTreeData_api(_params)

  if (iniPage.value && props.rowKeys.length) {
    iniPage.value = false
    openKeys.value = getExpandedRowById(props.rowKeys[0]?.value, resp.result as any[])
  }

  return resp
}

const selectedRowChange = (values: any, selectedRows: any[]) => {
  const item = selectedRows[0]
  console.log(values, selectedRows)
  emit('update', [{ name: item.name, value: item.id }])
}

const cancelAll = () => {
  emit('update', [])
}

const expandedRowChange = (keys: string[]) => {
  openKeys.value = keys
}

</script>

<style scoped>
.search {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
}
</style>