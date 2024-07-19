<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="northbound-aliyun"
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
const params = ref({});
const current = ref();
const TreeRef = ref();

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '网桥产品',
        dataIndex: 'bridgeProductName',
        key: 'bridgeProductName',
        search: {
            type: 'string',
        },
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
    }
}
</style>
