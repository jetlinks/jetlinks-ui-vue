import dayjs from 'dayjs';
import dayjs from 'dayjs';

const getParams = (dt: any) => {
    switch (dt.type) {
        case 'today':
            return {
                limit: 24,
                interval: '1h',
                format: 'HH:mm',
            };
        case 'week':
            return {
                limit: 7,
                interval: '1d',
                format: 'MM-dd',
            };
        case 'hour':
            return {
                limit: 60,
                interval: '1m',
                format: 'HH:mm',
            };
        default:
            const time = dt.time[1] - dt.time[0];
            const hour = 60 * 60 * 1000;
            const days = hour * 24;
            const year = days * 365;
            if (time <= hour) {
                return {
                    limit: Math.abs(Math.ceil(time / (60 * 60))),
                    interval: '1m',
                    format: 'HH:mm',
                };
            } else if (time > hour && time <= days) {
                return {
                    limit: Math.abs(Math.ceil(time / hour)),
                    interval: '1h',
                    format: 'HH:mm',
                };
            } else if (time >= year) {
                return {
                    limit: Math.abs(Math.ceil(time / days / 31)) + 1,
                    interval: '1M',
                    format: 'yyyy年-M月',
                };
            } else {
                return {
                    limit: Math.abs(Math.ceil(time / days)) + 1,
                    interval: '1d',
                    format: 'MM-dd',
                };
            }
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

export const pointParams = (data: any) => [
    {
        dashboard: 'collector',
        object: 'pointData',
        measurement: 'quantity',
        dimension: 'agg',
        params: {
            limit: getParams(data.time).limit,
            from: data.time.start,
            to: data.time.end,
            interval: getParams(data.time).interval,
            format: getParams(data.time).format,
        },
    },
];

export const pointOptionsSeries = {
    type: 'line',
    smooth: true,
    color: '#60DFC7',
    areaStyle: {
        color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
                {
                    offset: 0,
                    color: '#60DFC7', // 100% 处的颜色
                },
                {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                },
            ],
            global: false, // 缺省为 false
        },
    },
};

export const defaultParams = {
    terms: [
        {
            column: 'runningState',
            termType: 'not',
            value: 'running',
        },
    ],
};

export const statusData = [
    [
        {
            type: 'channel',
            title: '异常通道',
            status: 'error',
            label: '通道数量',
            value: 0,
            total: 0,
        },
    ],
    [
        {
            type: 'collector',
            title: '异常采集器',
            status: 'error',
            label: '采集器数量',
            value: 0,
            total: 0,
        },
    ],
    [
        {
            type: 'point',
            title: '异常点位',
            status: 'error',
            label: '采集点位',
            value: 0,
            total: 0,
        },
    ],
];
