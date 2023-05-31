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
                      <j-scrollbar>
                        <j-tree
                          v-if="treeData.length !== 0"
                          show-line
                          defaultExpandAll
                          multiple
                          draggable
                          :tree-data="treeData"
                          @select="onSelect"
                          :selectedKeys="selectedKeys"
                          @drop="onDrop"
                          @dragend="onDragend"
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
                      </j-scrollbar>
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
    initData,
    drop,
    select,
    getMaxDepth,
    mergeArr,
    findAllParentsAndChildren,
    handleSorts
} from './utils';
import BaseMenu from '@/views/init-home/data/baseMenu';
import type { AntTreeNodeDropEvent } from 'ant-design-vue/es/tree';
import { cloneDeep } from 'lodash';
import { onlyMessage } from '@/utils/comm';
import {
    MESSAGE_SUBSCRIBE_MENU_CODE,
    USER_CENTER_MENU_CODE,
} from '@/utils/consts';

const selectedKeys: any = ref([]);
const treeData = ref<any>([]);
const systemMenu: any = ref([]);
const baseMenu: any = ref([]);
const visible = ref(false);
const loading = ref(false);
const treeDataDropChange = ref(false); // 标记treeData拖拽成功

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

function filterTree(nodes: Array<any>, selectedKeys: Array<any>) {
    const filtered = [];
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node.code) {
            continue;
        }

        if (selectedKeys.indexOf(node.code) !== -1) {
            filtered.push(node);
            if (node.children) {
                node.children = filterTree(node.children, selectedKeys);
            }
        } else if (node.children) {
            node.children = filterTree(node.children, selectedKeys);
            if (node.children.length > 0) {
                filtered.push(node);
            }
        }
    }
    return filtered;
}

const handleOk = async () => {
    const _dataArr = filterTree(cloneDeep(treeData.value), selectedKeys.value);
    const _dataSorts = handleSorts(_dataArr)
    loading.value = true;
    const res = await updateMenus(_dataSorts).catch(() => {});
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
    selectedKeys.value = select(selecteds, e, cloneDeep(treeData.value));
};

const onDrop = (info: AntTreeNodeDropEvent) => {
    const TreeData = cloneDeep(treeData.value);
    const newTreeData = drop(info, treeData.value);
    const maxDepth = getMaxDepth(newTreeData);
    if (maxDepth > 3) {
        onlyMessage('仅支持3级菜单', 'error');
        treeDataDropChange.value = false;
        treeData.value = TreeData;
    } else {
        treeDataDropChange.value = true;
        treeData.value = newTreeData;
    }
};

const onDragend = (info: AntTreeNodeDropEvent) => {
    const { node } = info;
    const { children } = findAllParentsAndChildren(
        cloneDeep(treeData.value),
        node.code,
    );
    const cancelKeys = [node.code, ...children];
    const Keys = new Set(cloneDeep(selectedKeys.value));
    cancelKeys.forEach((i) => {
        Keys.has(i) && Keys.delete(i);
    });
    //拖拽成功时更新selectedKeys
    if (treeDataDropChange.value) {
        selectedKeys.value = [...Keys];
    }
};

onMounted(() => {
    getSystemPermission_api().then((resp: any) => {
        const filterBaseMenu = BaseMenu.filter(item => ![
          USER_CENTER_MENU_CODE,
          MESSAGE_SUBSCRIBE_MENU_CODE,
        ].includes(item.code))
        baseMenu.value = filterMenu(
            resp.result.map((item: any) => JSON.parse(item).id),
          filterBaseMenu,
        );
        getMenuTree_api(params).then((resp: any) => {
            if (resp.status == 200) {
                systemMenu.value = resp.result?.filter(
                    (item: { code: string }) =>
                        ![
                            USER_CENTER_MENU_CODE,
                            MESSAGE_SUBSCRIBE_MENU_CODE,
                        ].includes(item.code),
                );
                //初始化菜单
                initData(baseMenu.value); // 不要克隆，通过引用 处理key和name
                const systemMenuData = initData(systemMenu.value);
                selectedKeys.value = systemMenuData.checkedKeys;

                const AllMenu = mergeArr(
                    cloneDeep(filterBaseMenu),
                    cloneDeep(systemMenu.value),
                );

                // 处理排序
                treeData.value = handleSorts(AllMenu);
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
        height: 540px;

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
