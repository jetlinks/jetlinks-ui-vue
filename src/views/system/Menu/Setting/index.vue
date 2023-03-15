<template>
    <div class="setting-container">
        <h5 class="top">
            <AIcon type="ExclamationCircleOutlined" />
            <span style="padding-left: 12px"
                >基于系统源代码中的菜单数据，配置系统菜单。</span
            >
        </h5>

        <div class="transfer">
            <!-- 左侧树 -->
            <div class="basic-tree left">
                <div class="title">
                    <div class="title-label">
                        <span>源菜单</span>
                        <j-tooltip>
                            <template #title
                                >根据系统代码自动读取的菜单数据</template
                            >
                            <AIcon type="QuestionCircleOutlined" />
                        </j-tooltip>
                    </div>
                    <div class="title-func">
                        <j-button
                            type="primary"
                            @click="dialogShow = true"
                            ghost
                            >一键拷贝</j-button
                        >
                    </div>
                </div>
                <div class="content">
                    <j-input
                        v-model:value="transfer.data.leftSearchValue"
                        style="margin-bottom: 8px"
                        placeholder="请输入菜单名称"
                    >
                        <template #prefix>
                            <AIcon
                                type="SearchOutlined"
                                style="color: #b3b3b3"
                            />
                        </template>
                    </j-input>
                    <j-tree
                        autoExpandParent
                        :tree-data="transfer.data.leftTreeData"
                        draggable
                    >
                        <template #title="row">
                            <div>{{ row.name }}</div>
                        </template>
                    </j-tree>
                </div>
            </div>

            <div class="center">
                <j-button>请拖动至右侧</j-button>
            </div>
            <!-- 右侧树 -->
            <div class="basic-tree right">
                <div class="title">
                    <div class="title-label">
                        <span>系统菜单</span>
                        <j-tooltip>
                            <template #title
                                >菜单管理页面配置的菜单数据</template
                            >
                            <AIcon type="QuestionCircleOutlined" />
                        </j-tooltip>
                    </div>
                </div>
                <div class="content">
                    <j-input
                        v-model:value="transfer.data.rightSearchValue"
                        style="margin-bottom: 8px"
                        placeholder="请输入菜单名称"
                    >
                        <template #prefix>
                            <AIcon
                                type="SearchOutlined"
                                style="color: #b3b3b3"
                            />
                        </template>
                    </j-input>
                    <j-tree
                        draggable
                        autoExpandParent
                        :tree-data="transfer.data.rightTreeData"
                        @drop="transfer.onRightDrop"
                    >
                        <template #title="row">
                            <div
                                style="
                                    display: flex;
                                    justify-content: space-between;
                                "
                            >
                                <span>{{ row.name }}</span>
                                <j-popconfirm
                                    title="确认删除？"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="transfer.removeItem(row)"
                                >
                                    <j-tooltip>
                                        <template #title>删除</template>
                                        <j-button
                                            style="padding: 0"
                                            type="link"
                                        >
                                            <AIcon type="CloseOutlined" />
                                        </j-button>
                                    </j-tooltip>
                                </j-popconfirm>
                            </div>
                        </template>
                    </j-tree>
                </div>
            </div>
        </div>

        <j-button type="primary" style="margin-top: 24px">保存</j-button>

        <div class="dialogs">
            <j-modal
                v-model:visible="dialogShow"
                title="一键拷贝"
                @ok="transfer.copy"
                cancelText="取消"
                okText="确认"
            >
                <p>源数据将会覆盖当前的系统菜单数据，确定要一键拷贝吗？</p>
            </j-modal>
        </div>
    </div>
</template>

<script setup lang="ts" name="MenuSetting">
import { getMenuTree_api } from '@/api/system/menu';
import { getSystemPermission as getSystemPermission_api } from '@/api/initHome';
import { filterMenu, getKeys, loop } from './utils';
import BaseTreeData from './baseMenu';
import type {
    AntTreeNodeDropEvent,
    TreeDataItem,
    TreeProps,
} from 'ant-design-vue/es/tree';

