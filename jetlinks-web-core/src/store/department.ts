
import { defineStore } from "pinia";

type DepartmentStateType = {
    productId?: string[];
    optType: string | undefined;
    crossPageKeys: string[];
    changedApis: any;
}

export const useDepartmentStore = defineStore({
    id: 'department',
    state: (): DepartmentStateType => ({
        productId: undefined,
        // 设备资产分配弹窗操作类型: 
        // 1. optType === 'handle': 手动点击资产分配按钮; 
        // 2. optType === ': 产品资产分配后, 自动弹出设备资产分配
        optType: '',
        crossPageKeys: [], // 表格跨页多选的keys
        changedApis: {},
    }),
    actions: {
        setProductId(value?: string[]) {
            this.productId = value;
        },
        setType(value: string | undefined) {
            this.optType = value;
        },
        setSelectedKeys(value: string[], type?: string) {
            // 分页保留选中项
            this.crossPageKeys = type === 'concat' ? [...new Set([...this.crossPageKeys, ...value])] : value;
        },
        setChangedApis(value: any) {
            this.changedApis = { ...this.changedApis, ...value };
        }
    }
})