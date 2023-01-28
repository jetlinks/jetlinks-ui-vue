<!-- 物联卡-仪表盘 -->
<template>
    <div class="page-container">
        <a-card>
            <a-row :gutter="20" :style="{ marginBottom: '20px' }">
                <a-col :span="24"><Guide title="数据统计" /></a-col>
                <a-col :span="8">
                    <div class="data-statistics-item">
                        <div class="info" style="width: 100%">
                            <div class="label">昨日流量消耗</div>
                            <a-tooltip placement="bottomLeft">
                                <template #title>
                                    <span>{{ dayTotal }} M</span>
                                </template>
                                <div class="value">
                                    {{ dayTotal }}
                                    <span class="unit">M</span>
                                </div>
                            </a-tooltip>
                        </div>
                        <LineChart color="#FBA500" :chartData="dayOptions" />
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="data-statistics-item">
                        <div class="info" style="width: 100%">
                            <div class="label">当月流量消耗</div>
                            <a-tooltip placement="bottomLeft">
                                <template #title>
                                    <span>{{ monthTotal }} M</span>
                                </template>
                                <div class="value">
                                    {{ monthTotal }}
                                    <span class="unit">M</span>
                                </div>
                            </a-tooltip>
                        </div>
                        <LineChart :chartData="monthOptions" />
                    </div>
                </a-col>
                <a-col :span="8">
                    <div class="data-statistics-item">
                        <div class="info" style="width: 100%">
                            <div class="label">本年流量消耗</div>
                            <a-tooltip placement="bottomLeft">
                                <template #title>
                                    <span>{{ yearTotal }} M</span>
                                </template>
                                <div class="value">
                                    {{ yearTotal }}
                                    <span class="unit">M</span>
                                </div>
                            </a-tooltip>
                        </div>
                        <LineChart color="#58E1D3" :chartData="yearOptions" />
                    </div>
                </a-col>
            </a-row>
            <a-row :gutter="20">
                <a-col :span="16">
                    <Guide title="流量统计">
                        <template #extra></template>
                    </Guide>
                    <LineChart
                        :showX="true"
                        :showY="true"
                        style="min-height: 450px"
                        :chartData="yearOptions"
                    />
                </a-col>
                <a-col :span="8">
                    <Guide title="流量使用TOP10">
                        <template #extra></template>
                    </Guide>
                    <div class="rankingList" style="height: 400px">
                        <div
                            v-for="(item, index) in topList"
                            :key="item.cardNum"
                            class="rankItem"
                        >
                            <div
                                class="number"
                                :class="`number-item-${index + 1}`"
                            >
                                {{ index + 1 }}
                            </div>
                            <div class="cardNum">{{ item.cardNum }}</div>
                            <div class="progress">
                                <a-progress
                                    :strokeColor="'#ADC6FF'"
                                    :trailColor="'#E0E4E8'"
                                    :strokeLinecap="'butt'"
                                    :showInfo="false"
                                    :percent="
                                        Math.ceil((item.value / topTotal) * 100)
                                    "
                                ></a-progress>
                            </div>
                            <div class="total">
                                {{ item?.value?.toFixed(2) }} M
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import Guide from '../components/Guide.vue';
import LineChart from '../components/LineChart.vue';
import moment from 'moment';
import { queryFlow } from '@/api/iot-card/home';

const dayTotal = ref(0);
const monthTotal = ref(0);
const yearTotal = ref(0);
const dayOptions = ref<any[]>([]);
const monthOptions = ref<any[]>([]);
const yearOptions = ref<any[]>([]);

const flowData = ref<any[]>([]);
const topList = ref<any[]>([]);
const topTotal = ref(0);

const getData = (
    start: number,
    end: number,
): Promise<{ sortArray: any[]; data: any[] }> => {
    return new Promise((resolve) => {
        queryFlow(start, end, {
            orderBy: 'date',
        }).then((resp: any) => {
            if (resp.status === 200) {
                const sortArray = resp.result.sort(
                    (a: any, b: any) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime(),
                );
                resolve({
                    sortArray,
                    data: sortArray.map(
                        (item: any) => item.value && item.value.toFixed(2),
                    ),
                });
            }
        });
    });
};

