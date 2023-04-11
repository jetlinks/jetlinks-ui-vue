<!-- 物联卡-首页 -->
<template>
    <page-container>
        <j-row :gutter="[24, 24]">
            <j-col :xxl="14" :xl='24'>
                <div class="home-guide">
                    <Guide title="物联卡引导"></Guide>
                    <div
                        class="home-guide-items"
                        :style="`grid-template-columns: repeat(${
                            guideList ? guideList.length : 1
                        }, 1fr);`"
                    >
                        <div
                            v-for="(item, index) in guideList"
                            :key="index"
                            class="home-guide-item step-bar arrow-2 pointer"
                            @click="jumpPage(item)"
                        >
                            <div class="item-english">{{ item.english }}</div>
                            <div class="item-title">{{ item.name }}</div>
                            <div class="item-index">
                                <img :src="Image[index + 1]" />
                            </div>
                        </div>
                    </div>
                </div>
            </j-col>
            <j-col :xxl="10" :xl='24'>
                <div class="home-statistics">
                    <Guide title="基础统计">
                        <template #extra>
                            <span class="extra-text" @click="jumpDashboard"
                                >详情</span
                            >
                        </template>
                    </Guide>
                    <div class="home-statistics-body">
                        <div class="home-guide-item">
                            <div class="item-english">昨日流量统计</div>
                            <div class="item-title">{{ currentSource }} M</div>
                            <div
                                class="item-index-echarts"
                                style="height: 75px; width: 110px"
                            >
                                <div class="chart" ref="todayFlowChart"></div>
                            </div>
                        </div>
                        <div class="home-guide-item">
                            <div class="item-english">物联卡</div>
                            <div class="item-content">
                                <div
                                    v-for="iten in pieChartData"
                                    :key="iten.key"
                                    class="item-node"
                                >
                                    <div class="item-node-text">
                                        {{ iten.value }}
                                    </div>
                                    <div :class="`state ${iten.className}`">
                                        {{ iten.name }}
                                    </div>
                                </div>
                            </div>
                            <div
                                class="item-index-echarts"
                                style="height: 75px; width: 110px"
                            >
                                <div class="chart" ref="iotCardChart"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </j-col>
            <j-col :span="24">
                <div class="home-body">
                    <Guide
                        title="平台架构图"
                        english="PLATFORM ARCHITECTURE DIAGRAM"
                    />
                    <div class="home-body-img">
                        <img :src="getImage('/iot-card/iotcard-home.png')" />
                    </div>
                </div>
            </j-col>
        </j-row>
    </page-container>
</template>

<script setup lang="ts" name='IotCardHome'>
import { getImage } from '@/utils/comm';
import Guide from '../components/Guide.vue';
import moment from 'moment';
import { queryFlow, list } from '@/api/iot-card/home';
import * as echarts from 'echarts';
import { useMenuStore } from '@/store/menu';
import { usePermissionStore } from '@/store/permission';
import { message } from 'jetlinks-ui-components'

const { proxy } = <any>getCurrentInstance();

interface GuideItemProps {
    key: string;
    name: string;
    english: string;
    url: string;
    param?: Record<string, any>;
    index?: number;
    auth: boolean;
}
const menuStory = useMenuStore();
const menuHasPermission = useMenuStore().hasPermission;
const btnHasPermission = usePermissionStore().hasPermission;

// 菜单权限
const dashBoardUrl = menuHasPermission('iot-card/Dashboard');
const platformUrl = menuHasPermission('iot-card/Platform/Detail');
const recordUrl = menuHasPermission('iot-card/Record');
const cardUrl = menuHasPermission('iot-card/CardManagement');

// 按钮权限
const paltformPermission = btnHasPermission(`iot-card/Platform:add`);
const cardPermission = btnHasPermission(`iot-card/CardManagement:add`);

const Image = {
    1: getImage('/home/1.png'),
    2: getImage('/home/2.png'),
    3: getImage('/home/3.png'),
};
const guideList = [
    {
        key: 'EQUIPMENT',
        name: '平台对接',
        english: 'STEP1',
        auth: paltformPermission,
        // url: platformUrl,
        url: 'iot-card/Platform/Detail',
    },
    {
        key: 'SCREEN',
        name: '物联卡管理',
        english: 'STEP2',
        auth: !!cardPermission,
        // url: cardUrl,
        url: 'iot-card/CardManagement',
        param: { save: true },
    },
    {
        key: 'CASCADE',
        name: '操作记录',
        english: 'STEP3',
        auth: !!recordUrl,
        // url: recordUrl,
        url: 'iot-card/Record',
    },
];

const currentSource = ref<number>(0);
const barChartData = ref<any[]>([]);
const pieChartData = ref<any[]>([
    {
        key: 'using',
        name: '正常',
        value: 0,
        className: 'normal',
    },
    {
        key: 'toBeActivated',
        name: '未激活',
        value: 0,
        className: 'notActive',
    },
    {
        key: 'deactivate',
        name: '停用',
        value: 0,
        className: 'stopped',
    },
]);

const jumpPage = (data: GuideItemProps) => {
    if (!data.auth){
        message.warning('暂无权限，请联系管理员');
        return
    }
    if (data.key === 'EQUIPMENT') {
        menuStory.jumpPage(data.url, { id: ':id'});
    } else {
      let params: any = undefined
      if (data.key === 'SCREEN') {
        params = { type: 'add'}
      }
        menuStory.jumpPage(data.url, params);
    }
};

const jumpDashboard = () => {
    menuStory.jumpPage('iot-card/Dashboard');
};

/**
 * 获取昨日流量消耗
 */
const getTodayFlow = async () => {
    const beginTime = moment().subtract(1, 'days').startOf('day').valueOf();
    const endTime = moment().subtract(1, 'days').endOf('day').valueOf();
    const resp: any = await queryFlow(beginTime, endTime, { orderBy: 'date' });
    resp.result.map((item: any) => {
        currentSource.value += parseFloat(item.value.toFixed(2));
    });
};

/**
 * 获取最近15天流量消耗统计图数据
 */
const get15DaysTrafficConsumption = async () => {
    const beginTime = moment().subtract(15, 'days').startOf('day').valueOf();
    const endTime = moment().subtract(1, 'days').endOf('day').valueOf();
    const resp: any = await queryFlow(beginTime, endTime, { orderBy: 'date' });
    barChartData.value = resp.result
        .map((item: any) => ({
            ...item,
        }))
        .reverse();
    createBarChart();
};

/**
 * 获取物联卡状态数据
 */
const getStateCard = async () => {
    Promise.all(
        pieChartData.value.map((item) => {
            const params = {
                terms: [
                    {
                        terms: [
                            {
                                column: 'cardStateType',
                                termType: 'eq',
                                value: item.key,
                            },
                        ],
                    },
                ],
            };
            return list(params);
        }),
    )
        .then((resp) => {
            resp.forEach((i: any, index) => {
                if (i.success) {
                    pieChartData.value[index].value = i.result.total;
                }
            });
            createPieChart();
        })
        .catch((err) => {
            console.log(err);
        });
};

/**
 * 最近15天流量消耗统计图
 */
const createBarChart = () => {
    const myChart = echarts.init(proxy.$refs.todayFlowChart);

    const options = {
        tooltip: {},
        xAxis: {
            show: false,
            data: barChartData.value.map((m) => m.date),
        },
        yAxis: {
            show: false,
        },
        series: [
            {
                name: '流量消耗',
                type: 'bar',
                color: '#FACD89',
                // barWidth: '5%', // 设单柱状置宽度
                showBackground: true, //设置柱状的背景虚拟
                data: barChartData.value.map((m) =>
                    parseFloat(m.value.toFixed(2)),
                ),
            },
        ],
    };
    myChart.setOption(options);
    window.addEventListener('resize', function () {
        myChart.resize();
    });
};
/**
 * 物联卡饼图
 */
const createPieChart = () => {
    nextTick(() => {
        const myChart = echarts.init(proxy.$refs.iotCardChart);

        const options = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)',
            },
            color: ['#85a5ff', '#f29b55', '#c4c4c4'],
            series: [
                {
                    name: '',
                    type: 'pie',
                    avoidLabelOverlap: true, //是否启用防止标签重叠策略
                    radius: ['50%', '90%'],
                    center: ['50%', '50%'],
                    itemStyle: {
                        borderColor: 'rgba(255,255,255,1)',
                        borderWidth: 2,
                    },
                    label: {
                        normal: {
                            show: false,
                        },
                    },
                    data: pieChartData.value,
                },
            ],
        };
        myChart.setOption(options);
        window.addEventListener('resize', function () {
            myChart.resize();
        });
    });
};

watch(
    barChartData.value,
    () => {
        createBarChart();
    },
    { deep: true },
);

getTodayFlow();
get15DaysTrafficConsumption();
getStateCard();
</script>

<style scoped lang="less">
.home-base {
    position: relative;
    padding: 24px 16px;
    background-color: #fff;
}

.home-guide {
    padding: 24px 16px;
    background-color: #fff;

    .home-guide-items {
        display: grid;
        grid-column-gap: 56px;
    }
}

.home-guide-item {
    position: relative;
    padding: 16px;
    background: linear-gradient(
        135.62deg,
        #f6f7fd 22.27%,
        rgba(255, 255, 255, 0.86) 91.82%
    );
    border-radius: 2px;
    box-shadow: 0 4px 18px #efefef;
    .state {
        position: relative;
        padding-left: 8px;
        &::before {
            position: absolute;
            top: 7px;
            left: 0;
            display: inline-block;
            width: 6px;
            height: 6px;
            margin-right: 2px;
            content: '';
        }
        &.normal::before {
            background: #85a5ff;
        }
        &.notActive::before {
            background: #f29b55;
        }
        &.stopped::before {
            background: #c4c4c4;
        }
    }

    &.pointer {
        cursor: pointer;
    }

    .item-english {
        color: #4f4f4f;
    }

    .item-content {
        display: flex;
        margin-top: 15px;
        width: 80%;
    }

    .item-node {
        min-width: 58px;
        margin-right: 8px;
        z-index: 1;

        .item-node-text {
            font-size: 14px;
            font-weight: bold;
        }
    }

    .item-title {
        margin: 20px 0;
        color: @text-color;
        font-weight: 700;
        font-size: 20px;
    }

    .item-index {
        position: absolute;
        right: 10%;
        bottom: 0;
    }

    .item-index-echarts {
        .item-index;

        right: 12px;
        bottom: 5%;
        z-index: 0;
        width: 50%;

        .chart {
            width: 100%;
            height: 100%;
        }
    }
}

.home-body {
    .home-base;

    min-height: 444px;
    margin-bottom: 24px;
    // padding-bottom: 26.5%;
    padding-bottom: 30%;
    overflow: hidden;
    border-bottom: 1px solid #2f54eb;

    .home-body-img {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;

        > img {
            width: 100%;
            height: 100%;
        }
    }
}

.home-statistics {
    .home-base;

    .extra-text {
        cursor: pointer;
        color: @primary-color;
    }

    .home-statistics-body {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }
}

.step-item-after {
    position: absolute;
    top: 50%;
    right: -60px;
    width: 60px;
    height: 40px;
    transform: translateY(-50%);
    content: ' ';
}

.home-step {
    .home-base;

    .home-step-items {
        display: grid;
        grid-column-gap: 66px;

        .step-item {
            display: flex;
            flex-direction: column;

            .step-item-title {
                position: relative;
                padding: 16px 24px;
                color: #333;
                font-weight: bold;
                font-size: 14px;
                background-color: #f8f9fd;
                cursor: pointer;

                .step-item-img {
                    position: absolute;
                    top: 0;
                    right: 0;
                    z-index: 1;
                    height: 100%;

                    img {
                        height: 100%;
                    }
                }

                > span {
                    position: relative;
                    z-index: 2;
                }
            }

            .step-item-content {
                flex-grow: 1;
                height: auto;
                padding: 24px;
                border-right: 1px solid #e5edf4;
                border-bottom: 1px solid #e5edf4;
                border-left: 1px solid #e5edf4;
            }
        }
    }
}

.step-bar {
    position: relative;

    &.arrow-1 {
        &:not(:last-child) {
            &::after {
                .step-item-after;

                background: url('/images/home/arrow-1.png') no-repeat center;
            }
        }
    }

    &.arrow-2 {
        &:not(:last-child) {
            &::after {
                .step-item-after;

                background: url('/images/home/arrow-2.png') no-repeat center;
            }
        }
    }
}
</style>
