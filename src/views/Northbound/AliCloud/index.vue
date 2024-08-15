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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const params = ref({});
const current = ref();
const TreeRef = ref();

const columns = [
    {
        title: $t('AliCloud.index.613237-0'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('AliCloud.index.613237-1'),
        dataIndex: 'bridgeProductName',
        key: 'bridgeProductName',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('AliCloud.index.613237-2'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('AliCloud.index.613237-3'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('AliCloud.index.613237-4'), value: 'enabled' },
                { label: $t('AliCloud.index.613237-5'), value: 'disabled' },
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
        border-right: 1px solid #f0f0f0;
    }
    .detail {
        width: 85%;
    }
}
</style>
