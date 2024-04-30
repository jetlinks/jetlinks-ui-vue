<template>
    <j-data-table
        class="ant-table-striped"
        ref="tableRef"
        :columns="columns"
        :data-source="props.deviceDetailList"
        :searchProps="{
            placeholder: '请输入搜索名称',
        }"
        :row-class-name="(_record :any, index:any) => (index % 2 === 1 ? 'table-striped' : null)"
        bordered
    >
        <template #expand>
            <PermissionButton
                key="import"
                style="margin-right: 20px"
                :tooltip="{
                    title: '导入',
                }"
                @click="handleImport"
                placement="topRight"
            >
                导入
            </PermissionButton>
            <PermissionButton
                key="save"
                style="margin-right: 20px"
                type="primary"
                :tooltip="{
                    title: '保存',
                }"
                @click="handleSave"
                placement="topRight"
            >
                保存
            </PermissionButton>
        </template>
        <template #select="{ data }">
            <j-select
                    v-model:value="data.record.select"
                    style="width: 150px"
                    :options="props.deviceIdsMapOpt"
                    placeholder="请选择目标设备"
                    @change="saveRowData(data.index, 'select', $event)"
                ></j-select>
        </template>
        <template #state="{ data }">
            <j-switch
                v-model:checked="data.record.state"
                @change="saveRowData(data.index, 'state', $event)"
                checkedValue="enabled"
                unCheckedValue="Disabled"
                size="small"
            />
        </template>
        <template #action="{ data }">
            <j-space>
                <PermissionButton
                    type="link"
                    key="edit"
                    @click="handleMap(data)"
                >
                    映射
                </PermissionButton>
            </j-space>
        </template>
    </j-data-table>
    <j-modal
        :visible="State.openView"
        :title="State.title"
        :maskClosable="false"
        destroy-on-close
        width="1020px"
        @ok="State.confirm"
        @cancel="State.cancel"
        :confirmLoading="State.confirmLoading"
        cancelText="取消"
        okText="确定"
    >
        <div style="margin-top: 10px">
            <j-data-table
                ref="DelTableRef"
                :columns="DetailColumns"
                :data-source="deviceMapDetail"
                :searchProps="{
                    placeholder: '请输入搜索文本',
                }"
                bordered
            >
                <template #expand>
                    <PermissionButton
                        key="save"
                        style="margin-right: 20px"
                        type="primary"
                        :tooltip="{
                            title: '保存',
                        }"
                        @click="handleMapSave"
                        placement="topRight"
                    >
                        保存
                    </PermissionButton>
                </template>
                <template #select="{ data }">
                    <j-select
                        v-model:value="data.record.select"
                        style="width: 100%"
                        :options="props.deviceIdsMapOpt"
                        @change="saveMapRowData(data.index, 'select', $event)"
                        placeholder="请选择目标属性"
                    ></j-select>
                </template>
                <template #state="{ data }">
                    <j-switch
                        v-model:checked="data.record.state"
                        @change="saveMapRowData(data.index, 'state', $event)"
                        checkedValue="enabled"
                        unCheckedValue="Disabled"
                        size="small"
                    />
                </template>
            </j-data-table>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { queryNoPagingPost } from '@/api/device/product';
import { getDataSandMap } from '@/api/exchange/receive';

const params = ref<Record<string, any>>({});
const mappingData = ref<any>([]);
const tableRef = ref();
const DelTableRef = ref();
const mapOptions = ref<any>([]);
const deviceMapDetail = ref<any>([]);

const State = reactive({
    openView: false,
    title: '映射',
    confirmLoading: false,
    confirm() {
        console.log('保存');
    },
    cancel() {
        State.openView = false;
    },
});

const props = defineProps({
    mapDeviceList: {
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
    deviceMapOption: {
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
    deviceIdsMapOpt: {
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
    deviceDetailList:{
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
});
// const deviceDetailList = ref<any>(props.deviceDetailList);

const columns = [
    { title: '原设备名称', dataIndex: 'originalName' },
    { title: '原设备标识', dataIndex: 'originalId' },
    { title: '目标设备', dataIndex: 'select' },
    { title: '状态', dataIndex: 'state', width: 200 },
    { title: '操作', dataIndex: 'action', width: 100 },
];

const DetailColumns = [
    { title: '原属性名称', dataIndex: 'originalName' },
    { title: '原属性标识', dataIndex: 'originalId' },
    { title: '目标属性', dataIndex: 'targetAttribute' },
    { title: '状态', dataIndex: 'state', width: 200 },
];

//修改设备table表数据
const saveRowData = (index: any, dataIndex: string, event: any) => {
    props.deviceDetailList[index][dataIndex] = event;
};

//修改映射table表数据
const saveMapRowData = (index: any, dataIndex: string, event: any) => {
    deviceMapDetail.value[index][dataIndex] = event;
};

const handleImport = () => {
    console.log('导入');
};

const handleSave = () => {
    console.log(props.deviceDetailList);
};

//映射保存
const handleMapSave = () => {
    console.log(deviceMapDetail.value);
};

const handleChange = (value: any, key: any) => {
    console.log(value);
    console.log(key);
};

const handleMap = (data: any) => {
    console.log(data.record.deviceTargetAttribute);
    deviceMapDetail.value = data.record.deviceTargetAttribute
    State.openView = true;
};

// watch(()=>props.deviceDetailList, (newValue: any) => {
//     console.log('newValue',newValue);
// });
</script>

<style lang="less" scoped>
[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
    background-color: #7dd1e0;
}
[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
    background-color: rgb(230, 228, 228);
}
</style>
