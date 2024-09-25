<template>
  <div class="device-select-warp">
    <pro-search
      :columns="columns"
      type="simple"
      :style="{ padding: 0, marginBottom: 0 }"
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
      :scroll="{ y: 300}"
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
    </JProTable>
  </div>
</template>

<script setup name="BatchDeviceSelect">
import { query } from '@/api/device/instance';
import { getImage } from '@/utils/comm';
import {queryNoPagingPost} from "@/api/device/product";
import {queryTree} from "@/api/device/category";
import {getContext} from "../util";

const params = ref()
const deviceRowKeys = ref([])
const deviceSelected = reactive([])
const context = getContext()
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

const defaultParams = {
  sorts: [{ name: 'createTime', order: 'desc' }],
  terms: [
    {
      column: 'productId$product-info',
      value: 'deviceType is gateway'
    }
  ],
}

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

  context.addGateWay(deviceSelected.map(item => ({
    value: item.id,
    label: item.name,
    ...item
  })))
}

</script>

<style scoped lang="less">
.device-select-warp {
  :deep(.jtable-body-spin) {
    padding: 0;
  }
}
</style>
