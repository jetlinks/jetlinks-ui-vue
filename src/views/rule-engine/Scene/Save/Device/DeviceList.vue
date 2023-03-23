<template>
  <j-advanced-search
    :columns="columns"
    type='simple'
    @search="handleSearch"
    class="scene-search"
    target="scene-triggrt-device-device"
  />
  <j-divider style='margin: 0' />
  <j-pro-table
    ref='actionRef'
    model='CARD'
    :columns='columns'
    :request='deviceQuery'
    :gridColumn='2'
    :params='params'
    :bodyStyle='{
      paddingRight: 0,
      paddingLeft: 0
    }'
  >
    <template #card="slotProps">
      <CardBox
        :value='slotProps'
        :active="deviceRowKeys.includes(slotProps.id)"
        :status="slotProps.state?.value"
        :statusText="slotProps.state?.text"
        :statusNames="{
                        online: 'processing',
                        offline: 'error',
                        notActive: 'warning',
                    }"
        @click="handleClick"
      >
        <template #img>
          <slot name="img">
            <img width='88' height='88' :src="slotProps.photoUrl || getImage('/device/instance/device-card.png')" />
          </slot>
        </template>
        <template #content>
          <Ellipsis style='width: calc(100% - 100px)'>
              <span style="font-size: 16px;font-weight: 600" >
                {{ slotProps.name }}
              </span>
          </Ellipsis>
          <j-row>
            <j-col :span="12">
              <div class="card-item-content-text">
                设备类型
              </div>
              <div>{{ slotProps.deviceType?.text }}</div>
            </j-col>
            <j-col :span="12">
              <div class="card-item-content-text">
                产品名称
              </div>
              <div>{{ slotProps.productName }}</div>
            </j-col>
          </j-row>
        </template>
      </CardBox>
    </template>
  </j-pro-table>
</template>

<script setup lang='ts' name='DeviceSelectList'>
import type { PropType } from 'vue'
import { getImage } from '@/utils/comm'
import { query } from '@/api/device/instance'
import { cloneDeep } from 'lodash-es'
import type { SelectorValuesItem } from '@/views/rule-engine/Scene/typings'

type Emit = {
  (e: 'update', data: SelectorValuesItem[]): void
}

const params = ref({})
const props = defineProps({
  rowKeys: {
    type: Array as PropType<SelectorValuesItem[]>,
    default: () => ([])
  },
  productId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<Emit>()

const deviceRowKeys = computed(() => {
  return props.rowKeys.map(item => item.value)
})

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 300,
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string'
    }
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
      first: true
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    search: {
      type: 'date'
    }
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 90,
    search: {
      type: 'select',
      options: [
        { label: '禁用', value: 'notActive' },
        { label: '离线', value: 'offline' },
        { label: '在线', value: 'online' },
      ]
    }
  },

]

const handleSearch = (p: any) => {
  params.value = p
}

const deviceQuery = (p: any) => {
  const sorts: any = [];

  if (props.rowKeys) {
    props.rowKeys.forEach(rowKey => {
      sorts.push({
        name: 'id',
        value: rowKey,
      });
    })
  }
  sorts.push({ name: 'createTime', order: 'desc' });
  const terms = [
    ...p.terms,
    { terms: [{ column: "productId", value: props.productId }]}
  ]
  return query({ ...p, terms, sorts })
}

const handleClick = (detail: any) => {
  const cloneRowKeys = cloneDeep(props.rowKeys)
  const indexOf = cloneRowKeys.findIndex(item => item.value === detail.id)
  if (indexOf !== -1) {
    cloneRowKeys.splice(indexOf, 1)
  } else {
    cloneRowKeys.push({
      name: detail.name,
      value: detail.id
    })
  }
  emit('update', cloneRowKeys)
}

</script>

<style scoped>
.search {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
}
</style>