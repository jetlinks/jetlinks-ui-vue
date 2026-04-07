import {isFunction} from "lodash-es";

export const crudTableProps = {
    rowKey: {
        type: [String, Function],
        default: 'id',
    },
    target: {
        type: String,
        default: undefined
    },
    columns: {
        type: Array,
        default: () => []
    },
    request: {
        type: Function,
        default: undefined
    },
    defaultParams: {
        type: Object,
        default: () => ({})
    },
    permission: {
        type: String
    },
    modeValue: {
        type: String,
        default: 'CARD'
    },
    mode: {
        type: String,
        default: undefined
    },
    actions: {
        type: Array,
        default: () => []
    },
    gridColumns: {
        type: Array,
        default: () => [4]
    },
    schema: {
        type: Array,
        default: []
    },
    contentList: {
        type: Function
    },
    updateRequest: {
        type: Function,
        default: undefined
    },
    handleRequestData: {
        type: Function,
        default: undefined
    },
    deleteRequest: {
        type: Function,
        default: undefined
    },
    statusText: {
        type: [Function, String],
        default: undefined
    },
    status: {
        type: [Function, String],
        default: undefined
    },
    imgUrl: {
        type: [Function, String],
        default: undefined
    },
    statusNames: {
        type: Object,
        default: () => ({'default': 'default'})
    },
    showView: {
        type: Boolean,
        default: true
    },
    showEdit: {
        type: Boolean,
        default: true
    },
    showDelete: {
        type: Boolean,
        default: true
    },
    showAdd: {
        type: Boolean,
        default: true
    },
    showSelect: {
        type: Boolean,
        default: false
    },
}

export const handleFuncValue = (item: any, record: any) => {
    if(isFunction(item)) {
        return item(record)
    } else {
        return item
    }
}
