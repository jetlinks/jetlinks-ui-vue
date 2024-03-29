<template>
    <j-input
        placeholder="请输入区域名称或行政区划代码"
        class="search-input"
        v-model:value="searchValue"
        @change="(e) => onSearch(e.target.value)"
    >
        <template #prefix>
            <AIcon type="SearchOutlined" style="color: rgba(0, 0, 0, 0.45)" />
        </template>
    </j-input>
    <j-button @click="onAdd" type="primary" class="btn">新增区域</j-button>
    <j-tree
        class="draggable-tree"
        draggable
        block-node
        v-if="treeData.length"
        :tree-data="_treeData"
        @drop="onDrop"
        :defaultExpandAll="true"
        :height="700"
        :show-line="{ showLeafIcon: false }"
        :show-icon="true"
    >
        <template #title="_data">
            <div class="tree-box">
                <div class="name">
                    <j-ellipsis>{{ _data?.name }}</j-ellipsis>
                </div>
                <div class="actions">
                    <j-space :size="8">
                        <j-tooltip title="重命名">
                            <j-button
                                @click.stop="onEdit(_data?.data)"
                                class="actions-btn"
                                type="link"
                                ><AIcon type="EditOutlined"
                            /></j-button>
                        </j-tooltip>
                        <j-tooltip title="新增子区域">
                            <j-button
                                @click.stop="onAdd(_data?.data)"
                                class="actions-btn"
                                type="link"
                                ><AIcon type="PlusCircleOutlined"
                            /></j-button>
                        </j-tooltip>
                        <j-tooltip title="删除">
                            <j-popconfirm @confirm="onRemove(_data?.id)">
                                <j-button
                                    @click.stop
                                    class="actions-btn"
                                    type="link"
                                    danger
                                    ><AIcon type="DeleteOutlined"
                                /></j-button>
                            </j-popconfirm>
                        </j-tooltip>
                    </j-space>
                </div>
            </div>
        </template>
    </j-tree>
    <j-empty v-else style="margin-top: 150px" />
    <Save
        :mode="mode"
        v-if="visible"
        :data="current"
        @save="onSave"
        @close="onClose"
    />
</template>
<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
import { debounce } from 'lodash-es';
import { onMounted, ref, watch } from 'vue';
import Save from '../Save/index.vue';
import { getRegionTree, delRegion } from '@/api/system/region';

const treeData = ref<any[]>([]);
const _treeData = ref<any[]>([]);
const visible = ref<boolean>(false);
const current = ref<any>({});
const mode = ref<'add' | 'edit'>('add');
const searchValue = ref<string>();

const filterTreeNodes = (tree: any[], condition: string) => {
    return tree.filter((item) => {
        if (item?.title && item.title.includes(condition)) {
            return true;
        }
        if (item?.code && item.code.includes(condition)) {
            return true;
        }

        if (item.children) {
            item.children = filterTreeNodes(item.children, condition);
            return !!item.children.length;
        }

        return false;
    });
};

const onSearch = debounce((v: string) => {
    _treeData.value = filterTreeNodes(treeData.value, v);
});

const onSave = () => {
    visible.value = false;
    handleSearch()
};

const onClose = () => {
    visible.value = false;
};

const onEdit = (_data: any) => {
    mode.value = 'edit';
    current.value = _data;
    visible.value = true;
};

const onRemove = async (id: string) => {
    const resp = await delRegion(id);
    if (resp.success) {
        onlyMessage('操作成功！');
        handleSearch();
    }
};

const onAdd = (_data?: any) => {
    mode.value = 'add';
    current.value = _data ? _data : {};
    visible.value = true;
};

const onDrop = (info: any) => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const loop = (data: any, key: string | number, callback: any) => {
        data.forEach((item: any, index: number) => {
            if (item.key === key) {
                return callback(item, index, data);
            }
            if (item.children) {
                return loop(item.children, key, callback);
            }
        });
    };
    const data = [...treeData.value];
    // // Find dragObject
    let dragObj: any;
    loop(data, dragKey, (item: any, index: number, arr: any[]) => {
        arr.splice(index, 1);
        dragObj = item;
    });
    if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item: any) => {
            item.children = item.children || [];
            /// where to insert 示例添加到头部，可以是随意位置
            item.children.unshift(dragObj);
        });
    } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
    ) {
        loop(data, dropKey, (item: any) => {
            item.children = item.children || [];
            // where to insert 示例添加到头部，可以是随意位置
            item.children.unshift(dragObj);
        });
    } else {
        let ar: any[] = [];
        let i = 0;
        loop(data, dropKey, (_item: any, index: number, arr: any[]) => {
            ar = arr;
            i = index;
        });
        if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
        } else {
            ar.splice(i + 1, 0, dragObj);
        }
    }
    treeData.value = data;
};

watch(
    () => treeData.value,
    () => {
        if (searchValue.value) {
            onSearch(searchValue.value);
        } else {
            _treeData.value = treeData.value;
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

const handleSearch = async () => {
    const resp = await getRegionTree();
    if (resp.success) {
        treeData.value = resp?.result || [];
    }
};

onMounted(() => {
    handleSearch();
});
</script>

<style lang="less" scoped>
.btn {
    width: 100%;
    margin: 18px 0;
}
.tree-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .actions {
        .actions-btn {
            margin: 0;
            padding: 0;
        }
    }
}
</style>
  
  