<template>
    <div ref="modal" class="func-test-dialog-container"></div>
    <a-modal
        v-model:visible="visible"
        title="选择产品"
        style="width: 1000px"
        @ok="handleOk"
        :getContainer="getContainer"
        :maskClosable="false"
    >
        <div class="search">
            <a-select
                v-model:value="form.key"
                style="width: 100px;margin-right: 20px;"
                :options="productList"
            />
            <a-select
                v-model:value="form.relation"
                style="width: 100px;margin-right: 20px;"
                :options="productList"
            />
            <a-input v-model:value="form.keyValue" allow-clear style="width: 230px;margin-right: 50px;" />

            <a-button type="primary" @click="clickSearch" style="margin-right: 10px;">
                <template #icon><SearchOutlined /></template>
                搜索
            </a-button>
            <a-button @click="clickReset">
                <template #icon><reload-outlined /></template>
                重置
            </a-button>
        </div>
        <JTable :columns="columns" model="TABLE"> </JTable>

        <template #footer>
            <a-button key="back" @click="visible = false
            ">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk">确认</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ComponentInternalInstance } from 'vue';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue';

import { productItem, deviceInfo } from '../../index';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const emits = defineEmits(['confirm']);
const props = defineProps({
    openNumber: Number,
});

// 弹窗控制
const visible = ref<boolean>(false);
const getContainer = () => proxy?.$refs.modal as HTMLElement;
const handleOk = () => {
    emits('confirm', form.value);
    visible.value = false;
};
watch(
    () => props.openNumber,
    () => {
        visible.value = true;
        clickReset();
        getOptions();
        clickSearch();
    },
);

// 搜索部分
const form = ref({
    key: '',
    relation: '',
    keyValue: '',
});
const productList = ref<[productItem] | []>([]);
const getOptions = () => {
    productList.value = [];
};
const clickSearch = () => {};
const clickReset = () => {
    Object.entries(form.value).forEach(([prop]) => {
        form.value[prop] = '';
    });
};

// 表格部分
const columns = [
    {
        title: '设备Id',
        dataIndex: 'deviceId',
        key: 'deviceId',
    },
    {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
    },
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
    },
    {
        title: '注册时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
];
const tableData = ref<deviceInfo[]>([]);
const selectItem: deviceInfo | {} = {};
const getList = () => {};
</script>

<style lang="less" scoped>
.func-test-dialog-container {
    .search {
        display: flex;
    }
}

</style>
