<template>
    <page-container>
        <j-card>
            <div class="top">
                <AIcon style="padding: 12px" type="ExclamationCircleOutlined" />
                <span
                    >单击可切换菜单未选中/选中状态；操作父级菜单时，对应子菜单状态将默认与其同步，可以单独操作调整；支持拖拽菜单调整展示顺序。
                </span>
            </div>
            <div class="content">
                <j-card title="菜单配置" style="width: 80%">
                    <div class="tree">
                        <j-tree
                            v-if="treeData.length !== 0"
                            show-line
                            defaultExpandAll
                            multiple
                            draggable
                            :tree-data="treeData"
                            :height="520"
                            @select="onSelect"
                            :selectedKeys="selectedKeys"
                            @drop="onDrop"
                        >
                            <template #title="row">
                                <div class="tree-content">
                                    <div class="tree-content-title">
                                        <AIcon type="HolderOutlined" />
                                        <div style="margin-left: 8px">
                                            {{ row.name }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </j-tree>
                    </div>
                </j-card>
            </div>
            <j-button
                type="primary"
                @click="() => (visible = true)"
                style="margin-left: 10%"
                >保存</j-button
            >
        </j-card>
        <j-modal
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            modalType="message"
            :confirmLoading="loading"
        >
            保存后当前系统菜单数据将被覆盖，确认操作？
        </j-modal>
    </page-container>
</template>

<script setup lang="ts" name="MenuSetting">
import { getMenuTree_api } from '@/api/system/menu';
import {
    getSystemPermission as getSystemPermission_api,
    updateMenus,
} from '@/api/initHome';
import {
    filterMenu,
    mergeMapToArr,
    developArrToMap,
    drop,
    select,
    getMaxDepth,
} from './utils';
import BaseMenu from '@/views/init-home/data/baseMenu';
import type { AntTreeNodeDropEvent } from 'ant-design-vue/es/tree';
import { cloneDeep } from 'lodash';
import { onlyMessage } from '@/utils/comm';
import { MESSAGE_SUBSCRIBE_MENU_CODE, USER_CENTER_MENU_CODE } from '@/utils/consts'

const selectedKeys: any = ref([]);
const treeData = ref<any>([]);
const systemMenu: any = ref([]);
const baseMenu: any = ref([]);
const AllMenu = ref([]);
const visible = ref(false);
const loading = ref(false);

const params = {
    paging: false,
    terms: [
        {
            terms: [
                {
                    column: 'owner',
                    termType: 'eq',
                    value: 'iot',
                },
                {
                    column: 'owner',
                    termType: 'isnull',
                    value: '1',
                    type: 'or',
                },
            ],
        },
    ],
};

// 过滤子级空children
const filterAndClean = (data: any) => {
    // 如果 data 是一个数组，则对每个元素递归调用此函数
    if (Array.isArray(data)) {
        return data
            .filter((item) => item !== null) // 过滤掉 null 元素
            .map((item: any) => filterAndClean(item)); // 递归调用此函数
    }

    // 如果 data 是一个对象，则递归调用此函数来清除其子元素
    if (typeof data === 'object') {
        let cleanedChildren = filterAndClean(data.children); // 递归清除子元素
        if (Array.isArray(cleanedChildren)) {
            cleanedChildren = cleanedChildren.filter((i) => i);
        }

        if (cleanedChildren !== undefined) {
            data.children = cleanedChildren;
        } else {
            delete data.children; // 如果 children 是 undefined，则将其删除
        }
    }
    return data;
};

const handleOk = async () => {
    const { arrMap, rootSet } = developArrToMap(
        cloneDeep(treeData.value),
        false,
        true,
    );
    const dataMap = new Map();
    // 过滤选中菜单的map
    selectedKeys.value.forEach((item: string) => {
        if (arrMap.has(item)) {
            dataMap.set(item, arrMap.get(item));
        }
    });

    const _saveDataMap = {
        arrMap: dataMap,
        rootSet,
    };

    const dataArr = filterAndClean(mergeMapToArr(_saveDataMap, _saveDataMap));

    loading.value = true;
    const res = await updateMenus(dataArr).catch(() => {});
    if (res?.status === 200) {
        onlyMessage('操作成功', 'success');
    }
    loading.value = false;
    visible.value = false;
};
const handleCancel = () => {
    visible.value = false;
};

const onSelect = (selecteds: Array<string>, e: any) => {
    selectedKeys.value = select(selecteds, e);
};

const onDrop = (info: AntTreeNodeDropEvent) => {
    const TreeData = cloneDeep(treeData.value);
    const newTreeData = drop(info, treeData.value);
    const maxDepth = getMaxDepth(newTreeData);
    if (maxDepth > 3) {
        onlyMessage('仅支持3级菜单', 'error');
        treeData.value = TreeData;
    } else {
        treeData.value = newTreeData;
    }
};

onMounted(() => {
    getSystemPermission_api().then((resp: any) => {
        baseMenu.value = filterMenu(
            resp.result.map((item: any) => JSON.parse(item).id),
            BaseMenu,
        );
        getMenuTree_api(params).then((resp: any) => {
            if (resp.status == 200) {
                systemMenu.value = resp.result?.filter((item: { code: string }) => ![USER_CENTER_MENU_CODE, MESSAGE_SUBSCRIBE_MENU_CODE].includes(item.code));
                //初始化菜单
                const baseMenuData = developArrToMap(baseMenu.value);
                const systemMenuData = developArrToMap(systemMenu.value, true);
                selectedKeys.value = systemMenuData.checkedKeys;
                AllMenu.value = mergeMapToArr(baseMenuData, systemMenuData);
                treeData.value = cloneDeep(AllMenu.value);
            }
        });
    });
});
</script>

<style lang="less" scoped>
.top {
    background: #f6f6f6;
    height: 40px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.55);
    margin-bottom: 12px;
}
.content {
    width: 100%;
    margin: 12px 0;
    display: flex;
    justify-content: center;
    // flex-direction: row;
    :deep(.ant-tree) {
        .ant-tree-switcher {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .ant-tree-switcher-noop {
            visibility: hidden;
        }
        .ant-tree-treenode {
            width: 100%;
        }
        .ant-tree-node-content-wrapper {
            width: 100%;
        }
    }
    :deep(.ant-card-body) {
        padding: 0;
    }

    .tree {
        // flex: 1;
        height: 540px;
        margin: 16px 0;
        padding: 12px;
        background: #ffffff;
        border-radius: 4px;
        overflow: hidden;
        width: 100%;

        &-content {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;

            &-title {
                flex: 1;
                font-weight: 800;
                font-size: 12px;
                line-height: 24px;
                display: flex;
                align-items: center;
                color: #333333;
            }
            &-action {
                // width: 20px;
            }
        }
    }
}
</style>
