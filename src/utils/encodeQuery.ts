import { isObject, isArray } from 'lodash-es'

type TermsType = {
    column: string
    type: string
    value: string
    termsType: string
    terms: Array<TermsType>
}

type ParamsType = {
    terms?: Array<TermsType>
    sorts?: Array<{name:string, order: string }>
    current?: any
}

export interface SearchItemData {
    column: any;
    value: any;
    termType: string;
    type?: string;
}

const handleTermsArr = (queryTerms: any, data: any[], parentKey?: string) => {
    data.forEach((item, index) => {
        const key = `${parentKey}[${index}]`

        if (isArray(item)){
            handleTermsArr(queryTerms, item, `${key}`)
        } else if (isObject(item)) {
            handleTermsObject(queryTerms, item, `${key}`)
        } else{
            queryTerms[key] = item
        }
    })
}
const handleTermsObject = (queryTerms: any, data: any, parentKey?: string) => {
    Object.keys(data).forEach(k => {
        const key = `${parentKey}.${k}`
        console.log(key, data[k], isObject(data[k]), isArray(data[k]),k)
        if( k === 'value' && isArray(data[k])){
            queryTerms[key] = data[k].join(',')
        }else if (isArray(data[k])) {
            handleTermsArr(queryTerms, data[k], `${key}`)
        } else if (isObject(data[k])) {
            handleTermsObject(queryTerms, data[k], `${key}`)
        } else  {
            queryTerms[key] = data[k]
        }
    })
}

const handleTermsToString = (queryTerms: any, terms: Array<TermsType>, parentKey?: string) => {
    console.log(terms)
    terms.forEach((a, aIndex) => {
        Object.keys(a).forEach((b) => {
            const key = `${parentKey}[${aIndex}].${b}`
            if (isArray(a[b])) {
                handleTermsArr(queryTerms, a[b], `${key}`)
            } else if (isObject(a[b])) {
                handleTermsObject(queryTerms, a[b], `${key}`)
            } else {
                queryTerms[key] = a[b]
            }
        })

    })
}

export const paramsEncodeQuery = (params?: ParamsType) => {
    if (!params) return {}

    const queryParams = {
        current: params.current,
    }

    const { sorts, terms } = params

    if (terms) {
        handleTermsToString(queryParams, terms, 'terms')
    }

    if (sorts) {
        sorts.forEach((item, index) => {
            queryParams[`sorts[${index}].name`] = item.name;
            queryParams[`sorts[${index}].order`] = item.order;
        })
    }
    return queryParams
}

export const encodeQuery = (params: any) => {
    if (!params) return {};
    const queryParam = {
        // pageIndex: 0,
        current: params.current,
    };
    const { terms, sorts } = params;
    Object.keys(params).forEach((key: string) => {
        if (key === 'terms') {
            let index = 0;
            if (!terms) return;
            Object.keys(terms).forEach((k: string) => {
                if (
                    !(
                        terms[k] === '' ||
                        terms[k] === undefined ||
                        terms[k].length === 0 ||
                        (isObject(terms[k]) && Object.keys(terms[k]).length === 0) ||
                        terms[k] === null
                    )
                ) {
                    if (k.indexOf('$LIKE') > -1 && terms[k].toString().indexOf('%') === -1) {
                        terms[k] = `%${terms[k]}%`;
                    }
                    if (k.indexOf('$IN') > -1) {
                        terms[k] = terms[k].toString();
                    } else if (k.indexOf('$START') > -1) {
                        terms[k] = `%${terms[k]}`;
                    } else if (k.indexOf('$END') > -1) {
                        terms[k] = `${terms[k]}%`;
                    }
                    if (k.indexOf('@') > -1) {
                        const temp = k.split('@');
                        // eslint-disable-next-line prefer-destructuring
                        queryParam[`terms[${index}].column`] = temp[0];
                        // eslint-disable-next-line prefer-destructuring
                        queryParam[`terms[${index}].type`] = temp[1];
                    } else {
                        queryParam[`terms[${index}].column`] = k;
                    }
                    queryParam[`terms[${index}].value`] = terms[k];
                    index += 1;
                }
            });
        } else if (key === 'sorts') {
            // 当前Ant Design排序只支持单字段排序
            if (!sorts) return;
            Object.keys(sorts).forEach((s, index) => {
                queryParam[`sorts[${index}].name`] = s;
                queryParam[`sorts[${index}].order`] = sorts[s].replace('end', '');
            });
            // if (Object.keys(sorts).length > 0) {
            //     queryParam[`sorts[0].name`] = sorts.field;
            //     queryParam[`sorts[0].order`] = (sorts.order || '').replace('end', '');
            // }
        } else {
            queryParam[key] = params[key];
        }
    });

    // queryParam.pageIndex = current - 1;

    return queryParam;
}

export const handleParamsToString = (terms:SearchItemData[] = []) => {
    const _terms: any[] = [
        { terms: [null,null,null]},
        { terms: [null,null,null], type: 'and'}
    ]
    let termsIndex = 0
    let termsStar = 0
    terms.forEach((item, index) => {
        if (index > 2) {
            termsIndex = 1
            termsStar = 4
        }
        _terms[termsIndex].terms[index - termsStar ] = item
    })

    return JSON.stringify({ terms: _terms})
}
