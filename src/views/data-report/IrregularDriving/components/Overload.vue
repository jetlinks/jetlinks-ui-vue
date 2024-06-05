<template>
    <div>
        <pro-search
            :columns="columns"
            target="overload-target"
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
                <template #duration="{ duration }">
                    {{ formatMillisecondsToHourMinute(duration) }}
                </template>
                <template #overLoadInfoLoadRating="{ overLoadInfoLoadRating }">
                    {{ `${overLoadInfoLoadRating}t` }}
                </template>
                <template
                    #overLoadInfoOverloadValue="{ overLoadInfoOverloadValue }"
                >
                    {{ `${overLoadInfoOverloadValue}t` }}
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
                        :show-total="handleShowTotal"
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
    queryOverLoad,
    overLoadExport,
} from '@/api/data-report/IrregularDriving';
import { useSelect } from '@/utils/hooks/useSelect';

const { state, selectedRowChange, handleRowSelected, handleSelectAll } =
    useSelect();
import moment from 'moment';
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';
import { onlyMessage } from '@/utils/comm';

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

const configRef = ref<Record<string, any>>({});

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await queryOverLoad(_params);
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

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return state.selectedRowKeys.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

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
            _params.terms[0]?.terms[0].column === 'duration'
        ) {
            const duration = _params.terms[0]?.terms[0].value;
            const temp = duration * 60000;

            _params.terms[0].terms[0].value = temp;
        }
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

const type = ref<string>('xlsx');

const formatMillisecondsToHourMinute = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    if (
        typeof milliseconds === 'number' &&
        isFinite(milliseconds) &&
        milliseconds > 0
    ) {
        return hours > 0
            ? `${
                  hours > 10
                      ? hours.toString().padStart(2, '0')
                      : hours.toString().padStart(1, '0')
              }小时${
                  minutes > 9
                      ? minutes.toString().padStart(2, '0')
                      : minutes.toString().padStart(1, '0')
              }分`
            : `${
                  minutes > 9
                      ? minutes.toString().padStart(2, '0')
                      : minutes.toString().padStart(1, '0')
              }分`;
    } else {
        return '0分';
    }
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
            sorts: [{ name: 'reportTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }

    // 注意这里的请求函数要更换为当前页面的请求函数，以及下方导出的文件名
    overLoadExport(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `超载异常数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
            if (
                state.selectedRowKeys?.length > 10000 ||
                (state.selectedRowKeys?.length === 0 && dataTotal.value > 10000)
            ) {
                onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
            } else {
                onlyMessage(EXPORT_TIPS);
            }
        }
    });
};

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
    handleSearchDate(param);
    globParams.value = param;
};

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
        search: {
            type: 'string',
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
        title: '载荷',
        dataIndex: 'overLoadInfoLoadRating',
        key: 'overLoadInfoLoadRating',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '当前实际吊重',
        dataIndex: 'overLoadInfoOverloadValue',
        key: 'overLoadInfoOverloadValue',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '持续时间',
        dataIndex: 'duration',
        key: 'duration',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'number',
            componentProps: {
                placeholder: '默认持续时间单位为分钟',
            },
        },
    },
];
</script>

<style lang="less" scoped></style>
