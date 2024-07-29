<template>
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
                        @change="handleOnChange"
                    />
                </template>
            </j-pro-table>
        </full-page>
        <diagnose-modal
            v-if="modalVisible"
            :device-id="deviceId"
            :device-type="deviceType"
            :device-state="deviceState"
            @update:close="modalEvent.close"
        />
        <div class="loading" v-if="pageLoading">
            <div class="wrapper">
                <a-button type="text" text loading size="large">
                    加载中...
                </a-button>
            </div>
        </div>
    </page-container>
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

const tableRef = ref();

const globParams = ref<Record<string, any>>({});
const total = ref<number>(0);
const currentPage = ref<number>(1);
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

// 解构搜索函数
const { handleSearch } = useProSearch(globParams, handleClearSelected, [
    'offlineTime',
]);

const instanceStore = useInstanceStore();

//
const popTitle = computed(() => {
    return selectedRowKeys.value.length === 0 ? EXPORT_ALL : EXPORT_SELECT;
});

// 处理分页器的显示总数的格式
const handleShowTotal = () => {
    return `总共 ${total.value} 条`;
};

// 处理网络请求
const queryData = async () => {
    total.value = mockData.result.data.length;
    return mockData;
};

// 获取tag样式
const getState = (status: { text: string; value: string }) => {
    switch (status.value) {
        case 'offline':
            return '#FF3325';
        case 'warning':
            return '#FF9100';
        default:
            return '#00B87A';
    }
};

// 点击分页器的点击事件
const handleOnChange = (num: number, pageSize: number) => {
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
            sorts: [{ name: 'createTime', order: 'desc' }],
        };
    } else {
        _params = {
            paging: false,
            pageSize: total.value > 10000 ? 10000 : total.value,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
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
const modalEvent = {
    open: async (record: Record<string, any>) => {
        pageLoading.value = true;
        // 处理传递给modal框的值
        deviceId.value = record.id;
        deviceState.value = record.state.value;
        const deviceResp = await detail(record.id);
        let accessId = '';
        if (deviceResp.status === 200) {
            const res = deviceResp.result;

            instanceStore.current = res;
            console.log('instanceStore.current', toRaw(instanceStore.current));

            if (!res.accessId) {
                onlyMessage('accessId缺失', 'error');
                pageLoading.value = false;
                return;
            } else {
                accessId = res.accessId;
            }
        }
        const accessResp = await queryGatewayState(accessId);
        if (accessResp.status === 200) {
            const res = accessResp.result as any;
            if (res.provider) {
                const provider = handleProvider(res.provider);
                if (provider === 'channel') {
                    onlyMessage('暂不能处理该类型设备', 'error');
                    return;
                }
                deviceType.value = provider;
            }
        }
        // 显示modal框
        modalVisible.value = true;
        pageLoading.value = false;
    },
    close() {
        modalVisible.value = false;
    },
};

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
    instanceStore.current = {};
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
