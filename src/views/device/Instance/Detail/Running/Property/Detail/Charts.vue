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
                    >
                    </j-select>
                </div>
                <div v-if="cycle !== '*' && _type">
                    统计规则：
                    <j-select v-model:value="agg" style="width: 120px">
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

const cycle = ref<string>();
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
            format: 'yyyy-MM-dd HH:mm:ss',
            from: prop.time[0],
            to: prop.time[1],
        },
    }).finally(() => {
        loading.value = false;
    });
    if (resp.status === 200) {
        const dataList: any[] = [
            {
                year: prop.time[1],
                value: undefined,
                type: prop.data?.name || '',
            },
        ];
        (resp.result as any[]).forEach((i: any) => {
            dataList.push({
                ...i,
                year: i.time,
                value: Number(i[prop.data.id || '']),
                type: prop.data?.name || '',
            });
        });
        dataList.push({
            year: prop.time[0],
            value: undefined,
            type: prop.data?.name || '',
        });
        chartsList.value = (dataList || []).reverse();
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
                    'yyyy-MM-dd\nhh:mm:ss',
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
watch(
    () => prop.time,
    (val) => {
        const diffInSeconds = dayjs(val[1]).diff(dayjs(val[0]), 'minute');
        if (diffInSeconds < 60) {
            periodOptions.value = [
                {
                    label: '实际值',
                    value: '*',
                },
                {
                    label: '按分钟统计',
                    value: '1m',
                },
            ];
            cycle.value = '*';
        } else if (diffInSeconds < 1440) {
            periodOptions.value = [
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
            ];
            cycle.value = '*';
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
    },
    {
        deep: true,
        immediate: true,
    },
);

watch(
    () => [cycle.value, agg.value, prop.time],
    ([newCycle]) => {
        if (newCycle === '*' && _type.value) {
            queryChartsList();
        } else {
            queryChartsAggList();
        }
    },
    { deep: true, immediate: true },
);

watchEffect(() => {
    if (chartsList.value.length) {
        getOptions(chartsList.value);
    }
});
</script>
