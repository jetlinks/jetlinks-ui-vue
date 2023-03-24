<template>
    <page-container>
        <j-card>
            <div class="top">
                <AIcon style="padding: 12px" type="ExclamationCircleOutlined" />
                <span>基于系统源代码中的菜单数据，配置系统菜单。</span>
            </div>
            <div class="content">
                <div class="title">
                    系统菜单
                    <j-tooltip>
                        <template #title
                            >根据系统代码自动读取的菜单数据</template
                        >
                        <AIcon type="QuestionCircleOutlined" />
                    </j-tooltip>
                </div>
                <div class="tree">
                    <j-input
                        v-model="filterText"
                        placeholder="请输入"
                        @change="change"
                        style="margin-bottom: 12px"
                    />
                    <j-tree
                        show-line
                        defaultExpandAll
                        multiple
                        draggable
                        :tree-data="treeData"
                        :height="500"
                    >
                        <template #title="row">
                            <div class="tree-content">
                                <div class="tree-content-title">
                                    <AIcon type="HolderOutlined" />
                                    <div style="margin-left: 8px">
                                        {{ row.name }}
                                    </div>
                                </div>
                                <div class="tree-content-action">
                                    <span @click="(e) => e.stopPropagation()">
                                        <PermissionButton
                                            type="text"
                                            :tooltip="{
                                                title: '删除',
                                            }"
                                            hasPermission="DataCollect/Collector:delete"
                                            :popConfirm="{
                                                title: `确定删除？`,
                                                onConfirm: () =>
                                                    handlDelete(row.id),
                                            }"
                                        >
                                            <AIcon type="CloseOutlined" />
                                        </PermissionButton>
                                    </span>
                                </div>
                            </div>
                        </template>
                    </j-tree>
                </div>
                <j-button type="primary">保存</j-button>
            </div>
        </j-card>
    </page-container>
</template>

<script setup lang="ts" name="MenuSetting">
import { getMenuTree_api } from '@/api/system/menu';
import { getSystemPermission as getSystemPermission_api } from '@/api/initHome';
import { filterMenu, getKeys, loop } from './utils';
import BaseMenu from './baseMenu';
import type {
    AntTreeNodeDropEvent,
    TreeDataItem,
    TreeProps,
} from 'ant-design-vue/es/tree';
import { treeFilter } from '@/utils/tree';
import { cloneDeep } from 'lodash';

const treeData = ref<any>();
const filterText = ref('');
treeData.value = [...BaseMenu];
let systemMenu: any = reactive([]);
const baseMenu = cloneDeep(BaseMenu);

const BaseMenuMap = new Map();
BaseMenu.forEach((item) => {
    BaseMenuMap.set(item.code, item);
});

console.log(11, BaseMenuMap);

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

const change = (val: any) => {
    treeData.value = treeFilter(baseMenu, val.target.value, 'name');
};

const handlDelete = (value) => {
    console.log(22, value);
};

onMounted(() => {
    getMenuTree_api(params).then((resp: any) => {
        if (resp.status == 200) {
            systemMenu = resp.result;
            console.log(2, systemMenu);
        }
        // transfer.data.rightTreeData = resp.result;
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
}
.content {
    width: 50%;
    margin-top: 24px;
    .title {
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        height: 48px;
        padding: 12px;
        background: #f3f4f4;
        color: rgba(0, 0, 0, 0.8);
    }
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
    .tree {
        height: 580px;
        margin: 16px 0;
        padding: 12px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
        width: 100%;

        &-content {
            display: flex;
            justify-content: space-between;
            width: 100%;
            &-title {
                flex: 1;
                font-weight: 800;
                font-size: 12px;
                line-height: 17px;
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
