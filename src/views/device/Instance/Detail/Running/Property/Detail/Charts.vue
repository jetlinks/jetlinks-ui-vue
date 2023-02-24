<template>
    <a-spin :spinning="loading">
        <div>
            <a-space>
                <div>
                    统计周期：
                    <a-select v-model:value="cycle" style="width: 120px">
                        <a-select-option value="*" v-if="_type"
                            >实际值</a-select-option
                        >
                        <a-select-option value="1m">按分钟统计</a-select-option>
                        <a-select-option value="1h">按小时统计</a-select-option>
                        <a-select-option value="1d">按天统计</a-select-option>
                        <a-select-option value="1w">按周统计</a-select-option>
                        <a-select-option value="1M">按月统计</a-select-option>
                    </a-select>
                </div>
                <div v-if="cycle !== '*' && _type">
                    统计规则：
                    <a-select v-model:value="agg" style="width: 120px">
                        <a-select-option value="AVG">平均值</a-select-option>
                        <a-select-option value="MAX">最大值</a-select-option>
                        <a-select-option value="MIN">最小值</a-select-option>
                        <a-select-option value="COUNT">总数</a-select-option>
                    </a-select>
                </div>
            </a-space>
        </div>
        <div style="width: 100%; height: 500px">
            <Chart :options="options" v-if="chartsList.length" />
            <JEmpty v-else />
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import { getPropertiesInfo, getPropertiesList } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import Chart from './Chart.vue';
import * as echarts from 'echarts';

const list = ['int', 'float', 'double', 'long'];

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

const cycle = ref<string>('*');
const agg = ref<string>('AVG');
const loading = ref<boolean>(false);
const chartsList = ref<any[]>([]);
const instanceStore = useInstanceStore();
const options = ref({});

const _type = computed(() => {
    const flag = list.includes(prop.data?.valueType?.type || '')
    cycle.value =  flag ? '*' : '1m'
    return flag
});

const queryChartsAggList = async () => {
    loading.value = true;
    const resp = await getPropertiesInfo(instanceStore.current.id, {
        columns: [
            {
                property: prop.data.id,
                alias: prop.data.id,
                agg: agg.value,
            },
        ],
        query: {
            interval: cycle.value,
            format: 'yyyy-MM-dd HH:mm:ss',
            from: prop.time[0],
            to: prop.time[1],
        },
    });
    loading.value = false;
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
    );
    loading.value = false;
    if (resp.status === 200) {
        const dataList: any[] = [
            {
                year: prop.time[0],
                value: undefined,
                type: prop.data?.name || '',
            },
        ];
        (resp.result as any)?.data?.forEach((i: any) => {
            dataList.push({
                ...i,
                year: i.timestamp,
                value: i.value,
                type: prop.data?.name || '',
            });
        });
        dataList.push({
            year: prop.time[1],
            value: undefined,
            type: prop.data?.name || '',
        });
        chartsList.value = dataList || [];
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
                end: 10,
            },
            {
                start: 0,
                end: 10,
            },
        ],
        tooltip: {
            trigger: 'axis',
            position: function (pt: any) {
                return [pt[0], '10%'];
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
    () => [cycle, agg],
    ([newCycle, newAgg]) => {
        if (newCycle.value === '*' && _type.value) {
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