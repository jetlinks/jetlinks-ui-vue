import { ReactiveSet } from '@/utils/reactiveSet';

/**
 * @function useSelectableTable
 * @description 封装了table组件的selectedRowKeys属性，
 * 同时实现了rowSelection的onSelect事件和onSelectAll事件以及onSelectNone事件，用于实现多选功能
 * @param columnName 需要用于选择的列名，否则则默认监听id
 */
export function useSelectableTable<T = string>(columnName?: string) {
    // 用于computed监听set的依赖项，同时记录选中的行数
    const setLength = ref(0);
    // 选中行的id集合
    const dataSet = new ReactiveSet<T>(setLength);

    const selectedRowKeys = computed(() => {
        let keys = setLength.value;
        return Array.from(dataSet.value);
    });

    /**
     * @function handleRowSelected table组件的rowSelection的onSelect事件
     * @param record 当前选中的数据项的对象
     * @param selected 是否选中，用于判断选中还是取消选中
     * @param selectedRows 选中的所有数据项的对象数组
     */
    const handleRowSelected = (
        record: Record<string, any>,
        selected: boolean,
        selectedRows: any,
    ) => {
        if (!columnName) {
            if (selected) {
                dataSet.setItem(record.id);
            } else {
                dataSet.removeItem(record.id);
            }
        } else {
            if (selected) {
                dataSet.setItem(record[columnName]);
            } else {
                dataSet.removeItem(record[columnName]);
            }
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
        if (!columnName) {
            if (selected) {
                changeRows.forEach((row: any) => {
                    dataSet.setItem(row.id);
                });
            } else {
                changeRows.forEach((row: any) => {
                    dataSet.removeItem(row.id);
                });
            }
        } else {
            changeRows.forEach((row: any) => {
                if (selected) {
                    dataSet.setItem(row[columnName]);
                } else {
                    dataSet.removeItem(row[columnName]);
                }
            });
        }
    };

    /**
     * @function handleClearSelected 清空选中的数据项，对应rowSelection的onSelectNone事件
     */
    const handleClearSelected = () => {
        dataSet.reset();
    };

    /**
     * @function handleDefaultSelected 设置默认选中的数据项
     * @param dataList
     */
    const handleDefaultSelected = (dataList: T[]) => {
        dataSet.reset();
        dataList.forEach((data: T) => {
            dataSet.setItem(data);
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