/**
 * 查询今日、当月、本年数据
 */
const getDataTotal = () => {
    const dTime = [
        moment(new Date()).startOf('day').valueOf(),
        moment(new Date()).endOf('day').valueOf(),
    ];
    const mTime = [
        moment().startOf('month').valueOf(),
        moment().endOf('month').valueOf(),
    ];
    const yTime = [
        moment().startOf('year').valueOf(),
        moment().endOf('year').valueOf(),
    ];
    getData(dTime[0], dTime[1]).then((resp) => {
        dayTotal.value = resp.data
            .reduce((r, n) => r + Number(n), 0)
            .toFixed(2);
        dayOptions.value = resp.sortArray;
    });
    getData(mTime[0], mTime[1]).then((resp) => {
        monthTotal.value = resp.data
            .reduce((r, n) => r + Number(n), 0)
            .toFixed(2);
        monthOptions.value = resp.sortArray;
    });
    getData(yTime[0], yTime[1]).then((resp) => {
        yearTotal.value = resp.data
            .reduce((r, n) => r + Number(n), 0)
            .toFixed(2);
        yearOptions.value = resp.sortArray;
    });
};

/**
 * 流量统计
 * @param data
 */
const getEcharts = (data: any) => {
    console.log(data);
    let startTime = data.time.start;
    let endTime = data.time.end;
    if (data.time.type === 'week' || data.time.type === 'month') {
        startTime = moment(data.time.start).startOf('days').valueOf();
        endTime = moment(data.time.end).startOf('days').valueOf();
    }
    getData(startTime, endTime).then((resp) => {
        flowData.value = resp.sortArray;
    });
};

/**
 * 流量使用TOP10
 * @param star 开始时间
 * @param end 结束时间
 */
const getTopRang = (star: number, end: number) => {
    queryFlow(star, end, { orderBy: 'usage' }).then((resp: any) => {
        if (resp.status === 200) {
            const arr = resp.result
                .slice(0, 10)
                .sort((a: any, b: any) => b.value - a.value);
            topTotal.value = arr.length ? arr[0].value : 0;
            topList.value = arr;
        }
    });
};

getDataTotal();

// getEcharts(data);

const dTime = [
    moment().subtract(6, 'days').startOf('day').valueOf(),
    moment().endOf('day').valueOf(),
];
getTopRang(dTime[0], dTime[1]);
</script>
<style scoped lang="less">
.page-container {
    .data-statistics-item {
        height: 140px;
        background: #fcfcfc;
        border: 1px solid #e0e4e8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        .info {
            // width: 180px;
            width: 28%;
            .label {
                font-size: 14px;
                color: rgba(0, 0, 0, 0.64);
            }
            .value {
                font-size: 32px;
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                .unit {
                    font-size: 20px;
                    font-weight: normal;
                }
            }
        }
    }

    .rankingList {
        padding: 0;
        overflow-y: auto;
        list-style: none;

        .rankItem {
            display: flex;
            justify-content: space-between;
            min-width: 0;
            padding: 12px 0;
        }
        .number {
            flex: 0 0 24px;
            height: 24px;
            color: #fff;
            font-weight: bold;
            line-height: 24px;
            text-align: center;
            background-color: #d1d1d1;
        }

        .number-item-1 {
            color: #e50012;
            background-color: rgba(#e50012, 0.1);
        }

        .number-item-2 {
            color: #fba500;
            background-color: rgba(#fba500, 0.1);
        }

        .number-item-3 {
            color: #597ef7;
            background-color: rgba(#597ef7, 0.1);
        }

        .cardNum {
            flex: 0 0 100px;
            margin-left: 16px;
        }

        .progress {
            flex: 1 1 auto;
            margin: 0 8px;

            :deep(.ant-progress-inner) {
                border-radius: 0px;
            }
            :deep(.ant-progress-bg) {
                border-radius: 0px;
            }
        }

        .total {
            flex: 0 0 80px;
            color: #999;
            text-align: right;
        }
    }
}
</style>
