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

type treeNodeTpye = {
    name: string;
    url: string;
    children?: treeNodeTpye[];
};
const emits = defineEmits(['select']);

const treeData: TreeProps['treeData'] = ref([]);

const getTreeData = () => {
    let tree: treeNodeTpye[] = [];
    getTreeOne_api().then((resp) => {
        tree = resp.urls.map((item) => ({
            ...item,
            key: item.url,
        }));
        const allPromise = tree.map((item) => getTreeTwo_api(item.name));
        Promise.all(allPromise).then((values) => {
            values.forEach((item, i) => {
                tree[i].children = combData(item.paths);
            });
            console.log(tree);
            treeData.value = tree
        });
    });
};
const clickSelectItem = (key, { node }) => {
    emits('select', node);
};

onMounted(() => {
    getTreeData();
});

const combData = (dataSource: object): object[] => {
    const apiList: object[] = [];
    const keys = Object.keys(dataSource);

    keys.forEach((key) => {
        const method = Object.keys(dataSource[key] || {})[0];
        const name = dataSource[key][method].tags[0];
        let apiObj = apiList.find((item) => item.name === name);
        if (!apiObj) {
            apiObj = { name, link: key, methods: dataSource[key], key };
            apiList.push(apiObj);
        }
    });

    return apiList;
};
</script>

<style lang="less" scoped></style>
