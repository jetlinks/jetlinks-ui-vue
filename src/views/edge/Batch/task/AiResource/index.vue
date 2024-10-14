<template>
  <div class="task-warp">
    <div class="header">
      AI底库
    </div>
    <div class="tip">
      <AIcon class="icon" type="ExclamationCircleFilled" />若AI底库重复，边端已安装的AI底库将自动覆盖
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
      :request="query"
      :params="params"
      :gridColumn="3"
    />
  </div>
</template>

<script setup name="AiResource">

const params = ref()
const columns = [
  {
    title: '底库ID',
    key: 'id',
    dataIndex: 'id',
    search: {
      type: 'string',
    },
  },
  {
    title: '底库名称',
    key: 'name',
    dataIndex: 'name',
    search: {
      type: 'string',
    },
  },
  {
    title: '底库类型',
    key: 'type',
    dataIndex: 'type',
    search: {
      type: 'string',
    },
  },
  {
    title: '文件',
    key: 'file',
    dataIndex: 'file',
  },
  {
    title: '版本号',
    key: 'version',
    dataIndex: 'version',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
]

const handleSearch = (e) => {
  params.value = e
}
</script>

<style scoped lang="less">
@import "../task.less";
</style>
