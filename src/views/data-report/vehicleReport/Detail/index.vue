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
                <j-divider style="height: 1px; background-color: #E7E9EF;margin: 14px 0;" />
                <div class="title-type">
                    <span>子设备:</span>
                    <div class="type-list"></div>
                </div>
            </div>
        </div>
        <div class="table above">
            <div class="table-title">
                在线离线表
            </div>
            <JProTable
                ref="configRef"
                :columns="columns"
                model="table"
            >
            </JProTable>
        </div>
        <div class="table middle"></div>
        <div class="table content"></div>
        <div class="table footer"></div>
    </div>
</template>
<script lang="ts" setup>

const columns = [
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
    },
    {
        title: '日期',
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '车辆位置',
        dataIndex: 'position',
        key: 'position',
        ellipsis: true,
    },
];
</script>
<style lang="less" scoped>
.detail {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 10px;
    .table {
        padding: 10px;
        margin: 10px;
        background: #ffffff;
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

            .title-type{
                height: 20px;
                display: flex;
                flex-direction: row;
                
                .type-list{
                    margin-left: 28px;
                }
            }
        }
    }
}
</style>
