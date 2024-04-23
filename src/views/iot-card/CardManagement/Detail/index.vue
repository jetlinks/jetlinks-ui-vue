<!-- 物联卡查看 -->
<template>
    <page-container>
        <!-- 新增、编辑 -->
        <Save
            v-if="visible"
            :type="saveType"
            :data="current"
            @change="saveChange"
        />
        <j-row :gutter="[24, 24]">
            <j-col :span="24">
                <j-card>
                    <j-descriptions size="small" :column="3" bordered>
                        <template #title>
                            <Guide>
                                <template #title>
                                    <span>基本信息</span>
                                    <j-button
                                        type="link"
                                        @click="
                                            () => {
                                                visible = true;
                                                current = detail;
                                                saveType = 'edit';
                                            }
                                        "
                                    >
                                        <AIcon type="EditOutlined"></AIcon>
                                        编辑
                                    </j-button>
                                </template>
                            </Guide>
                        </template>

                        <j-descriptions-item label="卡号">{{
                            detail.id
                        }}</j-descriptions-item>
                        <j-descriptions-item label="ICCID">{{
                            detail.iccId
                        }}</j-descriptions-item>
                        <j-descriptions-item label="绑定设备">{{
                            detail.deviceName
                        }}</j-descriptions-item>
                        <j-descriptions-item label="平台类型">{{
                            detail.operatorPlatformType?.text
                        }}</j-descriptions-item>
                        <j-descriptions-item label="平台名称">{{
                            detail.platformConfigName
                        }}</j-descriptions-item>
                        <j-descriptions-item label="运营商">{{
                            detail.operatorName
                        }}</j-descriptions-item>
                        <j-descriptions-item label="类型">{{
                            detail.cardType?.text
                        }}</j-descriptions-item>
                        <j-descriptions-item label="激活日期">{{
                            detail.activationDate
                                ? moment(detail.activationDate).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : ''
                        }}</j-descriptions-item>
                        <j-descriptions-item label="更新时间">{{
                            detail.updateTime
                                ? moment(detail.updateTime).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : ''
                        }}</j-descriptions-item>
                        <j-descriptions-item label="总流量">{{
                            detail.totalFlow
                                ? detail.totalFlow.toFixed(2) + ' M'
                                : ''
                        }}</j-descriptions-item>
                        <j-descriptions-item label="使用流量">{{
                            detail.usedFlow
                                ? detail.usedFlow.toFixed(2) + ' M'
                                : ''
                        }}</j-descriptions-item>
                        <j-descriptions-item label="剩余流量">{{
                            detail.residualFlow
                                ? detail.residualFlow.toFixed(2) + ' M'
                                : ''
                        }}</j-descriptions-item>
                        <j-descriptions-item label="状态">{{
                            detail?.cardState?.text
                        }}</j-descriptions-item>
                        <j-descriptions-item label="说明">{{
                            detail?.describe
                        }}</j-descriptions-item>
                    </j-descriptions>
                </j-card>
            </j-col>
            <j-col :span="24">
                <!-- 流量统计 -->
                <j-row :gutter="24">
                    <j-col :span="16">
                        <div class="card">
                            <Guide title="流量统计">
                                <template #extra>
                                    <TimeSelect
                                        :type="'week'"
                                        :quickBtnList="quickBtnList"
                                        @change="getEcharts"
                                    />
                                </template>
                            </Guide>
                            <LineChart
                                :showX="true"
                                :showY="true"
                                style="min-height: 490px"
                                :chartData="flowData"
                            />
                        </div>
                    </j-col>
                    <j-col :span="8">
                        <div class="card">
                            <Guide title="数据统计" />
                            <div class="static-info" style="min-height: 490px">
                                <div class="data-statistics-item">
                                    <div class="flow-info" style="width: 100%">
                                        <div class="label">昨日流量消耗</div>
                                        <j-tooltip placement="bottomLeft">
                                            <template #title>
                                                <span>{{ dayTotal }} M</span>
                                            </template>
                                            <div class="value">
                                                {{ dayTotal }}
                                                <span class="unit">M</span>
                                            </div>
                                        </j-tooltip>
                                    </div>
                                    <LineChart
                                        color="#FBA500"
                                        :chartData="dayOptions"
                                    />
                                </div>
                                <div class="data-statistics-item">
                                    <div class="flow-info" style="width: 100%">
                                        <div class="label">当月流量消耗</div>
                                        <j-tooltip placement="bottomLeft">
                                            <template #title>
                                                <span>{{ monthTotal }} M</span>
                                            </template>
                                            <div class="value">
                                                {{ monthTotal }}
                                                <span class="unit">M</span>
                                            </div>
                                        </j-tooltip>
                                    </div>
                                    <LineChart :chartData="monthOptions" />
                                </div>
                                <div class="data-statistics-item">
                                    <div class="flow-info" style="width: 100%">
                                        <div class="label">本年流量消耗</div>
                                        <j-tooltip placement="bottomLeft">
                                            <template #title>
                                                <span>{{ yearTotal }} M</span>
                                            </template>
                                            <div class="value">
                                                {{ yearTotal }}
                                                <span class="unit">M</span>
                                            </div>
                                        </j-tooltip>
                                    </div>
                                    <LineChart
                                        color="#58E1D3"
                                        :chartData="yearOptions"
                                    />
                                </div>
                            </div>
                        </div>
                    </j-col>
                </j-row>
            </j-col>
        </j-row>
    </page-container>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { CardManagement } from '../typing';
