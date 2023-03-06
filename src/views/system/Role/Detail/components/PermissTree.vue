<template>
    <div class="permiss-tree-container">
        <j-table
            :columns="columns"
            :data-source="tableData"
            :pagination="false"
            :rowKey="'id'"
            :scroll="{ y: '500px' }"
        >
            <!-- 表头 -->
            <template #headerCell="{ column }">
                <div v-if="column.key === 'menu'">
                    <j-checkbox
                        v-model:checked="selectedAll"
                        :indeterminate="indeterminate"
                        @change="selectAllChange"
                        >菜单权限</j-checkbox
                    >
                </div>
                <div v-else-if="column.key === 'data'">
                    <span style="">数据权限</span>
                    <j-tooltip>
                        <template #title
                            >勾选任意数据权限均能看到自己创建的数据权限</template
                        >
                        <AIcon type="QuestionCircleOutlined" />
                    </j-tooltip>
                    <j-checkbox
                        v-model:checked="bulkShow"
                        @change="bulkValue = ''"
                        style="margin-left: 10px"
                        >批量设置</j-checkbox
                    >
                    <j-select
                        v-show="bulkShow"
                        v-model:value="bulkValue"
                        :size="'middle'"
                        style="width: 200px"
                        :options="bulkOptions"
                        @change="bulkChange"
                        placeholder="请选择"
                    ></j-select>
                </div>
                <div v-else>
                    <span>{{ column.title }}</span>
                </div>
            </template>
            <!-- 表格内容 -->
            <template #bodyCell="{ column, record }">
                <div v-if="column.key === 'menu'">
                    <j-checkbox
                        v-model:checked="record.granted"
                        :indeterminate="record.indeterminate"
                        @change="menuChange(record, true)"
                        >{{ record.name }}</j-checkbox
                    >
                </div>

                <div v-else-if="column.key === 'action'">
                    <div v-if="record.buttons && record.buttons.length > 0">
                        <j-checkbox
                            v-for="button in record.buttons"
                            v-model:checked="button.granted"
                            @change="actionChange(record)"
                            >{{ button.name }}</j-checkbox
                        >
                    </div>
                </div>

                <div v-else-if="column.key === 'data'">
                    <span v-if="record.accessSupport === undefined">
                        不支持数据权限配置，默认可查看全部数据
                    </span>
                    <div v-else-if="record.accessSupport.value === 'support'">
                        <j-radio-group
                            v-model:value="record.selectAccesses"
                            @change="resetBulk"
                        >
                            <j-radio
                                :value="asset.supportId"
                                v-for="asset in record.assetAccesses"
                                >{{ asset.name }}</j-radio
                            >
                        </j-radio-group>
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
        </j-table>
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

// 重置批量设置
const resetBulk = () => {
    bulkValue.value = '';
    bulkShow.value = false;
};
// ------------下面为表格内容部分------------------
const flatTableData: tableItemType[] = []; // 表格数据的扁平化版本--浅克隆   方便进行对表格数据进行操作

const init = () => {
    getAllPermiss();
    // 监听权限的修改情况，产生修改后反馈给父组件
    watch(
        tableData,
        () => {
            // 深克隆表格数据的扁平版  因为会做一些改动 该改动只用于反馈给父组件，本组件无需变化
            const selected = cloneDeep(flatTableData).filter(
                (item) =>
                    (item.granted && item.parentId) ||
                    (item.indeterminate && item.buttons),
            );

            selected.forEach((item) => {
                /**
                 * 如果该项支持设置数据权限，则对其进行数据权限的映射，结束后删除用于映射的源属性，
                 * 同时清除用于半全选状态的标记
                 */
                if (
                    item.accessSupport &&
                    item.accessSupport.value === 'support' &&
                    item.selectAccesses
                ) {
                    // item.selectAccesses = bulkValue.value;
                    item.assetAccesses?.forEach((asset) => {
                        if (asset.supportId === item.selectAccesses) {
                            asset.granted = true;
                        } else {
                            asset.granted = false;
                        }
                    });
                    delete item.selectAccesses;
                }
                delete item.indeterminate;
                item.granted = true;
            });
            emits('update:selectItems', selected);
        },
        { deep: true },
    );
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
    // 判断是否需要对子菜单及操作权限进行选择
    if (setButtonBool) {
        if (row.buttons && row.buttons.length > 0)
            row.buttons.forEach((button) => {
                button.granted = row.granted;
            });
        row.children && setChildrenChecked(row.children, row.granted);
    }
    // 更新选中状态
    if (row.buttons && row.buttons.length > 0) setStatus(row, 'buttons');
    else setStatus(row, 'children');
    // 更新数据权限
    if (row.selectAccesses !== undefined) {
        if (!row.granted) {
            row.selectAccesses = '';
        } else if (row.selectAccesses === '') {
            row.selectAccesses = 'creator';
        }
    }
    // 更新上层节点的状态
    if (row.parentId) {
        // 找到对应的父节点  判断该父节点的选中状态为 全选中/部分选中/未选中
        const parent = flatTableData.find(
            (item) => item.id === row.parentId,
        ) as tableItemType;
        setStatus(parent, 'children');
        // 若该父节点不是根节点  重复此操作以此来确定该父节点的父节点状态
        if (parent.parentId) {
            return menuChange(parent, false);
        }
    }

    // 取消批量设置
    resetBulk();

    // 改变头部节点状态
    const selectList = flatTableData.filter((item) => item.granted); // 第一列选中的项
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
    setStatus(row, 'buttons');
    menuChange(row, false);
}

/**
 * 将树形结构的表格数据拍扁为一个普通数组
 * @param treeData
 */
function treeToSimple(treeData: tableItemType[]) {
    treeData.forEach((item) => {
        // 数据权限回填
        if (item.accessSupport && item.accessSupport.value === 'support') {
            const select =
                item.assetAccesses?.find((assetItem) => assetItem.granted) ||
                {};
            item.selectAccesses = select.supportId || '';
        }
        if (item.buttons && item.buttons.length > 0) setStatus(item, 'buttons');
        else setStatus(item, 'children');
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
        item.indeterminate = false;
        if (item.buttons && item.buttons.length > 0)
            item.buttons.forEach((button) => {
                button.granted = value;
            });
        item.children && setChildrenChecked(item.children, value);
    });
}
/**
 * 根据taget的prop属性，判断对应的全选状态，头部全选不适用
 * @param target 目标对象
 * @param prop 目标属性
 */
function setStatus(
    target: tableItemType,
    prop: 'children' | 'buttons' = 'children',
) {
    const childrens = target[prop] as any[];

    if (childrens && childrens instanceof Array) {
        // 如果子选项有半全选，则当前节点直接为半全选
        const indeterminateLen = childrens.filter(
            (childrens: buttonItemType | tableItemType) =>
                childrens?.indeterminate,
        ).length;
        if (indeterminateLen > 0) {
            target.granted = false;
            target.indeterminate = true;
            return;
        }

        const selectLen = childrens.filter(
            (children: buttonItemType | tableItemType) => children.granted,
        ).length;
        if (selectLen === childrens.length) {
            target.granted = true;
            target.indeterminate = false;
        } else if (selectLen > 0) {
            target.granted = false;
            target.indeterminate = true;
        } else {
            target.granted = false;
            target.indeterminate = false;
        }
    }
}
type buttonItemType = {
    supportId: string;
    name: string;
    granted: boolean;
    indeterminate?: boolean;
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
