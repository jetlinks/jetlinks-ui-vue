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
      :request="query"
      :params="params"
    />
  </div>
</template>

<script setup name="TaskPlugin">

const params = ref()
const columns = [
  {
    title: '插件ID',
    key: 'id',
    dataIndex: 'id',
    search: {
      type: 'string',
    },
  },
  {
    title: '插件名称',
    key: 'name',
    dataIndex: 'name',
    search: {
      type: 'string',
    },
  },
  {
    title: '插件类型',
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
    title: '说明',
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
