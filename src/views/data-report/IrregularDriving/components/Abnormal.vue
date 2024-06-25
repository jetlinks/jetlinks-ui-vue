<template>
    <div>
        <pro-search
            :columns="columns"
            target="abnormal-config"
            @search="handleSearch"
        ></pro-search>
        <full-page>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                model="table"
                :params="globParams"
                :defaultParams="{
                    sorts: [{ name: 'reportTime', order: 'desc' }],
                }"
                :gridColumn="3"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onSelect: handleRowSelected,
                    onSelectAll: handleSelectAll,
                    onSelectNone: handleClearSelected,
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

                <template #collisionAngle="{ collisionAngle }">
                    {{ `${collisionAngle || 0}&deg;` }}
                </template>
                <template #vehicleTypeEnum="{ vehicleTypeEnum }">
                    {{ handleVehicleType(vehicleTypeEnum) }}
                </template>
                <template #collisionThreshold="{ collisionThreshold }">
                    {{ `${collisionThreshold || 0}G` }}
                </template>
                <template #collisionActual="{ collisionActual }">
                    {{ `${collisionActual || 0}G` }}
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
        </full-page>
    </div>
</template>

<script setup lang="ts">
import { downloadFileByUrl } from '@/utils/utils';
import {
    queryAbnormal,
    abnormalExport,
} from '@/api/data-report/IrregularDriving';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';
import { useSelect } from '@/utils/hooks/useSelect';
import { vehicleTypeEnum } from '@/api/data-report/commonApi';
import { useSelectableTable } from '@/hook/useSelectableTable';
import { useProSearch } from '@/hook/useProSearch';

const {
    selectedRowKeys,
    handleRowSelected,
    handleSelectAll,
    handleClearSelected,
} = useSelectableTable();

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

const configRef = ref<Record<string, any>>({});

const type = ref<string>('xlsx');

const { handleSearch } = useProSearch(globParams, handleClearSelected);

const vehicleType = ref<{ label: string; value: string }[]>();

const handleVehicleType = (type: string) => {
    const item = vehicleType.value?.find((item) => item.value === type);
    return item?.label || type;
};

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
        title: '等级',
        dataIndex: 'collisionLevel',
        key: 'collisionLevel',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '碰撞阈值',
        dataIndex: 'collisionThreshold',
        key: 'collisionThreshold',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '碰撞实际值',
        dataIndex: 'collisionActual',
        key: 'collisionActual',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '碰撞角度 ',
        dataIndex: 'collisionAngle',
        key: 'collisionAngle',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return selectedRowKeys.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

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

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await queryAbnormal(_params);
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
 * @function handleExport 导出
 */
const handleExport = async () => {
    let _params: any = {};
    // 当部分选中时
    if (selectedRowKeys.value.length > 0) {
        _params = {
            paging: false,
            sorts: [{ name: 'reportTime', order: 'desc' }],
            pageSize: selectedRowKeys.value.length,
            terms: [
                {
                    column: 'id',
                    value: selectedRowKeys.value,
                    termType: 'in',
                },
            ],
        };
    } else {
        _params = {
            paging: false,
            pageSize: dataTotal.value > 10000 ? 10000 : dataTotal.value,
            sorts: [{ name: 'reportTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }

    // 注意这里的请求函数要更换为当前页面的请求函数，以及下方导出的文件名
    const res = await abnormalExport(type.value, _params);

    if (res) {
        const blob = new Blob([res.data], { type: type.value });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(
            url,
            `震动异常数据-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            type.value,
        );

        if (
            selectedRowKeys.value?.length > 10000 ||
            (selectedRowKeys.value?.length === 0 && dataTotal.value > 10000)
        ) {
            onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
        } else {
            onlyMessage(EXPORT_TIPS);
        }
    }
};

// /**
//  * 搜索
//  * @param _params
//  */
// const handleSearch = (_params: any) => {
//     if (_params.terms && _params.terms.length > 0) handleClearSelected();
//     globParams.value = _params;
// };
</script>

<style lang="less " scoped></style>
