import { getDicList } from '@/api/data-report/commonApi';
import { columns } from '@/views/data-report/AlarmSheet/columnConfig';

interface IAlarmDesc {
    alarmValue: string;
    dicDesc: string;
}

interface IDicMap {
    alarmKey: string;
    alarmDescArr: IAlarmDesc[];
}

const useFilterAlarmDesc = (columns: any[]) => {
    // 存储告警信息
    const dicMap = reactive<IDicMap[]>([]);
    //
    const tableColumns = reactive([...columns]);

    // 处理告警信息为dictId: [{dicValue, dicDesc},{dicValue, dicDesc},...]的格式
    const setDicMap = async () => {
        const res: any = await getDicList({
            pageSize: 9999,
            pageNum: 0,
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
                    const dictIdIndex = dicMap.findIndex(
                        (item) => item.alarmKey === dic.dictId,
                    );
                    // 判断dictId是否在dicMap中，如果在，则添加dicDesc，否则创建新的字典
                    if (dictIdIndex === -1) {
                        dicMap.push({
                            alarmKey: dic.dictId,
                            alarmDescArr: [
                                { alarmValue: dic.value, dicDesc: dic.text },
                            ],
                        });
                    } else {
                        const alarmDescArr = dicMap[dictIdIndex].alarmDescArr;
                        let addFlag = true;
                        for (let i = 0; i < alarmDescArr.length; i++) {
                            if (alarmDescArr[i].alarmValue === dic.value) {
                                addFlag = false;
                                break;
                            }
                        }
                        addFlag &&
                            alarmDescArr.push({
                                alarmValue: dic.value,
                                dicDesc: dic.text,
                            });
                    }
                });
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

            // 每次请求时，获取字典数据，以确保字典数据是最新的
            await setDicMap();

            // 包装实际的请求函数，添加字典数据对应的描述
            const resp: any = await requestFunc(data);
            if (resp.status === 200) {
                const records = resp.result.data;

                // 2.为表格的每条数据对象添加描述（description）字段
                records.forEach((record: any) => {
                    const { alarmDictionaryKey, alarmDictionaryValue } = record;

                    // 默认无内容时显示--
                    let description: string = '--';

                    // 获取当前数据的alarmDictionaryKey在字典中的索引，判断这条数据的告警是否存在对应的字典
                    const index = dicMap.findIndex(
                        (item) => item.alarmKey === alarmDictionaryKey,
                    );

                    // 字典存在则遍历告警字典数组，找到对应的告警描述添加到当前数据对象中
                    if (index !== -1) {
                        const alarmDescArr = dicMap[index].alarmDescArr;
                        for (let i = 0; i < alarmDescArr.length; i++) {
                            if (
                                alarmDescArr[i].alarmValue ===
                                alarmDictionaryValue
                            ) {
                                description = alarmDescArr[i].dicDesc;
                                break;
                            }
                        }
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

    // 监听字典变化，更新搜索下拉框
    watch(dicMap, (newDicMap) => {
        const options: any[] = [];
        // 展开树结构的告警字典，用于搜索的下拉框显示
        newDicMap.forEach((dicItem) => {
            const alarmKey = dicItem.alarmKey;
            dicItem.alarmDescArr.forEach((alarmDesc: any) => {
                options.push({
                    label: alarmDesc.dicDesc,
                    alarmDictionaryValue: alarmDesc.alarmValue,
                    alarmDictionaryKey: alarmKey,
                    value: alarmDesc.dicDesc,
                });
            });
        });
        tableColumns.forEach((item) => {
            if (item.key === 'description') {
                item.search.options = options;
            }
        });
    });
    return {
        queryDataFactory,
        dicMap,
        tableColumns,
    };
};

export default useFilterAlarmDesc;
