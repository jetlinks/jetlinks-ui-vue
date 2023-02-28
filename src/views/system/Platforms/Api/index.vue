<template>
    <div class="api-page-container">
        <div class="top">
            <slot name="top" />
        </div>
        <a-row :gutter="24" style="background-color: #fff; padding: 20px">
            <a-col
                :span="24"
                v-if="props.showTitle"
                style="font-size: 16px; margin-bottom: 48px"
                >API文档</a-col
            >
            <a-col :span="5">
                <LeftTree
                    @select="treeSelect"
                    :mode="props.mode"
                    :has-home="props.hasHome"
                    :filter-array="treeFilter"
                />
            </a-col>
            <a-col :span="19">
                <HomePage v-show="showHome" />
                <div class="url-page" v-show="!showHome">
                    <ChooseApi
                        v-show="!selectedApi.url"
                        v-model:click-api="selectedApi"
                        :table-data="tableData"
                        v-model:selectedRowKeys="selectedKeys"
                        :source-keys="selectSourceKeys"
                        :mode="props.mode"
                    />

                    <div
                        class="api-details"
                        v-if="selectedApi.url && tableData.length > 0"
                    >
                        <a-button
                            @click="selectedApi = initSelectedApi"
                            style="margin-bottom: 24px"
                            >返回</a-button
                        >
                        <a-tabs v-model:activeKey="activeKey" type="card">
                            <a-tab-pane key="does" tab="文档">
                                <ApiDoes
                                    :select-api="selectedApi"
                                    :schemas="schemas"
                                />
                            </a-tab-pane>
                            <a-tab-pane key="test" tab="调试">
                                <ApiTest :select-api="selectedApi" />
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </div>
            </a-col>
        </a-row>
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

const route = useRoute();
const props = defineProps<{
    mode: modeType;
    showTitle?: boolean;
    hasHome?: boolean;
    code?: string
}>();
const showHome = ref<boolean>(Boolean(props.hasHome));
const tableData = ref([]);
const treeFilter = ref([]);
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
const schemas = ref({});
const initSelectedApi: apiDetailsType = {
    url: '',
    method: '',
    summary: '',
    parameters: [],
    responses: {},
    requestBody: {},
};
const selectedApi = ref<apiDetailsType>(initSelectedApi);

const canSelectKeys = ref<string[]>([]); // 左侧可展示的项
const selectedKeys = ref<string[]>([]); // 右侧默认勾选的项
let selectSourceKeys = ref<string[]>([]);
init();

function init() {
    const code = route.query.code;
    if (props.mode === 'appManger') {
    } else if (props.mode === 'home') {
    } else if (props.mode === 'api') {
        apiOperations_api().then((resp) => {
            selectedKeys.value = resp.result as string[];
            selectSourceKeys.value = [...(resp.result as string[])];
        });
    }
    watch(tableData, () => {
        activeKey.value = 'does';
        selectedApi.value = initSelectedApi;
    });
}
</script>

<style scoped>
.api-page-container {
    height: 100%;
    background-color: transparent;
}
</style>
