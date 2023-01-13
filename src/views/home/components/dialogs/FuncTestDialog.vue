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
        <Search />
        <JTable :columns="columns" model="TABLE"> </JTable>

        <template #footer>
            <a-button key="back" @click="visible = false">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk"
                >确认</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ComponentInternalInstance } from 'vue';

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
        clickSearch();
    },
);

// 搜索部分
const form = ref({
    key: '',
    relation: '',
    keyValue: '',
});

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
</script>

<style lang="less" scoped>
.func-test-dialog-container {
    .search {
        display: flex;
    }
}
</style>
