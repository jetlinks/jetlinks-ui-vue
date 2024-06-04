export function useSelect() {
    // 当前分页表格选中的数据项的id
    const state = reactive<{ selectedRowKeys: string[] }>({
        selectedRowKeys: [],
    });

    /**
     * @function selectedRowChange table组件的rowSelection的onChange事件
     * @param selectedRowKeys
     * @param selectedRows
     */
    const selectedRowChange = (
        selectedRowKeys: string[],
        selectedRows?: any[],
    ) => {
        if (selectedRowKeys.length === 0 || selectedRows?.length === 0) {
            state.selectedRowKeys = [];
        }
    };

    /**
     * @function handleRowSelected table组件的rowSelection的onSelect事件
     * @param record
     * @param selected
     * @param selectedRows
     */
    const handleRowSelected = (
        record: any,
        selected: boolean,
        selectedRows: any,
    ) => {
        if (selected) {
            const index = state.selectedRowKeys.findIndex(
                (item) => item === record.id,
            );
            index === -1 && state.selectedRowKeys.push(record.id);
        } else {
            const index = state.selectedRowKeys.findIndex(
                (item) => item === record.id,
            );
            index !== -1 && state.selectedRowKeys.splice(index, 1);
        }
    };

    /**
     * @function handleSelectAll table组件的rowSelection的onSelectAll事件
     * @param selected
     * @param selectedRows
     * @param changeRows
     */
    const handleSelectAll = (
        selected: boolean,
        selectedRows: any,
        changeRows: any,
    ) => {
        if (selected) {
            for (let i = 0; i < changeRows.length; i++) {
                let flag = true;
                state.selectedRowKeys.forEach((item: any) => {
                    if (item === changeRows[i].id) flag = false;
                });
                flag && state.selectedRowKeys.push(changeRows[i].id);
            }
        } else {
            for (let i = 0; i < changeRows.length; i++) {
                const index = state.selectedRowKeys.findIndex(
                    (item) => item === changeRows[i].id,
                );
                index !== -1 && state.selectedRowKeys.splice(index, 1);
            }
        }
    };

    return {
        state,
        selectedRowChange,
        handleRowSelected,
        handleSelectAll,
    };
}