import { queryDetail } from '@/api/iot-card/cardManagement';
import Save from '../Save.vue';
import Guide from '@/views/iot-card/components/Guide.vue';
import LineChart from '@/views/iot-card/components/LineChart.vue';
import { queryFlow } from '@/api/iot-card/home';
import TimeSelect from '@/views/iot-card/components/TimeSelect.vue';

const route = useRoute();

const visible = ref<boolean>(false);
const current = ref<Partial<CardManagement>>({});
const saveType = ref<string>('');
const detail = ref<any>({});

const flowData = ref<any[]>([]);
const dayTotal = ref(0);
const monthTotal = ref(0);
const yearTotal = ref(0);
const dayOptions = ref<any[]>([]);
const monthOptions = ref<any[]>([]);
const yearOptions = ref<any[]>([]);

const quickBtnList = [
    { label: '昨日', value: 'yesterday' },
    { label: '近一周', value: 'week' },
    { label: '近一月', value: 'month' },
    { label: '近一年', value: 'year' },
];

const getDetail = () => {
    queryDetail(route.params.id).then((resp: any) => {
        if (resp.status === 200) {
            detail.value = resp.result;
        }
    });
};

/**
 * 新增、编辑关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
    visible.value = false;
    current.value = {};
    if (val) {
        getDetail();
    }
};

const getData = (
    start: number,
    end: number,
): Promise<{ sortArray: any[]; data: any[] }> => {
    return new Promise((resolve) => {
        queryFlow(start, end, {
            orderBy: 'date',
            terms: [{
              column : "cardId",
              termType: "eq",
              value: route.params.id
            }]
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
        console.log('monthTotal.value:'+monthTotal.value);
    });
    getData(yTime[0], yTime[1]).then((resp) => {
        yearTotal.value = resp.data
            .reduce((r, n) => r + Number(n), 0)
            .toFixed(2);
        yearOptions.value = resp.sortArray;
        console.log('yearOptions.value:'+yearTotal.value);
    });
    
};


/**
 * 流量统计
 * @param data
 */
const getEcharts = (data: any) => {
    let startTime = data.start;
    let endTime = data.end;
    if (data.type === 'week' || data.type === 'month'||data.type === 'year') {
        startTime = moment(data.start).startOf('days').valueOf();
        endTime = moment(data.end).startOf('days').valueOf();
    }
    getData(startTime, endTime).then((resp) => {
        flowData.value = resp.sortArray;
    });
};

getDetail();
getDataTotal();
</script>
<style scoped lang="less">
.card {
    padding: 24px;
    background-color: #fff;
}

.static-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .data-statistics-item {
        height: 140px;
        background: #fcfcfc;
        border: 1px solid #e0e4e8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        .flow-info {
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
}
</style>
