<template>
    <page-container :showBack="true">
        <div class="detail">
            <div class="table title">
                <div class="title-left">
                    <img
                        src="../../../../../public/images/dataReport/vehicleDetail.png"
                        alt="车辆报表详情图片"
                    />
                </div>
                <div class="title-right">
                    <j-descriptions
                        :column="{ xxl: 4, xl: 4, lg: 4, md: 3, sm: 3, xs: 1 }"
                    >
                        <j-descriptions-item label="出厂编号"
                            >12025YB</j-descriptions-item
                        >
                        <j-descriptions-item label="车辆简称"
                            >1810000000</j-descriptions-item
                        >
                        <j-descriptions-item label="车辆类型"
                            >内燃柴油机</j-descriptions-item
                        >
                        <j-descriptions-item label="型号"
                            >QYCD25-QCG</j-descriptions-item
                        >
                        <j-descriptions-item label="日期"
                            >2020-01-01</j-descriptions-item
                        >
                        <j-descriptions-item label="闲置"
                            >一小时</j-descriptions-item
                        >
                        <j-descriptions-item label="所属组织"
                            >组织A</j-descriptions-item
                        >
                        <j-descriptions-item label="行驶里程"
                            >12200</j-descriptions-item
                        >
                    </j-descriptions>
                    <j-divider
                        style="
                            height: 1px;
                            background-color: #e7e9ef;
                            margin: 14px 0;
                        "
                    />
                    <div class="title-type">
                        <span>子设备:</span>
                        <div class="type-list" v-for="item in devices">
                            <button
                                v-if="item.isImportant === true"
                                style="
                                    height: 24px;
                                    padding: 2px 12px 2px 12px;
                                    gap: 8px;
                                    border-radius: 20px;
                                    border: 1px solid #ec5448;
                                    font-size: 14px;
                                    font-weight: 400;
                                    line-height: 18px;
                                    text-align: center;
                                    color: #ec5448;
                                    background: #ffffff;
                                "
                            >
                                {{ item.name }}
                            </button>
                            <button
                                v-else
                                style="
                                    height: 24px;
                                    padding: 2px 12px 2px 12px;
                                    gap: 8px;
                                    border-radius: 20px;
                                    border: 1px solid #0fce8c;
                                    font-size: 14px;
                                    font-weight: 400;
                                    line-height: 18px;
                                    text-align: center;
                                    color: #0fce8c;
                                    background: #ffffff;
                                "
                            >
                                {{ item.name }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
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
                                    width: 44px;
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
                                    width: 44px;
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
import detailList from '../components/detailsList.vue';

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

const devices = [
    {
        name: '发动机',
        isImportant: true,
    },
    {
        name: '变速器',
        isImportant: false,
    },
    {
        name: '压力传感器',
        isImportant: false,
    },
];

const setStyle = (data: any) => {
    return;
};

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
    {
        title: '工作效率',
        dataIndex: 'efficiency',
        key: 'efficiency',
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
        date: `2024-05-23`,
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
        travel: `${20 + (i % 5) * 10}`,
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
    hideOnSinglePage: true,
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
    hideOnSinglePage: true,
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
    hideOnSinglePage: true,
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
    hideOnSinglePage: true,
};
</script>
<style lang="less" scoped>
.detail {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 10px;
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
