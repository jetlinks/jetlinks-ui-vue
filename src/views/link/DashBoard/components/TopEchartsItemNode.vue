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
import { topOptionsSeries } from './tool';
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
            myChart: undefined
        };
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize)
    },
    methods: {
        createChart(val) {
            const chart = this.$refs.chartRef;
            if (chart && Object.keys(val).length > 0 && !this.myChart) {
              console.log('createChart')
                this.myChart = echarts.init(chart);
                this.myChart.setOption(val);
                window.addEventListener('resize', this.resize);
            } else if (this.myChart) {
              this.myChart.setOption(val);
            }
        },
        resize() {
          this.myChart?.resize();
        },
        getOptions(max, formatter, val) {
            let formatterCount = 0;
            this.options = {
                series: [
                    {
                        ...topOptionsSeries,
                        max: max || 100,
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
    // box-shadow: 0px 2.73036px 5.46071px rgba(31, 89, 245, 0.2);
    border: 1px solid #e0e4e8;
    border-radius: 2px;
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
