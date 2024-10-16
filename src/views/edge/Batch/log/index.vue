<template>
  <div class="log-warp">
    <JProTable
      ref="edgeDeviceRef"
      model="CARD"
      style="padding: 12px 0 0"
      :columns="columns"
      :request="queryTask"
      :params="params"
      :gridColumn="1"
      :defaultParams="{
        terms: [
          {
            column: 'type',
            value: type
          },
          {
            column: 'id',
            termType: 'device-involve-task',
            value: ''
          }
        ]
      }"
    >
      <template #card="slotProps">
        <Card :detail="slotProps" />
      </template>
    </JProTable>
  </div>
</template>

<script setup name="BatchLog">
import {BatchOperateOptions} from "../util";
import { queryTask } from '@/api/edge/batch'
import Card from './Card.vue'

const props = defineProps({
  type: {
    type: String,
    default: undefined
  },
  deviceList: {
    type: Array,
    default: undefined
  }
})
const params = ref()

const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
    search: {
      type: 'select',
      options: BatchOperateOptions
    },
  },
  {
    title: '涉及网关',
    dataIndex: 'gateway',
    key: 'gateway',
    search: {
      type: 'string',
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    search: {
      type: 'date',
    },
  },
]

const handleSearch = (e) => {
  params.value = e
}


</script>

<style scoped lang="less">
.log-warp {
  .header {
    padding: 16px 0;
    font-size: 18px;
  }
}
</style>
