<template>
    <j-spin :spinning="pageLoading">
        <page-container>
            <pro-search :columns="columnsConf" @search="handleSearch" />
            <full-page>
                <j-pro-table
                    ref="tableRef"
                    :columns="columnsConf"
                    :request="queryData"
                    model="table"
                    :params="globParams"
                    :gridColumn="3"
                    :defaultParams="{
                        sorts: [{ name: DEFAULT_ORDER_COLUMN, order: 'desc' }],
                    }"
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
                    <!--      采集模型        -->
                    <template #model="record">
                        {{ record.model ? record.model.text : '--' }}
                    </template>
                    <!--      设备类型        -->
                    <template #deviceType="record">
                        {{ record.deviceType ? record.deviceType.text : '--' }}
                    </template>
                    <!--       离线时间       -->
                    <template #offlineTime="record">
                        {{
                            record.offlineTime
                                ? dayjs(record.offlineTime).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : '--'
                        }}
                    </template>
                    <template #state="{ state }">
                        <template v-if="state">
                            <z-tag :color="getState(state)">
                                {{ state.text }}
                            </z-tag>
                        </template>
                        <template v-else> -- </template>
                    </template>
                    <template #offlineReason="record">
                        {{ record.offlineReason ? record.offlineReason : '--' }}
                    </template>
                    <template #action="record">
                        <a
                            href="javascript: void(0);"
                            @click.prevent="modalEvent.open(record)"
                        >
                            诊断
                        </a>
                    </template>
                    <template #paginationRender>
                        <a-pagination
                            :showQuickJumper="true"
                            :isShowContent="true"
                            :showSizeChanger="true"
                            :pageSize="pageSize"
                            :pageSizeOptions="['12', '24', '48', '96']"
                            :current="currentPage"
                            :total="total"
                            :show-total="handleShowTotal"
                            @change="handlePageChange"
                        />
                    </template>
                </j-pro-table>
            </full-page>

            <diagnose-modal
                v-if="modalVisible"
                :device-id="deviceId"
                :device-type="deviceType"
                :device-state="deviceState"
                :is-xieli-device="deviceIsXieli"
                @update:close="modalEvent.close"
            />
        </page-container>
    </j-spin>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import { columnsConf, mockData } from '@/views/device/OfflineManage/config';
import { useSelectableTable } from '@/hook/useSelectableTable';
import { useProSearch } from '@/hook/useProSearch';
import { downloadFileByUrl } from '@/utils/utils';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';
import {
    EXCEED_EXPORT_TIPS,
    EXPORT_ALL,
    EXPORT_SELECT,
    EXPORT_TIPS,
} from '@/utils/consts';
import PermissionButton from 'components/PermissionButton/index.vue';
import ZTag from '@/views/device/OfflineManage/components/z-tag/index.vue';
import DiagnoseModal from '@/views/device/OfflineManage/components/diagnose/index.vue';
import dayjs from 'dayjs';
import { detail, queryGatewayState } from '@/api/device/instance';
import { useInstanceStore } from 'store/instance';
import {
    checkDevice,
    fetchOfflineDevice,
    offlineDeviceExport,
} from '@/api/device/offlineManage';
import type { ISearchParams } from '@/global';

// 默认排序字段
const DEFAULT_ORDER_COLUMN = 'createTime';

const tableRef = ref();

const globParams = ref<Record<string, any>>({});
const total = ref<number>(0);
const currentPage = ref<number>(1); // 注意a-pagination的索引从1开始
const pageSize = ref<number>(12);
const pageLoading = ref(false);

const type = ref<string>('xlsx');
const dataSource = ref<Record<string, any>[]>([]);

// 解构可选表格相关函数
const {
    selectedRowKeys,
    handleRowSelected,
    handleSelectAll,
    handleClearSelected,
} = useSelectableTable();

// 处理设备诊断的钩子
const instanceStore = useInstanceStore();

const popTitle = computed(() => {
    return selectedRowKeys.value.length === 0 ? EXPORT_ALL : EXPORT_SELECT;
});

/**
 * 处理搜索事件，因为所有查询事件都会调用handleSearch，
 */
// 存储上一次查询的条件
let prevSearchTerms: any = {};
let offlineReasons: string = '';
let isContains = true;

const handleSearch = (_params: any) => {
    // 处理需要清空选中行的情况
    handleResetSelectedRows(_params);
    // 如果搜索条件为离线原因则需要处理offlineReasons,isContains
    handleSearchOfflineReasons(_params);
    globParams.value = _params;
};

/**
 * @function handleResetSelectedRows
 * @description 处理重置和切换搜索条件时，清空选中的行
 * @param params 搜索携带的条件对象
 */
const handleResetSelectedRows = (params: ISearchParams) => {
    // 如果携带搜索条件时
    if (
        params.terms &&
        params.terms.length > 0 &&
        params.terms[0].terms &&
        params.terms[0].terms.length > 0
    ) {
        // 搜索条件是否发生变化
        let termsIsChange = false;
        let terms = params.terms[0].terms[0];

        // 如果上一次的搜索条件与这次的搜索条件不同
        for (const key in terms) {
            if (terms[key] !== prevSearchTerms[key]) {
                termsIsChange = true;
                termsIsChange && handleClearSelected();
                break;
            }
        }

        // 保存上一次的搜索条件
        prevSearchTerms = terms;
    } else {
        // 如果本次未携带搜索条件，但上次搜索条件有值，则这次搜索可能为重置操作或空值搜索，需要清空选中的行
        if (Reflect.ownKeys(prevSearchTerms).length > 0) {
            handleClearSelected();
            prevSearchTerms = {};
            // 重置isContain, offlineReasons
            isContains = true;
            offlineReasons = '';
        }
    }
};

