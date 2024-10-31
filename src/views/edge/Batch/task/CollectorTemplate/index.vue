<template>
  <div class="task-warp">
    <div class="header">
      采集器模板
    </div>
    <div class="tip">
      <AIcon class="icon" type="ExclamationCircleFilled" />若采集器模板重复，边端已安装的采集器模板将自动覆盖
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
      :request="queryPage"
      :params="params"
      :defaultParams="{
        sort: [{ name: 'createTime', order: 'desc' }],
        terms: [{column: 'targetType', value: 'entityTemplate:Collector'}]
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

<script setup name="CollectorTemplate">
import { queryPage } from '@/api/edge-resource/ai-model'
import {pick} from "lodash-es";
import {useTemplateRowSelection} from '../../util'

const params = ref()
const { selectedRowKeys, selectedRowMap, onSelectChange, selectAll } = useTemplateRowSelection()

const columns = [
  {
    title: '模板ID',
    key: 'id',
    dataIndex: 'id',
    search: {
      type: 'string',
    },
  },
  {
    title: '模板名称',
    key: 'name',
    dataIndex: 'name',
    search: {
      type: 'string',
    },
  },
  {
    title: '通讯协议',
    key: 'category',
    dataIndex: 'category',
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
      data: item
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
