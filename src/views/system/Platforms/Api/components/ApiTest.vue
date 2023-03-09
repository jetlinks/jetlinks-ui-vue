<template>
    <div class="api-test-container">
        <div class="top">
            <h5>{{ props.selectApi.summary }}</h5>
            <div class="input">
                <InputCard :value="props.selectApi.method" />
                <j-input :value="props.selectApi?.url" disabled />
                <span class="send" @click="send">发送</span>
            </div>
        </div>

        <div class="api-card">
            <h5>请求参数</h5>
            <div class="content">
                <div class="table" v-if="paramsTable.length">
                    <j-form :model="requestBody.params" ref="formRef">
                        <j-table
                            :columns="requestBody.tableColumns"
                            :dataSource="paramsTable"
                            :pagination="false"
                            size="small"
                        >
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'name'">
                                    <j-form-item
                                        :name="[
                                            'paramsTable',
                                            index +
                                                (requestBody.pageNum - 1) *
                                                    requestBody.pageSize,
                                            'name',
                                        ]"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '该字段是必填字段',
                                            },
                                        ]"
                                    >
                                        <j-input
                                            v-model:value="record.name"
                                        ></j-input>
                                    </j-form-item>
                                </template>
                                <template v-else-if="column.key === 'value'">
                                    <j-form-item
                                        :name="[
                                            'paramsTable',
                                            index +
                                                (requestBody.pageNum - 1) *
                                                    requestBody.pageSize,
                                            'value',
                                        ]"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '该字段是必填字段',
                                            },
                                        ]"
                                    >
                                        <j-input
                                            v-model:value="record.value"
                                        ></j-input>
                                    </j-form-item>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                    <PermissionButton
                                        type="link"
                                        :uhasPermission="`{permission}:delete`"
                                        :popConfirm="{
                                            title: `确定删除`,
                                            onConfirm: () =>
                                                requestBody.clickDel(index),
                                        }"
                                    >
                                        <AIcon type="DeleteOutlined" />
                                    </PermissionButton>
                                </template>
                            </template>
                        </j-table>
                    </j-form>

                    <j-pagination
                        :pageSize="requestBody.pageSize"
                        v-model:current="requestBody.pageNum"
                        :total="requestBody.params.paramsTable.length"
                        hideOnSinglePage
                        style="text-align: center"
                    />
                    <j-button
                        @click="requestBody.addRow"
                        style="width: 100%; text-align: center"
                    >
                        <AIcon type="PlusOutlined" />新增
                    </j-button>
                </div>
                <MonacoEditor
                    v-model:modelValue="requestBody.code"
                    style="height: 300px; width: 100%"
                    theme="vs"
                    ref="editorRef"
                />
            </div>
        </div>
        <div class="api-card">
            <h5>响应参数</h5>
            <div class="content">
                <JsonViewer :value="responsesContent" copyable />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { JsonViewer } from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import MonacoEditor from '@/components/MonacoEditor/index.vue';
import type { apiDetailsType } from '../typing';
import InputCard from './InputCard.vue';
import { cloneDeep, toLower } from 'lodash';
import { FormInstance } from 'ant-design-vue';
import server from '@/utils/request';

const props = defineProps<{
    selectApi: apiDetailsType;
    schemas: any;
}>();
const formRef = ref<FormInstance>();
const requestBody = reactive({
    tableColumns: [
        {
            title: '参数名称',
            dataIndex: 'name',
            key: 'name',
            scopedSlots: true,
        },
        {
            title: '参数值',
            dataIndex: 'value',
            key: 'value',
            scopedSlots: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: '80px',
            scopedSlots: true,
        },
    ],
    pageSize: 10,
    pageNum: 1,
    params: {
        paramsTable: cloneDeep(
            props.selectApi.parameters || [],
        ) as requestObj[],
    },

    code: '',

    addRow: () => {
        if (paramsTable.value.length === 10)
            requestBody.pageNum = requestBody.pageNum + 1;
        requestBody.params.paramsTable.push({
            name: '',
            value: '',
        });
    },
    clickDel: (index: number) => {
        if (paramsTable.value.length === 1 && requestBody.pageNum > 1)
            requestBody.pageNum = requestBody.pageNum - 1;
        requestBody.params.paramsTable.splice(index, 1);
    },
});
const paramsTable = computed(() => {
    const startIndex = (requestBody.pageNum - 1) * requestBody.pageSize;
    const endIndex = requestBody.pageNum * requestBody.pageSize;
    return requestBody.params.paramsTable.slice(startIndex, endIndex);
});

