<template>
    <div class="detail">
        <DetailsTitle :title="'车辆概况'">
            <Title
                :data="vehicleData"
                :deviceData="dataAss"
                :vehicleMileage="vehicleMileage"
            />
        </DetailsTitle>

        <div class="table above">
            <DetailsTitle :title="'在线离线表'">
                <j-table
                    :columns="columns"
                    model="table"
                    :data-source="data"
                    :pagination="pagination"
                    :scroll="{ y: 246 }"
                >
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.dataIndex === 'timestamp'">
                            {{
                                dayjs(Number(text)).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                )
                            }}
                        </template>
                    </template>
                </j-table>
            </DetailsTitle>
        </div>
        <div class="table middle">
            <DetailsTitle :title="'工作效率表'">
                <j-table
                    :columns="columnsWork"
                    model="table"
                    :data-source="dataWork"
                    :pagination="paginationWork"
                    :scroll="{ y: 246 }"
                >
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.dataIndex === 'startTime'">
                            {{
                                dayjs(Number(text)).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                )
                            }}
                        </template>
                        <template v-if="column.dataIndex === 'endTime'">
                            {{
                                dayjs(Number(text)).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                )
                            }}
                        </template>
                        <template v-if="column.dataIndex === 'workEfficiency'">
                            {{
                                `${
                                    Number(text) > 0
                                        ? Number(text).toFixed(2)
                                        : 0
                                }%`
                            }}
                        </template>
                        <template v-if="column.dataIndex === 'operationTime'">
                            {{ formatMillisecondsToHourMinute(Number(text)) }}
                        </template>
                    </template>
                </j-table>
            </DetailsTitle>
        </div>
        <!-- <div class="table content">
            <div class="table-title">当前关联的设备</div>
            <j-table
                ref="configRef"
                :columns="columnsAss"
                model="table"
                :data-source="dataAss"
                :scroll="{ y: 246 }"
                :pagination="paginationAss"
            >
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'state'">
                        <button
                            v-if="record.state.value === 'offline'"
                            style="
                                height: 24px;
                                padding: 3px 8px 3px 8px;
                                border-radius: 3px;
                                background: #f99d311a;
                                color: #f99d31;
                                border: 1px solid #f99d3199;
                                font-size: 14px;
                                font-weight: 400;
                                line-height: 18px;
                            "
                        >
                            离线
                        </button>
                        <button
                            v-else-if="record.state.value === 'notActive'"
                            style="
                                height: 24px;
                                padding: 3px 8px 3px 8px;
                                border-radius: 3px;
                                background: rgba(229, 0, 18, 0.1);
                                color: rgba(229, 0, 18, 1);
                                border: 1px solid rgba(229, 0, 18, 1);
                                font-weight: 400;
                                line-height: 18px;
                            "
                        >
                            禁用
                        </button>
                        <button
                            v-else
                            style="
                                height: 24px;
                                padding: 3px 8px 3px 8px;
                                border-radius: 3px;
                                background: #0fce8c1a;
                                color: #0fce8c;
                                border: 1px solid #0fce8c99;
                                font-size: 14px;
                                font-weight: 400;
                                line-height: 18px;
                            "
                        >
                            在线
                        </button>
                    </template>
                </template>
            </j-table>
        </div> -->
        <div class="table footer">
            <DetailsTitle :title="'行驶记录明细'">
                <j-table
                    :columns="columnsRecord"
                    model="table"
                    :data-source="dataRecord"
                    :pagination="paginationRecord"
                >
                    <template #bodyCell="{ column, text }">
                        <template v-if="column.dataIndex === 'shutStartMilli'">
                            {{
                                text
                                    ? dayjs(Number(text)).format(
                                          'YYYY-MM-DD HH:mm:ss',
                                      )
                                    : ''
                            }}
                        </template>
                        <template v-if="column.dataIndex === 'shutDownMilli'">
                            {{
                                text
                                    ? dayjs(Number(text)).format(
                                          'YYYY-MM-DD HH:mm:ss',
                                      )
                                    : ''
                            }}
                        </template>
                        <template v-if="column.dataIndex === 'drivingTime'">
                            {{ formatMillisecondsToHourMinute(Number(text)) }}
                        </template>
                        <template v-if="column.dataIndex === 'drivenDistance'">
                            {{ `${text}km` }}
                        </template>
                    </template>
                </j-table>
            </DetailsTitle>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {
    queryVehicleById,
    queryVehicleEquipmentList,
    queryVehicleTravelList,
    queryVehicleWorkList,
    queryVehicleStatusList,
    getVehicleMileage,
} from '@/api/data-report/vehicleReport';
import dayjs from 'dayjs';
import DetailsTitle from '../components/detailsTitle.vue';
import Title from './Title/index.vue';

