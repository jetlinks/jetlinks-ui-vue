<template>
    <div class="api-test-container">
        <div class="top">
            <h5>{{ props.selectApi.summary }}</h5>
            <div class="input">
                <InputCard :value="props.selectApi.method" />
                <a-input :value="props.selectApi?.url" disabled />
                <span class="send" @click="send">发送</span>
            </div>
        </div>

        <div class="api-card">
            <h5>请求参数</h5>
            <div class="content">
                <!-- <VueJsoneditor
                    height="400"
                    mode="tree"
                    v-model:text="requestBody.paramsText"
                /> -->
                <div class="table" v-if="paramsTable.length">
                    <a-form :model="requestBody.params" ref="formRef" >
                        <a-table
                            :columns="requestBody.tableColumns"
                            :dataSource="paramsTable"
                            :pagination="false"
                            size="small"
                        >
                            <template #bodyCell="{ column, record, index }">
                                <template v-if="column.key === 'name'">
                                    <a-form-item
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
                                        <a-input
                                            v-model:value="record.name"
                                        ></a-input>
                                    </a-form-item>
                                </template>
                                <template v-else-if="column.key === 'value'">
                                    <a-form-item
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
                                        <a-input
                                            v-model:value="record.value"
                                        ></a-input>
                                    </a-form-item>
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
                        </a-table>
                    </a-form>

                    <a-pagination
                        :pageSize="requestBody.pageSize"
                        v-model:current="requestBody.pageNum"
                        :total="requestBody.params.paramsTable.length"
                        hideOnSinglePage
                        style="text-align: center"
                    />
                    <a-button
                        @click="requestBody.addRow"
                        style="width: 100%; text-align: center"
                    >
                        <AIcon type="PlusOutlined" />新增
                    </a-button>
                </div>
                <MonacoEditor
                    v-model:modelValue="requestBody.paramsText"
                    style="height: 300px; width: 100%"
                    theme="vs"
                />
            </div>
        </div>
        <div class="api-card">
            <h5>响应参数</h5>
            <div class="content">
                <VueJsoneditor
                    height="400"
                    mode="tree"
                    v-model:text="responsesContent"
                    :disabled="true"
                />
                <!-- <MonacoEditor
                    v-model:modelValue="responsesContent"
                    style="height: 300px; width: 100%"
                    theme="vs"
                /> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import VueJsoneditor from 'vue3-ts-jsoneditor';
import MonacoEditor from '@/components/MonacoEditor/index.vue';
import type { apiDetailsType } from '../typing';
import InputCard from './InputCard.vue';
import { cloneDeep, toLower } from 'lodash';
import { FormInstance } from 'ant-design-vue';
import server from '@/utils/request'

const props = defineProps<{
    selectApi: apiDetailsType;
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
        paramsTable: cloneDeep(props.selectApi.parameters || []) as requestObj[],
    },

    paramsText: '',

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

const responsesContent = ref('{"a":123}');

const send = () => {
    formRef.value &&
        formRef.value.validate().then(() => {
            const methodName = toLower(props.selectApi.method)
            const methodObj = {
                get: 'get',
                post: 'post',
                patch: 'patch',
                put: 'put',
                delete: 'remove'
            }

            let url = props.selectApi?.url;
            const urlParams = {}
            requestBody.params.paramsTable.forEach(item=>{
                if(methodName === 'get')
                    urlParams[item.name] = item.value
                if(url.includes(`{${item.name}}`))
                    url = url.replace(`{${item.name}}`, item.value)
            })
            const params = {
                ...JSON.parse(requestBody.paramsText || '{}'),
                ...urlParams
            }

            

            server[methodObj[methodName]](url,params).then((resp:any)=>{
                responsesContent.value = JSON.stringify(resp)
            })




        });
};

type requestObj = {
    name: string;
    value: string;
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
