<template>
    <div class="choose-api-container">
        <div class="table">
            <j-pro-table
                :columns="columns"
                :dataSource="props.tableData"
                :rowSelection="props.mode !== 'home' ? rowSelection : undefined"
                noPagination
                model="TABLE"
            >
                <template #url="slotProps">
                    <span
                        style="color: #1d39c4; cursor: pointer"
                        @click="emits('update:clickApi', slotProps)"
                        >{{ slotProps.url }}</span
                    >
                </template>
            </j-pro-table>
        </div>

        <PermissionButton
            type="primary"
            hasPermission="system/Platforms/Setting:update"
            @click="save"
            v-if="props.mode !== 'home'"
        >
            保存
        </PermissionButton>
    </div>
</template>

<script setup lang="ts">
import {
    addOperations_api,
    delOperations_api,
    updateOperations_api,
} from '@/api/system/apiPage';
import { message } from 'jetlinks-ui-components';
import { modeType } from '../typing';
import { useDepartmentStore } from '@/store/department';

const department = useDepartmentStore();
const emits = defineEmits([
    'refresh',
    'update:clickApi',
    'update:selectedRowKeys',
    'update:changedApis',
]);
const props = defineProps<{
    tableData: any[];
    clickApi: any;
    selectedRowKeys: string[];
    sourceKeys: string[];
    mode: modeType;
    changedApis: any; // 产生变化的api项
}>();
const code = useRoute().query.code as string;
const columns = [
    {
        title: 'API',
        dataIndex: 'url',
        key: 'url',
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'summary',
        key: 'summary',
    },
];
const rowSelection = {
    // onSelect: (record: any) => {
    //     const targetId = record.id;
    //     let newKeys = [...props.selectedRowKeys];

    //     if (props.selectedRowKeys.includes(targetId)) {
    //         newKeys = newKeys.filter((id) => id !== targetId);
    //     } else newKeys.push(targetId);

    //     emits('update:selectedRowKeys', newKeys);
    //     if (props.mode === 'appManger') {
    //         emits('update:changedApis', {
    //             ...props.changedApis,
    //             [record.id]: record,
    //         });
    //     }
    // },
    onChange: (keys: string[]) => {
        // 当前节点表格数据id
        const currenTableKeys = props.tableData.map((m: any) => m.id);
        // 当前表格, 原有选中的id
        const oldSelectedKeys = currenTableKeys.filter((key) =>
            props.sourceKeys.includes(key),
        );
        // 除当前表格之外, 勾选上的数据
        const otherSelectedKeys = department.crossPageKeys.filter(
            (key) => !currenTableKeys.includes(key),
        );

        // 取消选择的数据项
        const removeKeys = oldSelectedKeys.filter((key) => !keys.includes(key));
        // 新增选择的项
        const addKeys = keys.filter((key) => !oldSelectedKeys.includes(key));
        // 缓存当前表格和其他表格改变的数据
        emits('update:selectedRowKeys', [...otherSelectedKeys, ...keys]);

        // 新增选中/取消选中的数据
        const changed = {};
        [...addKeys, ...removeKeys].forEach((key: string) => {
            changed[key] = props.tableData.find((f: any) => f.id === key);
        });
        if (props.mode === 'appManger') {
            // 缓存当前表格和其他表格改变的数据
            emits('update:changedApis', {
                ...department.changedApis,
                ...changed,
            });
        }
    },
    selectedRowKeys: ref<string[]>([]),
};
const save = async () => {
    const keys = props.selectedRowKeys;
    // 移除的key
    const removeKeys = props.sourceKeys.filter((key) => !keys.includes(key));
    // 新选中的key
    const addKeys = keys.filter((key) => !props.sourceKeys.includes(key));

    if (props.mode === 'api') {
        // 此时是api配置
        // removeKeys.length &&
        //     delOperations_api(removeKeys)
        //         .finally(() => addOperations_api(addKeys))
        //         .then(() => {
        //             message.success('操作成功');
        //             emits('refresh');
        //         });
        // fix: bug#10829
        removeKeys.length && (await delOperations_api(removeKeys));
        const res = await addOperations_api(addKeys);
        if (res.success) {
            message.success('操作成功');
            emits('refresh');
        }
    } else if (props.mode === 'appManger') {
        const removeItems = removeKeys.map((key) => ({
            id: key,
            permissions: props.changedApis[key]?.security,
        }));
        const addItems = addKeys.map((key) => ({
            id: key,
            permissions: props.changedApis[key]?.security,
        }));
        Promise.all([
            updateOperations_api(code, '_delete', { operations: removeItems }),
            updateOperations_api(code, '_add', { operations: addItems }),
        ]).then((resps) => {
            if (resps[0].status === 200 && resps[1].status === 200) {
                message.success('操作成功');
                emits('refresh');
            }
        });
    }
};

watch(
    () => props.selectedRowKeys,
    (n) => {
        // console.log('props.selectedRowKeys: ', n);
        rowSelection.selectedRowKeys.value = n;
    },
);
</script>

<style lang="less" scoped>
.choose-api-container {
    .table {
        max-height: calc(100vh - 260px);
        overflow-y: auto;
    }
    :deep(.jtable-body-header) {
        display: none !important;
    }
    :deep(.ant-alert-info) {
        display: none !important;
    }
}
</style>
