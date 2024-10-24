<template>
  <div class="task-warp">
    <div class="header">
      AI模型
    </div>
    <div class="tip">
      <AIcon class="icon" type="ExclamationCircleFilled" />若AI模型重复，边端已安装的AI模型将自动覆盖
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
      :defaultParams="{
        sort: [{ name: 'createTime', order: 'desc' }],
        terms: [{column: 'targetType', value: 'AiModel'}]
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

<script setup name="AiModel">
import { queryPage } from '@/api/edge-resource/ai-model'
import {useTemplateRowSelection} from '../../util'
import {pick} from "lodash-es";

const params = ref()
const { selectedRowKeys, selectedRowMap, onSelectChange, selectAll } = useTemplateRowSelection()

const columns = [
  {
    title: '模型ID',
    key: 'id',
    dataIndex: 'id',
    search: {
      type: 'string',
    },
  },
  {
    title: '模型名称',
    key: 'name',
    dataIndex: 'name',
    search: {
      type: 'string',
    },
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
]

const handleSearch = (e) => {
  params.value = e
}

const queryFn = async (_params) => {

  const resp = await queryPage(_params)
  return {
    status: resp.status,
    code: resp.status,
    result: {
      ...resp.result,
      data: resp.result.data?.map(item => {
        const _metadata = JSON.parse(item.metadata)
        item.file = item.properties.fileName
        item.description = item.properties.description
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

defineExpose({
  getValue: handleValue
})
</script>

<style scoped lang="less">
@import "../task.less";
</style>
