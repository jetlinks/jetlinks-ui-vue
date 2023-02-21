<template>
    <a-card class="api-page-container">
        apply/api
        <a-row :gutter="24">
            <a-col :span="5">
                <LeftTree @select="treeSelect" />
            </a-col>
            <a-col :span="19">
                <ChooseApi
                    v-show="!selectedApi.url"
                    v-model:click-api="selectedApi"
                    :table-data="tableData"
                />

                <div
                    class="api-details"
                    v-show="selectedApi.url && tableData.length > 0"
                >
                    <a-button @click="selectedApi = initSelectedApi" style="margin-bottom: 24px;"
                        >返回</a-button
                    >
                    <a-tabs v-model:activeKey="activeKey" type="card">
                        <a-tab-pane key="does" tab="文档">
                            <ApiDoes :select-api="selectedApi" :schemas="schemas" />
                        </a-tab-pane>
                        <a-tab-pane key="test" tab="调试">
                            <ApiTest :select-api="selectedApi" />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup lang="ts" name="apiPage">
import type { treeNodeTpye, apiObjType, apiDetailsType } from './typing';
import LeftTree from './components/LeftTree.vue';
import ChooseApi from './components/ChooseApi.vue';
import ApiDoes from './components/ApiDoes.vue';
import ApiTest from './components/ApiTest.vue';

const tableData = ref([]);
const treeSelect = (node: treeNodeTpye, nodeSchemas:object = {}) => {
    schemas.value = nodeSchemas
    if (!node.apiList) return;
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
                    method: key,
                });
            }
        }
    });
    tableData.value = table;
};

const activeKey = ref('does');
const schemas = ref({});
const initSelectedApi:apiDetailsType = {
    url: '',
    method: '',
    summary: '',
    parameters: [],
    responses: {},
    requestBody: {}
};
const selectedApi = ref<apiDetailsType>(initSelectedApi);

watch(tableData, () => (selectedApi.value = initSelectedApi));
</script>

<style scoped>
.api-page-container {
    height: 100%;
}
</style>
