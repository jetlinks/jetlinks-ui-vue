import { Ref } from 'vue';
import { handleSearchByDate } from '@/utils/dataReportUtils';
import { ISearchParams } from '@/global';

/**
 * @function useProSearch
 * @description 处理pro-search搜索组件的搜索事件，只能用于简单的处理如果有复杂的情况参考AlarmSheet
 * @param globParams 搜索组件的全局搜索条件
 * @param resetCallback 重置选中的回调
 * @param dateColumns 时间类型的搜索字段（可选），只需要传第四个参数的情况，dateColumns请传入空数组
 * @param  additionalFns 额外的搜索事件，如：搜索某个时需要拼接额外的条件，可以在这里添加（可选）
 */
export const useProSearch = (
    globParams: Ref<Record<string, any>>,
    resetCallback: () => void,
    dateColumns?: string[],
    additionalFns?: ((_params: ISearchParams) => ISearchParams)[],
) => {
    // 上一次查询的条件，这里不能使用null，null.property会报错，而{}.property 是 undefined 不会报错
    let prevSearchTerms: any = {};

    /**
     * @function handleSearch 搜索组件的搜索事件
     * @param _params
     */
    const handleSearch = (_params: any) => {
        // 处理需要清空选中行的情况
        handleResetSelectedRows(_params);

        // 处理搜索的字段是时间类型的情况
        dateColumns &&
            dateColumns.length > 0 &&
            handleSearchByDate(_params, dateColumns);

        additionalFns &&
            additionalFns.length > 0 &&
            additionalFns?.forEach((fn) => {
                _params = fn(_params);
            });
        globParams.value = _params;
        console.log('globParams', toRaw(globParams.value));
    };

    /**
     * @function handleResetSelectedRows
     * @description 处理重置和切换搜索条件时，清空选中的行
     * @param params 搜索携带的条件对象
     */
    const handleResetSelectedRows = (params: ISearchParams) => {
        // 如果携带搜索条件时
        if (
            params.terms &&
            params.terms.length > 0 &&
            params.terms[0].terms &&
            params.terms[0].terms.length > 0
        ) {
            // 搜索条件是否发生变化
            let termsIsChange = false;
            const terms = params.terms[0].terms[0];

            // 如果上一次的搜索条件与这次的搜索条件不同，则清空选中的行
            for (const key in terms) {
                if (terms[key] !== prevSearchTerms[key]) {
                    termsIsChange = true;
                    prevSearchTerms = terms;
                    break;
                }
            }

            termsIsChange && resetCallback();
        } else {
            // 如果currentSearchTerms不为空时，说明上次搜索条件有值，则这次搜索为重置操作，也清空选中的行
            if (Reflect.ownKeys(prevSearchTerms).length > 0) {
                resetCallback();
                prevSearchTerms = {};
            }
        }
    };

    return {
        handleSearch,
    };
};
