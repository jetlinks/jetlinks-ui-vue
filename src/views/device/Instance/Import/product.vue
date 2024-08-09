<template>
  <j-advanced-search
    :columns="columns"
    type='simple'
    @search="handleSearch"
    class="device-import-product"
    target="device-import-product"
  />
  <div class="alert">{{ $t('Import.product.077384-0') }}</div>
  <j-scrollbar :height='400'>
    <j-pro-table
      model='CARD'
      :columns='columns'
      :params='params'
      :request='queryProductList'
      :gridColumn='2'
      :defaultParams="{
        terms: [
             {
                 column: 'state',
                 value: '1',
                 type: 'and'
             },
             {
                    column: 'accessProvider',
                    value: props?.type
             }
         ],
         sorts: [{ name: 'createTime', order: 'desc' }]
      }"
      :gridColumns='[2,2,2]'
      :bodyStyle='{
        paddingRight: 0,
        paddingLeft: 0
      }'
    >
      <template #card="slotProps">
        <CardBox
          :value='slotProps'
          :active="rowKey === slotProps.id"
          :status="slotProps.state"
          :statusText="slotProps.state === 1 ? $t('Import.product.077384-1') : $t('Import.product.077384-2')"
          :statusNames="{ 1: 'processing', 0: 'error',  }"
          @click="handleClick"
        >
          <template #img>
            <slot name="img">
              <img width='80' height='80' :src="slotProps.photoUrl || getImage('/device-product.png')" />
            </slot>
          </template>
          <template #content>
            <div style='width: calc(100% - 100px)'>
              <Ellipsis>
                <span style="font-size: 16px;font-weight: 600" >
                  {{ slotProps.name }}
                </span>
              </Ellipsis>
            </div>
            <j-row>
              <j-col :span="12">
                <div class="card-item-content-text">
                  {{ $t('Import.product.077384-3') }}
                </div>
                <div>{{ slotProps?.deviceType?.text }}</div>
              </j-col>
            </j-row>
          </template>
        </CardBox>
      </template>
    </j-pro-table>
  </j-scrollbar>
</template>

<script setup lang='ts' name='Product'>
import { getProviders, queryGatewayList, queryProductList } from '@/api/device/product'
import { queryTree } from '@/api/device/category'
import { getTreeData_api } from '@/api/system/department'
import { getImage } from '@/utils/comm'
import { accessConfigTypeFilter } from '@/utils/setting'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

type Emit = {
  (e: 'update:rowKey', data: string): void
  (e: 'change', data: string): void
}

const params = ref({})
const props = defineProps({
  rowKey: {
    type: String,
    default: ''
  },
})

const emit = defineEmits<Emit>()
const firstFind = ref(true)

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 300,
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('Import.product.077384-4'),
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
      first: true
    }
  },
  {
    title: $t('Import.product.077384-5'),
    dataIndex: 'accessProvider',
    width: 150,
    ellipsis: true,
    hideInTable: true,
    search: {
      type: 'select',
      options: () => getProviders().then((resp: any) => {
        return accessConfigTypeFilter(resp.result || [])
      })
    }
  },
  {
    title: $t('Import.product.077384-3'),
    dataIndex: 'deviceType',
    width: 150,
    // search: {
    //   type: 'select',
    //   options: [
    //     { label: '直连设备', value: 'device' },
    //     { label: '网关子设备', value: 'childrenDevice' },
    //     { label: '网关设备', value: 'gateway' },
    //   ]
    // }
  },
  {
    title: $t('Import.product.077384-6'),
    dataIndex: 'state',
    width: '90px',
    search: {
      type: 'select',
      options: [
        { label: $t('Import.product.077384-2'), value: 0 },
        { label: $t('Import.product.077384-1'), value: 1 },
      ]
    }
  },
  {
    title: $t('Import.product.077384-7'),
    dataIndex: 'describe',
    ellipsis: true,
    width: 300,
    search: {
      type: 'string',
    }
  },
]

const handleSearch = (p: any) => {
  params.value = p
}

const handleClick = (detail: any) => {
  emit('update:rowKey', detail.id)
  emit('change', detail)
}

</script>

<style scoped lang='less'>
:deep(.device-import-product) {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
}

.alert {
    height: 40px;
    padding-left: 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
</style>