export type dictItemType = {
    id: string,
    name: string,
    children?: dictItemType
}
export type optionItemType = {
    label: string,
    value: string
}
export type sourceItemType = {
    id?: string,
    name: string,
    state: { text: string, value: "enabled" | 'disabled' },
    typeId: string,
    shareConfig: {
        url: string,
        adminUrl: string,
        addresses: string,
        username: string,
        password: string,
        virtualHost: string,
        schema: string
    }
    description: string
}

// 数据库字段
export type dbColumnType = {
    previousName?: string,
    type: String,
    length: number,
    scale: number,
    notnull: boolean,
    comment: string,
    name: string,
    scale?:number,
    index?:number
}