const route = useRoute();
const vehicleData = ref();
const data = ref<DataItem[]>([]);
const dataWork = ref<any>([]);
const dataAss = ref<DataItemAss[]>([]);
const dataRecord = ref<any>([]);
const vehicleMileage = ref<any>();

const formatMillisecondsToHourMinute = (milliseconds: number) => {
    if (milliseconds < 0) {
        return '0分';
    }

    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);

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
};

interface DataItem {
    key: number;
    type: string;
    date: string;
    position: string;
}

interface DataItemAss {
    key: number;
    id: string;
    name: string;
    productName: string;
    state: boolean;
    efficiency: string;
}

const columns = [
    {
        title: '类型',
        dataIndex: 'status',
        key: 'status',
        ellipsis: true,
    },
    {
        title: '日期',
        dataIndex: 'timestamp',
        key: 'timestamp',
        scopedSlots: true,
    },
    {
        title: '车辆位置',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
    },
];

const columnsWork = [
    {
        title: '开机时间',
        dataIndex: 'startTime',
        key: 'startTime',
        ellipsis: true,
    },
    {
        title: '熄火时间',
        dataIndex: 'endTime',
        key: 'endTime',
        ellipsis: true,
    },
    {
        title: '工作时长',
        dataIndex: 'operationTime',
        key: 'operationTime',
        ellipsis: true,
    },
    {
        title: '工作效率',
        dataIndex: 'workEfficiency',
        key: 'workEfficiency',
        ellipsis: true,
    },
];

// const columnsAss = [
//     {
//         title: 'ID',
//         dataIndex: 'deviceId',
//         key: 'deviceId',
//         ellipsis: true,
//     },
//     {
//         title: '设备名称',
//         dataIndex: 'name',
//         key: 'name',
//         ellipsis: true,
//     },
//     {
//         title: '所属物模型',
//         dataIndex: 'productName',
//         key: 'productName',
//         ellipsis: true,
//     },
//     {
//         title: '状态',
//         dataIndex: 'state',
//         key: 'state',
//         ellipsis: true,
//     },
// ];

const columnsRecord = [
    {
        title: '开始驾驶时间',
        dataIndex: 'shutStartMilli',
        key: 'shutStartMilli',
        width: 200,
        ellipsis: true,
    },
    {
        title: '结束驾驶时间',
        dataIndex: 'shutDownMilli',
        key: 'shutDownMilli',
        width: 200,
        ellipsis: true,
    },
    {
        title: '行驶时长',
        dataIndex: 'drivingTime',
        key: 'drivingTime',
        ellipsis: true,
    },
    {
        title: '行驶里程',
        dataIndex: 'drivenDistance',
        key: 'drivenDistance',
        ellipsis: true,
    },
    {
        title: '起点位置',
        dataIndex: 'startAddress',
        key: 'startAddress',
        ellipsis: true,
    },
    {
        title: '终点位置',
        dataIndex: 'endAddress',
        key: 'endAddress',
        ellipsis: true,
    },
    {
        title: '报警次数',
        dataIndex: 'count',
        key: 'count',
        ellipsis: true,
    },
];

