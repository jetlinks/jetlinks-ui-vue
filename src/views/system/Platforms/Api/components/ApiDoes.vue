<template>
    <div class="api-does-container">
        <div class="top">
            <h5>{{ selectApi.summary }}</h5>
            <div class="input">
                <InputCard :value="selectApi.method" />
                <a-input :value="selectApi?.url" disabled />
            </div>
        </div>

        <p>
            <span class="label">请求数据类型</span>
            <span>{{
                getContent(selectApi.requestBody) ||
                'application/x-www-form-urlencoded'
            }}</span>
            <span class="label">响应数据类型</span>
            <span>{{ `["/"]` }}</span>
        </p>

        <div class="api-card" v-if="props.selectApi.description">
            <h5>接口描述</h5>
            <div>{{ props.selectApi.description }}</div>
        </div>
        <div class="api-card" v-if="requestCard.codeText !== undefined">
            <h5>请求示例</h5>
            <JsonViewer :value="requestCard.codeText" copyable />
        </div>
        <div class="api-card" v-if="requestCard.tableData.length">
            <h5>请求参数</h5>
            <div class="content">
                <j-pro-table
                    :columns="requestCard.columns"
                    :dataSource="requestCard.tableData"
                    noPagination
                    mode="TABLE"
                    size="small"
                >
                    <template #required="slotProps">
                        <span>{{ Boolean(slotProps.required) + '' }}</span>
                    </template>
                    <template #type="slotProps">
                        <span>{{ slotProps?.schema.type }}</span>
                    </template>
                </j-pro-table>
            </div>
        </div>
        <div class="api-card">
            <h5>响应状态</h5>
            <div class="content">
                <j-pro-table
                    :columns="responseStatusCard.columns"
                    :dataSource="responseStatusCard.tableData"
                    noPagination
                    mode="TABLE"
                    size="small"
                >
                </j-pro-table>

                <a-tabs v-model:activeKey="responseStatusCard.activeKey">
                    <a-tab-pane
                        :key="key"
                        :tab="key"
                        v-for="key in tabs"
                    ></a-tab-pane>
                </a-tabs>
            </div>
        </div>

        <div class="api-card">
            <h5>响应参数</h5>
            <div class="content">
                <j-pro-table
                    :columns="respParamsCard.columns"
                    :dataSource="respParamsCard.tableData"
                    noPagination
                    mode="TABLE"
                    size="small"
                >
                </j-pro-table>
            </div>

            <JsonViewer :value="respParamsCard.codeText" copyable />
        </div>
    </div>
</template>

<script setup lang="ts">
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import type { apiDetailsType } from '../typing';
import InputCard from './InputCard.vue';
import { PropType } from 'vue';
import { findData, getCodeText, dealNoRef } from '../utils';

type cardType = {
    columns: object[];
    tableData: any[];
    codeText?: any;
    activeKey?: string;
    getData: Function;
};

const props = defineProps({
    selectApi: {
        type: Object as PropType<apiDetailsType>,
        required: true,
    },
    schemas: {
        type: Object,
        required: true,
    },
});
const { selectApi } = toRefs(props);

