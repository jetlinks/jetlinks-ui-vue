<template>
    <a-card class="api-page-container">
        <p>
            <AIcon type="ExclamationCircleOutlined" style="margin-right: 12px;" />配置系统支持API赋权的范围
        </p>
        <a-row :gutter="24">
            <a-col :span="5">
                <LeftTree @select="treeSelect" :mode="props.mode" />
            </a-col>
            <a-col :span="19">
                <ChooseApi
                    v-show="!selectedApi.url"
                    v-model:click-api="selectedApi"
                    :table-data="tableData"
                    v-model:selectedRowKeys="selectedKeys"
                    :source-keys="selectSourceKeys" :mode="props.mode"
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
            </a-col>
        </a-row>
    </a-card>
</template>

<script setup lang="ts" name="apiPage">

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
}>();

const tableData = ref([]);
const treeSelect = (node: treeNodeTpye, nodeSchemas: object = {}) => {
    schemas.value = nodeSchemas;
    if (!node.apiList) return;
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
let selectSourceKeys = ref<string[]>([])
init();

function init() {
    const code = route.query.code;
    if (props.mode === 'appManger') {
    } else if (props.mode === 'home') {
    } else if (props.mode === 'api') {
        apiOperations_api().then(resp=>{
            selectedKeys.value = resp.result as string[]
            selectSourceKeys.value = [...resp.result as string[]]
        })
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
