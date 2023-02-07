<template>
    <div class="permiss-tree-container">
        <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="false"
            :rowKey="'id'"
        >
            <!-- 自定义表头 -->
            <template #headerCell="{ column }">
                <div v-if="column.key === 'menu'">
                    <a-checkbox
                        v-model:checked="selectedAll"
                        :indeterminate="indeterminate"
                        @change="selectAllChange"
                        >菜单权限</a-checkbox
                    >
                </div>
                <div v-else-if="column.key === 'data'">
                    <span style="">数据权限</span>
                    <a-checkbox
                        v-model:checked="bulkShow"
                        @change="bulkValue = ''"
                        >批量设置</a-checkbox
                    >
                    <a-select
                        v-show="bulkShow"
                        v-model:value="bulkValue"
                        :size="'middle'"
                        style="width: 200px"
                        :options="bulkOptions"
                        @change="bulkChange"
                    ></a-select>
                </div>
                <div v-else>
                    <span>{{ column.title }}</span>
                </div>
            </template>
            <!-- 自定义表格内容 -->
            <template #bodyCell="{ column, record }">
                <div v-if="column.key === 'menu'">
                    <a-checkbox
                        v-model:checked="record.granted"
                        :indeterminate="record.indeterminate"
                        @change="menuChange(record)"
                        >{{ record.name }}</a-checkbox
                    >
                </div>

                <div v-else-if="column.key === 'action'">
                    <div v-if="record.buttons && record.buttons.length > 0">
                        <a-checkbox
                            v-for="button in record.buttons"
                            v-model:checked="button.granted"
                            @change="actionChange(record)"
                            >{{ button.name }}</a-checkbox
                        >
                    </div>
                </div>

                <div v-else-if="column.key === 'data'">
                    <span v-if="record.accessSupport === undefined">
                        不支持数据权限配置，默认可查看全部数据
                    </span>
                    <div v-else-if="record.accessSupport.value === 'support'">
                        <a-radio-group v-model:value="record.selectAccesses">
                            <a-radio
                                :value="asset.supportId"
                                v-for="asset in record.assetAccesses"
                                >{{ asset.name }}</a-radio
                            >
                        </a-radio-group>
                    </div>
                    <span
                        v-else-if="
                            record.accessSupport.value === 'indirect' ||
                            record.accessSupport.value === 'unsupported'
                        "
                        >{{ record.accessDescription }}</span
                    >
                </div>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import { getPrimissTree_api } from '@/api/system/role';

const emits = defineEmits(['update:selectItems']);
const route = useRoute();
const props = defineProps({
    selectItems: Array,
});

const columns = [
    {
        title: '菜单权限',
        dataIndex: 'menu',
        key: 'menu',
        width: '260px',
    },
    {
        title: '操作权限',
        dataIndex: 'action',
        key: 'action',
        width: '260px',
    },
    {
        title: '数据权限',
        dataIndex: 'data',
        key: 'data',
        width: '50%',
    },
];
const tableData = ref<tableItemType[]>([]);

// 表头-全选
const selectedAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);
const selectAllChange = () => {
    flatTableData.forEach((item) => {
        item.granted = selectedAll.value;
        item.buttons?.forEach((button) => {
            button.granted = selectedAll.value;
        });
    });
    indeterminate.value = false;
};
// 表头-批量设置
const bulkShow = ref<boolean>(false);
const bulkOptions = [
    {
        label: '全部数据',
        value: 'ignore',
    },
    {
        label: '所在组织及下级组织',
        value: 'org-include-children',
    },
    {
        label: '所在组织',
        value: 'org',
    },
    {
        label: '自己创建的',
        value: 'creator',
    },
];
const bulkValue = ref<string>('');
const bulkChange = () => {
    if (!bulkValue) return;
    flatTableData.forEach((item) => {
        if (item.accessSupport && item.accessSupport.value === 'support') {
            item.selectAccesses = bulkValue.value;
        }
    });
};
// ------------下面为表格内容部分------------------
const flatTableData: tableItemType[] = []; // 表格数据的扁平化版本--浅克隆   方便进行对表格数据进行操作

const init = () => {
    getAllPermiss();
    watch(tableData, () => {
        const selected = cloneDeep(flatTableData).filter((item) => (item.granted || item.indeterminate) && !item.parentId);
        selected.forEach((item) => {
            if (
                item.accessSupport &&
                item.accessSupport.value === 'support' &&
                item.selectAccesses
            ) {
                item.selectAccesses = bulkValue.value;
                item.assetAccesses?.forEach((asset) => {
                    if (asset.supportId === item.selectAccesses) {
                        asset.granted = true;
                    } else {
                        asset.granted = false;
                    }
                });
                delete item.selectAccesses;
            }
            delete item.indeterminate
        });
        emits(
            'update:selectItems',
            selected,
        );
    });
};
init();

