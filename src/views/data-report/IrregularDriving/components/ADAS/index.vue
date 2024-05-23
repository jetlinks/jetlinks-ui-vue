<template>
    <div>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        ></pro-search>
        <full-page>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="request"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="3"
                :row-selection="rowSelection"
            >
                <template #headerTitle>
                    <j-space>
                        <j-popconfirm
                            title="确认导出？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleExport"
                        >
                            <PermissionButton
                                hasPermission="notice/Template:export"
                            >
                                导出
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #type="slotProps">
                    <span> {{ getMethodTxt(slotProps.type) }}</span>
                </template>
                <template #provider="slotProps">
                    <span>
                        {{ getProviderTxt(slotProps.type, slotProps.provider) }}
                    </span>
                </template>
                <template #action="slotProps">
                    <a-button danger type="text" @click="onDetail(slotProps)">
                        查看</a-button
                    >
                </template>
            </JProTable>
        </full-page>
    </div>

    <Details
        v-if="visible"
        v-model:visible="visible"
        :data="dataInfo"
    />
</template>

<script setup lang="ts">
import { downloadObject } from '@/utils/utils';
import Details from './Details.vue';
import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';

let providerList: any = [];
Object.keys(MSG_TYPE).forEach((key) => {
    providerList = [...providerList, ...MSG_TYPE[key]];
});

const visible = ref(false);

const data = ref<any[]>([]);

const dataInfo = ref<Record<string, any>>();

const request = async () => {
    return {
        code: 'Success',
        status: 200,
        result: {
            data: data.value,

            pageIndex: 0,
            pageSize: 12,
            total: 100,
        },
    };
};

const configRef = ref<Record<string, any>>({});
/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value.selectedKeys, `异常震动数据`);
};

const onDetail = (data: Record<string, any>) => {
    dataInfo.value = data;
    visible.value = true;
};

const params = ref<Record<string, any>>({});
const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleType',
        key: 'vehicleType',
        scopedSlots: true,
        search: {
            type: 'select',
            options: providerList,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '出厂编号',
        dataIndex: 'number',
        key: 'number',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '车辆简称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警类型',
        dataIndex: 'alarmType',
        key: 'alarmType',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警信息',
        dataIndex: 'alarmInfo',
        key: 'alarmInfo',
        scopedSlots: true,
    },

    {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: 'organization',
        key: 'organization',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    }, 
    {
        title: '报警附件',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
        console.log(selected, selectedRows, changeRows);
    },
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    // console.log('handleSearch:', e);
    params.value = e;
    // console.log('params.value: ', params.value);
};

/**
 * 通知方式字段展示对应文字
 */
const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};

/**
 * 根据类型展示对应文案
 * @param type
 * @param provider
 */
const getProviderTxt = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.label;
};

onMounted(() => {
    for (let i = 0; i < 12; i++) {
        data.value.push({
            id: i,
            vehicleType: '内燃车类型',
            number: `2342355${i}`,
            name: `name${i}`,
            alarmType: `报警类型${i}`,
            alarmInfo: '报警信息',
            model: '型号',
            organization: '所属组织',
            time: '2024-05-04',
            position: '报警位置',
        });
    }
});
</script>

<style lang="scss" scoped></style>
