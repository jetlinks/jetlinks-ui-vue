import type { ColumnType } from 'ant-design-vue/lib/table'
import { omit} from "lodash-es";


type ColumnsFormType = {
    rules: Array<Record<string, any>>,
    watch: Array<string>
}
export type ColumnsType = Array<ColumnType & { form?: ColumnsFormType }>



/**
 * 规则收集器，收集columns中的rules和watch
 * @param columns
 */
export const collectValidateRules = (columns: ColumnsType):  Record<string, any> => {
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
    if (!record) return {}

    // if (record.expands) {
    //     record.expands = omit(record.expands, ['isProduct'])
    // }
    return omit(record, ['__serial', '__index', '__top', '__selected', '__key', '__dataIndex'])
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