const pagination = {
    showTotal: (num: number, range: number[]) => {
        return `总共 ${num} 条`;
    },
    defaultPageSize: 4,
    total: data?.value.length,
    pageSizeOptions: ['4', '10', '20', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    size: 'small',
};

const paginationWork = {
    showTotal: (num: number, range: number[]) => {
        return `总共 ${num} 条`;
    },
    defaultPageSize: 4,
    total: dataWork.value?.length,
    pageSizeOptions: ['4', '10', '20', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    size: 'small',
};

// const paginationAss = {
//     showTotal: (num: number, range: number[]) => {
//         return `总共 ${num} 条`;
//     },
//     defaultPageSize: 4,
//     total: dataAss.value?.length,
//     pageSizeOptions: ['4', '10', '20', '50', '100'],
//     showQuickJumper: true,
//     showSizeChanger: true,
//     size: 'small',
// };

const getDetailFn = async () => {
    const _id = route.params?.id as string;
    const res = await queryVehicleById(_id);
    if (res.status == 200) {
        vehicleData.value = res.result;
    }
};

// 获取当前关联设备信息
const queryDevice = async () => {
    const _id = route.params?.id as string;
    const params = {
        terms: [
            {
                column: 'vehicleId',
                value: `${_id}`,
                termType: 'eq',
            },
        ],

        paging: false,
    };
    const res = await queryVehicleEquipmentList(params);
    if (res.status == 200) {
        dataAss.value = res.result.data;
    }
};

//获取车辆里程
const getMileage = async () => {
    const _deviceId: any = route.query?.deviceId;
    const res: any = await getVehicleMileage(_deviceId);
    if (res.status == 200) {
        vehicleMileage.value = res.result.mileage;
    }
};
//获取行驶记录数据
const queryDataRecord = async () => {
    const _deviceId: any = route.query?.deviceId;

    const defaultParams = {
        terms: [
            {
                column: 'deviceId',
                value: _deviceId,
                termType: 'eq',
            },
        ],
        paging: false,
        sorts: [{ name: 'shutStartMilli', order: 'desc' }],
    };
    const res: any = await queryVehicleTravelList({ ...defaultParams });
    if (res.status == 200) {
        dataRecord.value = res.result.data;
    }
};
//获取工作效率数据
const queryDataWork = async () => {
    const _id = route.params?.id as string;
    const defaultParams = {
        terms: [
            {
                column: 'vehicleId',
                value: `${_id}`,
                termType: 'eq',
            },
        ],
        paging: false,
        sorts: [{ name: 'startTime', order: 'desc' }],
    };
    const res: any = await queryVehicleWorkList({ ...defaultParams });
    if (res.status == 200) {
        dataWork.value = res.result.data;
    }
};
//获取在线离线数据
const queryVehicleStatus = async () => {
    const _deviceId: any = route.query?.deviceId;
    const defaultParams = {
        terms: [
            {
                column: 'deviceId',
                value: _deviceId,
                termType: 'eq',
            },
        ],
        paging: false,
        sorts: [{ name: 'timestamp', order: 'desc' }],
    };
    const res: any = await queryVehicleStatusList({ ...defaultParams });
    if (res.status == 200) {
        data.value = res.result.data;
    }
};

const paginationRecord = {
    showTotal: (num: number, range: number[]) => {
        return `总共 ${num} 条`;
    },
    defaultPageSize: 4,
    total: dataRecord.value?.length,
    pageSizeOptions: ['4', '10', '20', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    size: 'small',
};

onMounted(() => {
    getDetailFn();
    queryDevice();
    queryVehicleStatus();
    queryDataWork();
    queryDataRecord();
    getMileage();
});
</script>
<style lang="less" scoped>
.detail {
    width: 100%;
    height: 100%;
    position: relative;

    .table {
        height: 393px;
        padding: 16px;
        margin-top: 10px;
        background: #ffffff;
        border-radius: 4px;

        .table-title {
            font-size: 18px;
            font-weight: 500;
            line-height: 21px;
            color: #191c27;
        }

        .ant-table-wrapper {
            padding-top: 10px;
        }

        &.footer {
            margin-bottom: 16px;
        }
    }

    .title {
        height: 164px;
        display: flex;
        flex-direction: row;

        .title-left {
            width: 132px;
            height: 132px;
            border: 1px solid #e7e9ef;
            display: flex;
            justify-content: center;
            text-align: center;

            img {
                display: inline-block;
                width: 118.8px;
                height: 94.05px;
                margin-top: 18.98px;
                margin-left: 6.6px;
            }
        }

        .title-right {
            width: 100%;
            height: 132px;
            margin-left: 15px;

            .title-type {
                height: 20px;
                display: flex;
                flex-direction: row;

                .type-list {
                    margin-left: 28px;
                }
            }
        }
    }
    :deep(.ant-table-body) {
        overflow-y: auto !important;
    }
}
</style>
