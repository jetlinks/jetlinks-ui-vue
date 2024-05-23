<template>
    <div class="detail">
        <div class="table title">
            <div class="title-left">
                <img
                    src="../../../../../public/images/dataReport/vehicleDetail.png"
                    alt="vehicleDetail"
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
                    <div class="type-list"></div>
                </div>
            </div>
        </div>
        <div class="table above">
            <div class="table-title">在线离线表</div>
            <j-table
                ref="configRef"
                :columns="columns"
                model="table"
                :data-source="data"
                :scroll="{ y: 246 }"
                :pagination="pagination"
            >
            </j-table>
        </div>
        <div class="table middle"></div>
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
                    <template v-if="column.key === 'type'">
                        <button
                            v-if="record.type === true"
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
        <div class="table footer"></div>
    </div>
</template>
<script lang="ts" setup>
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
    type: boolean;
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
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
    },
    {
        title: '工作效率',
        dataIndex: 'efficiency',
        key: 'efficiency',
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

const dataAss: DataItemAss[] = [];
for (let i = 0; i < 50; i++) {
    dataAss.push({
        key: i,
        id: '111222',
        name: `设备${i}`,
        productName: i % 2 === 0 ? '空调' : '喇叭',
        type: i % 3 === 0 ? true : false,
        efficiency: `${i + 10} %`,
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
