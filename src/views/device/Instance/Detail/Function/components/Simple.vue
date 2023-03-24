<template>
    <div class="simple-wrapper">
        <div class="tips">
            <j-space>
                <AIcon type="QuestionCircleOutlined" />
                <span>精简模式下参数只支持输入框的方式录入</span>
            </j-space>
        </div>
        <j-tabs v-model="activeKey" tab-position="left">
            <j-tab-pane v-for="func in newFunctions" :key="func.id">
                <template #tab>
                    <Ellipsis style="width: 100px; text-align: left">
                        {{ func.name }}
                    </Ellipsis>
                </template>
                <j-row :gutter="30">
                    <j-col :span="15">
                        <j-form :ref="`${func.id}Ref`" :model="func">
                            <j-table
                                :columns="columns"
                                :data-source="func.table"
                                :pagination="false"
                                rowKey="id"
                            >
                                <template #bodyCell="{ column, record, index }">
                                    <template
                                        v-if="column.dataIndex === 'type'"
                                    >
                                        <span>{{ record.type }}</span>
                                        <j-tooltip
                                            v-if="record.type === 'object'"
                                        >
                                            <template slot="title">
                                                请按照json格式输入
                                            </template>

                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                :style="{
                                                    marginLeft: '5px',
                                                    cursor: 'help',
                                                }"
                                            />
                                        </j-tooltip>
                                    </template>
                                    <template
                                        v-if="column.dataIndex === 'value'"
                                    >
                                        <j-form-item
                                            :name="['table', index, 'value']"
                                            :rules="{
                                                required: true,
                                                message: '该字段为必填字段',
                                            }"
                                            has-feedback
                                        >
                                            <ValueItem
                                                :ref="`valueItemRef${record.id}`"
                                                v-model:modelValue="
                                                    record.value
                                                "
                                                :itemType="record.type"
                                                :options="
                                                    (record?.options || []).map((item:any) => ({
                                                        label: item.text,
                                                        value: item.value,
                                                    }))
                                                "
                                            />
                                        </j-form-item>
                                    </template>
                                </template>
                            </j-table>
                        </j-form>
                        <div class="editor-btn">
                            <j-space>
                                <j-button
                                    type="primary"
                                    @click="handleExecute(func)"
                                >
                                    执行
                                </j-button>
                                <j-button
                                    type="default"
                                    @click="handleClear(func)"
                                >
                                    清空
                                </j-button>
                            </j-space>
                        </div>
                    </j-col>
                    <j-col :span="9">
                        <h6>执行结果：</h6>
                        <span
                            :ref="`result${func.id}Ref`"
                            class="execute-result"
                        >
                            {{ func.executeResult }}
                        </span>
                    </j-col>
                </j-row>
            </j-tab-pane>
        </j-tabs>
    </div>
</template>

<script setup lang="ts">
import { ComponentInternalInstance } from 'vue';
import { message } from 'jetlinks-ui-components';
import { useInstanceStore } from '@/store/instance';
import { execute } from '@/api/device/instance';

const instanceStore = useInstanceStore();
const route = useRoute();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const activeKey = ref('');
// 物模型数据
const metadata = computed(() => JSON.parse(instanceStore.detail.metadata));
const columns = ref([
    {
        title: '参数名称',
        dataIndex: 'name',
        width: 150,
        ellipsis: true,
    },
    {
        title: '输入类型',
        dataIndex: 'type',
        width: 150,
    },
    {
        title: '值',
        dataIndex: 'value',
    },
]);

// 设备功能数据处理
const newFunctions = computed(() => {
    const result: any = [];
    metadata.value.functions?.forEach((func: any) => {
        const array = [];
        const tableData = func.inputs || func.properties;
        for (const tableItem of tableData) {
            const type = tableItem.valueType ? tableItem.valueType.type : '-';
            if (type === 'boolean') {
                tableItem.valueType.elements = [
                    {
                        text: tableItem.valueType.trueText,
                        value: String(tableItem.valueType.trueValue),
                    },
                    {
                        text: tableItem.valueType.falseText,
                        value: String(tableItem.valueType.falseValue),
                    },
                ];
            }
            array.push({
                id: tableItem.id,
                name: tableItem.name,
                type: type,
                format: tableItem.valueType
                    ? tableItem.valueType.format
                    : undefined,
                options: tableItem.valueType
                    ? tableItem.valueType.elements
                    : undefined,
                json:
                    type === 'object'
                        ? tableItem['json']?.['properties'][0]
                        : undefined,
                value: undefined,
            });
        }

        result.push({
            ...func,
            table: array,
            executeResult: '',
        });
    });
    // console.log('newFunctions: ', result);
    return result;
});

/**
 * 执行
 */
const handleExecute = async (func: any) => {
    proxy?.$refs[`${func.id}Ref`][0]
        .validate()
        .then(async () => {
            const obj = {};
            func.table.forEach((item: any) => {
                if (item.type === 'object') {
                    obj[item.id] = JSON.parse(item.value);
                } else {
                    obj[item.id] = item.value;
                }
            });
            const { success, result } = await execute(
                route.params.id as string,
                func.id,
                obj,
            );
            if (!success) return;
            message.success('操作成功');
            func.executeResult = result instanceof Array ? result[0] : result;
            proxy?.$forceUpdate();
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};
/**
 * 清空
 */
const handleClear = (func: any) => {
    proxy?.$refs[`${func.id}Ref`][0].resetFields();
};
</script>

<style lang="less" scoped>
:deep(.ant-table-cell .ant-form-item) {
    margin-bottom: 0;
}
:deep(.ant-form-item-with-help .ant-form-item-explain) {
    min-height: 0;
}
.simple-wrapper {
    .tips {
        margin-bottom: 10px;
    }
    .editor-btn {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
    }
    .execute-result {
        display: inline-block;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        padding: 4px 11px;
        min-height: 140px;
        width: 100%;
        max-height: 450px;
        overflow: auto;
    }
}
</style>
