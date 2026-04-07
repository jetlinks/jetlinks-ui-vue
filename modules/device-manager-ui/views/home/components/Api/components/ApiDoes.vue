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
            <span class="label">{{ $t('components.ApiDoes.5497514-0') }}</span>
            <span>{{
                getContent(selectApi.requestBody) ||
                'application/x-www-form-urlencoded'
            }}</span>
            <span class="label">{{ $t('components.ApiDoes.5497514-1') }}</span>
            <span>{{ `["/"]` }}</span>
        </p>

        <div class="api-card" v-if="props.selectApi.description">
            <h5>{{ $t('components.ApiDoes.5497514-2') }}</h5>
            <div>{{ props.selectApi.description }}</div>
        </div>
        <div class="api-card" v-if="requestCard.codeText !== undefined">
            <h5>{{ $t('components.ApiDoes.5497514-3') }}</h5>
            <Monaco
                :tips="requestCard.tips"
                :codeText="requestCard.codeText"
                :loading="loading"
            />
        </div>
        <div class="api-card" v-if="requestCard.tableData.length">
            <h5>{{$t('components.ApiDoes.5497514-4')}}</h5>
            <div class="content">
                <j-pro-table
                    :columns="requestCard.columns"
                    :dataSource="requestCard.tableData"
                    :scroll="{ x: 'max-content' }"
                    noPagination
                    mode="TABLE"
                    size="small"
                >
                    <template #required="slotProps">
                        <span :style="{ color: Boolean(slotProps.required) ? '#f81d22' : ''}">{{ Boolean(slotProps.required) + '' }}</span>
                    </template>
                </j-pro-table>
            </div>
        </div>
        <div class="api-card">
            <h5>{{$t('components.ApiDoes.5497514-5')}}</h5>
            <div class="content">
                <j-pro-table
                    :columns="responseStatusCard.columns"
                    :dataSource="responseStatusCard.tableData"
                    :scroll="{ x: 'max-content' }"
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
            <h5>{{ $t('components.ApiDoes.5497514-6') }}</h5>
            <div class="content">
                <j-pro-table
                    :columns="respParamsCard.columns"
                    :dataSource="respParamsCard.tableData"
                    :scroll="{ x: 'max-content' }"
                    noPagination
                    mode="TABLE"
                    size="small"
                >
                </j-pro-table>
            </div>
            <Monaco
                :tips="respParamsCard.tips"
                :codeText="respParamsCard.codeText"
                :loading="loading"
            />
        </div>
    </div>
</template>

<script setup lang="ts" name="APIDoes">
import 'vue3-json-viewer/dist/index.css';
import type { apiDetailsType } from '../typing';
import InputCard from './InputCard.vue';
import type { PropType } from 'vue';
import { findData, getCodeText, dealNoRef } from '../utils';
import { randomString } from "@jetlinks-web/utils";
import Monaco from './monaco.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
const loading = ref(false)

