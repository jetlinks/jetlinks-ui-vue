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
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
          {
            column: 'targetType',
            value: 'PluginDriver'
          }
        ]
      }"
      :rowSelection="{
            selectedRowKeys: _selectedRowKeys,
            onSelect: onSelectChange,
            onSelectAll: selectAll,
            onSelectNone: () => (_selectedRowKeys = []),
        }"
    />
  </div>
</template>

<script setup name="TaskPlugin">
import { query } from '@/api/edge/resource'
import { pick } from 'lodash-es'

const params = ref()
const _selectedRowKeys = ref([])

const selectedRowMap = new Map();

const columns = [
  {
    title: '资源库ID',
    key: 'id',
    dataIndex: 'id',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
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
    title: '说明',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
]

const handleSelect = (selected, array) => {
  const keys = new Set(_selectedRowKeys.value)

  array.map((i) => {
    if (selected) {
      keys.add(i.id)
      selectedRowMap.set(i.id, i)
    } else {
      keys.delete(i.id)
      selectedRowMap.delete(i.id)
    }
  });

  _selectedRowKeys.value = [...keys.values()]
}
const onSelectChange = (item, state) => {
  handleSelect(state, [item])
};

const selectAll = (selected, selectedRows, changeRows) => {
  handleSelect(selected, changeRows)
};

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
