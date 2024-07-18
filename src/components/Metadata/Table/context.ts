import { provide } from 'vue'
import {RIGHT_MENU, TABLE_DATA_SOURCE, TABLE_ERROR, TABLE_GROUP_ERROR, TABLE_WRAPPER} from "./utils";

type FiledExpose = {

}

const FormContextKey = 'form-context'
export const useFormContext = (options: Record<string, any>) => {
    provide(FormContextKey, options)
}

export const useInjectForm = () => {
    return inject(FormContextKey, {
        addField: (key: string, field: FiledExpose) => {},
        dataSource: computed(() => []),
        rules: computed(() => undefined),
    })
}

export const useInjectError = () => inject(TABLE_ERROR)

export const useTableWrapper = () => inject(TABLE_WRAPPER)

export const useRightMenuContext = () => inject(RIGHT_MENU)

export const useTableGroupError = () => inject(TABLE_GROUP_ERROR)

export const useTableDataSource = () => inject(TABLE_DATA_SOURCE, [])
