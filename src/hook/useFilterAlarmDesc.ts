import { getDicList, vehicleTypeEnum } from '@/api/data-report/commonApi';
import { Ref } from 'vue';
import { onlyMessage } from '@/utils/comm';

/**
 * @param dicMap 数据字典字面量对象，之所以用响应式数据，便于外层能使用
 * @param dicIds 字典id数组，用于查询告警信息
 */
export const useFilterAlarmDesc = (
    dicMap: Ref<Record<string, any>>,
    dicIds: string[],
) => {
    // 存储告警信息
    const vehicleTypeMap = ref<{ label: string; value: string }[]>([]);

    /**
     * @description 设置字典
     */
    const initDicMap = async () => {
        // 如果存在条件
        const resp = await getDicList({
            pageSize: 9999,
            pageNum: 0,
            sorts: [
                {
                    name: 'ordinal',
                    order: 'desc',
                },
            ],
            terms: [
                {
                    column: 'dictId',
                    value: dicIds,
                    termType: 'in',
                },
            ],
        });
        if (resp.status === 200) {
            resp.result.data.forEach((dic) => {
                dicMap.value[`${dic.dictId}_${dic.value}`] = dic.text;
            });
        }
    };

    /**
     * @function getVehicleTypeMap
     * @description 获取车辆类型数据集合
     */
    const getVehicleTypeMap = async () => {
        const res = await vehicleTypeEnum();
        if (res.status == 200) {
            vehicleTypeMap.value = res.result.map((item: any) => ({
                label: item.text,
                value: item.value,
            }));
        }
    };

    /**
     * @function queryDataFactory 请求函数工厂
     * @param requestFunc 发送请求的函数
     * @param orderProperty 排序字段
     */
    const queryDataFactory = (requestFunc: any, orderProperty: string) => {
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

            // 获取字典和车辆类型
            const resp1 = await Promise.allSettled([
                initDicMap(),
                getVehicleTypeMap(),
            ]);
            const flag = resp1.every((item) => item.status === 'fulfilled');
            if (!flag) onlyMessage('获取数据异常请刷新重试！', 'warning');

            // 包装实际的请求函数，添加字典数据对应的描述，如果前两个请求未能成功不影响显示，只是存在显示异常
            const resp: any = await requestFunc(data);
            if (resp.status === 200) {
                const records = resp.result.data;

                records.forEach((record: any) => {
                    // 获取字典数据key和value
                    const { alarmDictionaryKey, alarmDictionaryValue } = record;

                    // 默认无内容时显示--
                    let description: string = '--';
                    const key = `${alarmDictionaryKey}_${alarmDictionaryValue}`;

                    if (dicMap.value[key]) {
                        description = dicMap.value[key];
                    }
                    record.description = description;
                });
                // 3.仿造请求结果返回给表格
                return {
                    code: resp.status,
                    result: resp.result,
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

    /**
     * @function valueMapping2VehicleType
     * @description 根据value获取vehicleTypeMap中对应的label
     * @param value 值
     */
    const valueMapping2VehicleType = (value: string) => {
        const item = vehicleTypeMap.value.find((item) => item.value === value);
        if (!item) return '--';
        return item.label;
    };

    return {
        queryDataFactory,
        valueMapping2VehicleType,
    };
};
