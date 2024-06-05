import Schema from 'async-validator';
import type { ColumnType } from 'ant-design-vue/lib/table'
import { Ref, onBeforeUnmount, watch } from 'vue'
import ResizeObserver from "resize-observer-polyfill";
import {debounce, omit} from "lodash-es";

type DataSourceType = Array<Record<string, any> & { __validate_id?: string, __validate_index?: number}>
type ColumnsFormType = {
    rules: Array<Record<string, any>>,
    watch: Array<string>
}
type ColumnsType = Array<ColumnType & { form?: ColumnsFormType }>

type OptionsType = {
    onError: (err: Array<{ message: string, __index: number, field: string, filedValue: any}>) => void
}

export const TABLE_WRAPPER = Symbol('table-wrapper')
export const FULL_SCREEN = Symbol('full')

export const RIGHT_MENU = Symbol('right-menu')


/**
 * 规则收集器，收集columns中的rules和watch
 * @param columns
 */
const collectValidateRules = (columns: ColumnsType):  Record<string, any> => {
    const rules = {}
    columns.forEach(item => {
        if (item.form) {
            if (item.form.rules) {
                rules[item.dataIndex as string] = item.form.rules
            }
        }
    })
    return rules
}

export const handlePureRecord = (record: Record<string, any>) => {
    return omit(record, ['__serial', '__index', '__top'])
}
export const useValidate = (dataSource: Ref<DataSourceType>, columns: ColumnsType, rowKey: string, options?: OptionsType): {
    validate: () => Promise<any>
    validateItem: (data: Record<string, any> ) => Promise<any>
    errorMap: Ref<Record<string, any>>
    rules: Ref<Record<string, any>>
} => {
    const errorMap = ref({})

    let schemaInstance: any
    let rules = ref({})
    let validateDataSource = ref(dataSource)


    const validateItem = (data: Record<string, any>, index: number = 0): Promise<any> => {
        return new Promise((resolve, reject) => {
            schemaInstance.validate(data, { firstFields: true, index}, (err: any[]) => {
                if (err?.length) {
                    reject(err.map(item => ({ ...item, __index: index})))
                } else {
                    resolve(data)
                }
            })
        })
    }

    const validate = () => {
        return new Promise((resolve, reject) => {
            const filterDataSource = dataSource.value

            const len = filterDataSource.length
            const error: any[] = []
            const success: any[] = []
            let validateLen = 0
            const end = () => {
                console.log(validateLen, len)
                if (validateLen === len) {
                    Object.keys(error).length ? reject(error) : resolve(success)
                }
            }

            filterDataSource.forEach((record, index) => {
                console.log(record, rowKey, record[rowKey])
                if (record[rowKey]) {
                    validateItem(record, index).then(res => {
                        success.push(handlePureRecord(res))
                        validateLen += 1
                        end()
                    }).catch(err => {
                        options?.onError(err)
                        error.push(err)
                        validateLen += 1
                        end()
                    })
                } else {
                    validateLen += 1
                }
            })

        })
    }

    const createValidate = () => {
        rules.value = collectValidateRules(columns)
        schemaInstance = new Schema(rules.value)
    }

    watch(() => dataSource.value, () => {
        validateDataSource.value = dataSource.value
    }, { deep: true })

    createValidate()

    return {
        validate,
        validateItem,
        errorMap,
        rules,
    }
}


export const useResizeObserver = (tableWrapper: Ref<HTMLElement>, cb: Function) => {

    let observer: ResizeObserver

    const onResize = (e: any[]) => {
        let rect = {}
        for (const entry of e) {
            rect = entry.contentRect;
        }

        cb(rect, e)
    }

    onMounted(() => {
        observer = new ResizeObserver(debounce(onResize, 100))
        observer.observe(tableWrapper.value)
    })

    onBeforeUnmount(() => {
        observer.unobserve(tableWrapper.value)
    })
}

export const handleColumnsWidth = (columns: any[], warpWidth: number): any[] => {

    let newColumns = [...columns]
    let noWidthLen = 0 // 没有width属性的长度
    let hasWidthCount = 0 // 有width属性的合计
    let average = 0 // 每个column宽度
    let parseAverage = 0 // 取整宽度
    let decimalCount = 0 // 收集每个取整后的小数
    let lastNoWidthIndex : number | undefined = undefined // 最后一个没有width属性的位置

    newColumns.forEach(item => {
        if (item.width) {
            hasWidthCount += item.width
        } else {
            noWidthLen += 1
        }
    })

    if (noWidthLen) {
        average = (warpWidth - hasWidthCount) / noWidthLen // 剩余平分分配宽度
        parseAverage = Math.trunc(average)
        decimalCount = (average - parseAverage) * noWidthLen
    }

    newColumns.forEach((item, index) => {
        if (!item.width) {
            lastNoWidthIndex = index
        }
    })

    return newColumns.reduce((prev, next, index) => {
        let _width = next.width
        let left = 0

        if (!next.width) {
            _width = parseAverage
        }

        if (index === lastNoWidthIndex) {
            _width = Math.trunc(decimalCount) + parseAverage
        }

        if (index !== 0) {
            left = prev[index - 1].width + prev[index - 1].left
        }

        prev.push({
            ...next,
            width: _width,
            left
        })
        return prev
    }, [])
}

export const useTableWrapper = () => {
    return inject(TABLE_WRAPPER)

}

export const useRightMenuContext = () => inject(RIGHT_MENU)