const responsesContent = ref({});
const editorRef = ref()
const send = () => {
    if (paramsTable.value.length)
        formRef.value &&
            formRef.value.validate().then(() => {
                _send();
            });
    else _send();
};
const _send = () => {
    const methodName = toLower(props.selectApi.method);
    const methodObj = {
        get: 'get',
        post: 'post',
        patch: 'patch',
        put: 'put',
        delete: 'remove',
    };

    let url = props.selectApi?.url;
    const urlParams = {};
    requestBody.params.paramsTable.forEach((item) => {
        if (methodName === 'get') urlParams[item.name] = item.value;
        if (url.includes(`{${item.name}}`))
            url = url.replace(`{${item.name}}`, item.value);
    });
    const params = {
        ...JSON.parse(requestBody.code || '{}'),
        ...urlParams,
    };
    server[methodObj[methodName]](url, params).then((resp: any) => {
        if (Object.keys(params).length === 0){

            requestBody.code = JSON.stringify(getDefaultParams());
            editorRef.value?.editorFormat()
        }
        responsesContent.value = resp;
    });
};

/**
 * 获取默认参数
 */
function getDefaultParams() {
    if (!props.selectApi.requestBody) return {};
    const schema =
        props.selectApi.requestBody.content['application/json'].schema;
    const schemaName = (schema.$ref || schema.items.$ref)?.split('/').pop();
    const type = schema.type || '';
    const tableData = findData(schemaName);
    if (type === 'array') {
        return [getCodeText(tableData, 3)];
    } else return getCodeText(tableData, 3);
}

function findData(schemaName: string) {
    const schemas = toRaw(props.schemas);
    const basicType = ['string', 'integer', 'boolean'];

    if (!schemaName || !schemas[schemaName]) {
        return [];
    }
    const result: schemaObjType[] = [];
    const schema = schemas[schemaName];
    Object.entries(schema.properties).forEach((item: [string, any]) => {
        const paramsType =
            item[1].type ||
            (item[1].$ref && item[1].$ref.split('/').pop()) ||
            (item[1].items && item[1].items.$ref.split('/').pop()) ||
            '';
        const schemaObj: schemaObjType = {
            paramsName: item[0],
            paramsType,
            desc: item[1].description || '',
        };
        if (!basicType.includes(paramsType))
            schemaObj.children = findData(paramsType);
        result.push(schemaObj);
    });

    return result;
}
function getCodeText(arr: schemaObjType[], level: number): object {
    const result = {};
    const schemas = toRaw(props.schemas);
    arr.forEach((item) => {
        switch (item.paramsType) {
            case 'string':
                result[item.paramsName] = '';
                break;
            case 'integer':
                result[item.paramsName] = 0;
                break;
            case 'boolean':
                result[item.paramsName] = true;
                break;
            case 'array':
                result[item.paramsName] = [];
                break;
            case 'object':
                result[item.paramsName] = '';
                break;
            default: {
                const properties = schemas[item.paramsType]
                    .properties as object;
                const newArr = Object.entries(properties).map(
                    (item: [string, any]) => ({
                        paramsName: item[0],
                        paramsType: level
                            ? (item[1].$ref && item[1].$ref.split('/').pop()) ||
                              (item[1].items &&
                                  item[1].items.$ref.split('/').pop()) ||
                              item[1].type ||
                              ''
                            : item[1].type,
                    }),
                );
                result[item.paramsName] = getCodeText(newArr, level - 1);
            }
        }
    });

    return result;
}

type requestObj = {
    name: string;
    value: string;
};
type schemaObjType = {
    paramsName: string;
    paramsType: string;
    desc?: string;
    children?: schemaObjType[];
};
</script>

<style lang="less" scoped>
.api-test-container {
    .top {
        width: 100%;

        h5 {
            font-weight: bold;
            font-size: 16px;
        }

        .input {
            display: flex;

            .send {
                width: 65px;
                padding: 4px 15px;
                font-size: 14px;
                color: #fff;
                background-color: #1890ff;
                cursor: pointer;
            }
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
                background-color: #1d39c4;
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
            .table {
                :deep(.ant-table-cell) {
                    padding: 0 8px;
                    height: 56px;
                }
            }
        }
    }
}
</style>