const transfer = {
    data: reactive({
        // 左侧树
        leftSearchValue: '',
        leftTreeData: [] as any[],

        // 右侧树
        rightSearchValue: '',
        rightTreeData: [] as any[],
    }),
    leftSourceData: [] as any[],
    rightSourceData: [] as any[],

    init: () => {
        // 源菜单
        const sourceMenu = getSystemPermission_api().then((resp: any) => {
            const newTree = filterMenu(
                resp.result.map((item: any) => JSON.parse(item).id),
                BaseTreeData,
            );
            transfer.leftSourceData = [...newTree];
            transfer.data.leftTreeData = newTree;
        });
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
        // 系统菜单
        const systemMenu = getMenuTree_api(params).then((resp: any) => {
            transfer.data.rightTreeData = resp.result;
            transfer.rightSourceData = [...resp.result];
        });
        // 当两个菜单的源数据都获取到之后，对左侧菜单进行更新，更新每项是否需要禁用
        Promise.all([sourceMenu, systemMenu]).then(() => transfer.updateTree());
    },
    copy: () => {
        transfer.data.rightTreeData = [...toRaw(transfer.data.leftTreeData)];
        dialogShow.value = false;
    },
    removeItem: (row: any) => {
        loop(
            transfer.data.rightTreeData,
            row.id,
            (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
                arr?.splice(index, 1);
            },
        );
        transfer.updateTree();
    },
    onRightDrop: (info: AntTreeNodeDropEvent) => {
        const dropKey = info.node.id;
        const dragKey = info.dragNode.id;
        const dropPos = (info.node.pos && info.node.pos.split('-')) || [];
        const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const data = [...transfer.data.rightTreeData];
        let dragObj: TreeDataItem = { key: '' };
        loop(
            data,
            dragKey,
            (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
                arr?.splice(index, 1);
                dragObj = item;
            },
        );

        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item: TreeDataItem) => {
                item.children = item.children || [];
                /// where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else if (
            (info.node.children || []).length > 0 && // Has children
            info.node.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item: TreeDataItem) => {
                item.children = item.children || [];
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj);
            });
        } else {
            let ar: TreeProps['treeData'] = [];
            let i = 0;
            loop(
                data,
                dropKey,
                (
                    _item: TreeDataItem,
                    index: number,
                    arr: TreeProps['treeData'],
                ) => {
                    ar = arr;
                    i = index;
                },
            );
            if (dropPosition === -1) {
                ar.splice(i, 0, dragObj);
            } else {
                ar.splice(i + 1, 0, dragObj);
            }
        }
        transfer.data.rightTreeData = data;
    },
    updateTree: () => {
        console.log(getKeys(transfer.data.rightTreeData));
    },
};
transfer.init();

const dialogShow = ref<boolean>(false);
</script>

<style lang="less" scoped>
.setting-container {
    padding: 24px;
    margin: 24px;
    background-color: #fff;

    .top {
        font-size: inherit;
        margin-bottom: 24px;
        padding: 10px 24px;
        color: rgba(0, 0, 0, 0.55);
        background-color: #f6f6f6;
    }

    .transfer {
        display: flex;
        justify-content: space-between;

        .basic-tree {
            flex: 1;

            .title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                padding: 14px 16px;
                font-weight: 400;
                font-size: 16px;
                background-color: #f3f4f4;

                .title-label {
                    span {
                        padding-right: 12px;
                    }
                }
            }

            .content {
                padding: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;

                .ant-input-affix-wrapper {
                    width: 75%;
                }

                :deep(.ant-tree) {
                    height: 500px;
                    overflow: auto;
                    .ant-tree-list-holder-inner {
                        > .ant-tree-treenode {
                            width: 100%;
                        }
                        .ant-tree-node-content-wrapper {
                            width: 100%;
                        }
                    }
                }
            }
        }

        .center {
            flex-basis: 120px;
            display: flex;
            align-items: center;
            margin: 0 24px;
        }
    }
}
</style>
