<template>
  <div class="task-warp">
    <div class="header">
      插件
    </div>
    <div class="tip">
      <AIcon class="icon" type="ExclamationCircleFilled" />若插件重复，边端已安装的插件将自动跳过，避免重复安装
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
      :request="queryFn"
      :params="params"
      :scroll="{ y: 320}"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
          {
            column: 'targetType',
            value: 'PluginDriver'
          }
          ,{column: 'state', value: 'enabled'}
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
import { query } from '@/api/edge/resource'
import { pick } from 'lodash-es'
import {useTemplateRowSelection} from "@/views/edge/Batch/util";

const params = ref()

const { selectedRowKeys, selectedRowMap, onSelectChange, selectAll } = useTemplateRowSelection()

const columns = [
  {
    title: '插件ID',
    key: 'targetId',
    dataIndex: 'targetId',
    search: {
      type: 'string',
    },
    ellipsis: true,
  },
  {
    title: '插件名称',
    key: 'name',
    dataIndex: 'name',
    search: {
      type: 'string',
    },
    ellipsis: true,
  },
  {
    title: '文件',
    key: 'file',
    dataIndex: 'file',
    ellipsis: true,
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
  {
    title: '资源库ID',
    key: 'id',
    dataIndex: 'id',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
]
const queryFn = async (_params) => {

  const resp = await query(_params)
  return {
    status: resp.status,
    code: resp.status,
    result: {
      ...resp.result,
      data: resp.result.data?.map(item => {
        const _metadata = JSON.parse(item.metadata)
        item.file = _metadata.filename
        item.description = _metadata.description
        item.type = _metadata.provider
        return item
      }),
    },
  }
}

const handleValue = async () => {
  return [...selectedRowMap.values()].map(item => {
    return {
      data: pick(item, ['id', 'targetId', 'metadata', 'targetType', 'serviceId', 'name'])
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
