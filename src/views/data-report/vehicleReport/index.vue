<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                :defaultParams="{
                    sorts: [{ name: 'vehicleDate', order: 'desc' }],
                }"
                model="table"
                :params="globParams"
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
                            <PermissionButton>
                                <AIcon type="ExportOutlined" />

                                <span>导出</span>
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #vehicleTypeEnum="slotProps">
                    <span> {{ slotProps.vehicleTypeEnum.text }}</span>
                </template>
                <template #orgName="slotProps">
                    <span> {{ slotProps.orgName || '--' }}</span>
                </template>
                <template #action="slotProps">
                    <a @click="handelDetail(slotProps)" style="color: #f84914"
                        >详情
                    </a>
                </template>
                <template #vehicleDate="{ vehicleDate }">
                    {{ dayjs(vehicleDate).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template #paginationRender>
                    <a-pagination
                        showQuickJumper
                        isShowContent
                        showSizeChanger
                        :pageSize="pageSize"
                        :pageSizeOptions="['12', '24', '48', '96']"
                        :current="currentPage"
                        :total="dataTotal"
                        :show-total="() => `总共 ${dataTotal} 条`"
                        @change="handleOnChange"
                    />
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';

import { downloadFileByUrl } from '@/utils/utils';
import { useMenuStore } from 'store/menu';

import {
    queryVehicleList,
    vehicleExport,
} from '@/api/data-report/vehicleReport';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';

const menuStory = useMenuStore();

const selects = ref<any>([]);

const configRef = ref<Record<string, any>>({});

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        width: 180,
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '内燃柴油机',
                    value: 'ICDieselEngine',
                },
                {
                    label: '内燃汽油机',
                    value: 'ICGasolineEngine',
                },
                {
                    label: '机械柴油机',
                    value: 'MachineDieselEngine',
                },
                {
                    label: '内燃牵引车',
                    value: 'ICTractor',
                },
                {
                    label: '其他',
                    value: 'other',
                },
            ],
        },
    },
    {
        title: '出场编号',
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
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
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
        title: '日期',
        dataIndex: 'vehicleDate',
        key: 'vehicleDate',
        width: 200,
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
        ellipsis: true,
    },
];

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await queryVehicleList(_params);
    if (resp.status === 200) {
        dataTotal.value = resp.result.total;
        currentPage.value = resp.result.pageIndex + 1;
        pageSize.value = resp.result.pageSize;
        return {
            // 3.仿造请求结果返回给表格
            code: resp.status,
            result: resp.result,
            status: resp.status,
        };
    } else {
        return {
            code: 200,
            result: { data: [] },
            status: 200,
        };
    }
};

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
    globParams.value = param;
};

const handelDetail = (slotProps: any) => {
    if (!slotProps.deviceId) {
        onlyMessage('未绑定车辆设备，请先绑定再查看详情', 'error');
        return;
    }
    menuStory.jumpPage(
        'data-report/vehicleReport/Detail',
        { id: slotProps.id },
        {
            id: slotProps.id,
            deviceId: JSON.stringify(slotProps.deviceId),
        },
    );
};

/**
 * @function handleOnChange 分页器改变的回调事件
 * @param num
 * @param pageSize
 */
const handleOnChange = (num: number, pageSize: number) => {
    const _params = {
        ...globParams,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    handleSearch(_params);
};

/**
 * 导出
 */

const type = ref<string>('xlsx');

const handleExport = async () => {
    console.log(selects.value.length, 'length');
    if (!selects.value?.length) {
        vehicleExport('zip', []).then((res: any) => {
            if (res) {
                const blob = new Blob([res.data], { type: type.value });
                const url = URL.createObjectURL(blob);
                downloadFileByUrl(
                    url,
                    `车辆列表数据-${moment(new Date()).format(
                        'YYYY/MM/DD HH:mm:ss',
                    )}`,
                    'zip',
                );
            }
        });
        return;
    } else if (selects.value.length === 1) {
        //只勾选一条的情况
        const { id, deviceId } = selects.value[0];
        vehicleExport(type.value, [{ vehicleId: id, deviceId }]).then(
            (res: any) => {
                if (res) {
                    const blob = new Blob([res.data], { type: type.value });
                    const url = URL.createObjectURL(blob);
                    downloadFileByUrl(
                        url,
                        `车辆列表数据-${moment(new Date()).format(
                            'YYYY/MM/DD HH:mm:ss',
                        )}`,
                        type.value,
                    );
                }
            },
        );
        return;
    } else {
        //导出多条

        console.log('多条');
        const params: any[] = [];
        selects.value.forEach((item: any) => {
            const temp = {
                vehicleId: item.id,
                deviceId: item.deviceId,
            };
            params.push(temp);
        });
        vehicleExport('zip', params).then((res: any) => {
            if (res) {
                const blob = new Blob([res.data], { type: type.value });
                const url = URL.createObjectURL(blob);
                downloadFileByUrl(
                    url,
                    `车辆列表数据-${moment(new Date()).format(
                        'YYYY/MM/DD HH:mm:ss',
                    )}`,
                    'zip',
                );
            }
        });
    }
};
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
        selects.value = selectedRows;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
        console.log(selected, selectedRows, changeRows);
    },
};
</script>

<style lang="less" scoped></style>
