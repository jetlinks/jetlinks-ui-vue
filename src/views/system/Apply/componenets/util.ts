export const getCheckByTree = (data: any[]): string[] => {
    let keys: string[] = []
    if (data.length) {
        data.forEach(item => {
            if (item.children) {
                keys = [...getCheckByTree(item.children), ...keys]
            } else {
                keys.push(item.code)
            }
        })
    }
    return keys
}

export const filterTree = (data: any[], ids: string[]) => {
    return data?.filter(item => {
        delete item.id
        item.options = {show: true}
        if (ids.includes(item.code)) {
            return true
        } else if (item.children) {
            item.children = filterTree(item.children, ids)
            return item.children.length >0
        }
        return false
    }) || []
}
