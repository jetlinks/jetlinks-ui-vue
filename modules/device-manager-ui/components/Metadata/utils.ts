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
        if (item.form?.rules) {
            let currentLevel: Record<string, any> = rules; // 从最顶层开始构建
            const field = item.form.field || item.dataIndex
            const parts = Array.isArray(field) ? field : field.split(',')

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i] as string;

                if (i === parts.length - 1) {
                    // 这是最深层的叶子节点
                    currentLevel[part] = [...item.form.rules]
                } else {
                    // 这是中间的父节点（例如 'prop1' 或 'type'）
                    if (!currentLevel[part]) {
                        // 如果当前层级还没有这个属性，就把它定义为一个对象
                        currentLevel[part] = { type: 'object', fields: {} };
                    } else if (currentLevel[part].type !== 'object') {
                        // 如果已经存在但不是对象类型，可能是之前被错误定义为叶子节点，修正它
                        console.warn(`Warning: '${parts.slice(0, i + 1).join('.')}' was expected to be an object but has other rules. Overwriting.`);
                        currentLevel[part] = { type: 'object', fields: {} };
                    }
                    // 进入下一层级，继续构建 `fields`
                    currentLevel = currentLevel[part].fields;
                }
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

    return newColumns.map((item, index) => {
        let _width = item.width
        let left = 0

        if (!item.width) {
            _width = parseAverage
        }

        if (index === lastNoWidthIndex) {
            _width = Math.trunc(decimalCount) + parseAverage
        }

        if (index !== 0) {
            left = newColumns[index - 1].width + newColumns[index - 1].left
        }


        item.width = _width
        item.left = left
        // prev.push({
        //     ...next,
        //     width: _width,
        //     left
        // })
        return item
    }, [])
}
