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
                :rowSelection="{
                    selectedRowKeys: state.selectedRowKeys,
                    onChange: selectedRowChange,
                    onSelect: handleRowSelected,
                    onSelectAll: handleSelectAll,
                }"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            :popConfirm="{
                                title: popTitle,
                                onConfirm: () => handleExport(),
                            }"
                        >
                            <AIcon type="ExportOutlined" />
                            导出
                        </PermissionButton>
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
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';
import { vehicleTypeEnum } from '@/api/data-report/commonApi';
const menuStory = useMenuStore();

const configRef = ref<Record<string, any>>({});

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

const xlsx = ref<string>('xlsx');
const zip = ref<string>('zip');

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
            options: () =>
                new Promise((resolve) => {
                    vehicleTypeEnum().then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.text,
                                value: item.value,
                            })),
                        );
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
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
        ellipsis: true,
    },
];

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return state.selectedRowKeys.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

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
        ...globParams.value,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    handleSearch(_params);
};

/**
 * 导出
 * @function当选中一条的时候导出xlsx，其他情况导出zip
 */

const handleExport = async () => {
    let _params: any = {};
    // 当部分选中时
    if (state.selectedRowKeys.length > 0) {
        _params = {
            paging: false,
            pageSize: state.selectedRowKeys?.length,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    column: 'id',
                    value: state.selectedRowKeys,
                    termType: 'in',
                },
            ],
        };
    } else {
        _params = {
            paging: false,
            pageSize: dataTotal.value > 10000 ? 10000 : dataTotal.value,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }
    vehicleExport('车辆中心数据', xlsx.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: xlsx.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `车辆列表数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                xlsx.value,
            );
            if (
                state.selectedRowKeys?.length > 10000 ||
                (state.selectedRowKeys?.length == 0 && dataTotal.value > 10000)
            ) {
                onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
            } else {
                onlyMessage(EXPORT_TIPS);
            }
        }
    });
};
// 当前分页表格选中的数据项的id
const state = reactive<{ selectedRowKeys: string[]; selectedRows: any[] }>({
    selectedRowKeys: [],
    selectedRows: [],
});

/**
 * @function selectedRowChange table组件的rowSelection的onChange事件
 * @param selectedRowKeys
 * @param selectedRows
 */
const selectedRowChange = (selectedRowKeys: string[], selectedRows?: any[]) => {
    if (selectedRowKeys.length === 0 || selectedRows?.length === 0) {
        state.selectedRowKeys = [];
        state.selectedRows = [];
    }
};

/**
 * @function handleRowSelected table组件的rowSelection的onSelect事件
 * @param record
 * @param selected
 * @param selectedRows
 */
const handleRowSelected = (
    record: any,
    selected: boolean,
    selectedRows: any,
) => {
    if (selected) {
        const index = state.selectedRowKeys.findIndex(
            (item) => item === record.id,
        );
        if (index === -1) {
            state.selectedRowKeys.push(record.id);
            state.selectedRows.push(record);
        }
    } else {
        const index = state.selectedRowKeys.findIndex(
            (item) => item === record.id,
        );
        if (index !== -1) {
            state.selectedRowKeys.splice(index, 1);
            state.selectedRows.splice(index, 1);
        }
    }
};

/**
 * @function handleSelectAll table组件的rowSelection的onSelectAll事件
 * @param selected
 * @param selectedRows
 * @param changeRows
 */
const handleSelectAll = (
    selected: boolean,
    selectedRows: any,
    changeRows: any,
) => {
    if (selected) {
        for (let i = 0; i < changeRows.length; i++) {
            let flag = true;
            state.selectedRowKeys.forEach((item: any) => {
                if (item === changeRows[i].id) flag = false;
            });
            if (flag) {
                state.selectedRowKeys.push(changeRows[i].id);
                state.selectedRows.push(changeRows[i]);
            }
        }
    } else {
        for (let i = 0; i < changeRows.length; i++) {
            const index = state.selectedRowKeys.findIndex(
                (item) => item === changeRows[i].id,
            );
            if (index !== -1) {
                state.selectedRowKeys.splice(index, 1);
                state.selectedRows.splice(index, 1);
            }
        }
    }
};
</script>

<style lang="less" scoped></style>
