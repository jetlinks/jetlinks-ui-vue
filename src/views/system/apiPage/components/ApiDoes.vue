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

        <div class="api-card">
            <h5>请求参数</h5>
            <div class="content">
                <JTable
                    :columns="requestCard.columns"
                    :dataSource="requestCard.tableData"
                    noPagination
                    model="TABLE"
                >
                    <template #required="slotProps">
                        <span>{{ slotProps.row.required + '' }}</span>
                    </template>
                    <template #type="slotProps">
                        <span>{{ slotProps.row.schema.type }}</span>
                    </template>
                </JTable>
            </div>
        </div>
        <div class="api-card">
            <h5>响应状态</h5>
            <div class="content">
                <JTable
                    :columns="responseStatusCard.columns"
                    :dataSource="responseStatusCard.tableData"
                    noPagination
                    model="TABLE"
                >
                </JTable>

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
                <JTable
                    :columns="respParamsCard.columns"
                    :dataSource="respParamsCard.tableData"
                    noPagination
                    model="TABLE"
                >
                </JTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { apiDetailsType } from '../index';
import InputCard from './InputCard.vue';
import { PropType } from 'vue';

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

type tableCardType = {
    columns: object[];
    tableData: object[];
    activeKey?: any;
    getData?: any;
};
const requestCard = reactive<tableCardType>({
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
    getData: () => {
        requestCard.tableData = props.selectApi.parameters;
    },
});
const responseStatusCard = reactive<tableCardType>({
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
const respParamsCard = reactive<tableCardType>({
    columns: [
        {
            title: '参数名称',
            dataIndex: 'name',
        },
        {
            title: '参数说明',
            dataIndex: 'desc',
        },
        {
            title: '类型',
            dataIndex: 'type',
        },
    ],
    tableData: [],
    getData: (code: string) => {
        type schemaObjType = {
            paramsName: string;
            paramsType: string;
            desc: string;
            children?: schemaObjType[];
        };

        const schemaName = responseStatusCard.tableData.find(
            (item: any) => item.code === code,
        ).schema;
        console.log(1212, schemaName);
        const schemas = toRaw(props.schemas);
        function findData(schemaName: string) {
            if (!schemaName || schemas[schemaName]) {
                console.log(schemaName, schemas);
                return [];
            }
            const result: schemaObjType[] = [];
            const schema = schemas[schemaName];
            const basicType = ['string', 'integer', 'boolean'];
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
            console.log(result);

            return result;
        }

        respParamsCard.tableData = findData(schemaName);
        // console.log(respParamsCard.tableData);
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
        }
    }
}
</style>
