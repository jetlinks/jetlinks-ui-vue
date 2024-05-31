<template>
    <page-container>
        <div class="DashBoardBox">
            <j-row :gutter="24">
                <j-col :span="6">
                    <TopCard
                        title="今日告警"
                        :value="state.today"
                        :footer="currentMonAlarm"
                    >
                        <Charts :options="state.fifteenOptions"></Charts>
                    </TopCard>
                </j-col>
                <j-col :span="6">
                    <TopCard
                        title="告警配置"
                        :value="state.config"
                        :footer="alarmState"
                        :img="getImage('/device/device-number.png')"
                    ></TopCard>
                </j-col>
                <j-col :span="12">
                    <NewAlarm :alarm-list="state.alarmList"></NewAlarm>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="24">
                    <div class="alarm-card">
                        <Guide>
                            <template #title>
                                <span style="margin-right: 24px">告警统计</span>
                                <j-select
                                    style="width: 40%"
                                    v-model:value="queryCodition.targetType"
                                    :options="
                                        isNoCommunity ? selectOpt1 : selectOpt2
                                    "
                                    @change="selectChange"
                                ></j-select>
                            </template>
                            <template #extra>
                                <TimeSelect
                                    key="flow-static"
                                    :type="'week'"
                                    :quickBtnList="[
                                        { label: '最近1小时', value: 'hour' },
                                        { label: '最近24小时', value: 'day' },
                                        { label: '近一周', value: 'week' },
                                    ]"
                                    @change="initQueryTime"
                                />
                            </template>
                        </Guide>
                        <div class="alarmBox">
                            <div class="alarmStatistics-chart">
                                <Charts
                                    :options="alarmStatisticsOption"
                                ></Charts>
                            </div>
                            <div class="alarmRank">
                                <h4>告警排名</h4>
                                <ul
                                    v-if="state.ranking.length"
                                    class="rankingList"
                                >
                                    <li
                                        v-for="(item, i) in state.ranking"
                                        :key="item.targetId"
                                    >
                                        <img
                                            :src="
                                                getImage(
                                                    `/rule-engine/dashboard/ranking/${
                                                        i + 1
                                                    }.png`,
                                                )
                                            "
                                            alt=""
                                        />
                                        <span
                                            class="rankingItemTitle"
                                            :title="item.targetName"
                                            >{{ item.targetName }}</span
                                        >
                                        <span class="rankingItemValue">{{
                                            item.count
                                        }}</span>
                                    </li>
                                </ul>
                                <div v-else class="empty-body">
                                    <j-empty
                                        :image="Empty.PRESENTED_IMAGE_SIMPLE"
                                    ></j-empty>
                                </div>
                            </div>
                        </div>
                    </div>
                </j-col>
            </j-row>
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import { Empty } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import Charts from './components/Charts.vue';
import TopCard from './components/TopCard.vue';
import NewAlarm from './components/NewAlarm.vue';
import TimeSelect from './components/TimeSelect.vue';
import Guide from './components/Guide.vue';
import encodeQuery from '@/utils/encodeQuery';
import type { SelectTypes } from 'ant-design-vue/es/select';
import type { Footer } from '@/views/rule-engine/DashBoard/typings';
import { isNoCommunity } from '@/utils/utils';
import {
    dashboard,
    getAlarm,
    getAlarmConfigCount,
    getAlarmLevel,
} from '@/api/rule-engine/dashboard';
import dayjs from 'dayjs';
let currentMonAlarm = ref<Footer[]>([
    {
        title: '当月告警',
        value: 0,
        status: 'success',
    },
]);
let alarmState = ref<Footer[]>([
    {
        title: '正常',
        value: 0,
        status: 'success',
    },
    {
        title: '禁用',
        value: 0,
        status: 'error',
    },
]);
const selectOpt1 = ref<Object[]>([
    { label: '设备', value: 'device' },
    { label: '产品', value: 'product' },
    { label: '组织', value: 'org' },
    { label: '其它', value: 'other' },
]);
const selectOpt2 = ref<SelectTypes['options']>([
    { label: '设备', value: 'device' },
    { label: '产品', value: 'product' },
    { label: '其它', value: 'other' },
]);
let queryCodition = reactive({
    startTime: 0,
    endTime: 0,
    targetType: 'device',
});
let alarmStatisticsOption = ref<any>({});
type DashboardItem = {
    group: string;
    data: Record<string, any>;
};
let state = reactive<{
    today: number;
    thisMonth: number;
    config: number;
    enabledConfig: number;
    disabledConfig: number;
    alarmList: any[];
    ranking: { targetId: string; targetName: string; count: number }[];
    fifteenOptions: any;
}>({
    today: 0,
    thisMonth: 0,
    config: 0,
    enabledConfig: 0,
    disabledConfig: 0,
    alarmList: [],
    ranking: [],
    fifteenOptions: {},
});
// 今日告警
const today = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'trend',
    dimension: 'agg',
    group: 'today',
    params: {
        time: '1d',
        // targetType: 'device',
        format: 'HH:mm:ss',
        from: dayjs(new Date(new Date().setHours(0, 0, 0, 0))).format(
            'YYYY-MM-DD HH:mm:ss',
        ),
        to: 'now',
        // limit: 24,
    },
};
// 当月告警
const thisMonth = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'trend',
    dimension: 'agg',
    group: 'thisMonth',
    params: {
        time: '1M',
        // targetType: 'device',
        format: 'yyyy-MM',
        limit: 1,
        from: 'now-1M',
    },
};

