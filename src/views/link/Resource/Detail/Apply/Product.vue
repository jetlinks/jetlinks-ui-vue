<template>
    <a-modal
        visible
        :centered="true"
        @cancel="emits('close')"
        :maskClosable="false"
        :width="1000"
        :footer="null"
        :closable="false"
    >
        <template #title>
            <div class="header">
                <div @click="emits('close')">
                    <AIcon
                        type="ArrowLeftOutlined"
                        style="font-size: 18px; margin-bottom: 12px"
                    />
                    返回
                </div>
                <div class="title">受影响的产品</div>
            </div>
        </template>
        <pro-search :columns="columns" type="simple" @search="handleSearch" />
        <a-divider style="margin: 0" />
        <div class="content">
            <j-pro-table
                ref="actionRef"
                model="CARD"
                :columns="columns"
                :params="params"
                :request="
                    (e) =>
                        type === 'metadata'
                            ? _queryProduct(_id, e)
                            : _queryProtocol(_id, e)
                "
                :gridColumn="2"
                :bodyStyle="{
                    paddingRight: 0,
                    paddingLeft: 0,
                }"
            >
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :status="String(slotProps.state)"
                        :statusText="slotProps.state === 1 ? '正常' : '禁用'"
                        :statusNames="{ '1': 'processing', '0': 'error' }"
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :width="80"
                                    :height="80"
                                    :src="
                                        slotProps.photoUrl ||
                                        getImage('/device-product.png')
                                    "
                                />
                            </slot>
                        </template>
                        <template #content>
                            <div style="width: calc(100% - 100px)">
                                <Ellipsis>
                                    <span
                                        style="
                                            font-size: 16px;
                                            font-weight: 600;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
                                </Ellipsis>
                            </div>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        设备类型
                                    </div>
                                    <Ellipsis>{{
                                        slotProps.deviceType?.text
                                    }}</Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        接入方式
                                    </div>
                                    <Ellipsis>{{
                                        slotProps?.accessName || '未接入'
                                    }}</Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                    </CardBox>
                </template>
            </j-pro-table>
        </div>
    </a-modal>
</template>

<script setup lang="ts" name="Product">
import { getImage } from '@/utils/comm';
import { queryTree } from '@/api/device/category';
import { getTreeData_api } from '@/api/system/department';
import { _queryProduct, _queryProtocol } from '@/api/link/resource';

const emits = defineEmits(['close']);
const props = defineProps({
    type: {
        type: String,
        default: 'metadata',
    },
});

const route = useRoute();
const _id = route.params?.id;
const params = ref({});
const handleSearch = (p: any) => {
    params.value = p;
};

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
        title: '名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    // {
    //     title: '网关类型',
    //     dataIndex: 'accessProvider',
    //     width: 150,
    //     ellipsis: true,
    //     hideInTable: true,
    //     search: {
    //         type: 'select',
    //         options: () =>
    //             getProviders().then((resp: any) => {
    //                 const data = resp.result || [];
    //                 return accessConfigTypeFilter(data);
    //             }),
    //     },
    // },
    // {
    //     title: '接入方式',
    //     dataIndex: 'accessName',
    //     width: 150,
    //     ellipsis: true,
    //     search: {
    //         type: 'select',
    //         options: () =>
    //             queryGatewayList().then((resp: any) =>
    //                 resp.result.map((item: any) => ({
    //                     label: item.name,
    //                     value: item.id,
    //                 })),
    //             ),
    //     },
    // },
    {
        title: '设备类型',
        dataIndex: 'deviceType',
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: '直连设备', value: 'device' },
                { label: '网关子设备', value: 'childrenDevice' },
                { label: '网关设备', value: 'gateway' },
            ],
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        width: '90px',
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 0 },
                { label: '正常', value: 1 },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        ellipsis: true,
        width: 300,
    },
    // {
    //     dataIndex: 'classifiedId',
    //     title: '分类',
    //     hideInTable: true,
    //     search: {
    //         type: 'treeSelect',
    //         options: () => {
    //             return new Promise((res) => {
    //                 queryTree({ paging: false }).then((resp) => {
    //                     res(resp.result);
    //                 });
    //             });
    //         },
    //         componentProps: {
    //             fieldNames: {
    //                 label: 'name',
    //                 value: 'id',
    //             },
    //         },
    //     },
    // },
    // {
    //     dataIndex: 'id$dim-assets',
    //     key: 'id$dim-assets',
    //     title: '所属组织',
    //     hideInTable: true,
    //     search: {
    //         type: 'treeSelect',
    //         componentProps: {
    //             fieldNames: {
    //                 label: 'name',
    //                 value: 'value',
    //             },
    //         },
    //         options: () =>
    //             new Promise((resolve) => {
    //                 getTreeData_api({ paging: false }).then((resp: any) => {
    //                     const formatValue = (list: any[]) => {
    //                         return list.map((item: any) => {
    //                             if (item.children) {
    //                                 item.children = formatValue(item.children);
    //                             }
    //                             return {
    //                                 ...item,
    //                                 value: JSON.stringify({
    //                                     assetType: 'product',
    //                                     targets: [
    //                                         {
    //                                             type: 'org',
    //                                             id: item.id,
    //                                         },
    //                                     ],
    //                                 }),
    //                             };
    //                         });
    //                     };
    //                     resolve(formatValue(resp.result) || []);
    //                 });
    //             }),
    //     },
    // },
];
</script>

<style lang="less" scoped>
.header {
    display: flex;
    .title {
        width: 90%;
        text-align: center;
    }
}
.content {
    height: 70vh;
    overflow-y: auto;
}
</style>
