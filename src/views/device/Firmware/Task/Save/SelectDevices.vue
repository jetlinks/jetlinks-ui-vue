<template lang="">
    <a-input
        placeholder="请选择设备"
        v-model:value="checkLable"
        :disabled="true"
    >
        <template #addonAfter>
            <AIcon
                :class="data.view ? 'disabled' : ''"
                type="EditOutlined"
                @click="onVisible"
            />
        </template>
    </a-input>
    <a-modal
        v-if="visible"
        title="选择设备"
        ok-text="确认"
        cancel-text="取消"
        :visible="true"
        width="80%"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <Search
            :columns="columns"
            target="search"
            @search="handleSearch"
            type="simple"
        />
        <JTable
            ref="tableRef"
            model="TABLE"
            :columns="columns"
            :request="queryDetailList"
            :defaultParams="defaultParams"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onSelect: onSelectChange,
                onSelectAll: onSelectAllChange,
            }"
            @cancelSelect="cancelSelect"
            :params="params"
        >
            <template #headerTitle>
                <a-checkbox
                    v-model:checked="state.checkAll"
                    :indeterminate="state.indeterminate"
                    @change="onCheckAllChange"
                    style="margin-left: 8px"
                >
                    全选
                </a-checkbox>
            </template>
            <template #productId="slotProps">
                <span>{{ slotProps.productName }}</span>
            </template>
            <template #state="slotProps">
                <a-badge
                    :text="slotProps.state?.text"
                    :status="statusMap.get(slotProps.state?.value)"
                />
            </template>
            <template #version="slotProps">
                <span>{{ slotProps.firmwareInfo?.version || '' }}</span>
            </template>
            <template #registerTime="slotProps">
                <span>{{
                    moment(slotProps.registerTime).format('YYYY-MM-DD HH:mm:ss')
                }}</span>
            </template>
        </JTable>
    </a-modal>
</template>
<script lang="ts" setup name="SelectDevicesPage">
import {
    queryDetailListNoPaging,
    queryDetailList,
} from '@/api/device/firmware';
import moment from 'moment';

type T = any;
const emit = defineEmits(['update:modelValue', 'change']);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const route = useRoute();
const params = ref<Record<string, any>>({});
const visible = ref(false);
const _selectedRowKeys = ref<string[]>([]);

const state = reactive({
    indeterminate: false,
    checkAll: false,
    checkedList: [],
});
let checkAllData: T[] = [];
const checkAllDataMap = new Map();
const checkLable = ref();

const defaultParams = {
    context: {
        includeTags: false,
        includeBind: false,
        includeRelations: false,
    },
    terms: [
        {
            terms: [
                {
                    column: 'productId',
                    value: route.query.productId,
                },
            ],
            type: 'and',
        },
    ],
    sorts: [{ name: 'createTime', order: 'desc' }],
};

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const columns = [
    {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '设备名称',
        key: 'name',
        dataIndex: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '固件版本',
        dataIndex: 'version',
        key: 'version',
        ellipsis: true,
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: '注册时间',
        key: 'registerTime',
        dataIndex: 'registerTime',
        search: {
            type: 'date',
        },
        width: 200,
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '在线', value: 'online' },
                { label: '离线', value: 'offline' },
                { label: '禁用', value: 'notActive' },
            ],
        },
        width: 150,
    },
];

const onCheckAllChange = (e: any) => {
    Object.assign(state, {
        checkedList: e.target.checked ? checkAllData : [],
        indeterminate: false,
    });
    _selectedRowKeys.value = state.checkedList;
};

const onSelectChange = (record: T[], selected: boolean, selectedRows: T[]) => {
    _selectedRowKeys.value = selected
        ? [...getSetRowKey(selectedRows)]
        : _selectedRowKeys.value.filter((item: T) => item !== record?.id);
};
const onSelectAllChange = (
    selected: boolean,
    selectedRows: T[],
    changeRows: T[],
) => {
    const unRowsKeys = getSelectedRowsKey(changeRows);
    _selectedRowKeys.value = selected
        ? [...getSetRowKey(selectedRows)]
        : _selectedRowKeys.value
              .concat(unRowsKeys)
              .filter((item) => !unRowsKeys.includes(item));
};

const getSelectedRowsKey = (selectedRows: T[]) =>
    selectedRows.map((item) => item?.id).filter((i) => !!i);

const getSetRowKey = (selectedRows: T[]) =>
    new Set([..._selectedRowKeys.value, ...getSelectedRowsKey(selectedRows)]);

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleOk = () => {
    checkLable.value = updateSelect(_selectedRowKeys.value);
    emit('update:modelValue', _selectedRowKeys.value);
    visible.value = false;
};

const updateSelect = (selectedRowKeys: T[]) =>
    selectedRowKeys
        .map((item) => checkAllDataMap.has(item) && checkAllDataMap.get(item))
        .toString();

const onVisible = () => {
    !props.data.view && (visible.value = true);
};

const handleCancel = () => {
    visible.value = false;
    cancelSelect();
};

onMounted(() => {
    queryDetailListNoPaging({ ...defaultParams, paging: false }).then(
        (resp: T) => {
            if (resp.status === 200) {
                checkAllData = resp.result.map((item: T) => {
                    checkAllDataMap.set(item.id, item.name);
                    return item.id;
                });
                if (props.data.id) {
                    checkLable.value = updateSelect(props.data.deviceId);
                    emit('update:modelValue', props.data.deviceId);
                }
            }
        },
    );
});

watch(
    () => _selectedRowKeys.value,
    (val) => {
        Object.assign(state, {
            checkedList: val,
            indeterminate: !!val.length && val.length < checkAllData.length,
            checkAll:
                !!checkAllData.length && val.length === checkAllData.length,
        });
    },
    { deep: true },
);

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style lang="less" scoped>
.disabled {
    pointer-events: auto !important;
    cursor: not-allowed !important;
}
</style>
