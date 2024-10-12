<template>
  <a-modal
    visible
    title="选择设备"
    :width="1300"
    @cancel="onCancel"
    @ok="onOk"
  >
    <div class="device-select-body">
      <pro-search
        type="simple"
        :columns="columns"
        :style="{ paddingBottom: 0, marginBottom: 0 }"
        @search="handleSearch"
      />
      <JProTable
        ref="edgeDeviceRef"
        model="CARD"
        :columns="columns"
        :request="query"
        :params="params"
        :defaultParams="defaultParams"
        :gridColumn="3"
      >
        <template #card="slotProps">
          <CardBox
            :value="slotProps"
            :status="slotProps.state?.value"
            :statusText="slotProps.state?.text"
            :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
            :active="deviceRowKeys.includes(slotProps.id)"
            @click="handleClick"
          >
            <template #img>
              <img
                :width="80"
                :height="80"
                :src="
                                    slotProps?.photoUrl ||
                                    getImage('/device-gateway.png')
                                "
              />
            </template>
            <template #content>
              <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
              </Ellipsis>
              <j-row style="margin-top: 18px">
                <j-col :span="24">
                  <div class="card-item-content-text">
                    产品名称
                  </div>
                  <Ellipsis style="width: 100%">
                    {{ slotProps.productName }}
                  </Ellipsis>
                </j-col>
              </j-row>
            </template>
          </CardBox>
        </template>
        <template #state="slotProps">
          <BadgeStatus
            :status="slotProps.state?.value"
            :text="slotProps.state?.text"
            :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
          />
        </template>
        <template #registryTime="slotProps">
                    <span>{{
                        slotProps.registryTime
                          ? dayjs(slotProps.registryTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )
                          : ''
                      }}</span>
        </template>
      </JProTable>
    </div>
  </a-modal>
</template>

<script setup name="DeviceSelectBody">
import { query } from '@/api/device/instance';
import dayjs from 'dayjs'
import { getImage, onlyMessage } from '@/utils/comm';
import {queryNoPagingPost} from "@/api/device/product";
import {queryTree} from "@/api/device/category";

const props = defineProps({
  filter: {
    type: Array,
    default: []
  }
})

const defaultParams = computed(() => {
  const _params = {
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [
      {
        terms: [
          {
            column: 'productId$product-info',
            value: 'accessProvider in (agent-device-gateway, agent-media-device-gateway, official-edge-gateway)'
          }
        ],
        type: 'and',
      },
    ],
  };

  if (props.filter.length) {
    _params.terms[0].terms.push({
      column: 'id$nin',
      value: props.filter.map(item => item.id).join(','),
      type: 'and'
    })
  }

  return _params
})

const emit = defineEmits(['cancel', 'ok'])

const params = ref()
const deviceRowKeys = ref([])

const deviceSelected = reactive([])

const transformData = (arr) => {
  if (Array.isArray(arr) && arr.length) {
    return (arr || []).map((item) => {
      return {
        ...item,
        id: `classifiedId is ${item.id}`,
        children: transformData(item.children),
      };
    });
  } else {
    return [];
  }
};

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    search: {
      type: 'string',
      defaultTermType: 'eq',
    },
    ellipsis: true,
  },
  {
    title: '设备名称',
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
      first: true,
    },
    ellipsis: true,
  },
  {
    title: '产品名称',
    dataIndex: 'productName',
    key: 'productName',
    search: {
      type: 'select',
      rename: 'productId',
      options: () =>
        new Promise((resolve) => {
          queryNoPagingPost({ paging: false }).then((resp) => {
            resolve(
              resp.result.map((item) => ({
                label: item.name,
                value: item.id,
              })),
            );
          });
        }),
    },
    ellipsis: true,
  },
  {
    title: '注册时间',
    dataIndex: 'registryTime',
    key: 'registryTime',
    scopedSlots: true,
    search: {
      type: 'date',
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: '禁用', value: 'notActive' },
        { label: '离线', value: 'offline' },
        { label: '在线', value: 'online' },
      ],
    },
  },
  {
    key: 'productId$product-info',
    dataIndex: 'productId$product-info',
    title: '产品分类',
    hideInTable: true,
    search: {
      type: 'treeSelect',
      options: () =>
        new Promise((resolve) => {
          queryTree({ paging: false }).then((resp) => {
            resolve(transformData(resp.result));
          });
        }),
    },
  },
  {
    title: '说明',
    dataIndex: 'describe',
    key: 'describe',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
]

const onCancel = () => {
  emit('cancel')
}

const onOk = () => {
  if (toRaw(deviceSelected).length) {
    emit('ok', toRaw(deviceSelected))
  } else {
    onlyMessage('请选择设备', 'warning')
  }
}
const handleSearch = (e) => {
  params.value = e
}

const handleClick = (record) => {
  const index = deviceSelected.findIndex(item => item.id === record.id)

  if (index !== -1) {
    deviceSelected.splice(index,1)
    deviceRowKeys.value.splice(index,1)
  } else {
    deviceSelected.push(record)
    deviceRowKeys.value.push(record.id)
  }
}

</script>

<style scoped>

</style>
