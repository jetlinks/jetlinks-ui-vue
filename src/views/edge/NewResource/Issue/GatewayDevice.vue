<template>
    <pro-search
        :columns="columns"
        target="edge-device"
        type="simple"
        @search="handleSearch"
    />
    <JProTable
        ref="edgeDeviceRef"
        :columns="columns"
        :request="query"
        :defaultParams="defaultParams"
        :params="params"
        :gridColumn="2"
        model="CARD"
        :rowSelection="{
            selectedRowKeys: _selectedRowKeys,
            onSelect: onSelectChange,
            onSelectAll: selectAll,
            onSelectNone: () => (_selectedRowKeys = []),
        }"
    >
        <template #card="slotProps">
            <CardBox
                :value="slotProps"
                :status="slotProps.state?.value"
                :statusText="slotProps.state?.text"
                :active="_selectedRowKeys.findIndex(i => i.id === slotProps.id) !== -1"
                @click="handleClick(slotProps)"
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
</template>

<script setup lang="ts">
import {queryNoPagingPost} from "@/api/device/product";
import {queryTree} from "@/api/device/category";
import {query} from "@/api/device/instance";
import {getImage} from "@/utils/comm";
import dayjs from "dayjs";
import BadgeStatus from "components/BadgeStatus/index.vue";
import {PropType} from "vue";

const emit = defineEmits(['update:value']);
const props = defineProps({
    value: {
        type: Array as PropType<string[]>,
        default: () => ([]),
    }
})
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
                    queryNoPagingPost({paging: false}).then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
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
                {label: '禁用', value: 'notActive'},
                {label: '离线', value: 'offline'},
                {label: '在线', value: 'online'},
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
                    queryTree({paging: false}).then((resp: any) => {
                        resolve(transformData(resp.result));
                    });
                }),
        },
    },
    {
        dataIndex: 'deviceType',
        title: '设备类型',
        valueType: 'select',
        hideInTable: true,
        search: {
            type: 'select',
            options: [
                {label: '直连设备', value: 'device'},
                {label: '网关子设备', value: 'childrenDevice'},
                {label: '网关设备', value: 'gateway'},
            ],
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

const defaultParams = {
    sorts: [{name: 'createTime', order: 'desc'}],
    terms: [
        {
            terms: [
                {
                    column: 'productId$product-info',
                    value: 'accessProvider is agent-device-gateway',
                },
            ],
            type: 'and',
        },
    ],
};

const _selectedRowKeys = ref<Record<string, any>[]>([]);
const params = ref<Record<string, any>>({});

const onSelectChange = (item: any, state: boolean) => {
    if (state) {
        _selectedRowKeys.value.push(item);
    } else {
        _selectedRowKeys.value.splice(_selectedRowKeys.value.findIndex(i => i.id === item.id), 1);
    }
    emit('update:value', _selectedRowKeys.value)
};

const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
    if (selected) {
        changeRows.map((i: any) => {
            if (!_selectedRowKeys.value.includes(i.id)) {
                _selectedRowKeys.value.push(i.id);
            }
        });
    } else {
        const arr = changeRows.map((item: any) => item.id);
        const _ids: string[] = [];
        _selectedRowKeys.value.map((i: any) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            }
        });
        _selectedRowKeys.value = _ids;
    }
};
const transformData = (arr: any[]): any[] => {
    if (Array.isArray(arr) && arr.length) {
        return (arr || []).map((item: any) => {
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

const handleSearch = (e: any) => {
    params.value = e;
}
const handleClick = (data: any) => {
    const _index = _selectedRowKeys.value.findIndex(i => i.id === data.id)
    if (_index !== -1) {
        _selectedRowKeys.value.splice(_index, 1);
    } else {
        _selectedRowKeys.value.push(data);
    }
    emit('update:value', _selectedRowKeys.value)
};

</script>

<style scoped lang="less">

</style>