function getAllPermiss() {
    const id = route.params.id as string;
    getPrimissTree_api(id).then((resp) => {
        tableData.value = resp.result;

        treeToSimple(resp.result); // 表格数据扁平化

        const selectList = flatTableData.filter((item) => item.granted); // 第一列选中的项
        emits('update:selectItems', selectList); // 选中的项传回父组件
        // 判断是全选/半全选
        if (selectList.length === flatTableData.length) {
            selectedAll.value = true;
            indeterminate.value = false;
        } else if (selectList.length > 0) {
            indeterminate.value = true;
            selectedAll.value = false;
        }
    });
}
/**
 * 菜单权限改变事件
 * @param row 触发的项
 * @param setButtonBool 是否改变对应的操作权限
 */
function menuChange(
    row: tableItemType,
    setButtonBool: boolean = true,
): undefined {
    if (setButtonBool) {
        if (row.buttons && row.buttons.length > 0)
            row.buttons.forEach((button) => {
                button.granted = row.granted;
            });
        row.children && setChildrenChecked(row.children, row.granted);
    }

    // 改变上层节点的状态
    const selectList = flatTableData.filter((item) => item.granted); // 第一列选中的项
    if (row.parentId) {
        // 找到对应的父节点  判断该父节点的选中状态为 全选中/部分选中/未选中
        const parent = flatTableData.find(
            (item) => item.id === row.parentId,
        ) as tableItemType;
        const selectLen = parent.children?.filter((item) => item.granted)
            .length as number; // 父节点的已选中子节点的数量

        if (selectLen === parent.children?.length) {
            parent.granted = true;
            parent.indeterminate = false;
        } else if (selectLen > 0) {
            parent.granted = false;
            parent.indeterminate = true;
        } else {
            parent.granted = false;
            parent.indeterminate = false;
        }

        if (parent.parentId) {
            return menuChange(parent, false);
        }
    }

    // 改变头部节点状态
    if (selectList.length === flatTableData.length) {
        selectedAll.value = true;
        indeterminate.value = false;
    } else if (selectList.length > 0) {
        indeterminate.value = true;
        selectedAll.value = false;
    } else {
        selectedAll.value = false;
        indeterminate.value = false;
    }
    emits('update:selectItems', selectList); // 选中的项传回父组件
}
/**
 * 操作权限改变事件
 * @param row 触发的项
 */
function actionChange(row: tableItemType) {
    const selectLen = row.buttons?.filter((item) => item.granted)
        .length as number;

    if (selectLen === row.buttons?.length) {
        row.granted = true;
        row.indeterminate = false;
    } else if (selectLen > 0) {
        row.granted = false;
        row.indeterminate = true;
    } else {
        row.granted = false;
        row.indeterminate = false;
    }

    menuChange(row, false);
}

/**
 * 将树形结构的表格数据拍扁为一个普通数组
 * @param treeData
 */
function treeToSimple(treeData: tableItemType[]) {
    treeData.forEach((item) => {
        if (item.accessSupport && item.accessSupport.value === 'support') {
            const select =
                item.assetAccesses?.find((assetItem) => assetItem.granted) ||
                {};
            item.selectAccesses = select.supportId || '';
        }
        flatTableData.push(item);
        item.children && treeToSimple(item.children);
    });
}
/**
 * 设置子节点的状态
 * @param childrens
 * @param value
 */
function setChildrenChecked(childrens: tableItemType[], value: boolean) {
    if (childrens.length < 1) return;
    childrens.forEach((item) => {
        item.granted = value;
        if (item.buttons && item.buttons.length > 0)
            item.buttons.forEach((button) => {
                button.granted = value;
            });
        item.children && setChildrenChecked(item.children, value);
    });
}

type buttonItemType = {
    supportId: string;
    name: string;
    granted: boolean;
};
type tableItemType = {
    id: string;
    granted: boolean;
    name: string;
    indeterminate?: boolean;
    parentId?: string;
    children?: tableItemType[];
    accessSupport?: any;
    buttons?: buttonItemType[];
    accessDescription?: string;
    selectAccesses?: string;
    assetAccesses?: any[];
};
</script>

<style lang="less" scoped>
.permiss-tree-container {
}
</style>
