<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <div style="display: flex; align-items: center; justify-content: space-between;margin-bottom: 16px">
      <a-space><span style="font-size: 16px; font-weight: bold">下发记录</span><a-tag>{{ count }}</a-tag></a-space>
      <a-button @click="onClick" type="primary" ghost>下发</a-button>
    </div>
    <pro-search
        :columns="columns"
        @search="handleSearch"
        type="simple"
        style="padding: 0"
    ></pro-search>
    <div style="flex: 1; min-height: 0">
      <JProTable
          ref="tableRef"
          :request="queryTaskDetailPage"
          :columns="columns"
          :gridColumn="1"
          model="CARD"
          :defaultParams="defaultParams"
          :params="params"
          style="padding: 0"
      >
        <template #card="slotProps">
          <Card :detail="slotProps" @reload="onReload"/>
        </template>
      </JProTable>
    </div>
  </div>
  <Issue
      v-if="current.visible"
      :jobType="JobTypeEnum[current.data?.targetType]"
      :service-id="ServiceIdEnum[current.data?.targetType]"
      :data="current.data"
      @close="current.visible = false"
      @save="onSave"
  />
</template>

<script setup lang="ts">
import {queryTaskDetailPage, queryTaskCount} from '@/api/edge-resource';
import {PropType} from "vue";
import Card from './Card.vue';
import Issue from "@/views/edge/NewResource/Issue/index.vue";
import {JobTypeEnum, ServiceIdEnum} from "@/views/edge/NewResource/utils";

const props = defineProps({
    data: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    }
})
const tableRef = ref();
const defaultParams = computed(() => {
  return {
    sorts: [
      {
        name: 'createTime',
        order: 'desc',
      }
    ],
    terms: [
      {
        column: "targetId",
        termType: "eq",
        value: props.data.targetId,
      }
    ]
  }
})

const params = ref({});
const count = ref(0)
const current = reactive({
  data: {},
  visible: false
})
const columns = [
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        search: {
            type: 'date'
        }
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {label: '全部完成', value: 'complete'},
                {label: '未完成', value: 'incomplete'},
                {label: '进行中', value: 'running'},
            ]
        }
    },
]

const getCount = async () => {
  const resp = await queryTaskCount({
    terms: [
      {
        column: "targetId",
        termType: "eq",
        value: props.data.targetId,
      }
    ]
  })
  if(resp.success){
    count.value = resp.result || 0
  }
}

const handleSearch = (e: any) => {
    params.value = e
}

const onReload = () => {
    tableRef.value?.reload();
    getCount()
}

const onClick = () => {
  current.data = props.data
  current.visible = true
}

const onSave = () => {
  current.visible = false
  onReload()
}

onMounted(() => {
  getCount()
})
</script>

<style scoped lang="less">

</style>
