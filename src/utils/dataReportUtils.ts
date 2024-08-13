import dayjs from 'dayjs';
import { Ref } from 'vue';

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
 * @function handleSearchByDate
 * @description 处理搜索条件为时间的情况
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
 */
export const handleSearchByDescription = (_params: any) => {
    if (
        _params.terms &&
        _params.terms.length > 0 &&
        _params.terms[0].terms &&
        _params.terms[0].terms.length > 0
    ) {
        // 获取当前搜索字段
        const column = _params.terms[0].terms[0].column;
        if (column === 'description') {
            console.log('搜索条件为描述');
            // 解构出搜索条件和值
            const { termType, value } = _params.terms[0].terms[0];
            console.log(_params.terms[0].terms[0], termType, value);
            // 遍历表格列，找到缓存表格列对应的描述字段
            const [alarmDictionaryKey, alarmDictionaryValue] = (
                value as string
            ).split('_');
            _params.terms[0] = {
                terms: [
                    {
                        type: 'and',
                        value: alarmDictionaryValue,
                        termType: termType,
                        column: 'alarmDictionaryValue',
                    },
                    {
                        type: 'and',
                        value: alarmDictionaryKey,
                        termType: termType,
                        column: 'alarmDictionaryKey',
                    },
                ],
            };
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

/**
 * @function handleResetSelectedRows
 * @description 处理重置和切换搜索条件时，清空选中的行
 * @param params 搜索携带的条件对象
 * @param prevSearchTerms 上一次搜索条件
 * @param resetCallback 重置选中的回调
 */
export const handleResetSelectedRows = (
    params: any,
    prevSearchTerms: Ref<any>,
    resetCallback: () => void,
) => {
    // 如果携带搜索条件时
    if (params.terms && params.terms.length > 0) {
        let termsIsChange: boolean = false;
        const terms = params.terms[0].terms[0];

        // 如果上一次的搜索条件与这次的搜索条件不同，则清空选中的行
        for (const key in terms) {
            if (terms[key] !== prevSearchTerms.value[key]) {
                termsIsChange = true;
                prevSearchTerms.value = terms;
                break;
            }
        }

        termsIsChange && resetCallback();
    } else {
        // 如果currentSearchTerms不为空时，说明上次搜索条件有值，则这次搜索为重置操作，也清空选中的行
        if (Reflect.ownKeys(prevSearchTerms.value).length > 0) {
            resetCallback();
            prevSearchTerms.value = {};
        }
    }
};
