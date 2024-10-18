<template>
  <a-drawer
    visible
    title="任务详情"
    :width="1000"
    :maskClosable="false"
    @close="onCancel"
  >
    <template #title>
      <div class="title">
        <div>

        </div>
        <div>
          {{ record.title }}
        </div>
        <div>

        </div>

      </div>
    </template>
    <div class="log-detail-body">
      <div @click="onCopy">从相同设备创建任务</div>
      <div>
        <TitleComponent title="基本信息" />
        <a-descriptions bordered>
          <a-descriptions-item label="创建人" :labelStyle="{width: '110px'}"></a-descriptions-item>
          <a-descriptions-item label="创建时间" :labelStyle="{width: '110px'}"></a-descriptions-item>
          <a-descriptions-item label="任务详情" :labelStyle="{width: '110px'}">
            <a-button type="link" @click="emit('showTaskDetail')">查看</a-button>
          </a-descriptions-item>
          <a-descriptions-item label="已完成" :labelStyle="{width: '110px'}"></a-descriptions-item>
          <a-descriptions-item label="已失败" :labelStyle="{width: '110px'}"></a-descriptions-item>
          <a-descriptions-item label="进行中" :labelStyle="{width: '110px'}"></a-descriptions-item>
          <a-descriptions-item label="排队中" :labelStyle="{width: '110px'}"></a-descriptions-item>
          <a-descriptions-item label="说明" :labelStyle="{width: '110px'}"></a-descriptions-item>
        </a-descriptions>
      </div>
      <div>
        <TitleComponent title="涉及网关" />
        <JProTable
          model="TABLE"
          :columns="gatewayColumns"
          :request="query"
        />
      </div>
      <div>
        <TitleComponent title="安装插件" />
        <JProTable
          model="TABLE"
          :columns="pluginColumns"
          :request="query"
        />
      </div>
    </div>
  </a-drawer>
</template>

<script setup name="LogDrawer">

const props = defineProps({
  record: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['showTaskDetail', 'copy', 'cancel'])

const gatewayColumns = [
  {
    title: '网关设备名称',
    dataIndex: 'name',
  },
  {
    title: '设备类型',
    dataIndex: 'type',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 120
  },
]

const pluginColumns = [
  {
    title: '插件ID',
    dataIndex: 'id',
  },
  {
    title: '插件名称',
    dataIndex: 'name',
  },
  {
    title: '插件类型',
    dataIndex: 'type',
  },
  {
    title: '文件',
    dataIndex: 'file',
  },
  {
    title: '版本号',
    dataIndex: 'version',
  },
  {
    title: '描述',
    dataIndex: 'describe',
  },
]

const query = () => {
  return {}
}

const onCopy = () => {
  emit('copy')
  emit('cancel')
}

const onCancel = () => {
  emit('cancel')
}

</script>

<style scoped>

</style>
