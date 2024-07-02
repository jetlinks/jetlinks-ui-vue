export const MAP_TOOL = {
    'rectangle': 'rectangle',
    'polygon': 'polygon',
    'circle': 'circle',
    'tool': 'tool',
    'district': 'district',
    'geoJson': 'geoJson',
}

export const syncChildren = (code: string, area: any[]) => {
    const findItem = (code: string, children: any[] = []): any[] => {
        let _children: any[] = []
        children.some(item => {
            if (item.code === code ) {
                _children = item.children
            } else if (item.children) {
                _children = findItem(code, item.children)
            }
            return item.code === code
        })

        return _children.map(item => {
            item.children = []
            return item
        })
    }

    return findItem(code, area)
}
