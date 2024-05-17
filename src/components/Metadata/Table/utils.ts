import Schema from 'async-validator';
import { randomString } from '@/utils/utils'
import type { ColumnType } from 'ant-design-vue/lib/table'
import { Ref } from 'vue'

type DataSourceType = Array<Record<string, any> & { __validate_id?: string, __validate_index?: number}>
type ColumnsFormType = {
    rules: Array<Record<string, any>>,
    watch: Array<string>
}
type ColumnsType = Array<ColumnType & { form?: ColumnsFormType }>


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

export const useValidate = (dataSource: DataSourceType, columns: ColumnsType): {
    validateItem: (data: Record<string, any> ) => Promise<any>
    errorMap: Ref<Record<string, any>>
    rules: Ref<Record<string, any>>
} => {
    const errorMap = ref({})

    let schemaInstance: any
    let rules = ref({})

    const validateItem = (data: Record<string, any>) => {
        return new Promise((resolve) => {
            schemaInstance.validate(data, { firstFields: true}, (err: any[]) => {
                resolve(err)
            })
        })
    }

    const createValidate = () => {
        rules.value = collectValidateRules(columns)
        schemaInstance = new Schema(rules.value)
    }

    createValidate()

    return {
        validateItem,
        errorMap,
        rules
    }
}
