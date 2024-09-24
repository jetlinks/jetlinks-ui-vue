<template>
  <div class="firmware-warp">
    <pro-search
      type="simple"
      :columns="columns"
      :style="{ padding: 0, marginBottom: 0 }"
      @search="handleSearch"
    />
    <JProTable
      ref="edgeDeviceRef"
      model="TABLE"
      style="padding: 12px 0 0"
      :columns="columns"
      :request="query"
      :params="params"
      :defaultParams="{
         sorts: [{ name: 'createTime', order: 'desc' }],
      }"
      :rowSelection="{
        type: 'radio',
        onSelect:onSelect
      }"
    >
      <template #productId="slotProps">
        <span>{{ slotProps.productName }}</span>
      </template>
      <template #createTime="slotProps">
                        <span>{{
                            dayjs(slotProps.createTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                            )
                          }}</span>
      </template>
    </JProTable>
  </div>
</template>

<script setup name="TaskFirmware">
import { query, queryProduct } from '@/api/device/firmware';
import { map } from "lodash-es";
import dayjs from 'dayjs'

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value', 'selected'])

const params = ref()
const selectedKeys = ref([])

const columns = [
  {
    title: '固件名称',
    key: 'name',
    dataIndex: 'name',
    fixed: 'left',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '固件版本',
    dataIndex: 'version',
    key: 'version',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: '所属产品',
    dataIndex: 'productId',
    key: 'productId',
    ellipsis: true,
    width: 200,
    scopedSlots: true,
    search: {
      type: 'select',
      options: () => {
        return new Promise((resolve) => {
          queryProduct({
            paging: false,
            sorts: [{ name: 'name', order: 'desc' }],
            terms: [{ column: 'state', value: 1 }], // 不传参会报错，暂时查询启用状态的，后期会改查全部 todo
          }).then((resp) => {
            const list = resp.result.filter((it) => {
              return map(it?.features || [], 'id').includes('supportFirmware');
            });
            resolve(list.map((item) => ({
              label: item.name,
              value: item.id,
            })))
          })
        })
      },
    },
  },
  {
    title: '签名方式',
    dataIndex: 'signMethod',
    key: 'signMethod',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        {
          label: 'MD5',
          value: 'md5',
        },
        {
          label: 'SHA256',
          value: 'sha256',
        },
      ],
    },
    width: 150,
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    search: {
      type: 'date',
    },
    width: 200,
    scopedSlots: true,
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

const onSelect = (record, selected) => {

  emit('update:value', selected ? record.id : undefined)

  if (selected) {
    emit('selected', record)
  }
}

watch(() => props.value, () => {
  selectedKeys.value = [props.value]
}, { immediate: true})
</script>

<style scoped lang="less">
.firmware-warp {
  :deep(.JSearch-item) {
    .JSearch-item--column {
      width: 130px !important;
    }

    .JSearch-item--termType {
      width: 110px !important;
    }
  }
}

</style>
