<template>
    <j-spin :spinning="loading">
        <div>
            <j-space>
                <div>
                    统计周期：
                    <j-select
                        v-model:value="cycle"
                        style="width: 120px"
                        :options="periodOptions"
                        @change="queryCharts"
                    >
                    </j-select>
                </div>
                <div v-if="cycle !== '*' && _type">
                    统计规则：
                    <j-select
                        v-model:value="agg"
                        style="width: 120px"
                        @change="queryCharts"
                    >
                        <j-select-option value="AVG">平均值</j-select-option>
                        <j-select-option value="MAX">最大值</j-select-option>
                        <j-select-option value="MIN">最小值</j-select-option>
                        <j-select-option value="COUNT">总数</j-select-option>
                    </j-select>
                </div>
            </j-space>
        </div>
        <div style="width: 100%; height: 500px">
            <Chart :options="options" v-if="chartsList.length" />
            <JEmpty v-else />
        </div>
    </j-spin>
</template>

<script lang="ts" setup>
import { getPropertiesInfo, getPropertiesList } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import Chart from './Chart.vue';
import * as echarts from 'echarts';
import dayjs from 'dayjs';

const prop = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    time: {
        type: Array,
        default: () => [],
    },
});

const cycle = ref<string>('');
const agg = ref<string>('AVG');
const loading = ref<boolean>(false);
const chartsList = ref<any[]>([]);
const instanceStore = useInstanceStore();
const periodOptions = ref<any>([]);
const options = ref({});
const list = ['int', 'float', 'double', 'long'];

const _type = computed(() => {
    const flag = list.includes(prop.data?.valueType?.type || '');
    // cycle.value = flag ? '*' : '1m';
    return flag;
});

const queryChartsAggList = async () => {
    loading.value = true;
    const resp = await getPropertiesInfo(instanceStore.current.id, {
        columns: [
            {
                property: prop.data.id,
                alias: prop.data.id,
                agg: _type.value ? agg.value : 'COUNT',
            },
        ],
        query: {
            interval: cycle.value,
            format: cycle.value === '1d' ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss',
            from: prop.time[0],
            to: prop.time[1],
        },
    }).finally(() => {
        loading.value = false;
    });
    if (resp.status === 200) {
        let beginTime;
        let endTime;
        if (cycle.value === '1d') {
            beginTime = dayjs(prop.time[0]).format('YYYY-MM-DD');
            endTime = dayjs(prop.time[1]).format('YYYY-MM-DD');
        } else {
            beginTime = dayjs(prop.time[0]).format('YYYY-MM-DD HH:mm:ss');
            endTime = dayjs(prop.time[1]).format('YYYY-MM-DD HH:mm:ss');
        }

        const dataList: any[] = [];
        (resp.result as any[]).forEach((i: any) => {
            dataList.push({
                ...i,
                year: i.time,
                value: Number(i[prop.data.id || '']),
                type: prop.data?.name || '',
            });
        });
        chartsList.value = (dataList || []).reverse();
        if (
            !chartsList.value?.[0]?.year ||
            chartsList.value[0].year !== beginTime
        ) {
            chartsList.value.unshift({
                year: prop.time[0],
                value: undefined,
                type: prop.data?.name || '',
            });
        }
        if (
            !chartsList.value?.[chartsList.value.length - 1]?.year ||
            chartsList.value[chartsList.value.length - 1].year !== endTime
        ) {
            chartsList.value.push({
                year: prop.time[1],
                value: undefined,
                type: prop.data?.name || '',
            });
        }
    }
};

const queryChartsList = async () => {
    loading.value = true;
    const resp = await getPropertiesList(
        instanceStore.current.id,
        prop.data.id,
        {
            paging: false,
            terms: [
                {
                    column: 'timestamp$BTW',
                    value:
                        prop.time[0] && prop.time[1]
                            ? [prop.time[0], prop.time[1]]
                            : [],
                    type: 'and',
                },
            ],
            sorts: [{ name: 'timestamp', order: 'asc' }],
        },
    ).finally(() => {
        loading.value = false;
    });
    if (resp.status === 200) {
        const dataList: any[] = [];
        (resp.result as any)?.forEach((i: any) => {
            dataList.push({
                ...i,
                year: i.timestamp,
                value: i.value,
                type: prop.data?.name || '',
            });
        });
        const beginTimeExist = dataList.find((i: any) => {
            return i.year === prop.time[0];
        });
        const endTimeExist = dataList.find((i: any) => {
            return i.year === prop.time[1];
        });
        if (!beginTimeExist) {
            dataList.unshift({
                year: prop.time[0],
                value: undefined,
                type: prop.data?.name || '',
            });
        }
        if (!endTimeExist) {
            dataList.push({
                year: prop.time[1],
                value: undefined,
                type: prop.data?.name || '',
            });
            chartsList.value = dataList || [];
        }
    }
};

const getOptions = (arr: any[]) => {
    options.value = {
        xAxis: {
            type: 'category',
            data: arr.map((item) => {
                return echarts.format.formatTime(
                    cycle.value === '1d'
                        ? 'yyyy-MM-dd'
                        : 'yyyy-MM-dd\nhh:mm:ss',
                    item.year,
                    false,
                );
            }),
            name: '时间',
        },
        yAxis: {
            type: 'value',
            name: arr[0]?.type,
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
            },
            {
                start: 0,
                end: 100,
            },
        ],
        tooltip: {
            trigger: 'axis',
            position: function (pt: any) {
                const left = pt[0] - 80;
                return [left, '10%'];
            },
        },
        series: [
            {
                data: arr.map((i: any) => i.value),
                type: 'line',
                areaStyle: {},
            },
        ],
    };
};

const queryCharts = () => {
    if (cycle.value === '*' && _type.value) {
        queryChartsList();
    } else {
        queryChartsAggList();
    }
};
watch(
    () => prop.time,
    (val) => {
        const diffInSeconds = dayjs(val[1]).diff(dayjs(val[0]), 'minute');
        if (diffInSeconds < 60) {
            periodOptions.value = _type.value
                ? [
                      {
                          label: '实际值',
                          value: '*',
                      },
                      {
                          label: '按分钟统计',
                          value: '1m',
                      },
                  ]
                : [
                      {
                          label: '按分钟统计',
                          value: '1m',
                      },
                  ];
            cycle.value = _type.value ? '*' : '1m';
        } else if (diffInSeconds < 1440) {
            periodOptions.value = _type.value
                ? [
                      {
                          label: '实际值',
                          value: '*',
                      },
                      {
                          label: '按分钟统计',
                          value: '1m',
                      },
                      {
                          label: '按小时统计',
                          value: '1h',
                      },
                  ]
                : [
                      {
                          label: '按分钟统计',
                          value: '1m',
                      },
                      {
                          label: '按小时统计',
                          value: '1h',
                      },
                  ];
            cycle.value = _type.value ? '*' : '1m';
        } else if (diffInSeconds < 43200) {
            periodOptions.value = [
                {
                    label: '按小时统计',
                    value: '1h',
                },
                {
                    label: '按天统计',
                    value: '1d',
                },
            ];
            cycle.value = '1h';
        } else {
            periodOptions.value = [
                {
                    label: '按天统计',
                    value: '1d',
                },
                {
                    label: '按周统计',
                    value: '1w',
                },
            ];
            cycle.value = '1d';
        }
        queryCharts();
    },
    {
        deep: true,
        immediate: true,
    },
);

watchEffect(() => {
    if (chartsList.value.length) {
        getOptions(chartsList.value);
    }
});
</script>
