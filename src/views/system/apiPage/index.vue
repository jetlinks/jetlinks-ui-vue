<template>
    <a-card class="api-page-container">
        <LeftTree @select="treeSelect" />

        
    </a-card>
</template>

<script setup lang="ts">
import LeftTree from './components/LeftTree.vue';
import { treeNodeTpye, apiObjType } from './index';

const tableData = ref([]);
const treeSelect = (node: treeNodeTpye) => {
    const apiList: apiObjType[] = node.apiList as apiObjType[];
    const table: any = [];
    // 将对象形式的数据转换为表格需要的形式
    apiList?.forEach((apiItem) => {
        const { method, url } = apiItem;
        for (const key in method) {
            if (Object.prototype.hasOwnProperty.call(method, key)) {
                table.push({
                    ...method[key],
                    url,
                });
            }
        }
    });
    tableData.value = table;
};
</script>

<style scoped>
.api-page-container {
    height: 100%;
}
</style>
