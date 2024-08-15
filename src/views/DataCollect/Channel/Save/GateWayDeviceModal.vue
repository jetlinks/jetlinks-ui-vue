<template>
  <j-modal
    :maskClosable="false"
    :width='820'
    :title="$t('Save.GateWayDeviceModal.098163-0')"
    visible
    @cancel="cancel"
    @ok="confirm"
  >
    <div>
      <j-advanced-search
          :columns="columns"
          class="scene-search"
          target="scene-triggrt-device-device"
          type='simple'
          @search="handleSearch"
      />
      <j-divider style='margin: 0' />
      <j-pro-table
          ref='actionRef'
          :bodyStyle='{
            paddingRight: 0,
            paddingLeft: 0
          }'
          :columns='columns'
          :defaultParams="{
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [{value: 'gateway', termType: 'eq', column: 'deviceType'}]
          }"
          :gridColumn='2'
          :params='params'
          :request='query'
          :scroll="{y: 350}"
          model='CARD'
      >
        <template #card="slotProps">
          <CardBox
              :active="selectKey.id === slotProps.id"
              :status="slotProps.state?.value"
              :statusNames="{
                        online: 'processing',
                        offline: 'error',
                        notActive: 'warning',
                    }"
              :statusText="slotProps.state?.text"
              :value='slotProps'
              @click="handleClick"
          >
            <template #img>
              <slot name="img">
                <img :src="slotProps.photoUrl || getImage('/device/instance/device-card.png')" height='80' width='80' />
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
                    {{ $t('Save.GateWayDeviceModal.098163-1') }}
                  </div>
                  <div>{{ slotProps.deviceType?.text }}</div>
                </j-col>
                <j-col :span="12">
                  <div class="card-item-content-text">
                    {{ $t('Save.GateWayDeviceModal.098163-2') }}
                  </div>
                  <div>{{ slotProps.productName }}</div>
                </j-col>
              </j-row>
            </template>
          </CardBox>
        </template>
      </j-pro-table>
    </div>

  </j-modal>
</template>

<script name="GateWayDevice" setup>
import { getImage } from '@/utils/comm'
import {query} from "@/api/device/instance";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    value: {
      type: String,
      default: undefined
    },
    name: {
      type: String,
      default: undefined
    }
})
const emit = defineEmits(['cancel', 'confirm'])

const selectKey = reactive({
  id: props.value,
  name: props.name
})
const params = ref()


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
    title: $t('Save.GateWayDeviceModal.098163-3'),
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
      first: true
    }
  },
  {
    title: $t('Save.GateWayDeviceModal.098163-4'),
    dataIndex: 'createTime',
    width: 200,
    search: {
      type: 'date'
    }
  },
  {
    title: $t('Save.GateWayDeviceModal.098163-5'),
    dataIndex: 'state',
    width: 90,
    search: {
      type: 'select',
      options: [
        { label: $t('Save.GateWayDeviceModal.098163-6'), value: 'notActive' },
        { label: $t('Save.GateWayDeviceModal.098163-7'), value: 'offline' },
        { label: $t('Save.GateWayDeviceModal.098163-8'), value: 'online' },
      ]
    }
  },
]

// const deviceQuery = (p) => {
//   const sorts = [];
//
//   if (props.rowKeys) {
//     props.rowKeys.forEach(rowKey => {
//       sorts.push({
//         name: 'id',
//         value: rowKey,
//       });
//     })
//   }
//   sorts.push({ name: 'createTime', order: 'desc' });
//   const terms = [
//     ...p.terms,
//     { terms: [{ column: "productId", value: props.productId }]}
//   ]
//   return query({ ...p, terms, sorts })
// }

const handleClick = (detail) => {
  console.log(detail)
  selectKey.id = detail.id
  selectKey.name = detail.name
}

const handleSearch = (p) => {
  params.value = p
}
const cancel = () => {
  emit('cancel')
}

const confirm = () => {
  emit('confirm', selectKey)
}

</script>

<style scoped>

</style>