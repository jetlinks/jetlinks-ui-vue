<template>
    <page-container>
        <pro-search :columns="columns" @search="handleSearch" />
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
                :gridColumn="3"
                :rowKey="(record: any) => record.id"
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
                <template #operatorName="{ operatorName }">
                    {{ handleOperatorName(operatorName) }}
                </template>
                <template #cardType="{ cardType }">
                    {{ cardType ? handleCardType(cardType.value) : '--' }}
                </template>
                <template #deviceId="{ deviceId }">
                    {{ deviceId || '--' }}
                </template>
                <template #totalFlow="{ totalFlow }">
                    {{ formatFlow(totalFlow) }}
                </template>
                <template #usedFlow="{ usedFlow }">
                    {{ formatFlow(usedFlow) }}
                </template>
                <template #residualFlow="{ residualFlow }">
                    {{ formatFlow(residualFlow) }}
                </template>
                <!-- 激活日期插槽 -->
                <template #activationDate="{ activationDate }">
                    {{
                        activationDate
                            ? dayjs(activationDate).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : '--'
                    }}
                </template>
                <!-- 更新时间插槽 -->
                <template #updateTime="{ updateTime }">
                    {{
                        updateTime
                            ? dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
                            : '--'
                    }}
                </template>
                <template #cardStateType="{ cardStateType }">
                    <state-tag
                        :text="cardStateType.text"
                        :type="handleTagType(cardStateType.value)"
                    />
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
import { querySim, simDataExport } from '@/api/data-report/sim';
import { downloadFileByUrl } from '@/utils/utils';
import StateTag from '@/views/data-report/SimCenter/components/StateTag.vue';
import dayjs from 'dayjs';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';
import { columns } from './columnConfig';
import {
    handleCardType,
    handleTagType,
    handleOperatorName,
    formatFlow,
} from './handleDataUtils';

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

// 每次请求后的数据
const dataSource = ref<any[]>([]);

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return state.selectedRowKeys.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await querySim(_params);
    if (resp.status === 200) {
        dataTotal.value = resp.result.total;
        currentPage.value = resp.result.pageIndex + 1;
        pageSize.value = resp.result.pageSize;
        dataSource.value = resp.result.data;
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
        ...globParams.value,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    handleSearch(_params);
};

/**
 * @function handleSearchDate 处理搜索条件为时间格式的情况，如果时间为大于等于或小于等于，则需要将时间戳转换为毫秒
 * @param _params
 */
const handleSearchDate = (_params: any) => {
    // 判断是否存在terms
    if (_params.terms && _params.terms.length > 0) {
        // 判断时间是否已经格式化，避免通过分页器触发的是否再次处理时间戳引发错误
        if (
            _params.terms[0]?.terms &&
            _params.terms[0]?.terms[0].value !== 'number'
        )
            if (_params.terms[0]?.terms[0].termType === 'lte') {
                // 时间为小于等于
                const date = _params.terms[0]?.terms[0].value;
                let timeStamp: string | number = dayjs(date).unix();
                timeStamp = Number(String(timeStamp) + '999');
                _params.terms[0].terms[0].value = timeStamp;
                // 时间为大于等于
            } else if (_params.terms[0]?.terms[0].termType === 'gte') {
                const date = _params.terms[0]?.terms[0].value;
                let timeStamp: string | number = dayjs(date).unix();
                timeStamp = Number(String(timeStamp) + '000');
                _params.terms[0].terms[0].value = timeStamp;
            }
        // 其他小于和大于未做处理，因为后端能够直接处理
    }
};

/**
 * @function handleSearch 搜索组件的搜索事件
 * @param _params
 */
const handleSearch = (_params: any) => {
    if (_params.terms && _params.terms.length > 0) state.selectedRowKeys = [];
    handleSearchDate(_params);
    globParams.value = _params;
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
    simDataExport(type.value, _params).then((res: any) => {
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

// 当前分页表格选中的数据项的id
const state = reactive<{ selectedRowKeys: string[] }>({
    selectedRowKeys: [],
});

/**
 * @function selectedRowChange table组件的rowSelection的onChange事件
 * @param selectedRowKeys
 * @param selectedRows
 */
const selectedRowChange = (selectedRowKeys: string[], selectedRows?: any) => {
    if (selectedRowKeys.length === 0 || selectedRows.length === 0) {
        state.selectedRowKeys = [];
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
        index === -1 && state.selectedRowKeys.push(record.id);
    } else {
        const index = state.selectedRowKeys.findIndex(
            (item) => item === record.id,
        );
        index !== -1 && state.selectedRowKeys.splice(index, 1);
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
            flag && state.selectedRowKeys.push(changeRows[i].id);
        }
    } else {
        for (let i = 0; i < changeRows.length; i++) {
            const index = state.selectedRowKeys.findIndex(
                (item) => item === changeRows[i].id,
            );
            index !== -1 && state.selectedRowKeys.splice(index, 1);
        }
    }
};
</script>

<style lang="less" scoped></style>
