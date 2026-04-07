export const handleData = (_arr: any[], checkedValue: any[]) => {
    return _arr.map((item) => {
        const checked = checkedValue?.find(
            (checkedItem) => checkedItem.id === item.id,
        )

        const options =
            (item.actions &&
                item.actions.map((actionItem: any) => ({
                    label: actionItem.i18nName || actionItem.name,
                    value: actionItem.action,
                }))) ||
            []
        return {
            id: item.id,
            name: item.i18nName ||item.name,
            checkedList: (checked && checked.actions) || [],
            checkAll:
                (checked &&
                    item.actions &&
                    checked.actions.length === item.actions.length) ||
                false,
            indeterminate:
                (checked &&
                    item.actions &&
                    checked.actions.length < item.actions.length) ||
                false,
            options,
        }
    })
}
