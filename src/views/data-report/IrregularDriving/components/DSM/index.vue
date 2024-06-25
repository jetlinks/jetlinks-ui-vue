<template>
    <div>
        <pro-search
            :columns="columns"
            target="dsm-config"
            @search="handleSearch"
        ></pro-search>
        <full-page>
            <PTable
                ref="configRef"
                :columns="columns"
                :request="queryDSM"
                :defaultParams="{
                    sorts: [{ name: 'reportTime', order: 'desc' }],
                }"
                model="table"
                v-model:params="globParams"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <j-space>
                        <j-popconfirm
                            :title="popTitle"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleExport"
                        >
                            <PermissionButton>
                                <AIcon type="ExportOutlined" />
                                导出
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #action="slotProps">
                    <a-button danger type="text" @click="onDetail(slotProps)">
                        查看</a-button
                    >
                </template>
                <template #vehicleTypeEnum="{ vehicleTypeEnum }">
                    {{ handleVehicleType(vehicleTypeEnum) }}
                </template>
                <template #reportTime="{ reportTime }">
                    {{ dayjs(reportTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template #orgName="{ orgName }">
                    {{ orgName || '--' }}
                </template>
            </PTable>
            <Detail v-if="visible" v-model:visible="visible" :data="dataInfo" />
        </full-page>
    </div>
</template>

<script setup lang="ts">
import PTable from '@/components/PTable/index.vue';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import Detail from './Detail.vue';
import { queryDSM, dsmExport } from '@/api/data-report/IrregularDriving';
import moment from 'moment';
import { handleSearchByDate } from '@/utils/dataReportUtils';
import { vehicleTypeEnum } from '@/api/data-report/commonApi';
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';
import { useProSearch } from '@/hook/useProSearch';

const configRef = ref<InstanceType<typeof PTable>>();

const visible = ref(false);

const vehicleType = ref<{ label: string; value: string }[]>();

const dataInfo = ref<Record<string, any>>();

const globParams = ref<Record<string, any>>({});

const { handleSearch } = useProSearch(
    globParams,
    () => configRef.value?.EmptySelectKeys(),
    ['reportTime'],
);

/**
 * 导出
 */
const type = ref<string>('xlsx');

const handleVehicleType = (type: string) => {
    const item = vehicleType.value?.find((item) => item.value === type);
    return item?.label || type;
};

/**
 * @function handleExport 导出
 */
const handleExport = async () => {
    let _params: any = {};

    const selectedRowKeys = configRef.value?.selectedRowKeys || [];

    const dataTotal = configRef.value?.dataTotal || 0;
    // 当部分选中时
    if (selectedRowKeys?.length > 0) {
        _params = {
            paging: false,
            sorts: [{ name: 'reportTime', order: 'desc' }],
            pageSize: selectedRowKeys?.length,
            terms: [
                {
                    column: 'id',
                    value: selectedRowKeys,
                    termType: 'in',
                },
            ],
        };
    } else {
        _params = {
            paging: false,
            pageSize: dataTotal > 10000 ? 10000 : dataTotal,
            sorts: [{ name: 'reportTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }

    // 注意这里的请求函数要更换为当前页面的请求函数，以及下方导出的文件名
    const res = await dsmExport(type.value, _params);

    if (res) {
        const blob = new Blob([res.data], { type: type.value });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(
            url,
            `DSM异常数据-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            type.value,
        );

        if (
            selectedRowKeys.length > 10000 ||
            (selectedRowKeys.length === 0 && dataTotal > 10000)
        ) {
            onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
        } else {
            onlyMessage(EXPORT_TIPS);
        }
    }
};

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return configRef?.value?.selectedRowKeys.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});
const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    vehicleTypeEnum().then((resp: any) => {
                        vehicleType.value = resp.result.map((item: any) => ({
                            label: item.text,
                            value: item.value,
                        }));
                        resolve(vehicleType.value);
                    });
                }),
        },
    },
    {
        title: '出厂编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '车辆简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警类型',
        dataIndex: 'reportType',
        key: 'reportType',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警信息',
        dataIndex: 'reportInfo',
        key: 'reportInfo',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },

    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '告警时间 ',
        dataIndex: 'reportTime',
        key: 'reportTime',
        scopedSlots: true,
        width: 180,
        ellipsis: true,
        search: {
            type: 'date',
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

const onDetail = (data: Record<string, any>) => {
    dataInfo.value = data;
    visible.value = true;
};
// /**
//  * 搜索
//  * @param param
//  */
// const handleSearch = (param: any) => {
//     handleSearchByDate(param, ['reportTime']);
//     globParams.value = param;
// };
</script>

<style lang="less" scoped></style>
