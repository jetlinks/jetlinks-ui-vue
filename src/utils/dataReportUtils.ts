import dayjs from 'dayjs';

/**
 * @function handleTimeStamp 将搜索的时间转为时间戳
 * @param term 搜索条件
 */
export const handleTimeStamp = (term: { [key: string]: any }) => {
    const date = term.value;
    let timeStamp: number;
    if (term.termType === 'lte') {
        timeStamp = Number(dayjs(date).unix() + '999');
    } else {
        timeStamp = dayjs(date).valueOf();
    }
    term.value = timeStamp;
};

/**
 * @function handleSearchByDate 处理搜索条件为时间的情况
 * @param _params 搜索携带的条件
 * @param columns 要过滤的时间字段
 */
export const handleSearchByDate = (_params: any, columns: string[]) => {
    if (
        _params.terms &&
        _params.terms.length > 0 &&
        _params.terms[0].terms &&
        _params.terms[0].terms.length > 0
    ) {
        const column = _params.terms[0].terms[0].column;
        for (let i = 0; i < columns.length; i++) {
            // 只有在字段匹配，并且未被处理为时间戳时，才处理
            if (
                column === columns[i] &&
                typeof _params.terms[0].terms[0].value !== 'number'
            ) {
                handleTimeStamp(_params.terms[0].terms[0]);
                break;
            }
        }
    }
};

/**
 * @function handleSearchByDescription 处理搜索条件为描述的情况
 * @param _params
 * @param tableColumns
 */
export const handleSearchByDescription = (
    _params: any,
    tableColumns: any[],
) => {
    if (
        _params.terms &&
        _params.terms.length > 0 &&
        _params.terms[0].terms &&
        _params.terms[0].terms.length > 0
    ) {
        // 获取当前搜索字段
        const column = _params.terms[0].terms[0].column;
        if (column === 'description') {
            // 解构出搜索条件和值
            const { termType, value } = _params.terms[0].terms[0];
            // 遍历表格列，找到缓存表格列对应的描述字段
            tableColumns.forEach((column: any) => {
                if (column.dataIndex === 'description') {
                    column.search.options.forEach((item: any) => {
                        // 找到匹配的描述字段
                        if (item.value === value) {
                            // 替换原本的搜索条件
                            _params.terms[0] = {
                                terms: [
                                    {
                                        type: 'and',
                                        value: item.alarmDictionaryValue,
                                        termType: termType,
                                        column: 'alarmDictionaryValue',
                                    },
                                    {
                                        type: 'and',
                                        value: item.alarmDictionaryKey,
                                        termType: termType,
                                        column: 'alarmDictionaryKey',
                                    },
                                ],
                            };
                        }
                    });
                }
            });
        }
    }
};

/**
 * @function formatDate 格式化时间，对时间为空和string时做处理
 * @param timeStamp
 */
export const formatDate = (timeStamp: number | string | undefined) => {
    if (!timeStamp) return '--';

    let res: number;
    if (typeof timeStamp === 'string') {
        res = parseInt(timeStamp);
    } else {
        res = timeStamp;
    }
    return dayjs(res).format('YYYY-MM-DD HH:mm:ss');
};
