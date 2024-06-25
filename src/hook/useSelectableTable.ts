import { ReactiveSet } from '@/utils/reactiveSet';

/**
 * @function useSelectableTable
 * @description 封装了table组件的selectedRowKeys属性，
 * 同时实现了rowSelection的onSelect事件和onSelectAll事件以及onSelectNone事件，用于实现多选功能
 */
export function useSelectableTable() {
    // 用于computed监听set的依赖项，同时记录选中的行数
    const setLength = ref(0);
    // 选中行的id集合
    const idSet = new ReactiveSet(setLength);

    const selectedRowKeys = computed(() => {
        let keys = setLength.value;
        return Array.from(idSet.value);
    });

    /**
     * @function handleRowSelected table组件的rowSelection的onSelect事件
     * @param record 当前选中的数据项的对象
     * @param selected 是否选中，用于判断选中还是取消选中
     * @param selectedRows 选中的所有数据项的对象数组
     */
    const handleRowSelected = (
        record: any,
        selected: boolean,
        selectedRows: any,
    ) => {
        if (selected) {
            idSet.setItem(record.id);
        } else {
            idSet.removeItem(record.id);
        }
    };

    /**
     * @function handleSelectAll table组件的rowSelection的onSelectAll事件
     * @param selected 是否全选，用于判断全选还是取消全选
     * @param selectedRows 选中的所有数据项的对象数组
     * @param changeRows 发生变化的数据项的对象数组
     */
    const handleSelectAll = (
        selected: boolean,
        selectedRows: any,
        changeRows: any,
    ) => {
        if (selected) {
            changeRows.forEach((row: any) => {
                idSet.setItem(row.id);
            });
        } else {
            changeRows.forEach((row: any) => {
                idSet.removeItem(row.id);
            });
        }
    };

    /**
     * @function handleClearSelected 清空选中的数据项，对应rowSelection的onSelectNone事件
     */
    const handleClearSelected = () => {
        idSet.reset();
    };

    /**
     * @function handleDefaultSelected 设置默认选中的数据项
     * @param idList
     */
    const handleDefaultSelected = (idList: (string | number)[]) => {
        idSet.reset();
        idList.forEach((id: string | number) => {
            idSet.setItem(id);
        });
    };

    return {
        selectedRowKeys,
        handleDefaultSelected,
        handleRowSelected,
        handleSelectAll,
        handleClearSelected,
    };
}
