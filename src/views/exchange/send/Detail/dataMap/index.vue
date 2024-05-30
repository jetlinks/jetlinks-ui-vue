<template>
    <j-form>
        <j-data-table ref="tableRef" class="ant-table-striped" :columns="columns" :data-source="props.dataDetailList"
            :height="560" bordered>
            <template #expand>
                <PermissionButton style="margin-right: 20px" placement="topRight">
                    <j-upload name="file" accept=".json" :showUploadList="false"
                        :before-upload="beforeUpload">导入</j-upload>
                </PermissionButton>
                <PermissionButton key="save" style="margin-right: 20px" type="primary" :tooltip="{
                    title: '保存',
                }" @click="handleSave" placement="topRight">
                    保存
                </PermissionButton>
            </template>
            <template #headerCell="{ column }">
                <template v-if="column.key === 'state'">
                    <span> 状态 </span>
                    <j-switch style="margin-left: 10px" v-model:checked="checkedAll"
                        @change="updateAllRowData('state', $event)" checkedValue="enabled" unCheckedValue="disabled"
                        checked-children="开启" un-checked-children="关闭" />
                </template>
            </template>
            <template #select="{ data }">
                <j-select v-model:value="data.record.select" style="width: 150px" :options="props.dataMapOpt"
                    placeholder="请选择目标属性" @change="saveRowData(data.index, 'select', $event)"></j-select>
            </template>
            <template #state="{ data }">
                <j-switch v-model:checked="data.record.state" @change="saveRowData(data.index, 'state', $event)"
                    checkedValue="enabled" unCheckedValue="disabled" size="small" />
            </template>
        </j-data-table>
    </j-form>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { getImage, onlyMessage } from '@/utils/comm';
import {
    queryDeviceProductTarget,
    getDataSandMap,
} from '@/api/exchange/receive';
const tableRef = ref();
const checkedAll = ref('disabled');

const props = defineProps({
    mapDataList: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    dataMapOpt: {
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
    deviceDetailList: {
        type: Object,
        default: [],
    },
    dataDetailList: {
        type: Object,
        default: [],
    },
    sendId: {
        type: String,
        default: undefined,
    },
    allDataMapping: {
        type: Object,
        default: [],
    },
    allDeviceMapping: {
        type: Object,
        default: [],
    },
    selectProductId: {
        type: String,
        default: '',
    },
});

const saveRowData = (index: any, dataIndex: string, event: any) => {
    if (dataIndex === 'select') {
        props.dataDetailList[index][dataIndex] = event;
        props.dataDetailList[index]['targetAttribute'] = splitHumidity(event);
    } else {
        props.dataDetailList[index][dataIndex] = event;
    }
};

const updateAllRowData = (dataIndex: string, event: any) => {
    props.dataDetailList.forEach((item: any) => {
        item.state = event === 'enabled' ? 'enabled' : 'disabled';
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

/**
 * 导入
 */
const beforeUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (result) => {
        const text: any = result.target?.result;
        if (!file.type.includes('json')) {
            onlyMessage('请上传json格式文件', 'error');
            return false;
        }
        if (!text) {
            onlyMessage('文件内容不能为空', 'error');
            return false;
        }
        const data = JSON.parse(JSON.stringify(JSON.parse(text)));
        if (Array.isArray(data)) {
            onlyMessage('请上传正确格式文件', 'error');
            return false;
        }
        let arr = []
        for (let key in data) {
            arr.push(data[key]);
        }
        let saveData = [
            {
                id: props.sendId,
                targetMapping: { result: arr },
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

const columns = [
    { title: '原属性名称', dataIndex: 'originalName', key: 'originalName' },
    { title: '原属性标识', dataIndex: 'originalId', key: 'originalId' },
    { title: '目标属性', dataIndex: 'select', key: 'select' },
    { title: '状态', dataIndex: 'state', key: 'state', width: 200 },
];

//映射保存
const handleSave = () => {
    let getData = props.dataDetailList.map((item: any) => ({
        originalId: item.originalId,
        targetAttribute: item.targetAttribute,
        state: item.state,
    }));
    let getDeviceData = props.deviceDetailList.map((item: any) => {
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
            bln: item.bln,
            state: item.state,
        };
    });
    // console.log('props.allDataMapping',props.allDataMapping)
    if (props.allDataMapping.length > 0 && props.allDataMapping.length > 0) {
        if (!props.selectProductId) {
            onlyMessage('保存失败', 'error');
            return
        }
        const newDataMapping = upsert(props.allDataMapping, { id: props.selectProductId, configList: getData })
        const newDeviceMapping = upsert(props.allDeviceMapping, { id: props.selectProductId, configList: getDeviceData })

        let senSaveDataMap = { dataMapping: newDataMapping, deviceMapping: newDeviceMapping };
        // console.log('senSaveDataMap1', senSaveDataMap);
        getDataSandMap(props.sendId, senSaveDataMap).then((res: any) => {
            if (res.status === 200) {
                onlyMessage('保存成功');
                emit('refresh');
            }
        });
    } else {
        if (!props.selectProductId) {
            onlyMessage('保存失败', 'error');
            return
        }
        let senSaveDataMap = { dataMapping: [{ id: props.selectProductId, configList: getData }], deviceMapping: [{ id: props.selectProductId, configList: getDeviceData }] };
        // console.log('senSaveDataMap2', senSaveDataMap);
        getDataSandMap(props.sendId, senSaveDataMap).then((res: any) => {
            if (res.status === 200) {
                onlyMessage('保存成功');
                emit('refresh');
            }
        });
    }
};

//更新或添加对象到映射中
const upsert = (arr: any, obj: any) => {
    const index = arr.findIndex((x: any) => x.id === obj.id);
    if (index === -1) {
        // 如果不存在，直接添加
        return [...arr, obj];
    } else {
        // 如果存在，更新
        return [...arr.slice(0, index), obj, ...arr.slice(index + 1)];
    }
}

const emit = defineEmits(['refresh']);
</script>

<style lang="less" scoped>
.j-data-table-full {
    display: none;
}

.j-data-table-search-result {
    display: none;
}

[data-doc-theme='light'] .ant-table-striped :deep(.table-striped) td {
    background-color: #7dd1e0;
}

[data-doc-theme='dark'] .ant-table-striped :deep(.table-striped) td {
    background-color: rgb(230, 228, 228);
}
</style>
