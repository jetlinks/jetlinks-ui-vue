<template>
  <div class="log-warp">
    <div class="header">
      操作记录
    </div>
    <pro-search
      :columns="columns"
      type="simple"
      :style="{ padding: 0, marginBottom: 0 }"
      @search="handleSearch"
    />
    <Card />
<!--    <JProTable-->
<!--      ref="edgeDeviceRef"-->
<!--      model="CARD"-->
<!--      style="padding: 12px 0 0"-->
<!--      :columns="columns"-->
<!--      :request="query"-->
<!--      :params="params"-->
<!--      :gridColumn="1"-->
<!--    >-->
<!--      <template #card="slotProps">-->
<!--        <Card :detail="slotProps" />-->
<!--      </template>-->
<!--    </JProTable>-->
  </div>
</template>

<script setup name="BatchLog">
import {BatchOperateOptions} from "../util";
import Card from './Card.vue'

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

const query = () => {
  return {
    status: 200,
    result: []
  }
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
