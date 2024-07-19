<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="northbound-dueros"
            @search="handleSearch"
        />
        <FullPage>
            <div class="container">
                <div class="list">
                    <Tree ref="TreeRef" @viewData="viewData" :params="params" />
                </div>
                <div class="detail">
                    <Detail :data="current" @refreshList="refreshList" />
                </div>
            </div>
        </FullPage>
    </page-container>
</template>

<script setup>
import Tree from './Tree/index.vue';
import Detail from './Detail/index.vue';
import { queryTypes } from '@/api/northbound/dueros';
import { queryNoPagingPost } from '@/api/device/product';
const params = ref({});
const current = ref();
const TreeRef = ref();

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'select',
            rename: 'id',
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
    },
    {
        title: '设备类型',
        dataIndex: 'applianceType',
        key: 'applianceType',
        scopedSlots: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryTypes().then((resp) => {
                        resolve(
                            resp.result.map((item) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 180,
        scopedSlots: true,
    },
];

const viewData = (data) => {
    current.value = data;
};
const refreshList = (changeSelect = false) => {
    TreeRef.value?.refresh(changeSelect);
};
const handleSearch = (_params) => {
    params.value = _params;
};
</script>
<style scoped lang="less">
.container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    height: 100%;
    .list {
        width: 15%;
        background-color: #fff;
        padding: 10px 15px;
        height: 100%;
    }
    .detail {
        width: 85%;
        height: 100%
    }
}
</style>
