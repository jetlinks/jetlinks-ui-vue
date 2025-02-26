<template>
  <div class="task-warp">
    <div class="header">
      产品
    </div>
    <div class="tip">
      <AIcon class="icon" type="ExclamationCircleFilled" />若产品重复，边端已下发产品的物模型将自动覆盖
    </div>
    <pro-search
        type="simple"
        :columns="columns"
        :style="{ padding: 0, marginBottom: 0 }"
        @search="handleSearch"
    />
    <JProTable
        ref="tableRef"
        model="TABLE"
        style="padding: 0"
        :columns="columns"
        :request="queryProductList"
        :params="params"
        :scroll="{ y: 320}"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }],
          terms: [
            {
              column: 'deviceType',
              value: 'childrenDevice',
              type: 'and'
            },
            {column: 'state', value: 1}
          ]
        }"
        :rowSelection="{
            selectedRowKeys: selectedRowKeys,
            onSelect: onSelectChange,
            onSelectAll: selectAll,
            onSelectNone: () => (selectedRowKeys = []),
        }"
    />
  </div>
</template>

<script setup name="TaskPlugin">
import { queryProductList } from '@/api/device/product'
import { pick } from 'lodash-es'
import {useTemplateRowSelection} from "@/views/edge/Batch/util";

const params = ref()

const { selectedRowKeys, selectedRowMap, onSelectChange, selectAll } = useTemplateRowSelection()

const columns = [
  {
    title: '产品ID',
    key: 'id',
    dataIndex: 'id',
    search: {
      type: 'string',
    },
    ellipsis: true,
  },
  {
    title: '产品名称',
    key: 'name',
    dataIndex: 'name',
    search: {
      type: 'string',
    },
    ellipsis: true,
  },
  {
    title: '描述',
    dataIndex: 'describe',
    key: 'describe',
    ellipsis: true,
  },
]

const handleValue = async () => {
  return [...selectedRowMap.values()].map(item => {
    return {
      data: {
        ...pick(item, ['id', 'metadata', 'name']),
        deviceType: item.deviceType.value
      }
    }
  })
}

const handleSearch = (e) => {
  params.value = e
}

defineExpose({
  getValue: handleValue
})
</script>

<style scoped lang="less">
@import "../task.less";
</style>
