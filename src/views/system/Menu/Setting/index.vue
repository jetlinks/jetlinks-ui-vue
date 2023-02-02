<template>
    <div class="setting-container">
        <a-card>
            <h5 class="top">
                <exclamation-circle-outlined />
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
                            <a-tooltip>
                                <template #title
                                    >根据系统代码自动读取的菜单数据</template
                                >
                                <question-circle-outlined />
                            </a-tooltip>
                        </div>
                        <div class="title-func">
                            <a-button type="primary" ghost>一键拷贝</a-button>
                        </div>
                    </div>
                    <div class="content">
                        <a-input
                            v-model:value="transfer.data.leftSearchValue"
                            style="margin-bottom: 8px"
                            placeholder="请输入菜单名称"
                        >
                            <template #prefix>
                                <search-outlined style="color: #b3b3b3" />
                            </template>
                        </a-input>
                        <a-tree
                            autoExpandParent
                            draggable
                            :tree-data="transfer.data.leftTreeData"
                        >
                            <template #title="row">
                                <span>{{ row.name }}</span>
                            </template>
                        </a-tree>
                    </div>
                </div>

                <div class="center">
                    <a-button>请拖动至右侧</a-button>
                </div>
                <!-- 右侧树 -->
                <div class="basic-tree right">
                    <div class="title">
                        <div class="title-label">
                            <span>系统菜单</span>
                            <a-tooltip>
                                <template #title
                                    >菜单管理页面配置的菜单数据</template
                                >
                                <question-circle-outlined />
                            </a-tooltip>
                        </div>
                    </div>
                    <div class="content">
                        <a-input
                            v-model:value="transfer.data.rightSearchValue"
                            style="margin-bottom: 8px"
                            placeholder="请输入菜单名称"
                        >
                            <template #prefix>
                                <search-outlined style="color: #b3b3b3" />
                            </template>
                        </a-input>
                        <a-tree
                            draggable
                            autoExpandParent
                            :tree-data="transfer.data.rightTreeData"
                            @drop="transfer.onDrop"
                            @dragenter="transfer.onDragEnter"
                        >
                            <template #title="row">
                                <div
                                    style="
                                        display: flex;
                                        justify-content: space-between;
                                    "
                                >
                                    <span>{{ row.name }}</span>
                                    <a-popconfirm
                                        title="确认删除？"
                                        ok-text="确定"
                                        cancel-text="取消"
                                        @confirm="transfer.removeItem(row)"
                                    >
                                        <a-tooltip>
                                            <template #title>删除</template>
                                            <a-button
                                                style="padding: 0"
                                                type="link"
                                            >
                                                <close-outlined />
                                            </a-button>
                                        </a-tooltip>
                                    </a-popconfirm>
                                </div>
                            </template>
                        </a-tree>
                    </div>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script setup lang="ts" name="MenuSetting">
import {
    ExclamationCircleOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
    CloseOutlined,
} from '@ant-design/icons-vue';

import { getMenuTree_api } from '@/api/system/menu';
import { getSystemPermission as getSystemPermission_api } from '@/api/initHome';
import { filterMenu } from './utils';
import BaseTreeData from './baseMenu';
import type {
    AntTreeNodeDragEnterEvent,
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

    init: () => {
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
        getMenuTree_api(params).then((resp: any) => {
            transfer.data.rightTreeData = resp.result;
            transfer.data.rightTreeData[2].disabled = true;
        });
        // 源菜单
        getSystemPermission_api().then((resp: any) => {
            const newTree = filterMenu(
                resp.result.map((item: any) => JSON.parse(item).id),
                BaseTreeData,
            );
            transfer.data.leftTreeData = newTree;
        });
    },
    removeItem: (row: any) => {
        transfer.loop(
            transfer.data.rightTreeData,
            row.id,
            (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
                arr?.splice(index, 1);
            },
        );
    },
    onDrop: (info: AntTreeNodeDropEvent) => {
        const dropKey = info.node.id;
        const dragKey = info.dragNode.id;
        const dropPos = (info.node.pos && info.node.pos.split('-')) || [];
        const dropPosition =
            info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const loop = transfer.loop;
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
    onDragEnter: (info: AntTreeNodeDragEnterEvent) => {
        // console.log('onDragEnter', info);
    },

    // 树辅助函数
    loop: (data: TreeProps['treeData'], id: string | number, callback: any) => {
        data?.forEach((item, index) => {
            if (item.id === id) {
                return callback(item, index, data);
            }
            if (item.children) {
                return transfer.loop(item.children, id, callback);
            }
        });
    },
};
transfer.init();
</script>

<style lang="less" scoped>
.setting-container {
    padding: 24px;
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