const requestCard = reactive<cardType>({
    columns: [
        {
            title: '参数名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '参数说明',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '请求类型',
            dataIndex: 'in',
            key: 'in',
        },
        {
            title: '是否必须',
            dataIndex: 'required',
            key: 'required',
            scopedSlots: true,
        },
        {
            title: '参数类型',
            dataIndex: 'type',
            key: 'type',
            scopedSlots: true,
        },
    ],
    tableData: [],
    codeText: undefined,
    getData: () => {
        if (!props.selectApi.requestBody)
            return (requestCard.tableData = props.selectApi.parameters);
        const schema =
            props.selectApi.requestBody.content['application/json'].schema;
        const _ref = schema.$ref || schema?.items?.$ref;
        // schema不是Java中的类的话则不进行解析，直接结束
        if (!_ref) {
            const type = schema.type || '';
            requestCard.codeText = dealNoRef(type, schema);
        } else {
            const schemaName = _ref?.split('/').pop();
            const type = schema.type || '';
            const tableData = findData(props.schemas, schemaName);
            requestCard.codeText =
                type === 'array'
                    ? [getCodeText(props.schemas, tableData, 3)]
                    : getCodeText(props.schemas, tableData, 3);
            requestCard.tableData = [
                {
                    name: schemaName[0].toLowerCase() + schemaName.substring(1),
                    description: schemaName,
                    in: 'body',
                    required: true,
                    schema: { type: type || schemaName },
                    children: tableData.map((item) => ({
                        name: item.paramsName,
                        description: item.desc,
                        required: false,
                        schema: { type: item.paramsType },
                    })),
                },
            ];
            // console.log(requestCard,'requestCard')
        }
    },
});
const responseStatusCard = reactive<cardType>({
    activeKey: '',
    columns: [
        {
            title: '状态码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '说明',
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: 'schema',
            dataIndex: 'schema',
            key: 'schema',
        },
    ],
    tableData: [],
    getData: () => {
        if (!Object.keys(props.selectApi.responses).length)
            return (responseStatusCard.tableData = []);

        const tableData = <any>[];
        Object.entries(props.selectApi.responses || {}).forEach((item: any) => {
            const desc = item[1].description;
            const schema = item[1].content['*/*'].schema.$ref?.split('/') || '';

            tableData.push({
                code: item[0],
                desc,
                schema: schema && schema.pop(),
            });
        });
        responseStatusCard.activeKey = tableData[0]?.code;
        responseStatusCard.tableData = tableData;
    },
});
const tabs = computed(() =>
    responseStatusCard.tableData
        .map((item: any) => item.code + '')
        .filter((code: string) => code !== '400'),
);
const respParamsCard = reactive<cardType>({
    columns: [
        {
            title: '参数名称',
            dataIndex: 'paramsName',
        },
        {
            title: '参数说明',
            dataIndex: 'desc',
        },
        {
            title: '类型',
            dataIndex: 'paramsType',
        },
    ],
    tableData: [],
    codeText: '',
    getData: (code: string) => {
        const schemaName = responseStatusCard.tableData.find(
            (item: any) => item.code === code,
        )?.schema;

        const tableData = findData(props.schemas, schemaName);
        respParamsCard.codeText = getCodeText(props.schemas, tableData, 3);
        respParamsCard.tableData = tableData;
    },
});

const getContent = (data: any) => {
    if (data && data.content) {
        return Object.keys(data.content || {})[0];
    }
    return '';
};
onMounted(() => {
    requestCard.getData();
    responseStatusCard.getData();
    watch(
        () => props.selectApi,
        () => {
            requestCard.getData();
            responseStatusCard.getData();
        },
    );

    watch([() => responseStatusCard.activeKey, () => props.selectApi], (n) => {
        n[0] && respParamsCard.getData(n[0]);
    });
});
</script>

<style lang="less" scoped>
.api-does-container {
    .top {
        width: 100%;

        h5 {
            font-weight: bold;
            font-size: 16px;
        }

        .input {
            display: flex;
            margin: 24px 0;
        }
    }
    p {
        display: flex;
        justify-content: space-between;
        font-size: 14px;

        .label {
            font-weight: bold;
        }
    }
    .api-card {
        margin-top: 24px;
        h5 {
            position: relative;
            padding-left: 10px;
            font-weight: 600;
            font-size: 16px;

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background-color: @primary-color;
                border-radius: 0 3px 3px 0;
                content: ' ';
            }
        }
        .content {
            padding-left: 10px;

            :deep(.jtable-body) {
                padding: 0;

                .jtable-body-header {
                    display: none;
                }
            }
        }
    }
}
</style>
