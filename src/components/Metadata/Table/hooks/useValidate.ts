import {Ref, watch} from "vue";
import Schema from "async-validator";
import {handlePureRecord, collectValidateRules} from "../utils";
import type {ColumnsType } from "../utils";

type DataSourceType = Array<Record<string, any> & { __validate_id?: string, __validate_index?: number}>

export type ErrorItem = {
    message: string
    __index: number
    __dataIndex: number

    field: string

    filedValue: any

    groupId: string
}

export type OptionsType = {
    onError?: (err: Array<Array<ErrorItem>>) => void
    onEdit?: (item: any) => void

    validateRowKey?: Boolean
}

export const useValidate = (dataSource: Ref<DataSourceType>, columns: ColumnsType, rowKey: string, options: OptionsType = {}): {
    validate: () => Promise<any>
    validateItem: (data: Record<string, any> ) => Promise<any>
    errorMap: Ref<Record<string, any>>
    rules: Ref<Record<string, any>>
} => {
    const errorMap = ref({})

    let schemaInstance: any
    let rules = ref({})
    let validateDataSource = ref(dataSource)

    const _options = Object.assign({ validateRowKey: false }, options)


    const validateItem = (data: Record<string, any>, index: number = 0): Promise<any> => {
        return new Promise((resolve, reject) => {
            schemaInstance.validate(data, { firstFields: true, index}, (err: any[]) => {
                if (err?.length) {
                    reject(err.map(item => ({ ...item, __index: data.__serial, __dataIndex: index })))
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
                validateLen += 1
                if (validateLen === len) {
                    if (error.length) {
                        _options.onError?.(error)
                    }

                    Object.keys(error).length ? reject(error) : resolve(success)
                }
            }

            const validateRowKey = _options.validateRowKey

            if (filterDataSource.length) {
                filterDataSource.forEach((record, index) => {
                    if (validateRowKey || record[rowKey]) {
                        validateItem(record, index).then(res => {
                            success.push(handlePureRecord(res))
                            end()
                        }).catch(err => {
                            error.push(err)
                            end()
                        })
                    } else {
                        end()
                    }
                })
            } else {
                resolve(filterDataSource)
            }
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
