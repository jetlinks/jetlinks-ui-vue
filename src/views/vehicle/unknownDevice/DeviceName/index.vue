<template>
    <div>
        <pro-search
            :columns="columns"
            target="dataUpload-config"
            @search="handleSearch"
        ></pro-search>
        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="columns"
                model="table"
                :request="queryData"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                v-model:params="globParams"
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
                <template #vehicleTypeEnum="{ vehicleTypeEnum }">
                    <Ellipsis>{{ vehicleTypeEnum?.text || '' }}</Ellipsis>
                </template>
                <template #createTime="{ createTime }">
                    {{
                        createTime
                            ? moment(Number(createTime)).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
                </template>
                <template #paginationRender>
                    <a-pagination
                        showQuickJumper
                        isShowContent
                        showSizeChanger
                        :pageSize="pageSizePag"
                        :pageSizeOptions="['12', '24', '48', '96']"
                        :current="currentPage"
                        :total="dataTotal"
                        :show-total="() => `总共 ${dataTotal} 条`"
                        @change="handleOnChange"
                    />
                </template>
            </JProTable>
        </FullPage>
    </div>
</template>

<script setup lang="ts">
import { queryUnknownName, exportUnknownName } from '@/api/vehicle/unknown';
import { vehicleTypeEnum } from '@/api/data-report/commonApi';
import { onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import { useProSearch } from '@/hook/useProSearch';
import { useSelectableTable } from '@/hook/useSelectableTable';
import moment from 'moment';
const {
    selectedRowKeys,
    handleRowSelected,
    handleSelectAll,
    handleClearSelected,
} = useSelectableTable();
const tableRef = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSizePag = ref<number>(12);

// 导出文件的类型
const type = ref<string>('xlsx');

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});
const vehicleTypeValue = ref('');
const chooseList = ref<string[]>([]);

const { handleSearch } = useProSearch(globParams, handleClearSelected, [
    'timestamp',
]);

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return selectedRowKeys.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

const handleExport = async () => {
    let _params: any = {};
    if (selectedRowKeys.value.length > 0) {
        // 当部分选中时
        _params = {
            paging: false,
            pageSize:
                selectedRowKeys.value.length > 10000
                    ? 10000
                    : selectedRowKeys.value.length,
            terms: [
                {
                    column: 'id',
                    value: selectedRowKeys.value,
                    termType: 'in',
                },
            ],
            sorts: [{ name: 'createTime', order: 'desc' }],
        };
    } else {
        // 当全不选时
        _params = {
            paging: false,
            pageSize: dataTotal.value > 10000 ? 10000 : dataTotal.value,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }
    const res: any = await exportUnknownName(
        'unknownName',
        type.value,
        _params,
    );
    if (res.status === 200) {
        const blob = new Blob([res.data], { type: type.value });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(
            url,
            `设备命名异常-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            type.value,
        );
        if (
            selectedRowKeys.value.length > 10000 ||
            (selectedRowKeys.value.length == 0 && dataTotal.value > 10000)
        ) {
            onlyMessage('超出上限，已导出10000条', 'warning');
        } else {
            onlyMessage('导出成功');
        }
    }
};

/**
 * @function handleOnChange 分页器改变的回调事件
 * @param num
 * @param pageSize
 */
const handleOnChange = (num: number, pageSize: number) => {
    // currentPage.value = num - 1;
    // pageSizePag.value = pageSize;
    const _params = {
        ...globParams.value,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    handleSearch(_params);
};

const columns = [
    {
        title: '设备id',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    // {
    //     title: '所属车辆简称',
    //     dataIndex: 'simpleName',
    //     key: 'simpleName',
    //     ellipsis: true,
    //     search: {
    //         type: 'string',
    //     },
    // },
    // {
    //     title: '出厂编号',
    //     dataIndex: 'factoryNumber',
    //     key: 'factoryNumber',
    //     ellipsis: true,
    //     scopedSlots: true,
    //     width: 200,
    //     search: {
    //         type: 'string',
    //     },
    // },
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
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'date',
        },
    },
];

const queryData = async (_params: any) => {
    // console.log('_params', _params);
    const { terms, ...params } = _params;
    if (terms.length > 0) {
        terms[0].terms?.map((item: any) => {
            if (item.column === 'vehicleTypeEnum') {
                if (item.termType === 'eq' || item.termType === 'not') {
                    vehicleTypeValue.value = item.value;
                    chooseList.value = [];
                } else {
                    chooseList.value = item.value;
                    vehicleTypeValue.value = chooseList.value.join(',');
                }
            } else {
                vehicleTypeValue.value = '';
                chooseList.value = [];
            }
        });
    } else {
        vehicleTypeValue.value = '';
        chooseList.value = [];
    }
    const myParams = {
        queryParamEntity: {
            ...params,
            terms,
        },
        vehicleTypeEnum: vehicleTypeValue.value,
        isContains:
            vehicleTypeValue.value || chooseList.value.length > 0
                ? true
                : false,
        chooseList: chooseList.value,
    };
    console.log('命名myParams', myParams);
    const resp: any = await queryUnknownName(myParams);
    if (resp.status === 200) {
        dataTotal.value = resp.result.total || 12;
        currentPage.value = resp.result.pageIndex + 1 || 0;
        pageSizePag.value = resp.result.pageSize || 12;
        return {
            // 请求结果返回给表格
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
</script>

<style lang="less" scoped></style>
