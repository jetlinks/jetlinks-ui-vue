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
            <PermissionButton style="margin-right: 20px" placement="topRight">
                <j-upload
                    name="file"
                    accept=".json"
                    :showUploadList="false"
                    :before-upload="beforeUpload"
                    >导入</j-upload
                >
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
                :allowClear="true"
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
                <template #select="{ data }">
                    <j-select
                        v-model:value="data.record.select"
                        style="width: 100%"
                        :options="mapOptions"
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
// import { queryNoPagingPost } from '@/api/device/product';
import {
    getDataSandMap,
    queryDeviceProductTarget,
} from '@/api/exchange/receive';
import { onlyMessage } from '@/utils/comm';

const params = ref<Record<string, any>>({});
const tableRef = ref();
const DelTableRef = ref();
const deviceMapDetail = ref<any>([]);
const mapOptions = ref<any>([]);
const deviceMapDetailOne = ref<any>();

const State = reactive({
    openView: false,
    title: '映射',
    confirmLoading: false,
    confirm() {
        deviceMapDetailOne.value.deviceTargetAttribute = deviceMapDetail.value;
        const arr = props.deviceDetailList.map((item: any) => {
            if (item.originalId === deviceMapDetailOne.value.originalId) {
                return {
                    originalId: deviceMapDetailOne.value.originalId,
                    originalName: deviceMapDetailOne.value.originalName,
                    select: deviceMapDetailOne.value.select || undefined,
                    state: deviceMapDetailOne.value.state || undefined,
                    bln: true,
                    targetAttribute:
                        deviceMapDetailOne.value.targetAttribute || undefined,
                    deviceTargetAttributeMap:
                        deviceMapDetailOne.value.deviceTargetAttributeMap ||
                        undefined,
                    deviceTargetAttribute:
                        deviceMapDetailOne.value.deviceTargetAttribute ||
                        undefined,
                };
            }
            return item;
        });
        emit('updateParentVar', arr);
        State.openView = false;
    },
    cancel() {
        State.openView = false;
    },
});

const props = defineProps({
    deviceIdsMapOpt: {
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
    deviceDetailList: {
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
    sendId: {
        type: String,
        default: undefined,
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
    { title: '目标属性', dataIndex: 'select' },
    { title: '状态', dataIndex: 'state', width: 200 },
];

/**
 * 导入
 */
const beforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (result) => {
        const text = result.target?.result;
        if (!file.type.includes('json')) {
            onlyMessage('请上传json格式文件', 'error');
            return false;
        }
        if (!text) {
            onlyMessage('文件内容不能为空', 'error');
            return false;
        }
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
            onlyMessage('请上传正确格式文件', 'error');
            return false;
        }
        if (
            !data?.deviceDetails ||
            JSON.stringify(data?.deviceDetails) === '{}'
        ) {
            onlyMessage('缺少deviceDetails字段或对应的值', 'error');
            return false;
        }
        let saveData = [
            {
                id: props.sendId,
                targetMapping: data,
            },
        ];
        console.log('saveData', saveData);
        queryDeviceProductTarget(saveData).then((res: any) => {
            if (res.status === 200) {
                onlyMessage('导入成功！');
                emit('refresh');
            }
        });
        return true;
    };
    return false;
};

// const handleClear = (index: any, dataIndex: string, event: any) => {
//     console.log('index', index);
//     console.log('dataIndex', dataIndex);
//     console.log(event);
//     if (event === undefined) {
//     }
// };

//修改设备table表数据
const saveRowData = (index: any, dataIndex: string, event: any) => {
    if (dataIndex === 'select') {
        if (event) {
            const getTargetAtt = props.deviceDetailList.find((item:any)=> item.select = event)
            // console.log(getTargetAtt)
            props.deviceDetailList[index]['deviceTargetAttribute'] = getTargetAtt.deviceTargetAttribute;
            props.deviceDetailList[index]['deviceTargetAttributeMap'] = getTargetAtt.deviceTargetAttributeMap;
            props.deviceDetailList[index][dataIndex] = event;
            props.deviceDetailList[index]['targetAttribute'] = splitHumidity(event);
        }else{
            props.deviceDetailList[index][dataIndex] = event;
            props.deviceDetailList[index]['targetAttribute'] = undefined;
        }
    } else {
        props.deviceDetailList[index][dataIndex] = event;
    }
};

//修改映射table表数据
const saveMapRowData = (index: any, dataIndex: string, event: any) => {
    if (dataIndex === 'select') {
        deviceMapDetail.value[index][dataIndex] = event;
        deviceMapDetail.value[index]['targetAttribute'] = splitHumidity(event);
    } else {
        deviceMapDetail.value[index][dataIndex] = event;
    }
};

const handleSave = () => {
    console.log(props.deviceDetailList);
    let getData = props.deviceDetailList.map((item: any) => {
        let deviceTargetAttribute = item.deviceTargetAttribute.map(
            (item: any) => ({
                originalId: item.originalId,
                state: item.state,
                targetAttribute: item.targetAttribute,
            }),
        );
        return {
            originalId: item.originalId,
            targetAttribute: item.targetAttribute,
            deviceTargetAttribute: deviceTargetAttribute,
            state: item.state,
        };
    });
    let senSaveDataMap = { deviceMapping: getData };
    // console.log('senSaveDataMap',senSaveDataMap);
    // console.log('props.sendId',props.sendId);
    getDataSandMap(props.sendId, senSaveDataMap).then((res: any) => {
        if (res.status === 200) {
            onlyMessage('保存成功');
        }
    });
};

const splitHumidity = (data: any) => {
    const match = data.match(/^([^(]+)\((.*)\)$/);
    if (match) {
        return {
            targetName: match[1],
            targetId: match[2],
        };
    } else {
        return {
            targetName: data,
            targetId: '',
        };
    }
};

const handleMap = (data: any) => {
    deviceMapDetailOne.value = data.record;
    deviceMapDetail.value = data.record.deviceTargetAttribute;
    mapOptions.value = data.record.deviceTargetAttributeMap;
    State.openView = true;
};

const emit = defineEmits(['updateParentVar', 'refresh']);
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
