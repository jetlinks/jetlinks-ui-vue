<template>
    <div class="channel-tree">
        <div class="channel-tree-query">
            <j-input @change="queryTree" placeholder="请输入目录名称">
                <template #suffix>
                    <AIcon type="SearchOutlined" />
                </template>
            </j-input>
        </div>
        <div class="channel-tree-content">
            <j-tree
                :height="500"
                :selectedKeys="selectedKeys"
                :treeData="treeData"
                :onSelect="(keys:any) => {
                    if (keys.length) {
                    selectedKeys = keys
                    if (props.onSelect) {
                        props.onSelect(keys[0]);
                    }
                    }
                }"
                :fieldNames="{ key: 'id', title: 'name' }"
                :showLine="{ showLeafIcon: false }"
                :show-icon="true"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es';
import ChannelApi from '@/api/media/channel';

interface TreeProps {
    onSelect: (id: string) => void;
    onTreeLoad: (type: boolean) => void;
    deviceData: any;
}

const props = defineProps<TreeProps>();

const treeData = ref<any[]>([]);
const selectedKeys = ref<string[]>([]);

const getTreeData = async (id: string, data?: any) => {
    const { result } = await ChannelApi.queryTree(id, data);
    treeData.value[0].children = result || [];
    props.onTreeLoad(treeData.value[0].children.length > 10);
    treeData.value = treeData.value;
};

const queryTree = debounce((e: any) => {
    getTreeData(props.deviceData.id, {
        terms: [
            { column: 'name', termType: 'like', value: `%${e.target.value}%` },
        ],
    });
}, 300);

watch(
    () => props.deviceData,
    () => {
        treeData.value = [
            {
                id: props.deviceData.id,
                name: props.deviceData.name,
                children: [],
            },
        ];
        selectedKeys.value = [props.deviceData.id];
        getTreeData(props.deviceData.id, {});
    },{
        deep:true
    }
);
</script>

<style lang="less" scoped>
.channel-tree {
    height: 100%;

    .channel-tree-query {
        margin-bottom: 16px;
    }

    .channel-tree-content {
        min-height: calc(100% - 50px);
    }
}
</style>
