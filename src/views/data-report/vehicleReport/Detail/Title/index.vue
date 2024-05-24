<template>
    <div class="table title">
        <div class="title-left">
            <img
                src="../../../../../../public/images/dataReport/vehicleDetail.png"
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
                <j-descriptions-item label="闲置">一小时</j-descriptions-item>
                <j-descriptions-item label="所属组织"
                    >组织A</j-descriptions-item
                >
                <j-descriptions-item label="行驶里程"
                    >12200</j-descriptions-item
                >
            </j-descriptions>
            <j-divider
                style="height: 1px; background-color: #e7e9ef; margin: 14px 0"
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
</template>

<script lang="ts" setup>
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
</script>
<style lang="less" scoped>
.table {
    height: 393px;
    padding: 10px;
    margin: 10px;
    background: #ffffff;
    border-radius: 4px;
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
</style>