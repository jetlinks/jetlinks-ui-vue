<template>
    <div class="api-page-container">
        <div class="top">
            <slot name="top" />
        </div>
        <j-row :gutter="24" class="content">
            <j-col
                :span="24"
                v-if="props.showTitle"
                style="font-size: 16px; margin-bottom: 48px"
            >
                API文档
            </j-col>
            <j-col :span="5" class="tree-content">
                <LeftTree
                    @select="treeSelect"
                    :mode="props.mode"
                    :has-home="props.hasHome"
                    :code="props.code"
                />
            </j-col>
            <j-col :span="19">
                <HomePage v-show="showHome" />
                <div class="url-page" v-show="!showHome">
                    <ChooseApi
                        v-show="!selectedApi.url"
                        v-model:click-api="selectedApi"
                        v-model:selectedRowKeys="selectedKeys"
                        v-model:changedApis="changedApis"
                        :table-data="tableData"
                        :source-keys="selectSourceKeys"
                        :mode="props.mode"
                        @refresh="getSelectKeys"
                    />

                    <div
                        class="api-details"
                        v-if="selectedApi.url && tableData.length > 0"
                    >
                        <j-button
                            @click="selectedApi = initSelectedApi"
                            style="margin-bottom: 24px"
                            >返回</j-button
                        >
                        <j-tabs v-model:activeKey="activeKey" type="card">
                            <j-tab-pane key="does" tab="文档">
                                <ApiDoes
                                    :select-api="selectedApi"
                                    :schemas="schemas"
                                />
                            </j-tab-pane>
                            <j-tab-pane key="test" tab="调试">
                                <ApiTest
                                    :select-api="selectedApi"
                                    :schemas="schemas"
                                />
                            </j-tab-pane>
                        </j-tabs>
                    </div>
                </div>
            </j-col>
        </j-row>
    </div>
</template>

<script setup lang="ts" name="apiPage">
import HomePage from './components/HomePage.vue';
import { getApiGranted_api, apiOperations_api } from '@/api/system/apiPage';
import type {
    treeNodeTpye,
    apiObjType,
    apiDetailsType,
    modeType,
} from './typing';
import LeftTree from './components/LeftTree.vue';
import ChooseApi from './components/ChooseApi.vue';
import ApiDoes from './components/ApiDoes.vue';
import ApiTest from './components/ApiTest.vue';

const props = defineProps<{
    mode: modeType;
    showTitle?: boolean;
    hasHome?: boolean;
    code?: string;
}>();
const showHome = ref<boolean>(Boolean(props.hasHome)); // 是否展示home页面
const tableData = ref([]);
const treeSelect = (node: treeNodeTpye, nodeSchemas: object = {}) => {
    if (node.key === 'home') return (showHome.value = true);
    schemas.value = nodeSchemas;
    if (!node.apiList) return;
    showHome.value = false;
    const apiList: apiObjType[] = node.apiList as apiObjType[];
    const table: any = [];
    // 将对象形式的数据转换为表格需要的形式
    apiList?.forEach((apiItem) => {
        const { method, url } = apiItem as any;
        for (const key in method) {
            if (Object.prototype.hasOwnProperty.call(method, key)) {
                table.push({
                    ...method[key],
                    url,
                    method: key,
                    id: method[key].operationId,
                });
            }
        }
    });
    tableData.value = table;
};

const activeKey = ref<'does' | 'test'>('does'); 
const schemas = ref({}); // 对应一级api相关的类
const initSelectedApi: apiDetailsType = {
    url: '',
    method: '',
    summary: '',
    parameters: [],
    responses: {},
    requestBody: {},
};
const selectedApi = ref<apiDetailsType>(initSelectedApi);

const selectedKeys = ref<string[]>([]); // 右侧勾选的项
const selectSourceKeys = ref<string[]>([]); // 右侧原本勾选的项
const changedApis = ref({}); // 勾选发生变化的项，以对应的id作为key

init();

function init() {
    getSelectKeys();
    watch(tableData, () => {
        activeKey.value = 'does';
        selectedApi.value = initSelectedApi;
    });
    watch(
        () => selectedApi.value.url,
        () => (activeKey.value = 'does'),
    );
}

/**
 * 右侧api选中项
 */
function getSelectKeys() {
    if (props.mode === 'appManger') {
        getApiGranted_api(props.code as string).then((resp) => {
            selectedKeys.value = resp.result as string[];
            selectSourceKeys.value = [...(resp.result as string[])];
            changedApis.value = {};
        });
    } else if (props.mode === 'api') {
        apiOperations_api().then((resp) => {
            selectedKeys.value = resp.result as string[];
            selectSourceKeys.value = [...(resp.result as string[])];
        });
    }
}
</script>

<style lang="less" scoped>
.api-page-container {
    .content {
        background-color: #fff;
        padding: 24px;
        margin: 0 !important;
        .tree-content {
            padding-bottom: 30px;
            height: calc(100vh - 230px);
            overflow-y: auto;
            border-right: 1px solid #e9e9e9;
        }
    }
}
</style>
