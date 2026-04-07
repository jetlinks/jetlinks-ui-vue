import dayjs, { Dayjs } from 'dayjs';
import * as echarts from 'echarts';

// export const getInterval = (type: string) => {
//     switch (type) {
//         case 'year':
//             return '30d';
//         case 'month':
//         case 'week':
//             return '1d';
//         case 'hour':
//             return '1m';
//         case 'today':
//             return '1h';
//         default:
//             return '1h';
//     }
// };
export const getTimeFormat = (type: string) => {
    switch (type) {
        case 'year':
            return 'YYYY-MM-DD';
        case 'month':
        case 'week':
            return 'MM-DD';
        case 'today':
        case 'hour':
            return 'HH:mm';
        default:
            return 'YYYY-MM-DD HH:mm:ss';
    }
};

export const getTimeByType = (type: string) => {
    switch (type) {
        case 'hour':
            return dayjs().subtract(1, 'hours');
        case 'week':
            return dayjs().subtract(6, 'days').startOf('day');
        case 'month':
            return dayjs().subtract(29, 'days');
        case 'year':
            return dayjs().subtract(365, 'days');
        case 'day':
            return dayjs().subtract(24, 'hours');
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

export const networkParams = (val: any) => {
    let _time = '1h';
    let _limit = 12;
    let format = 'M月dd日 HH:mm';
    // @ts-ignore
    const dt = dayjs(val.time.time[1]) - dayjs(val.time.time[0])
    const hour = 60 * 60 * 1000;
    const days = hour * 24;
    const months = days * 30;
    const year = 365 * days;

    if (dt <= (hour + 10)) {
        format = 'HH:mm';
        _time = '1m';
        _limit = 60;
    } else if (dt > hour && dt <= days) {
        _limit = 24;
    } else if (dt > days && dt <= months * 3) {
        _limit = Math.abs(Math.ceil(dt / days)) + 1;
        _time = '1d';
        format = 'M月dd日';
    } else if (dt > months * 3 && dt < year) {
        _limit = Math.abs(Math.ceil(dt / months)) + 1;
        _time = '1M';
        format = 'M月dd日';
    } else if (dt >= year) {
        _limit = Math.abs(Math.floor(dt / months));
        _time = '1M';
        format = 'yyyy年-M月';
    }
    return [
        {
            dashboard: 'systemMonitor',
            object: 'network',
            measurement: 'traffic',
            dimension: 'agg',
            group: 'network-group',
            params: {
                type: val.type,
                interval: _time,
                from: Number(val.time.time[0]),
                to: Number(val.time.time[1]),
                limit: _limit,
                format: format,
            },
        },
    ];
};
export const defaultParamsData = (group: any, val: any) => [
    {
        dashboard: 'systemMonitor',
        object: 'stats',
        measurement: 'info',
        dimension: 'history',
        group,
        params: {
            from: dayjs(val.time[0]).valueOf(),
            to: dayjs(val.time[1]).valueOf(),
            format: 'YYYY-MM-dd HH:mm',
        },
    },
];

export const colorNetwork = ['#FF7D00', '#FFC300', '#37E2E2', '#165DFF', '#722ED1']
export const colorCpu = ['#313CA9', '#21CCFF', '#249EFF', '#86DF6C', '#979AFF']
export const colorJvm = ['#246EFF', '#00B2FF', '#81E2FF', '#2CAB40', '#8D4EDA']

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