// 处理离线原因搜索
const handleSearchOfflineReasons = (_params: ISearchParams) => {
    if (
        _params.terms.length > 0 &&
        _params.terms[0].terms &&
        _params.terms[0].terms.length > 0 &&
        _params.terms[0].terms[0].column === 'offlineReasons'
    ) {
        const value = _params.terms[0].terms[0].value as string;
        if (_params.terms[0].terms[0].termType === 'nlike') {
            isContains = false;
        }
        // 切除首尾的%符号
        offlineReasons = value.replace(/%/g, '');
    }
    return _params;
};

// 处理分页器的显示总数的格式
const handleShowTotal = () => {
    return `总共 ${total.value} 条`;
};

// 处理网络请求
const queryData = async (_params: ISearchParams) => {
    const resp = await fetchOfflineDevice(_params, offlineReasons, isContains);
    if (resp.status === 200) {
        total.value = resp.result.total;
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

// 获取tag样式
const getState = (status: { text: string; value: string }) => {
    switch (status.value) {
        case 'offline':
            return '#FF3325';
        case 'notActive':
            return '#FF9100';
        default:
            return '#00B87A';
    }
};

// 点击分页器的点击事件
const handlePageChange = (num: number, pageSize: number) => {
    const _params = {
        ...globParams.value,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize,
    };
    handleSearch(_params);
};

// 导出excel事件
const handleExport = async () => {
    let _params: any = {};
    // 当部分选中时
    if (selectedRowKeys.value.length > 0) {
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
        };
    } else {
        _params = {
            paging: false,
            pageSize: total.value > 10000 ? 10000 : total.value,
            terms: globParams.value.terms,
        };
    }

    const res = await offlineDeviceExport(
        type.value,
        _params,
        offlineReasons,
        isContains,
    );
    if (res.status === 200) {
        const blob = new Blob([res.data], { type: type.value });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(
            url,
            `离线设备数据-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            type.value,
        );
        if (
            selectedRowKeys.value?.length > 10000 ||
            (selectedRowKeys.value?.length == 0 && total.value > 10000)
        ) {
            onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
        } else {
            onlyMessage(EXPORT_TIPS);
        }
    }
};

/**
 * 处理modal框的相关逻辑
 */
// modal框是否显示
const modalVisible = ref<boolean>(false);
// 设备信息
const deviceId = ref<string>('');
const deviceState = ref<string>('');
const deviceType = ref<string>('');
const deviceIsXieli = ref<boolean>(false);

// modal框事件
const modalEvent = {
    open: async (record: Record<string, any>) => {
        pageLoading.value = true;
        // 处理传递给modal框的值
        deviceId.value = record.id;
        deviceState.value = record.state.value;
        let accessId = '';
        const results = await Promise.allSettled([
            checkDevice(record.id),
            detail(record.id),
        ]);
        // 判断是否有请求异常
        if (results.some((item) => item.status === 'rejected')) {
            onlyMessage('网络异常，请再试一次!', 'error');
            pageLoading.value = false;
        } else {
            const res = (results[1] as PromiseFulfilledResult<any>).value
                .result;
            // 将数据暂存到store中，用于status组件
            instanceStore.current = res;
            // 判断accessId是否为空
            if (!res.accessId) {
                onlyMessage('accessId缺失!', 'error');
                pageLoading.value = false;
                return;
            } else {
                accessId = res.accessId;
            }
            // 判断是否为协力设备
            deviceIsXieli.value = (
                results[0] as PromiseFulfilledResult<any>
            ).value.result;

            // 获取设备类型，用于status组件
            const accessResp = await queryGatewayState(accessId);
            if (accessResp.status === 200) {
                const res = accessResp.result as any;
                if (res.provider) {
                    const provider = handleProvider(res.provider);
                    if (provider === 'channel') {
                        onlyMessage('暂不能诊断该类型设备', 'error');
                        pageLoading.value = false;
                        return;
                    }
                    deviceType.value = provider;
                }
            }
            // 显示modal框
            modalVisible.value = true;
            pageLoading.value = false;
        }
    },
    close() {
        modalVisible.value = false;
    },
};

// 获取设备分类
const handleProvider = (provider: string) => {
    if (provider === 'fixed-media' || provider === 'gb28181-2016') {
        provider = 'media';
    } else if (provider === 'OneNet' || provider === 'Ctwing') {
        provider = 'cloud';
    } else if (provider === 'modbus-tcp' || provider === 'opc-ua') {
        provider = 'channel';
    } else if (provider === 'child-device') {
        provider = 'child-device';
    } else {
        provider = 'network';
    }
    return provider;
};

onMounted(() => {
    // 清空store避免切换到设备实例页面时数据未清空
    instanceStore.current = {} as any;
});
</script>

<style scoped lang="less">
.loading {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 9999;
    cursor: wait;

    background-color: fade(#000, 45%);
    backdrop-filter: blur(2px);
    .wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;
        .ant-btn {
            color: #f84914;
        }
    }
}
</style>
