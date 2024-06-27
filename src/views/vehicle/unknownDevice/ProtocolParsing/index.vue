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
                    sorts: [{ name: 'timestamp', order: 'desc' }],
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
                <template #timestamp="{ timestamp }">
                    {{
                        timestamp
                            ? moment(Number(timestamp)).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
                </template>
                <template #action="slotProps">
                    <a @click="handelDetail(slotProps)" style="color: #f84914"
                        >查看
                    </a>
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
    </div>
</template>

<script setup lang="ts">
import {
    queryUnknownProtocol,
    exportUnknownProtocol,
} from '@/api/vehicle/unknown';
import { Modal, Textarea } from 'ant-design-vue';
import { onlyMessage } from '@/utils/comm';
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
const pageSize = ref<number>(12);

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

const handelDetail = (data: any) => {
    let content = '';
    try {
        content = JSON.stringify(data.payload, null, 2);
    } catch (error) {
        content = data.errorMessage;
    }
    Modal.info({
        title: '详细信息',
        width: 700,
        content: h(Textarea, {
            bordered: false,
            rows: 15,
            value: content,
        }),
    });
};

const { handleSearch } = useProSearch(globParams, handleClearSelected, [
    'createTime',
]);

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

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return selectedRowKeys.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

/**
 * @function handleExport 导出
 */
const handleExport = () => {
    console.log('selectedRowKeys', selectedRowKeys.value);
    onlyMessage('导出成功');
};

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
    },
    {
        title: '出厂编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
    },
    {
        title: '车辆简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        ellipsis: true,
    },

    {
        title: '子设备',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '异常时间',
        dataIndex: 'timestamp',
        key: 'timestamp',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: '异常说明',
        dataIndex: 'errorMessage',
        key: 'errorMessage',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const queryData = async (_params: any) => {
    const resp: any = await queryUnknownProtocol(_params);
    if (resp.status === 200) {
        dataTotal.value = resp.result.total || 12;
        currentPage.value = resp.result.pageIndex + 1 || 0;
        pageSize.value = resp.result.pageSize || 12;
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
</script>

<style lang="less" scoped></style>
