<template>
    <div class="t-table">
        <div class="t-title">
            <div class="title-left">
                <img
                    :src="getImage('/dataReport/vehicleDetail.png')"
                    alt="车辆报表详情图片"
                />
            </div>
            <div class="title-right">
                <j-descriptions
                    :column="{ xxl: 4, xl: 4, lg: 4, md: 3, sm: 3, xs: 1 }"
                >
                    <j-descriptions-item label="出厂编号">{{
                        data?.factoryNumber
                    }}</j-descriptions-item>
                    <j-descriptions-item label="车辆简称">{{
                        data?.simpleName
                    }}</j-descriptions-item>
                    <j-descriptions-item label="车辆类型">{{
                        data?.vehicleTypeEnum.text
                    }}</j-descriptions-item>
                    <j-descriptions-item label="型号">{{
                        data?.modelNumber
                    }}</j-descriptions-item>
                    <j-descriptions-item label="日期">{{
                        dayjs(Number(data?.vehicleDate)).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}</j-descriptions-item>
                    <j-descriptions-item label="车辆状态">
                        <button
                            v-if="data?.status === 0"
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
                        <button
                            v-else
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
                    </j-descriptions-item>
                    <j-descriptions-item label="所属组织">{{
                        data?.orgName
                    }}</j-descriptions-item>
                    <j-descriptions-item label="行驶里程"
                        >{{ vehicleMileage || '0' }} km</j-descriptions-item
                    >
                </j-descriptions>
                <j-divider
                    style="
                        height: 1px;
                        background-color: #e7e9ef;
                        margin: 5px 0;
                    "
                />
                <div class="title-type">
                    <span>子设备:</span>
                    <div class="type-list" v-for="item in deviceData">
                        <button
                            v-if="item.state.value === 'offline'"
                            style="
                                height: 24px;
                                padding: 2px 12px 2px 12px;
                                gap: 8px;
                                border-radius: 20px;
                                border: 1px solid #f99d31;
                                font-size: 14px;
                                font-weight: 400;
                                line-height: 18px;
                                text-align: center;
                                color: #f99d31;
                                background: #ffffff;
                            "
                        >
                            {{ item.name }}
                        </button>
                        <button
                            v-else-if="item.state.value === 'notActive'"
                            style="
                                height: 24px;
                                padding: 2px 12px 2px 12px;
                                gap: 8px;
                                color: rgba(229, 0, 18, 1);
                                border-radius: 20px;
                                border: 1px solid rgba(229, 0, 18, 1);
                                font-weight: 400;
                                line-height: 18px;
                                text-align: center;
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
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import dayjs from 'dayjs';
import { useMenuStore } from 'store/menu';

const props = withDefaults(
    defineProps<{
        data: any;
        deviceData: any;
        vehicleMileage: any;
    }>(),
    {},
);
</script>
<style lang="less" scoped>
.t-table {
    margin-top: 8px;
    background: #ffffff;
    border-radius: 4px;
    overflow: auto;
}

.t-title {
    display: flex;
    flex-direction: row;
    margin: 16px;

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
        height: 95%;
        margin-left: 15px;

        .title-type {
            margin-top: 15px;
            display: flex;
            flex-direction: row;

            .type-list {
                margin-left: 28px;
            }
        }
    }
}
</style>
