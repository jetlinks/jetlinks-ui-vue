<template>
    <j-form>
        <j-data-table
            ref="tableRef"
            class="ant-table-striped"
            :columns="columns"
            :data-source="props.dataDetailList"
            :searchProps="{
                placeholder: '请输入搜索文本',
                onSearch: onSearch,
            }"
            bordered
        >
            <template #expand>
                <PermissionButton
                    style="margin-right: 20px"
                    placement="topRight"
                >
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
                    :options="props.dataMapOpt"
                    placeholder="请选择目标属性"
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
        </j-data-table>
    </j-form>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { getImage, onlyMessage } from '@/utils/comm';
import { getDataSandMap } from '@/api/exchange/receive';
const tableRef = ref();

const props = defineProps({
    mapDataList: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    dataMapOpt: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    dataDetailList: {
        type: [Array, String] as PropType<string[] | string>,
        default: [],
    },
    sendId: {
        type: String,
        default: undefined,
    },
});

// watch(
//     () => props.dataDetailList,
//     (newValue: any) => {
//         console.log('newValue', newValue);
//     },
// );

const saveRowData = (index: any, dataIndex: string, event: any) => {
    if (dataIndex === 'select') {
        props.dataDetailList[index][dataIndex] = event;
        props.dataDetailList[index]['targetAttribute'] = splitHumidity(event);
    } else {
        props.dataDetailList[index][dataIndex] = event;
    }
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

const onSearch = (value: any) => {
    // const list = mapDeviceList
    // const objectValue = list.filter((obj:any) => {
    //     obj.originalId === value || obj.originalName === value
    // });
    // mapDeviceList = objectValue
};

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
        if (!data?.expands || JSON.stringify(data?.expands) === '{}') {
            onlyMessage('缺少deviceType字段或对应的值', 'error');
            return false;
        }
        return true;
    };
    return false;
};

const columns = [
    { title: '原属性名称', dataIndex: 'originalName' },
    { title: '原属性标识', dataIndex: 'originalId' },
    { title: '目标属性', dataIndex: 'select' },
    { title: '状态', dataIndex: 'state', width: 200 },
];

const handChange = (e: any) => {
    console.log(e);
};

const handleImport = () => {
    console.log('导入');
};

const handleSave = () => {
    let getData = props.dataDetailList.map((item: any) => ({
        originalId: item.originalId,
        targetAttribute: item.targetAttribute,
        state: item.state,
    }));
    let senSaveDataMap = { dataMapping: getData };
    console.log(senSaveDataMap)
    getDataSandMap(props.sendId, senSaveDataMap).then((res: any) => {
        if(res.status === 200){
            onlyMessage('保存成功');
        }
    });
};

const handleMap = (data: any) => {
    console.log(data);
};
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
