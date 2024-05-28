<template>
    <page-container :showBack="true">
        <div class="detail">
            <Title :data="vehicleData" />
            <div class="table above">
                <detailList
                    :title="'在线离线表'"
                    :columns="columns"
                    :data="data"
                    :pagination="pagination"
                    :scroll="{ y: 246 }"
                />
            </div>
            <div class="table middle">
                <detailList
                    :title="'工作效率表'"
                    :columns="columnsWork"
                    :data="dataWork"
                    :pagination="paginationWork"
                    :scroll="{ y: 246 }"
                />
            </div>
            <div class="table content">
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
                                v-if="record.state === true"
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
            </div>
            <div class="table footer">
                <detailList
                    :title="'行驶记录明细'"
                    :columns="columnsRecord"
                    :data="dataRecord"
                    :pagination="paginationRecord"
                    :scroll="{ y: 246 }"
                />
            </div>
        </div>
    </page-container>
</template>
<script lang="ts" setup>
import {
    queryVehicleById,
    queryVehicleEquipment,
} from '@/api/data-report/vehicleReport';
import Title from './Title/index.vue';
import detailList from '../components/detailsList.vue';

const route = useRoute();

const vehicleData = ref();

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
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
    },
    {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        ellipsis: true,
    },
    {
        title: '车辆位置',
        dataIndex: 'position',
        key: 'position',
        ellipsis: true,
    },
];

const columnsWork = [
    {
        title: '开机时间',
        dataIndex: 'startUpTime',
        key: 'startUpTime',
        ellipsis: true,
    },
    {
        title: '熄火时间',
        dataIndex: 'flameoutTime',
        key: 'flameoutTime',
        ellipsis: true,
    },
    {
        title: '工作时长',
        dataIndex: 'workTime',
        key: 'workTime',
        ellipsis: true,
    },
    {
        title: '工作效率',
        dataIndex: 'workEff',
        key: 'workEff',
        ellipsis: true,
    },
];

const columnsAss = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
    },
];

const columnsRecord = [
    {
        title: '开始驾驶时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 200,
        ellipsis: true,
    },
    {
        title: '结束驾驶时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 200,
        ellipsis: true,
    },
    {
        title: '行驶时长',
        dataIndex: 'travelTime',
        key: 'travelTime',
        ellipsis: true,
    },
    {
        title: '行驶里程',
        dataIndex: 'travel',
        key: 'travel',
        ellipsis: true,
    },
    {
        title: '起点位置',
        dataIndex: 'startPosition',
        key: 'startPosition',
        ellipsis: true,
    },
    {
        title: '终点位置',
        dataIndex: 'endPosition',
        key: 'endPosition',
        ellipsis: true,
    },
    {
        title: '报警次数',
        dataIndex: 'alarmNumber',
        key: 'alarmNumber',
        ellipsis: true,
    },
];

const data: DataItem[] = [];
for (let i = 0; i < 100; i++) {
    data.push({
        key: i,
        type: `type ${i}`,
        date: `2024-05-23 09:00:00`,
        position: `重庆市 no. ${i}`,
    });
}

const dataWork = ref<any>([]);
for (let i = 0; i < 100; i++) {
    dataWork.value.push({
        startUpTime: '2024-05-23 09:00:00',
        flameoutTime: `2024-05-23 10:${i % 6 === 0 ? '20' : '00'}:00`,
        workTime: `${i % 6 === 0 ? '1小时20分钟' : '1小时'}`,
        workEff: '80%',
    });
}

const dataAss: DataItemAss[] = [];
for (let i = 0; i < 50; i++) {
    dataAss.push({
        key: i,
        id: '111222',
        name: `设备${i}`,
        productName: i % 2 === 0 ? '空调' : '喇叭',
        state: i % 3 === 0 ? true : false,
        efficiency: `${i + 10} %`,
    });
}

const dataRecord = ref<any>([]);
for (let i = 0; i < 49; i++) {
    dataRecord.value.push({
        key: i,
        startTime: '2024-05-22 12:00:00',
        endTime: '2024-05-22 13:00:00',
        travelTime: '1小时',
        travel: `${20 + (i % 5) * 10}km`,
        startPosition: '重庆市渝北区',
        endPosition: '重庆市南岸区',
        alarmNumber: i % 4 === 0 ? 5 : 3,
    });
}

const pagination = {
    showTotal: (num: number, range: number[]) => {
        return `总共 ${num} 条`;
    },
    defaultPageSize: 4,
    total: data?.length,
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

const paginationAss = {
    showTotal: (num: number, range: number[]) => {
        return `总共 ${num} 条`;
    },
    defaultPageSize: 4,
    total: dataAss?.length,
    pageSizeOptions: ['4', '10', '20', '50', '100'],
    showQuickJumper: true,
    showSizeChanger: true,
    size: 'small',
};

const getDetailFn = async () => {
    const _id = route.params?.id as string;
    const res = await queryVehicleById(_id);
    console.log(res.result);
    if (res.status == 200) {
        vehicleData.value = res.result;
    }
};
//获取当前关联设备信息
const getDeviceFn = async () => {
    const _id = route.params?.id as string;
    const res = await queryVehicleEquipment({ where: `vehicleId=${_id}` });
    if (res.status == 200) {
        const data = res.result?.data;
        if(data?.length){
            
        }
    }
    console.log(res, 'res');
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
    getDeviceFn();
});
</script>
<style lang="less" scoped>
.detail {
    width: 100%;
    height: 100%;
    .table {
        height: 393px;
        padding: 10px;
        margin: 10px;
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
}
</style>
