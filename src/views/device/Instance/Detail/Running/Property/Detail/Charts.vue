<template>
    <j-spin :spinning="loading">
        <div>
            <j-space>
                <div>
                    {{ $t('Detail.Charts.2866713-0') }}
                    <j-select
                        v-model:value="cycle"
                        style="width: 120px"
                        :options="periodOptions"
                    >
                    </j-select>
                </div>
                <div v-if="cycle !== '*' && _type">
                    {{ $t('Detail.Charts.2866713-1') }}
                    <j-select v-model:value="agg" style="width: 120px">
                        <j-select-option value="AVG">{{ $t('Detail.Charts.2866713-2') }}</j-select-option>
                        <j-select-option value="MAX">{{ $t('Detail.Charts.2866713-3') }}</j-select-option>
                        <j-select-option value="MIN">{{ $t('Detail.Charts.2866713-4') }}</j-select-option>
                        <j-select-option value="COUNT">{{ $t('Detail.Charts.2866713-5') }}</j-select-option>
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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

        const dataList: any[] = [
        ];
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
            name: $t('Detail.Charts.2866713-6'),
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
                    label: $t('Detail.Charts.2866713-7'),
                    value: '*',
                },
                {
                    label: $t('Detail.Charts.2866713-8'),
                    value: '1m',
                },
            ];
            cycle.value = '*';
        } else if (diffInSeconds < 1440) {
            periodOptions.value = [
                {
                    label: $t('Detail.Charts.2866713-7'),
                    value: '*',
                },
                {
                    label: $t('Detail.Charts.2866713-8'),
                    value: '1m',
                },
                {
                    label: $t('Detail.Charts.2866713-9'),
                    value: '1h',
                },
            ];
            cycle.value = '*';
        } else if (diffInSeconds < 43200) {
            periodOptions.value = [
                {
                    label: $t('Detail.Charts.2866713-9'),
                    value: '1h',
                },
                {
                    label: $t('Detail.Charts.2866713-10'),
                    value: '1d',
                },
            ];
            cycle.value = '1h';
        } else {
            periodOptions.value = [
                {
                    label: $t('Detail.Charts.2866713-10'),
                    value: '1d',
                },
                {
                    label: $t('Detail.Charts.2866713-11'),
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
