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
                        <PermissionButton type="primary" @click="funSpeed">
                            限速
                        </PermissionButton>
                        <PermissionButton type="primary" @click="funAlarm">
                            报警速度
                        </PermissionButton>
                        <PermissionButton type="primary" @click="funRemoteLock">
                            远程锁车
                        </PermissionButton>
                        <PermissionButton
                            type="primary"
                            @click="funRemoteUnlock"
                        >
                            远程解锁
                        </PermissionButton>
                        <PermissionButton type="primary" @click="funCollision">
                            碰撞阈值
                        </PermissionButton>
                        <PermissionButton type="primary" @click="funOverload">
                            超载阈值
                        </PermissionButton>
                        <PermissionButton
                            type="primary"
                            @click="funSpeedCalibration"
                        >
                            车速校准
                        </PermissionButton>
                        <PermissionButton
                            type="primary"
                            @click="funWeighCalibration"
                        >
                            称重校准
                        </PermissionButton>
                    </j-space>
                </template>
                <template #vehicleTypeEnum="{ vehicleTypeEnum }">
                    {{ valueMapping2VehicleType(vehicleTypeEnum) }}
                </template>
                <!-- 所属组织 -->
                <template #orgName="{ orgName }">
                    {{ orgName || '--' }}
                </template>
                <template #status="slotProps">
                    <BadgeStatus
                        :text="
                            slotProps.status === 0
                                ? '在线'
                                : slotProps.status === 1
                                ? '离线'
                                : '禁用'
                        "
                        :status="slotProps.status"
                        :statusNames="{
                            0: 'processing',
                            1: 'error',
                            2: 'warning',
                        }"
                    />
                </template>
                <template #maximumSpeedLimit="slotProps">
                    <PermissionButton
                        type="link"
                        :key="slotProps.id"
                        @click="funSpeed(slotProps)"
                    >
                        <span>{{ slotProps.maximumSpeedLimit || 0 }} km/h</span>
                    </PermissionButton>
                </template>
                <template #alarmSpeed="slotProps">
                    <PermissionButton
                        type="link"
                        :key="slotProps.id"
                        @click="funAlarm(slotProps)"
                    >
                        <span>{{ slotProps.alarmSpeed || 0 }} km/h</span>
                    </PermissionButton>
                </template>
                <template #remoteLock="{ remoteLock }">
                    <a> {{ remoteLock === 0 ? '锁车' : '解锁' }} </a>
                </template>
                <template #collision="slotProps">
                    <PermissionButton
                        type="link"
                        :key="slotProps.id"
                        @click="funCollision(slotProps)"
                    >
                        <span>{{ slotProps.collision || 0 }} kg</span>
                    </PermissionButton>
                </template>
                <template #overload="{ overload }">
                    <a> {{ overload || 0 }} t</a>
                </template>
                <template #vehicleSpeed="slotProps">
                    <a>校准</a>
                </template>
                <template #weighingCalibration="slotProps">
                    <a>校准</a>
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
        <AlarmModal ref="alarmRef" />
        <MaxSpeedModal ref="maxSpeedRef" />
        <CollisionModal ref="collisionRef" />
    </page-container>
</template>

<script setup lang="ts">
import { downloadFileByUrl } from '@/utils/utils';
import moment from 'moment';
import { queryAlarmData, _export } from '@/api/data-report/alarmSheet';
import { useFilterAlarmDesc } from '@/hook/useFilterAlarmDesc';
import { FullPage } from 'components/Layout';
import { onlyMessage } from '@/utils/comm';
import { columns, data } from './columnConfig';
import {
    formatDate,
    handleResetSelectedRows,
    handleSearchByDate,
    handleSearchByDescription,
} from '@/utils/dataReportUtils';
import { useSelectableTable } from '@/hook/useSelectableTable';
import PermissionButton from '@/components/PermissionButton/index.vue';
import AlarmModal from './AlarmModal/index.vue';
import MaxSpeedModal from './MaxSpeedModal/index.vue';
import CollisionModal from './CollisionModal/index.vue';

const alarmRef = ref();
const maxSpeedRef = ref();
const collisionRef = ref();
const currentForm = ref({});

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

// 字典列表
const dicMap = ref<Record<string, any>>({});

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

const { queryDataFactory, valueMapping2VehicleType } = useFilterAlarmDesc(
    dicMap,
    ['aa', 'bb', 'cc'],
);
// 生成请求函数
const queryDataFn = queryDataFactory(queryAlarmData, 'alarmTime');

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp = await queryDataFn(_params);
    if (resp.status === 200) {
        dataTotal.value = data.length || 0;
        currentPage.value = 0;
        pageSize.value = 12;
        return {
            code: resp.status,
            result: {
                pageIndex: 0,
                pageSize: pageSize.value || 0,
                dataTotal: data.length || 0,
                data: data,
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
//限速
const funSpeed = (data?: any) => {
    console.log('限速');
    if (data) {
        nextTick(() => {
            maxSpeedRef.value.show(data);
        });
    } else {
        nextTick(() => {
            maxSpeedRef.value.show(currentForm.value);
        });
    }
};
//报警速度
const funAlarm = (data?: any) => {
    console.log('报警速度');
    if (data) {
        nextTick(() => {
            alarmRef.value.show(data);
        });
    } else {
        nextTick(() => {
            alarmRef.value.show(currentForm.value);
        });
    }
};
//远程锁车
const funRemoteLock = () => {
    console.log('远程锁车');
};
//远程解锁
const funRemoteUnlock = () => {
    console.log('远程解锁');
};
//碰撞阈值
const funCollision = (data?: any) => {
    console.log('碰撞阈值');
    if (data) {
        nextTick(() => {
            collisionRef.value.show(data);
        });
    } else {
        nextTick(() => {
            collisionRef.value.show(currentForm.value);
        });
    }
};
//超载阈值
const funOverload = () => {
    console.log('超载阈值');
};
//车速校准
const funSpeedCalibration = () => {
    console.log('车速校准');
};
//称重校准
const funWeighCalibration = () => {
    console.log('称重校准');
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
    handleSearchByDescription(_params);
    globParams.value = _params;
};
</script>

<style scoped></style>
