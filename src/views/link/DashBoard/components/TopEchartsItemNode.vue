<template>
    <div class="echarts-item">
        <div class="echarts-item-left">
            <div class="echarts-item-title">{{ title }}</div>
            <div class="echarts-item-value">
                {{ value || 0 }} {{ formatter || '%' }}
            </div>
            <div v-if="!!bottom" class="echarts-item-bottom">{{ bottom }}</div>
        </div>
        <div class="echarts-item-right">
            <div ref="chartRef" style="width: 100%; height: 100px"></div>
        </div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    name: 'TopEchartsItemNode',
    props: {
        title: {
            type: String,
            default: '',
        },
        value: {
            type: Number,
            default: 0,
        },
        max: {
            type: Number,
            default: 0,
        },
        bottom: {
            type: String,
            default: '',
        },
        formatter: {
            type: String,
            default: '%',
        },
    },
    data() {
        return {
            options: {},
        };
    },
    methods: {
        createChart(val) {
            const chart = this.$refs.chartRef;
            if (chart && Object.keys(val).length > 0) {
                const myChart = echarts.init(chart);
                myChart.setOption(val);
                window.addEventListener('resize', function () {
                    myChart.resize();
                });
            }
        },
        getOptions(max, formatter, val) {
            let formatterCount = 0;
            this.options = {
                series: [
                    {
                        type: 'gauge',
                        min: 0,
                        max: max || 100,
                        startAngle: 200,
                        endAngle: -20,
                        center: ['50%', '67%'],
                        title: {
                            show: false,
                        },
                        axisTick: {
                            distance: -20,
                            lineStyle: {
                                width: 1,
                                color: 'rgba(0,0,0,0.15)',
                            },
                        },
                        splitLine: {
                            distance: -22,
                            length: 9,
                            lineStyle: {
                                width: 1,
                                color: '#000',
                            },
                        },
                        axisLabel: {
                            distance: -22,
                            color: 'auto',
                            fontSize: 12,
                            width: 30,
                            padding: [6, 10, 0, 10],
                            formatter: (value) => {
                                formatterCount += 1;
                                if ([1, 3, 6, 9, 11].includes(formatterCount)) {
                                    return value + (formatter || '%');
                                }
                                return '';
                            },
                        },
                        pointer: {
                            length: '80%',
                            width: 4,
                            itemStyle: {
                                color: 'auto',
                            },
                        },
                        anchor: {
                            show: true,
                            showAbove: true,
                            size: 20,
                            itemStyle: {
                                borderWidth: 3,
                                borderColor: '#fff',
                                shadowBlur: 20,
                                shadowColor: 'rgba(0, 0, 0, .25)',
                                color: 'auto',
                            },
                        },
                        axisLine: {
                            lineStyle: {
                                width: 10,
                                color: [
                                    [0.25, 'rgba(36, 178, 118, 1)'],
                                    [
                                        0.4,
                                        new echarts.graphic.LinearGradient(
                                            0,
                                            0,
                                            0,
                                            1,
                                            [
                                                {
                                                    offset: 0,
                                                    color: 'rgba(66, 147, 255, 1)',
                                                },
                                                {
                                                    offset: 1,
                                                    color: 'rgba(36, 178, 118, 1)',
                                                },
                                            ],
                                        ),
                                    ],
                                    [
                                        0.5,
                                        new echarts.graphic.LinearGradient(
                                            0,
                                            0,
                                            0,
                                            1,
                                            [
                                                {
                                                    offset: 0,
                                                    color: 'rgba(250, 178, 71, 1)',
                                                },
                                                {
                                                    offset: 1,
                                                    color: 'rgba(66, 147, 255, 1)',
                                                },
                                            ],
                                        ),
                                    ],
                                    [
                                        1,
                                        new echarts.graphic.LinearGradient(
                                            0,
                                            0,
                                            0,
                                            1,
                                            [
                                                {
                                                    offset: 0,
                                                    color: 'rgba(250, 178, 71, 1)',
                                                },
                                                {
                                                    offset: 1,
                                                    color: 'rgba(247, 111, 93, 1)',
                                                },
                                            ],
                                        ),
                                    ],
                                ],
                            },
                        },
                        detail: {
                            show: false,
                        },
                        data: [{ value: val || 0 }],
                    },
                ],
            };
        },
    },
    watch: {
        options: {
            handler(val) {
                this.createChart(val);
            },
            immediate: true,
            deep: true,
        },
        max: {
            handler(val) {
                this.getOptions(val, this.formatter, this.value);
            },
            immediate: true,
            deep: true,
        },
        value: {
            handler(val) {
                this.getOptions(this.max, this.formatter, val);
            },
            immediate: true,
            deep: true,
        },
        formatter: {
            handler(val) {
                this.getOptions(this.max, val, this.value);
            },
            immediate: true,
            deep: true,
        },
    },
};
</script>

<style lang="less" scoped>
.echarts-item {
    display: flex;
    height: 150px;
    padding: 16px;
    background-color: #fff;
    box-shadow: 0px 2.73036px 5.46071px rgba(31, 89, 245, 0.2);

    .echarts-item-left {
        display: flex;
        flex-direction: column;
        width: 45%;
    }

    .echarts-item-right {
        width: 55%;
    }

    .echarts-item-title {
        margin-bottom: 8px;
        color: rgba(#000, 0.6);
        font-size: 16px;
    }

    .echarts-item-value {
        font-weight: bold;
        font-size: 36px;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
    }

    .echarts-item-bottom {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: center;
        height: 0;
        padding-left: 12px;

        &::before {
            position: absolute;
            top: 50%;
            left: 0;
            width: 4px;
            height: 12px;
            background-color: #ff595e;
            transform: translateY(-50%);
            content: ' ';
        }
    }
}
</style>
