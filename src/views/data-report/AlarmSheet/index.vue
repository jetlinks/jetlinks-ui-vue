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
                :params="globParams"
                :gridColumn="3"
                :row-selection="rowSelection"
                :pagination="false"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton :popConfirm="popTitle">
                            <AIcon type="ExportOutlined" />
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <!-- 所属组织 -->
                <template #orgName="{ orgName }">
                    {{ orgName || '' }}
                </template>
                <!-- 告警时间 -->
                <template #alarmTime="{ alarmTime }">
                    {{ dayjs(alarmTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template #paginationRender="{ paginationRender }">
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
    </page-container>
</template>

<script setup lang="ts">
import { downloadFileByUrl } from '@/utils/utils';
import { _export } from '@/api/data-report/alarmSheet';
import moment from 'moment';
import { queryAlarmData } from '@/api/data-report/alarmSheet';
import { useFilterAlarmDesc } from '@/hook/useFilterAlarmDesc';
import { FullPage } from 'components/Layout';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { columns } from './columnConfig';
import ThirdMenu from '@/views/system/Apply/componenets/ThirdMenu.vue';

const configRef = ref<Record<string, any>>({});
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

// 选中的数据的id
const selectIds = ref<Array<number | string>>([]);
// 导出文件的类型
const type = ref<string>('xlsx');

// 生成请求函数
const queryDataFn = useFilterAlarmDesc(queryAlarmData, 'alarmTime');

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp = await queryDataFn(_params);
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
        ...globParams,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    handleSearch(_params);
};

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    if (dataTotal.value > 10000) {
        return '系统最大导数为10,000，当前数据已超过10,000，请按条件筛选后导出！';
    }
    return selectIds.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

/**
 * 搜索
 * @param _params
 */
const handleSearch = (_params: any) => {
    globParams.value = _params;
};

/**
 * @function handleExport 导出
 */
const handleExport = async () => {
    let _params: any = {};
    if (selectIds.value?.length > 0) {
        _params = {
            terms: [
                {
                    column: 'id',
                    value: selectIds.value,
                    termType: 'in',
                },
            ],
        };
    } else {
        // 当全不选时，为导出接口添加筛选条件
        if (globParams.value.terms.length > 0) {
            _params.terms = [globParams.value.terms[0]?.terms[0]];
        } else {
            _params.terms = [];
        }
    }

    // 注意这里的请求函数要更换为当前页面的请求函数，以及下方导出的文件名
    _export(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `sim卡数据-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
                type.value,
            );
        }
    });
};

/**
 * 选中行
 */
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        selectIds.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {},
};
</script>

<style lang="less" scoped></style>
