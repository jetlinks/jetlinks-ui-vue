<template>
    <div class="choose-api-container">
        <div class="table">
            <j-pro-table
                :columns="columns"
                :dataSource="_tableData"
                :rowSelection="props.mode !== 'home' ? {
                    selectedRowKeys: _selectedRowKeys,
                    onChange: onChange,
                } : undefined"
                noPagination
                mode="TABLE"
            >
                <template #url="slotProps">
                    <span
                        style="color: #1677FF; cursor: pointer"
                        @click="emits('update:clickApi', slotProps)"
                        >{{ slotProps.url }}</span
                    >
                </template>
            </j-pro-table>
        </div>

        <j-permission-button
            type="primary"
            hasPermission="system/Platforms/Setting:update"
            @click="save"
            v-if="props.mode !== 'home'"
            style="margin-left: 20px;"
        >
            {{ $t('components.ChooseApi.726023-0') }}
        </j-permission-button>
    </div>
</template>

<script setup lang="ts">
import {
    addOperations_api,
    delOperations_api,
    updateOperations_api,
} from '@/api/system/apiPage';
import { modeType } from '../typing';
import { useDepartmentStore } from '@/store/department';
import { onlyMessage } from "@jetlinks-web/utils";
import { uniqBy } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
        title: $t('components.ChooseApi.726023-1'),
        dataIndex: 'summary',
        key: 'summary',
    },
];

const _tableData = computed(() => {
    return uniqBy(props.tableData, 'id') || []
})

const _selectedRowKeys = ref(props.selectedRowKeys);
const onChange = (keys: string[], _data: any[]) => {
    console.log(keys,'keys')
    const _keys = _data.map(i => i.id)
    // 当前节点表格数据id
    const currenTableKeys = _tableData.value.map((m: any) => m.id);
    // 当前表格, 原有选中的id
    const oldSelectedKeys = currenTableKeys.filter((key) =>
        props.sourceKeys.includes(key),
    );
    // 除当前表格之外, 勾选上的数据
    const otherSelectedKeys = department.crossPageKeys.filter(
        (key) => !currenTableKeys.includes(key),
    );

    // 取消选择的数据项
    const removeKeys = oldSelectedKeys.filter((key) => !_keys.includes(key));
    // 新增选择的项
    const addKeys = _keys.filter((key) => !oldSelectedKeys.includes(key));
    // 缓存当前表格和其他表格改变的数据
    emits('update:selectedRowKeys', [...otherSelectedKeys, ..._keys]);

    // 新增选中/取消选中的数据
    // const changed = {};
    // [...addKeys, ...removeKeys].forEach((key: string) => {
    //     changed[key] = _tableData.value.find((f: any) => f.id === key);
    // });
    // console.log(department.changedApis,'123')
    // if (props.mode === 'appManger') {
    //     // 缓存当前表格和其他表格改变的数据
    //     emits('update:changedApis', {
    //         ...department.changedApis,
    //         ...changed,
    //     });
    // }
}
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
        //             onlyMessage($t('components.ChooseApi.726023-2'));
        //             emits('refresh');
        //         });
        // fix: bug#10829
        if(addKeys.length || removeKeys.length) {
            removeKeys.length && (await delOperations_api(removeKeys));
            const res = await addOperations_api(addKeys);
            if (res.success) {
                onlyMessage($t('components.ChooseApi.726023-2'));
                emits('refresh');
            }
        } else {
            onlyMessage($t('components.ChooseApi.726023-3'),'error')
            return
        }
    } else if (props.mode === 'appManger') {
        const items = props.selectedRowKeys.map((key)=>({
            id: key,
            permissions: department.changedApis[key]?.security ? department.changedApis[key]?.security : []
        }))
        // const removeItems = removeKeys.map((key) => ({
        //     id: key,
        //     permissions: props.changedApis[key]?.security ? props.changedApis[key]?.security:[],
        // }));
        // const addItems = addKeys.map((key) => ({
        //     id: key,
        //     permissions: props.changedApis[key]?.security ? props.changedApis[key]?.security:[],
        // }));
        // Promise.all([
        //     updateOperations_api(code, '_delete', { operations: removeItems }),
        //     updateOperations_api(code, '_add', { operations: addItems }),
        // ]).then((resps) => {
        //     if (resps[0].status === 200 && resps[1].status === 200) {
        //         onlyMessage($t('components.ChooseApi.726023-2'));
        //         emits('refresh');
        //     }
        // });
        updateOperations_api(code,{operations:items}).then((resp)=>{
            if(resp.status === 200){
                onlyMessage($t('components.ChooseApi.726023-2'));
                emits('refresh')
            }
        })
    }
};

watch(
    () => props.selectedRowKeys,
    (n) => {
        // console.log('props.selectedRowKeys: ', n);
        _selectedRowKeys.value = n
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
