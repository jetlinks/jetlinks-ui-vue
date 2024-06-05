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
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="globParams"
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
                <template #factoryNumber="slotProps">
                    <span>{{ slotProps.factoryNumber || '--' }}</span>
                </template>
                <template #describe="slotProps">
                    <span>{{ slotProps.describe || '--' }}</span>
                </template>
                <template #state="slotProps">
                    <button
                        v-if="slotProps.state.value === 'offline'"
                        style="
                            height: 24px;
                            padding: 3px 8px 3px 8px;
                            border-radius: 3px;
                            background: #f99d311a;
                            color: #f99d31;
                            border: 1px solid #f99d3199;
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 18px;
                        "
                    >
                        离线
                    </button>
                    <button
                        v-else-if="slotProps.state.value === 'notActive'"
                        style="
                            height: 24px;
                            padding: 3px 8px 3px 8px;
                            border-radius: 3px;
                            background: rgba(229, 0, 18, 0.1);
                            color: rgba(229, 0, 18, 1);
                            border: 1px solid rgba(229, 0, 18, 1);
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 18px;
                        "
                    >
                        禁用
                    </button>
                    <button
                        v-else
                        style="
                            height: 24px;
                            padding: 3px 8px 3px 8px;
                            border-radius: 3px;
                            background: #0fce8c1a;
                            color: #0fce8c;
                            border: 1px solid #0fce8c99;
                            font-size: 14px;
                            font-weight: 400;
                            line-height: 18px;
                        "
                    >
                        在线
                    </button>
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
import { queryDeviceList, deviceExport } from '@/api/data-report/deviceReport';
import { downloadFileByUrl } from '@/utils/utils';
import moment from 'moment';
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';
import { useSelect } from '@/utils/hooks/useSelect';
import { onlyMessage } from '@/utils/comm';

const { state, selectedRowChange, handleRowSelected, handleSelectAll } =
    useSelect();

const configRef = ref<Record<string, any>>({});
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

const selectIds = ref<Array<number | string>>([]);

const type = ref<string>('xlsx');

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 180,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属车辆编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return state.selectedRowKeys.length === 0
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
    const resp: any = await queryDeviceList(_params);
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

/**
 * @function handleExport 导出
 */
const handleExport = async () => {
    let _params: any = {};
    // 当部分选中时
    if (state.selectedRowKeys.length > 0) {
        _params = {
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

    // 注意这里的请求函数要更换为当前页面的请求函数，以及下方导出的文件名
    deviceExport('设备中心数据', type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `设备中心数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
            if (
                state.selectedRowKeys?.length > 10000 ||
                dataTotal.value > 10000
            ) {
                onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
            } else {
                onlyMessage(EXPORT_TIPS);
            }
        }
    });
};
</script>

<style lang="less" scoped></style>
