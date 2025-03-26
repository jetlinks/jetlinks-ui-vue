<template>
    <div class="permiss-tree-container">
        <a-table
            :columns="columns"
            :data-source="tableData"
            :pagination="false"
            :rowKey="'id'"
            :scroll="{ y: '50vh' }"
            ref="treeRef"
        >
            <!-- 表头 -->
            <template #headerCell="{ column }">
                <div v-if="column.key === 'menu'">
                    <a-checkbox
                        v-model:checked="selectedAll"
                        :indeterminate="indeterminate"
                        @change="selectAllChange"
                        >{{ $t('components.PermissionTree.954862-0') }}</a-checkbox
                    >
                </div>
                <div v-else-if="column.key === 'data'">
                    <span style="">{{ $t('components.PermissionTree.954862-1') }}</span>
                    <a-tooltip>
                        <template #title
                            >{{ $t('components.PermissionTree.954862-2') }}</template
                        >
                        <AIcon type="QuestionCircleOutlined" />
                    </a-tooltip>
                    <a-checkbox
                        v-model:checked="bulkShow"
                        @change="bulkValue = ''"
                        style="margin-left: 10px"
                        >{{ $t('components.PermissionTree.954862-3') }}</a-checkbox
                    >
                    <a-select
                        v-show="bulkShow"
                        v-model:value="bulkValue"
                        :size="'middle'"
                        style="width: 200px"
                        :options="bulkOptions"
                        @change="bulkChange"
                        :placeholder="$t('components.PermissionTree.954862-4')"
                    ></a-select>
                </div>
                <div v-else>
                    <span>{{ column.title }}</span>
                </div>
            </template>
            <!-- 表格内容 -->
            <template #bodyCell="{ column, record }">
                <div :id="record.id"></div>
                <div v-if="column.key === 'menu'">
<!--                    <a-checkbox-->
<!--                        v-model:checked="record.granted"-->
<!--                        :indeterminate="record.indeterminate"-->
<!--                        :disabled='record.code === USER_CENTER_MENU_CODE'-->
<!--                        @change="menuChange(record, true)"-->
<!--                        >{{ record.i18nName || record.name }}</a-checkbox-->
<!--                    >-->
                  <MenuCheckbox :data="record" v-model:value="record.granted" @change="menuChange(record, true)" />
                </div>
                <div v-else-if="column.key === 'action'">
                    <div v-if="record.buttons && record.buttons.length > 0">
                        <a-checkbox
                            v-for="button in record.buttons"
                            v-model:checked="button.granted"
                            :disabled='record.code === USER_CENTER_MENU_CODE && button.id === "view"'
                            @change="actionChange(record)"
                            :key="button.id"
                            >{{ button.i18nName || button.name }}</a-checkbox
                        >
                    </div>
                </div>

                <div v-else-if="column.key === 'data'">
                    <span v-if="record.accessSupport === undefined">
                        {{ $t('components.PermissionTree.954862-5') }}
                    </span>
                    <div v-else-if="record.accessSupport.value === 'support'">
                        <a-radio-group
                            v-model:value="record.selectAccesses"
                            @change="resetBulk"
                        >
                            <a-radio
                                :value="asset.supportId"
                                v-for="asset in record.assetAccesses"
                                :key="asset.name"
                                >{{ asset.i18nName || asset.name }}</a-radio
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

<script setup lang="ts" name="RolePermissionTree">
import { cloneDeep, uniqBy } from 'lodash-es';
import { getPermissionTree_api } from '@/api/system/role';
import { getCurrentInstance } from 'vue';
import {
  USER_CENTER_MENU_CODE
} from '@/utils/consts'
import {permissionsGranted, useIndirectMenusMap} from "@/views/system/Role/Detail/components/util";
import {NotificationSubscriptionCode} from "@/router/menu";
import { useI18n } from 'vue-i18n';
import MenuCheckbox from './MenuCheckbox.vue'

import { isNoCommunity } from '@/utils/utils'
import { paramsEncodeQuery } from "@/utils";

