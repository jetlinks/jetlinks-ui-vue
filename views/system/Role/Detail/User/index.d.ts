type columnsType = {
    title: string,
    dataIndex: string,
    key: string,
    scopedSlots?:boolean
}

export type queryType = {
    columns: columnsType[],
    params?: object
}

export type tableType = {
    columns: columnsType[],
    tableData: any[],
    refresh: Function,
    clickAdd: Function,
    clickUnBind: Function,
    unbind: Function,
    _selectedRowKeys?: string[],
    onSelectChange?: Function,
    cancelSelect?: Function
}