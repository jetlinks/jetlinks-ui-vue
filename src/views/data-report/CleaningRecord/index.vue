<template>
    <page-container>
        <pro-search
            :columns="tableColumns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="tableColumns"
                :request="queryData"
                model="table"
                :params="globParams"
                :gridColumn="3"
                :rowKey="(record: any) => record.id"
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
                    {{ handleVehicleType(vehicleTypeEnum) }}
                </template>
                <!-- 所属组织 -->
                <template #action="slotProps">
                    <a @click="handelDetail(slotProps)" style="color: #f84914"
                        >查看
                    </a>
                </template>
                <!-- 告警时间 -->
                <template #alarmTime="{ alarmTime }">
                    {{ formatDate(alarmTime) }}
                </template>
                <template #paginationRender>
                    <a-pagination
                        :showQuickJumper="true"
                        :isShowContent="true"
                        :showSizeChanger="true"
                        :pageSize="pageSize"
                        :pageSizeOptions="['12', '24', '48', '96']"
                        :current="currentPage"
                        :total="dataTotal"
                        :show-total="handleShowTotal"
                        @change="handleOnChange"
                    />
                </template>
            </JProTable>
        </FullPage>
        <Modal ref="formRef" />
    </page-container>
</template>

<script setup lang="ts">
import { downloadFileByUrl } from '@/utils/utils';
import moment from 'moment';
import { queryAlarmData, _export } from '@/api/data-report/alarmSheet';
import useFilterAlarmDesc from '@/hook/useFilterAlarmDesc';
import { FullPage } from 'components/Layout';
import { onlyMessage } from '@/utils/comm';
import { columns } from './columnConfig';
import {
    formatDate,
    handleResetSelectedRows,
    handleSearchByDate,
    handleSearchByDescription,
} from '@/utils/dataReportUtils';
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';
import { useSelectableTable } from '@/hook/useSelectableTable';
import Modal from './Modal/index.vue';
import dayjs from 'dayjs';

const formRef = ref();

const configRef = ref<Record<string, any>>({});
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

// 导出文件的类型
const type = ref<string>('xlsx');

// 从hooks中解构获取表格的选中事件以及响应式的被选中id集合
const {
    selectedRowKeys,
    handleRowSelected,
    handleSelectAll,
    handleClearSelected,
} = useSelectableTable();

// 处理导出按钮的提示
const popTitle = computed(() => {
    return selectedRowKeys.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

const { queryDataFactory, dicMap, tableColumns, handleVehicleType } =
    useFilterAlarmDesc(columns);
// 生成请求函数
const queryDataFn = queryDataFactory(queryAlarmData, 'alarmTime');

//测试数据
const myData = [
    {
        id: '11111',
        factoryNumber: '设备111',
        simpleName: '产品111',
        alarmTime: dayjs(new Date()).valueOf(),
        lngLat: '温度',
        deviceId: '300',
        max: 200,
        min: 0,
    },
    {
        id: '22222',
        factoryNumber: '设备222',
        simpleName: '湿度',
        alarmTime: dayjs(new Date()).valueOf(),
        lngLat: '湿度',
        deviceId: '120',
        max: 100,
        min: 0,
    },
    {
        id: '33333',
        factoryNumber: '设备333',
        simpleName: '产品333',
        alarmTime: dayjs(new Date()).valueOf(),
        lngLat: '字段3',
        deviceId: '278',
        max: 200,
        min: 0,
    },
];

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp = await queryDataFn(_params);
    if (resp.status === 200) {
        dataTotal.value = myData.length;
        currentPage.value = resp.result.pageIndex + 1;
        pageSize.value = resp.result.pageSize || 12;
        return {
            code: resp.status,
            result: {
                data: myData,
                pageIndex: resp.result.pageSize || 12,
                pageSize: resp.result.pageIndex + 1,
                total: myData.length,
            },
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
 * @function handleShowTotal 处理分页器的显示总数的格式
 */
const handleShowTotal = () => {
    return `总共 ${dataTotal.value} 条`;
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

// 上一次搜索的条件，这里不能使用null，null.property会报错，而{}.property 是 undefined 不会报错
let prevSearchTerms = ref<any>({});

/**
 * @function handleSearch 搜索组件的搜索事件
 * @param _params
 */
const handleSearch = (_params: any) => {
    // 处理需要清空选中行的情况
    handleResetSelectedRows(_params, prevSearchTerms, handleClearSelected);

    // 处理搜索的字段是时间类型的情况
    handleSearchByDate(_params, ['alarmTime']);
    // 处理搜索的字段是故障描述类型的情况
    handleSearchByDescription(_params, tableColumns);
    globParams.value = _params;
};

//查看
const handelDetail = (data: any) => {
    nextTick(() => {
        formRef.value.show(data);
    });
};

/**
 * @function handleExport 导出
 */
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
            sorts: [{ name: 'alarmTime', order: 'desc' }],
        };
    } else {
        // 当全不选时
        _params = {
            paging: false,
            pageSize: dataTotal.value > 10000 ? 10000 : dataTotal.value,
            sorts: [{ name: 'alarmTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }

    const res = await _export(type.value, _params);
    if (res.status === 200) {
        const blob = new Blob([res.data], { type: type.value });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(
            url,
            `设备清洗记录-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            type.value,
        );
        if (
            selectedRowKeys.value.length > 10000 ||
            (selectedRowKeys.value.length == 0 && dataTotal.value > 10000)
        ) {
            onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
        } else {
            onlyMessage(EXPORT_TIPS);
        }
    }
};
</script>

<style lang="less" scoped></style>
