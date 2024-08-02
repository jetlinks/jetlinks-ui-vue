import { EChartsOption } from 'echarts';

const colors = [
    '#F84914',
    '#FF9100',
    '#F5D428',
    '#4DC0F4',
    '#176bf8',
    '#9050FA',
    '#4dc0f4',
    '#531bfa',
    '#ff3325',
];

interface categoryType {
    name: string;
    value: number;
    rate: number;
}

const categoryOptions = (totalCount: number, data: categoryType[]) => {
    const option: EChartsOption = {
        backgroundColor: 'transparent',
        animation: true,
        tooltip: {
            show: true,
        },
        title: {
            text: `${totalCount ?? 0}`,
            subtext: '离线设备数量',
            left: '32%',
            top: '40%',
            itemGap: 8,
            textAlign: 'center',
            textStyle: {
                color: '#000000D9',
                fontSize: 32,
                lineHeight: 34,
                fontWeight: 500,
            },
            subtextStyle: {
                color: '#6B6F7F',
                fontSize: 16,
                lineHeight: 24,
                width: 56,
                fontWeight: 'normal',
            },
        },
        legend: [
            {
                orient: 'vertical',
                left: '50%',
                top: '30%',
                padding: [0, 30, 0, 0],
                itemHeight: 14,
                itemWidth: 14,
                itemGap: 16,
                data: data?.slice(0, 4),
                textStyle: {
                    fontSize: 16,
                    lineHeight: 24,
                    rich: {
                        name: {
                            width: 100,
                            fontWeight: 400,
                            fontSize: 18,
                            lineHeight: 26,
                            fontFamily: 'HarmonyOS_Sans_SC',
                            color: '#191C27',
                        },
                        value: {
                            width: 50,
                            fontFamily: 'HarmonyOS_Sans_SC',
                            fontSize: 20,
                            lineHeight: 28,
                            fontWeight: 500,
                            color: '#191C27',
                        },
                        rate: {
                            width: 40,
                            fontFamily: 'HarmonyOS_Sans_SC',
                            fontSize: 16,
                            lineHeight: 24,
                            fontWeight: 500,
                            color: '#6B6F7F',
                        },
                    },
                },
                formatter: function (params: any) {
                    const list = data?.filter((val) => val.name == params)[0];
                    return (
                        ` {name|${params}}   ` +
                        `{rate|${list.rate}%}    {value|${list.value}}`
                    );
                },
            },
        ],
        series: [
            {
                type: 'pie',
                center: ['32%', '48%'],
                radius: ['50%', '70%'],
                // itemStyle: {
                //     borderColor: '#fafbfc',
                //     borderWidth: 12,
                // },
                color: colors,
                startAngle: 100,
                labelLine: {
                    length: 15,
                },
                label: {
                    show: false,
                },
                data: data,
            },
        ],
    };
    return option;
};

export default categoryOptions;
