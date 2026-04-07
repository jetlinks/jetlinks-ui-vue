<template>
  <j-advanced-search
    :columns="columns"
    type='simple'
    @search="handleSearch"
    class="device-import-product"
    target="device-import-product"
  />
  <div class="alert">{{ $t('Import.product.411796-0') }}</div>
  <j-scrollbar :height='400'>
    <j-pro-table
      mode='CARD'
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
          :statusText="slotProps.state === 1 ? $t('Import.product.411796-1') : $t('Import.product.411796-2')"
          :statusNames="{ 1: 'processing', 0: 'error',  }"
          @click="handleClick"
        >
          <template #img>
            <slot name="img">
              <img width='80' height='80' :src="slotProps.photoUrl || device.deviceProduct" />
            </slot>
          </template>
          <template #content>
            <div style='width: calc(100% - 100px)'>
              <j-ellipsis>
                <span style="font-size: 16px;font-weight: 600" >
                  {{ slotProps.name }}
                </span>
              </j-ellipsis>
            </div>
            <a-row>
              <a-col :span="12">
                <div class="card-item-content-text">
                  {{ $t('Import.product.411796-3') }}
                </div>
                <div>{{ slotProps?.deviceType?.text }}</div>
              </a-col>
            </a-row>
          </template>
        </CardBox>
      </template>
    </j-pro-table>
  </j-scrollbar>
</template>

<script setup lang='ts' name='Product'>
import { getProviders, queryProductList } from '../../../../api/product'
import { accessConfigTypeFilter } from '@jetlinks-web-core/utils'
import { device } from '../../../../assets'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
    title: $t('Import.product.411796-4'),
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
      first: true
    }
  },
  {
    title: $t('Import.product.411796-5'),
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
    title: $t('Import.product.411796-3'),
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
    title: $t('Import.product.411796-6'),
    dataIndex: 'state',
    width: '90px',
    search: {
      type: 'select',
      options: [
        { label: $t('Import.product.411796-2'), value: 0 },
        { label: $t('Import.product.411796-1'), value: 1 },
      ]
    }
  },
  {
    title: $t('Import.product.411796-7'),
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