const { t: $t } = useI18n();
const emits = defineEmits(['update:selectItems']);
const route = useRoute();
const props = defineProps({
    selectItems: Array,
});
const treeRef = ref();
let { ctx: that, proxy } = getCurrentInstance();
const flatTableData: tableItemType[] = []; // 表格数据的扁平化版本--浅克隆   方便进行对表格数据进行操作

const columns = [
    {
        title: $t('components.PermissionTree.954862-0'),
        dataIndex: 'menu',
        key: 'menu',
        width: '260px',
    },
    {
        title: $t('components.PermissionTree.954862-6'),
        dataIndex: 'action',
        key: 'action',
        width: '260px',
    },
];

if(isNoCommunity){
    columns.push({
        title: '数据权限',
        dataIndex: 'data',
        key: 'data',
        width: '50%',
    })
}
const tableData = ref<tableItemType[]>([]);

// 表头-全选
const selectedAll = ref<boolean>(false);
const indeterminate = ref<boolean>(false);
const selectAllChange = () => {
    flatTableData.forEach((item) => {
        const flag = item.code === USER_CENTER_MENU_CODE
        // 改变菜单
        if(flag){
            item.granted = selectedAll.value;
            item.indeterminate = !selectedAll.value;
        } else {
            item.granted = selectedAll.value;
            item.indeterminate = false;
        }
        // 改变按钮
        item.buttons?.forEach((button) => {
            if(!(flag && button?.id === 'view')){
                button.granted = selectedAll.value;
            }
        });
        if (selectedAll.value) {
            // 全选
            item.selectAccesses = 'creator';
        } else {
            // 取消全选
            item.selectAccesses = '';
        }
        if (item.accessSupport && item.accessSupport.value === 'support') {
            item.assetAccesses?.forEach((asset) => {
                if (asset.supportId === item.selectAccesses) {
                    asset.granted = true;
                } else {
                    asset.granted = false;
                }
            });
        }
    });
    indeterminate.value = false;
    emits(
        'update:selectItems',
        flatTableData.filter((item) => item.granted),
    );
};
// 表头-批量设置
const bulkShow = ref<boolean>(false);
const bulkOptions = ref<any[]>([]);
const bulkValue = ref<string>('');
const bulkChange = () => {
    if (!bulkValue) return;
    flatTableData.forEach((item) => {
        if (item.accessSupport && item.accessSupport.value === 'support') {
            item.selectAccesses = bulkValue.value;
            item.assetAccesses?.forEach((asset) => {
                if (asset.supportId === bulkValue.value) {
                    asset.granted = true;
                } else {
                    asset.granted = false;
                }
            });
        }
    });
    emits(
        'update:selectItems',
        flatTableData.filter((item) => item.granted),
    );
};

