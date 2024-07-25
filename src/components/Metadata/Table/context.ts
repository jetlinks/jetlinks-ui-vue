import { provide } from 'vue'
import {
    RIGHT_MENU,
    TABLE_DATA_SOURCE,
    TABLE_ERROR,
    TABLE_GROUP_ERROR,
    TABLE_WRAPPER,
    TABLE_OPEN_GROUP,
    TABLE_TOOL,
    TABLE_GROUP_OPTIONS,
    TABLE_FORM_ITEM_ERROR,
    TABLE_GROUP_ACTIVE
} from "./consts";

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

export const useTableOpenGroup = () => inject(TABLE_OPEN_GROUP, false)

export const useTableTool = () => inject(TABLE_TOOL, false)

export const useGroupOptions = () => inject(TABLE_GROUP_OPTIONS, [])

export const useFormItemError = () => inject(TABLE_FORM_ITEM_ERROR)
export const useGroupActive = () => inject(TABLE_GROUP_ACTIVE)
