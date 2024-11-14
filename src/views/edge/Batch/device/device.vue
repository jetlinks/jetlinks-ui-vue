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
            style="margin-top: 20px"
            :columns="columns"
            :request="query"
            :params="params"
            :defaultParams="defaultParams"
            :gridColumn="3"
            :scroll="{ y: 400 }"
            :rowSelection="{
                selectedRowKeys: deviceRowKeys,
                onSelect: handleClick,
                onSelectAll: selectAll,
                onSelectNone: onSelectNone,
            }"
        >
            <template #card="slotProps">
<!--                <Card-->
<!--                    :record="slotProps"-->
<!--                    :active="deviceRowKeys.includes(slotProps.id)"-->
<!--                    @click="handleClick"-->
<!--                >-->
<!--                </Card>-->
              <CardBox
                :value="slotProps"
                @click="handleClick"
                :active="deviceRowKeys.includes(slotProps.id)"
                :status="slotProps.state?.value"
                :statusText="slotProps.state?.text"
                :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
              >
                <template #img>
                  <img
                    :width="80"
                    :height="80"
                    :src="slotProps?.photoUrl || getImage('/device/instance/device-card.png')"
                  />
                </template>
                <template #content>
                  <Ellipsis
                    style="
                                    width: calc(100% - 100px);
                                    margin-bottom: 18px;
                                "
                  >
                    <span style="font-size: 16px; font-weight: 600">
                      {{ slotProps.name }}
                    </span>
                  </Ellipsis>
                  <j-row>
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
            <template #registryTime="slotProps">
                {{
                    dayjs(slotProps.registryTime).format('YYYY-MM-DD hh:mm:ss')
                }}
            </template>
            <template #state="slotProps">
                {{ slotProps.state.text }}
            </template>
        </JProTable>
    </div>
</template>

<script setup name="BatchDeviceSelect">
import { query } from '@/api/device/instance';
import { getImage } from '@/utils/comm';
import { queryNoPagingPost } from '@/api/device/product';
import { queryTree } from '@/api/device/category';
import { getContext } from '../util';
// import Card from '../components/card.vue';
import dayjs from 'dayjs';

const params = ref();
const deviceRowKeys = ref([]);
const deviceSelected = ref([]);
const context = getContext();
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
            value: 'accessProvider in (agent-device-gateway, agent-media-device-gateway, official-edge-gateway)',
        },
    ],
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
];

const handleSearch = (e) => {
    params.value = e;
};

const changeContextSelected = () => {
  context.addGateWay(
    deviceSelected.value.map((item) => ({
      value: item.id,
      label: item.name,
      ...item,
    })),
  );
}
const handleClick = (record) => {
    const index = deviceSelected.value.findIndex(
        (item) => item.id === record.id,
    );
    if (index !== -1) {
        deviceSelected.value.splice(index, 1);
        deviceRowKeys.value.splice(index, 1);
    } else {
        deviceSelected.value.push(record);
        deviceRowKeys.value.push(record.id);
    }
    changeContextSelected()
};

const selectAll = (selected, record, changeRows) => {
    const selectedMap = new Map();
    deviceSelected.value.forEach((item) => {
        selectedMap.set(item.id, item);
    });
    if (selected) {
        changeRows.forEach((i) => {
            if (!selectedMap.has(i.id)) {
                selectedMap.set(i.id, i);
            }
        });
    } else {
        changeRows.forEach((i) => {
            if (selectedMap.has(i.id)) {
                selectedMap.delete(i.id);
            }
        });
    }
    deviceSelected.value = [...selectedMap.values()];
    deviceRowKeys.value = [...selectedMap.keys()];
    changeContextSelected()
};

const onSelectNone = () => {
    deviceRowKeys.value = [];
    deviceSelected.value = [];
    context.addGateWay([]);
};
</script>

<style scoped lang="less">
.device-select-warp {
    :deep(.jtable-body-spin) {
        padding: 0;
    }
}
</style>
