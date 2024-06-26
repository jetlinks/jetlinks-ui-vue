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
                    sorts: [{ name: 'reportTime', order: 'desc' }],
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
                                title: '确认导出',
                                onConfirm: () => handleExport(),
                            }"
                        >
                            <AIcon type="ExportOutlined" />
                            导出
                        </PermissionButton>
                    </j-space>
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
import { vehicleTypeEnum } from '@/api/data-report/commonApi';
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
const pageSizePag = ref<number>(12);

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

const handleExport = () => {
    onlyMessage('导出成功');
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
        title: '子设备',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属车辆简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },

    {
        title: '出厂编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'string',
        },
    },
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
];

const queryData = async () => {
    const data: any[] = [];
    for (let i = 0; i < 12; i++) {
        data.push({
            id: `${i}`,
            vehicleTypeEnum: `内燃柴油车${i}`,
            factoryNumber: `出厂编号${i}`,
            simpleName: `90923${i}`,
            subEquipment: `电池${i}`,
            abnormalTime: 1718955275000,
            errorMessage: "{errorMessage:'异常'}",
            modelNumber: '型号',
            orgName: '所属组织',
        });
    }
    dataTotal.value = 100;
    currentPage.value = 0 || 0;
    pageSizePag.value = 12 || 12;
    return new Promise((resolve) => {
        resolve({
            message: 'success',
            result: {
                pageIndex: 0,
                pageSize: 12,
                total: 100,
                data: data,
            },
            status: 200,
            timestamp: 1718783580064,
        });
    });
};

const handleSearch = (params: any) => {
    globParams.value = params;
};
</script>

<style lang="less" scoped></style>