const requestCard = reactive<cardType>({
    columns: [
        {
            title: $t('components.ApiDoes.5497514-7'),
            dataIndex: 'paramsName',
            key: 'paramsName',
        },
        {
            title: $t('components.ApiDoes.5497514-8'),
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: $t('components.ApiDoes.5497514-9'),
            dataIndex: 'in',
            key: 'in',
            width: 80
        },
        {
            title: $t('components.ApiDoes.5497514-10'),
            dataIndex: 'required',
            key: 'required',
            scopedSlots: true,
            width: 80
        },
        {
            title: $t('components.ApiDoes.5497514-11'),
            dataIndex: 'paramsType',
            key: 'paramsType',
            width: 200
        },
        {
            title: 'schema',
            dataIndex: 'type',
            key: 'type',
            width: 200
        },
    ],
    tableData: [],
    tips: [],
    codeText: undefined,
    getData: () => {
        if (!props.selectApi.requestBody) {
            requestCard.tableData = props.selectApi.parameters?.map(i => {
                const desc =  i.description ? (i.description + (i.schema?.enum?.length ? `,${$t('components.ApiDoes.5497514-12')}:${i.schema?.enum.join(',')}` : '')) : '';
                const _paramsType = i.schema?.type ? (i.schema?.type + (i.schema?.format ? `(${i.schema?.format})` : '')) : ''
                return {
                    ...i,
                    paramsName: i.name,
                    paramsType: _paramsType,
                    desc: desc
                }
            })
            return;
        }
        const schema = props.selectApi.requestBody.content['application/json'].schema;
        const _ref = schema.$ref || schema?.items?.$ref;
        // schema不是Java中的类的话则不进行解析，直接结束
        if (!_ref) {
            const type = schema.type || '';
            if(type === 'array' || type === 'object'){
                requestCard.codeText = JSON.stringify(dealNoRef(type, schema));
            } else {
                requestCard.codeText = String(dealNoRef(type, schema))
            }
        } else {
            const schemaName = _ref?.split('/').pop();
            const type = schema.type || '';
            const tableData = findData(props.schemas, schemaName);
            // requestCard.codeText =
            //     type === 'array'
            //         ? [getCodeText(props.schemas, tableData, 3)]
            //         : getCodeText(props.schemas, tableData, 3);
            const { codeText, codeTips } = getCodeText(props.schemas, tableData, 3)
            requestCard.codeText = JSON.stringify(codeText)
            requestCard.tips = codeTips
            requestCard.tableData = [
                {
                    paramsName: schemaName[0].toLowerCase() + schemaName.substring(1),
                    desc: schemaName,
                    in: 'body',
                    id: randomString(),
                    required: true,
                    paramsType: type || schemaName,
                    type: type || schemaName,
                    children: tableData,
                },
            ];
        }
        setTimeout(() => {
            loading.value = true
        }, 1000)
    },
});
const responseStatusCard = reactive<cardType>({
    activeKey: '',
    columns: [
        {
            title: $t('components.ApiDoes.5497514-13'),
            dataIndex: 'code',
            key: 'code',
            width: 200
        },
        {
            title: $t('components.ApiDoes.5497514-14'),
            dataIndex: 'desc',
            key: 'desc',
        },
        {
            title: 'schema',
            dataIndex: 'schema',
            key: 'schema',
            width: 200
        },
    ],
    tableData: [],
    getData: () => {
        if (!Object.keys(props.selectApi.responses).length)
            return (responseStatusCard.tableData = []);

        const tableData = <any>[];
        Object.entries(props.selectApi.responses || {}).forEach((item: any) => {
            const desc = item[1].description;
            const schema = item[1].content?.['*/*']?.schema?.$ref?.split('/') || '';

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
            title: $t('components.ApiDoes.5497514-7'),
            dataIndex: 'paramsName',
            width: 320
        },
        {
            title: $t('components.ApiDoes.5497514-8'),
            dataIndex: 'desc',
        },
        {
            title: $t('components.ApiDoes.5497514-15'),
            dataIndex: 'paramsType',
            width: 320
        },
        {
            title: 'schema',
            dataIndex: 'schema',
            width: 200
        },
    ],
    tableData: [],
    tips: [],
    codeText: '',
    getData: (code: string) => {
        const schemaName = responseStatusCard.tableData.find(
            (item: any) => item.code === code,
        )?.schema;

        const tableData = findData(props.schemas, schemaName);
        const { codeText, codeTips } = getCodeText(props.schemas, tableData, 3)
        respParamsCard.codeText = JSON.stringify(codeText)
        respParamsCard.tips = codeTips
        respParamsCard.tableData = tableData;
        setTimeout(() => {
            loading.value = true
        }, 1000)
    },
});

const options = {
    minimap: {
        enabled: false
    }
}
const getContent = (data: any) => {
    if (data && data.content) {
        return Object.keys(data.content || {})[0];
    }
    return '';
};
onMounted(() => {
    requestCard.getData();
    responseStatusCard.getData();
});

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
