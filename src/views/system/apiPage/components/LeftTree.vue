<template>
    <a-tree
        :tree-data="treeData"
        @select="clickSelectItem"
        showLine
        class="left-tree-container"
    >
        <template #title="{ name }">
            {{ name }}
        </template>
    </a-tree>
</template>

<script setup lang="ts">
import { TreeProps } from 'ant-design-vue';

import { getTreeOne_api, getTreeTwo_api } from '@/api/system/apiPage';
import { treeNodeTpye } from '../index';

const emits = defineEmits(['select']);

const treeData = ref<TreeProps['treeData']>([]);

const getTreeData = () => {
    let tree: treeNodeTpye[] = [];
    getTreeOne_api().then((resp: any) => {
        tree = resp.urls.map((item: any) => ({
            ...item,
            key: item.url,
        }));
        const allPromise = tree.map((item) => getTreeTwo_api(item.name));
        Promise.all(allPromise).then((values) => {
            values.forEach((item: any, i) => {
                tree[i].children = combData(item?.paths);
            });
            treeData.value = tree;
        });
    });
};
const clickSelectItem: TreeProps['onSelect'] = (key, node: any) => {
    emits('select', node.node.dataRef);
};

onMounted(() => {
    getTreeData();
});

const combData = (dataSource: object) => {
    const apiList: treeNodeTpye[] = [];
    const keys = Object.keys(dataSource);

    keys.forEach((key) => {
        const method = Object.keys(dataSource[key] || {})[0];
        const name = dataSource[key][method].tags[0];
        let apiObj: treeNodeTpye | undefined = apiList.find(
            (item) => item.name === name,
        );
        if (apiObj) {
            apiObj.apiList?.push({
                url: key,
                method: dataSource[key],
            });
        } else {
            apiObj = {
                name,
                key: name,
                apiList: [
                    {
                        url: key,
                        method: dataSource[key],
                    },
                ],
            };
            apiList.push(apiObj);
        }
    });

    return apiList;
};
</script>

<style lang="less">
.left-tree-container {
    .ant-tree-list {
        .ant-tree-list-holder-inner {
            .ant-tree-switcher-noop {
                display: none !important;
            }
        }
    }
}
</style>
