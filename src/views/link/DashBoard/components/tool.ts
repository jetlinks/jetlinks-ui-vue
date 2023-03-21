import dayjs from 'dayjs';
import * as echarts from 'echarts';

export const getInterval = (type: string) => {
    switch (type) {
        case 'year':
            return '30d';
        case 'month':
        case 'week':
            return '1d';
        case 'hour':
            return '1m';
        default:
            return '1h';
    }
};
export const getTimeFormat = (type: string) => {
    switch (type) {
        case 'year':
            return 'YYYY-MM-DD';
        case 'month':
        case 'week':
            return 'MM-DD';
        case 'hour':
            return 'HH:mm';
        default:
            return 'HH';
    }
};

export const getTimeByType = (type: string) => {
    switch (type) {
        case 'hour':
            return dayjs().subtract(1, 'hours');
        case 'week':
            return dayjs().subtract(6, 'days');
        case 'month':
            return dayjs().subtract(29, 'days');
        case 'year':
            return dayjs().subtract(365, 'days');
        default:
            return dayjs().startOf('day');
    }
};

export const arrayReverse = (data: string) => {
    const newArray = [];
    for (let i = data.length - 1; i >= 0; i--) {
        newArray.push(data[i]);
    }
    return newArray;
};

export const networkParams = (val: any) => [
    {
        dashboard: 'systemMonitor',
        object: 'network',
        measurement: 'traffic',
        dimension: 'agg',
        group: 'network',
        params: {
            type: val.type,
            interval: getInterval(val.time.type),
            from: dayjs(val.time.time[0]).valueOf(),
            to: dayjs(val.time.time[1]).valueOf(),
        },
    },
];
export const defulteParamsData = (group: any, val: any) => [
    {
        dashboard: 'systemMonitor',
        object: 'stats',
        measurement: 'info',
        dimension: 'history',
        group,
        params: {
            from: dayjs(val.time[0]).valueOf(),
            to: dayjs(val.time[1]).valueOf(),
        },
    },
];

export const areaStyle = {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 1,
            color: 'rgba(151, 154, 255, 0)',
        },
        {
            offset: 0,
            color: 'rgba(151, 154, 255, .24)',
        },
    ]),
};
export const areaStyleCpu = {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 1,
            color: 'rgba(44, 182, 224, 0)',
        },
        {
            offset: 0,
            color: 'rgba(44, 182, 224, .24)',
        },
    ]),
};
export const areaStyleJvm = {
    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        {
            offset: 1,
            color: 'rgba(96, 223, 199, 0)',
        },
        {
            offset: 0,
            color: 'rgba(96, 223, 199, .24)',
        },
    ]),
};

export const typeDataLine = [
    {
        data: [],
        type: 'line',
    },
];

export const topOptionsSeries = {
    type: 'gauge',
    min: 0,
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
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(66, 147, 255, 1)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(36, 178, 118, 1)',
                        },
                    ]),
                ],
                [
                    0.5,
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(250, 178, 71, 1)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(66, 147, 255, 1)',
                        },
                    ]),
                ],
                [
                    1,
                    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgba(250, 178, 71, 1)',
                        },
                        {
                            offset: 1,
                            color: 'rgba(247, 111, 93, 1)',
                        },
                    ]),
                ],
            ],
        },
    },
    detail: {
        show: false,
    },
};