// 重置批量设置
const resetBulk = () => {
    bulkValue.value = '';
    bulkShow.value = false;
};
// ------------下面为表格内容部分------------------
const init = () => {
    getAllPermiss();
    // 监听权限的修改情况，产生修改后反馈给父组件
    watch(
        tableData,
        () => {
            // 深克隆表格数据的扁平版  因为会做一些改动 该改动只用于反馈给父组件，本组件无需变化
            const selected = cloneDeep(flatTableData).filter(
                (item: any) =>
                    // (item.granted && item.parentId) ||
                    (item.indeterminate && item.buttons)
                    || (item.granted), // 放开个人中心
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

const { PermissionsMap } = useIndirectMenusMap(tableData)

function getAllPermiss() {
    const id = route.params.id as string;
    getPermissionTree_api(id, paramsEncodeQuery({
        terms: [
            {
                value: "%show\":false%",
                termType: "nlike",
                column: "options"
            }
        ]
    })).then((resp) => {
        const _result = resp.result
        // 默认选中个人中心相关设置
        tableData.value = _result.filter((item: { code: string , buttons: any[], granted: boolean}) => {
            if (item.code === USER_CENTER_MENU_CODE) {
                item.buttons = item.buttons.map(buttonItem => {
                if (buttonItem.id === 'view') {
                    buttonItem.granted = true
                }
                return buttonItem
                })
            }
            return (item.code !== NotificationSubscriptionCode)
        });

        treeToSimple(tableData.value); // 表格数据扁平化

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

const hasIndirectMenus = (data: any) => {
  let indirectMenus = []
  if (data.children) {
    const item = data.children.find(item => item.indirectMenus)
    indirectMenus = item.indirectMenus
  } else if (data?.indirectMenus) {
    indirectMenus = data.indirectMenus
  }

  if (indirectMenus.length) {
      const ids = permissionsGranted(tableData.value)
    console.log(ids, indirectMenus)
      const inMenu = false
  }

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
  console.log(row.granted, row, setButtonBool)
    // 判断是否需要对子菜单及操作权限进行选择
  // hasIndirectMenus(row)
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
    updateAuthority(row);
    // if (row.accessSupport && row.accessSupport.value === 'support') {
    //     // 如果当前数据权限已有值，且菜单权限没有被选中或被半选   则清空对应的数据权限
    //     if (row.selectAccesses && !row.granted && !row.indeterminate)
    //         row.selectAccesses = '';
    //     // 如果当前数据权限没有值，且菜单权限有被选中或者是被半选   则将数据权限变为默认值'creator'
    //     else if (!row.selectAccesses && (row.granted || row.indeterminate))
    //         row.selectAccesses = 'creator';
    // }

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
    proxy?.$forceUpdate?.();
}

/**
 * 更新权限
 */
const updateAuthority = (row: any) => {
    if (row.accessSupport && row.accessSupport.value === 'support') {
        // 如果当前数据权限已有值，且菜单权限没有被选中或被半选   则清空对应的数据权限
        if (row.selectAccesses && !row.granted && !row.indeterminate)
            row.selectAccesses = '';
        // 如果当前数据权限没有值，且菜单权限有被选中或者是被半选   则将数据权限变为默认值'creator'
        else if (!row.selectAccesses && (row.granted || row.indeterminate))
            row.selectAccesses = 'creator';
    }
    if (row.children?.length > 0) {
        row.children?.forEach((item: any) => {
            if (item.accessSupport && item.accessSupport.value === 'support') {
                // 如果当前数据权限已有值，且菜单权限没有被选中或被半选   则清空对应的数据权限
                if (item.selectAccesses && !item.granted && !item.indeterminate)
                    item.selectAccesses = '';
                // 如果当前数据权限没有值，且菜单权限有被选中或者是被半选   则将数据权限变为默认值'creator'
                else if (
                    !item.selectAccesses &&
                    (item.granted || item.indeterminate)
                )
                    item.selectAccesses = 'creator';
            }
            if (item.children) {
                updateAuthority(item.children);
            }
        });
    }
};
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
function treeToSimple(_treeData: tableItemType[]) {
    _treeData.forEach((item) => {
        // 数据权限回填
        if (item.accessSupport && item.accessSupport.value === 'support') {
            const select =
                item.assetAccesses?.find((assetItem) => assetItem.granted) ||
                {};
            item.selectAccesses = select.supportId || '';
        }
        if (item.buttons && item.buttons.length > 0) {
            setStatus(item, 'buttons');
        } else {
            setStatus(item, 'children');
        }
        if(item.children){
            treeToSimple(item.children);
        }
        flatTableData.push(item);
    });
    // 根据所有权限, 取assetAccesses并集数据
    if(isNoCommunity){
        let assets: any[] = [];
        flatTableData?.forEach((item: any) => {
            assets = [...assets, ...item.assetAccesses];
        });
        bulkOptions.value = uniqBy(assets, 'supportId')?.map((m: any) => ({
            label: m.i18nName || m.name,
            value: m.supportId,
        }));
    }
}
/**
 * 设置子节点的状态
 * @param _children
 * @param value
 */
function setChildrenChecked(_children: tableItemType[], value: boolean) {
    if (_children.length < 1) return;
    _children.forEach((item) => {
        item.granted = value;
        item.indeterminate = false;
        if (item.buttons && item.buttons.length > 0)
            item.buttons.forEach((button) => {
                button.granted = value;
            });
        if (item.assetAccesses?.length > 0) {
            item.assetAccesses?.forEach((i) => {
                if (i.supportId === 'creator') {
                    i.granted = true;
                }
            });
        }
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

<style lang="less" scoped>
.permiss-tree-container {
    :deep(.ant-checkbox-wrapper) {
        margin-left: 0;
    }
}
</style>
