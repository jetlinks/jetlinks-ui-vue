import { getDicList } from '@/api/data-report/commonApi';

// 存储告警信息
const dicMap = new Map<string, any[]>();

// 处理告警信息为dictId: [{dicValue, dicDesc},{dicValue, dicDesc},...]的格式
(async () => {
    const res: any = await getDicList({
        sorts: [
            {
                name: 'ordinal',
                order: 'desc',
            },
        ],
    });
    if (res.status === 200) {
        const dicList = res.result.data;
        dicList &&
            dicList.forEach((dic: any) => {
                // 获取 value和desc映射 的 对象的数组
                const valMapDescArr = dicMap.get(dic.dictId);
                if (!valMapDescArr) {
                    dicMap.set(dic.dictId, [
                        { value: dic.value, desc: dic.text },
                    ]);
                } else {
                    valMapDescArr.push({ value: dic.value, desc: dic.text });
                }
            });
    }
})();

/**
 * @function useFilterAlarmDesc 过滤请求结果的告警信息
 * @param requestFunc 发送请求的函数
 * @param orderProperty 排序字段
 * @param mockData 模拟数据，可选参数
 */
export const useFilterAlarmDesc = (
    requestFunc: any,
    orderProperty: string,
    mockData: any = {},
) => {
    return async (_params: any) => {
        // 1.处理表格组件传递的参数
        const data = {
            ..._params,
            sorts: [
                {
                    name: orderProperty,
                    order: 'desc',
                },
            ],
        };
        const resp: any = await requestFunc(data);
        if (resp.status === 200) {
            const records = resp.result.data;
            // 2.为表格的每条数据对象添加描述（description）字段
            records.forEach((record: any) => {
                const dicKey = record.alarmDictionaryKey;
                const dicValue = record.alarmDictionaryValue;
                const valMapDescArr = dicMap.get(dicKey);
                valMapDescArr &&
                    valMapDescArr.forEach(
                        (item: { value: string; desc: string }) => {
                            if (item.value === dicValue)
                                record['description'] = item.desc;
                        },
                    );
            });
            return {
                // 3.仿造请求结果返回给表格
                code: resp.status,
                result: resp.result.data?.length > 0 ? resp.result : mockData,
                status: resp.status,
            };
        } else {
            return {
                code: 200,
                result: {
                    data: [],
                    pageIndex: 0,
                    pageSize: 0,
                    total: 0,
                },
                status: 200,
            };
        }
    };
};
