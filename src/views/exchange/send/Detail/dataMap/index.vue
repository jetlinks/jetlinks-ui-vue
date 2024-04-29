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
            :row-class-name="(_record :any, index:any) => (index % 2 === 1 ? 'table-striped' : null)"
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
            <template #targetAttribute="{ data }">
                <j-select
                    v-model="data.record.targetAttribute"
                    label-in-value
                    style="width: 150px"
                    :options="props.dataMapOption"
                    placeholder="请选择目标属性"
                    @change="saveRowData(data.index, 'name', $event)"
                    :field-names="{ label: 'targetName', value: 'targetId' }"
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
const tableRef = ref();

const props = defineProps({
    mapDataList: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    dataMapOption: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
    dataDetailList:{
        type: [String, Array] as PropType<string | string[]>,
        default: [],
    },
});

watch(props.dataDetailList, (newValue: any) => {
    console.log('newValue',newValue);
});
const dataDetailList = ref<any>();

const saveRowData = (index: any, dataIndex: string, event: any) => {
    dataDetailList.value[index][dataIndex] = {
        targetId:event.value,
        targetName: event.label
    };
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
    { title: '目标属性', dataIndex: 'targetAttribute' },
    { title: '状态', dataIndex: 'state', width: 200 },
];

const handChange = (e: any) => {
    console.log(e);
};

const handleImport = () => {
    console.log('导入');
};

const handleSave = () => {
    console.log(props.dataDetailList);
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
