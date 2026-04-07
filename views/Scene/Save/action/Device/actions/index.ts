export const handleParamsData = (data: any[]): any[] => {
    return data?.map(item => {
        return {
            ...item,
            key: item.column,
            disabled: !!item.children?.length,
            children: handleParamsData(item.children)
        }
    }) || []
}