const fifteen = {
    dashboard: 'alarm',
    object: 'record',
    measurement: 'trend',
    dimension: 'agg',
    group: '15day',
    params: {
        time: '1d',
        format: 'yyyy-MM-dd',
        // targetType: 'product',
        from: 'now-15d',
        to: 'now',
        limit: 15,
    },
};
const getDashBoard = () => {
    dashboard([today, thisMonth, fifteen]).then((res) => {
        if (res.status == 200) {
            const _data = res.result as DashboardItem[];
            state.today = _data.find(
                (item) => item.group === 'today',
            )?.data.value || 0;
            state.thisMonth = _data.find(
                (item) => item.group === 'thisMonth',
            )?.data.value || 0;
            currentMonAlarm.value[0].value = state.thisMonth;
            const fifteenData = _data
                .filter((item) => item.group === '15day')
                .map((item) => item.data)
                .sort((a, b) => b.timestamp - a.timestamp);

            state.fifteenOptions = {
                xAxis: {
                    type: 'category',
                    data: fifteenData.map((item) => item.timeString),
                    show: false,
                },
                yAxis: {
                    type: 'value',
                    show: false,
                },
                grid: {
                    top: '2%',
                    left: 40,
                    bottom: 0,
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    },
                },
                series: [
                    {
                        name: '告警数',
                        data: fifteenData.map((item) => item.value),
                        type: 'line',
                        color: '#FF595E',
                        smooth: true,
                        symbolSize: 0,
                        areaStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [
                                    {
                                        offset: 0,
                                        color: '#FF595E', // 100% 处的颜色
                                    },
                                    {
                                        offset: 1,
                                        color: '#FFFFFF', //   0% 处的颜色
                                    },
                                ],
                                global: false, // 缺省为 false
                            },
                        },
                    },
                ],
            };
        }
    });
};
getDashBoard();
const getAlarmConfig = async () => {
    const countRes = await getAlarmConfigCount({});
    const enabeldRes = await getAlarmConfigCount({
        terms: [
            {
                column: 'state',
                value: 'enabled',
            },
        ],
    });
    const disableRes = await getAlarmConfigCount({
        terms: [
            {
                column: 'state',
                value: 'disabled',
            },
        ],
    });
    if (countRes.status == 200) {
        state.config = countRes.result;
    }
    if (enabeldRes.status == 200) {
        state.enabledConfig = enabeldRes.result;
        alarmState.value[0].value = state.enabledConfig;
    }
    if (disableRes.status == 200) {
        state.disabledConfig = disableRes.result;
        alarmState.value[1].value = state.disabledConfig;
    }
};
getAlarmConfig();
const getCurrentAlarm = async () => {
    const alarmLevel: any = await getAlarmLevel();
    const sorts = { alarmTime: 'desc' };
    const currentAlarm: any = await getAlarm(encodeQuery({ sorts }));
    if (currentAlarm.status === 200) {
        if (alarmLevel.status === 200) {
            const levels = alarmLevel.result.levels;
            state.alarmList = currentAlarm.result?.data
                .filter((i: any) => i?.state?.value === 'warning')
                .map((item: { level: any }) => ({
                    ...item,
                    levelName: levels.find((l: any) => l.level === item.level)
                        ?.title,
                }));
        } else {
            state.alarmList = currentAlarm.result?.data.filter(
                (item: any) => item?.state?.value === 'warning',
            );
        }
    }
};
getCurrentAlarm();
//初始化查询条件
const initQueryTime = (data: any) => {
    queryCodition.startTime = data.start;
    queryCodition.endTime = data.end;
    selectChange();
};
const selectChange = () => {
    let time = '1m';
    let format = 'M月dd日 HH:mm';
    let limit = 12;
    const dt = queryCodition.endTime - queryCodition.startTime;
    const hour = 60 * 60 * 1000;
    const day = hour * 24;
    const month = day * 30;
    const year = 365 * day;

    if (dt <= (hour + 10)) {
      limit = 60
      format = 'HH:mm';
    } else if (dt > hour && dt <= day) {
      time = '1h'
      limit = 24;
    } else if (dt > day && dt < year) {
        limit = Math.abs(Math.ceil(dt / day)) + 1;
        time = '1d';
        format = 'M月dd日 HH:mm:ss';
    } else if (dt >= year) {
        limit = Math.abs(Math.floor(dt / month));
        time = '1M';
        format = 'yyyy年-M月';
    }

    // 告警趋势
    const chartData = {
        dashboard: 'alarm',
        object: 'record',
        measurement: 'trend',
        dimension: 'agg',
        group: 'alarmTrend',
        params: {
            targetType: queryCodition.targetType, // product、device、org、other
            format: format,
            time: time,
            // from: 'now-1y', // now-1d、now-1w、now-1M、now-1y
            // to: 'now',
            limit: limit, // 12
            // time: params.time.type === 'today' ? '1h' : '1d',
            from: dayjs(queryCodition.startTime).format('YYYY-MM-DD HH:mm:ss'),
            to: dayjs(queryCodition.endTime).format('YYYY-MM-DD HH:mm:ss'),
            // limit: 30,
        },
    };

    // 告警排名
    const order = {
        dashboard: 'alarm',
        object: 'record',
        measurement: 'rank',
        dimension: 'agg',
        group: 'alarmRank',
        params: {
            // time: '1h',
            time: time,
            targetType: queryCodition.targetType,
            from: dayjs(queryCodition.startTime).format('YYYY-MM-DD HH:mm:ss'),
            to: dayjs(queryCodition.endTime).format('YYYY-MM-DD HH:mm:ss'),
            limit: 9,
        },
    };
    let tip = '其它';
    if (queryCodition.targetType === 'device') {
        tip = '设备';
    } else if (queryCodition.targetType === 'product') {
        tip = '产品';
    } else if (queryCodition.targetType === 'org') {
        tip = '组织';
    }
    // 网络请求
    dashboard([chartData, order]).then((res) => {
        if (res.status == 200) {
            const xData: string[] = [];
            const sData: number[] = [];
            res.result
                .filter((item: any) => item.group === 'alarmTrend')
                .forEach((item: any) => {
                    if(time === '1d'){
                        item.data.timeString = item.data.timeString.split(' ')[0]
                    }
                    xData.push(item.data.timeString);
                    sData.push(item.data.value);
                });
            const data:any = JSON.parse(JSON.stringify(sData))
            if (data && data.length > 0 ) {
                    const maxY = data.sort((a,b)=>{
                    return b-a
                })[0]
                alarmStatisticsOption.value = {
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xData.reverse(),
                    },
                    yAxis: {
                        type: 'value',
                    },
                    tooltip: {
                        trigger: 'axis',
                        // axisPointer: {
                        //   type: 'shadow',
                        // },
                    },
                    grid: {
                        top: '2%',
                        bottom: '5%',
                        left:  maxY < 1000 ? 50 : maxY.toString().length * 10,
                        right: '48px',
                    },
                    series: [
                        {
                            name: tip,
                            data: sData.reverse(),
                            type: 'line',
                            smooth: true,
                            color: '#ADC6FF',
                            areaStyle: {
                                color: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: '#ADC6FF', // 100% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#FFFFFF', //   0% 处的颜色
                                        },
                                    ],
                                    global: false, // 缺省为 false
                                },
                            },
                        },
                    ],
                };
            }else{
                console.log('data is empty ')
            }
            state.ranking = res.result
                ?.filter(
                    (item: any) =>
                        item.group === 'alarmRank' &&
                        item.data?.value?.count !== 0,
                )
                .map((d: { data: { value: any } }) => d.data?.value)
                .sort(
                    (a: { count: number }, b: { count: number }) =>
                        b.count - a.count,
                );
        }
    });
};
</script>
<style scoped lang="less">
.alarm-card {
    width: 100%;
    background-color: white;
    padding: 24px;
    margin-top: 24px;
}
.alarmBox {
    width: 100%;
    display: flex;
    .alarmStatistics-chart {
        width: 70%;
        height: 500px;
    }
    .alarmRank {
        position: relative;
        width: 30%;
        padding-left: 48px;
    }
}
.rankingList {
    margin: 25px 0 0;
    padding: 0;
    list-style: none;

    li {
        display: flex;
        align-items: center;
        margin-top: 16px;
        zoom: 1;

        &::before,
        &::after {
            display: table;
            content: ' ';
        }

        &::after {
            clear: both;
            height: 0;
            font-size: 0;
            visibility: hidden;
        }

        span {
            //color: red;
            font-size: 14px;
            line-height: 22px;
        }

        .rankingItemNumber {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-top: 1.5px;
            margin-right: 16px;
            font-weight: 600;
            font-size: 12px;
            line-height: 20px;
            text-align: center;
            background-color: #edf0f3;
            border-radius: 20px;

            &.active {
                color: #fff;
                background-color: #314659;
            }
        }

        .rankingItemTitle {
            flex: 1;
            margin-right: 8px;
            padding-left: 8px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
}
.empty-body {
    height: 490px;
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    width: 100%;
    // height: 100%;
}
</style>