<template>
    <div class="wrapper">
        <div class="tips">
            <a-space>
                <AIcon type="QuestionCircleOutlined" />
                <span>精简模式下参数只支持输入框的方式录入</span>
            </a-space>
        </div>
        <a-tabs v-model="activeKey" tab-position="left">
            <a-tab-pane
                v-for="func in newFunctions"
                :key="func.id"
                :tab="func.name"
            >
                <a-row :gutter="30">
                    <a-col :span="15">
                        <a-table
                            :columns="columns"
                            :data-source="func.table"
                            :pagination="false"
                            rowKey="id"
                        >
                            <template #bodyCell="{ column, text, record }">
                                <template v-if="column.dataIndex === 'type'">
                                    <span>{{ record.type }}</span>
                                    <a-tooltip v-if="record.type === 'object'">
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
                                    </a-tooltip>
                                </template>
                                <template v-if="column.dataIndex === 'value'">
                                    <ValueItem
                                        :ref="`valueItemRef${record.id}`"
                                        v-model:modelValue="record.value"
                                        :itemType="record.type"
                                        :options="
                                            record.type === 'enum'
                                                ? (
                                                      record?.options
                                                          ?.elements || []
                                                  ).map((item:any) => ({
                                                          label: item.text,
                                                          value: item.value,
                                                      }))
                                                : record.type === 'boolean'
                                                ? [
                                                      {
                                                          label: '是',
                                                          value: true,
                                                      },
                                                      {
                                                          label: '否',
                                                          value: false,
                                                      },
                                                  ]
                                                : undefined
                                        "
                                    />
                                </template>
                            </template>
                        </a-table>
                        <div class="editor-btn">
                            <a-space>
                                <a-button
                                    type="primary"
                                    @click="handleExecute(func)"
                                >
                                    执行
                                </a-button>
                                <a-button
                                    type="default"
                                    @click="handleClear(func)"
                                >
                                    清空
                                </a-button>
                            </a-space>
                        </div>
                    </a-col>
                    <a-col :span="9">
                        <h6>执行结果：</h6>
                        <span class="execute-result">
                            {{ func.executeResult }}
                        </span>
                    </a-col>
                </a-row>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
import { ComponentInternalInstance } from 'vue';
import { message } from 'ant-design-vue';
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
    // console.log('newFunctions: ', result)
    return result;
});

/**
 * 执行
 */
const handleExecute = async (func: any) => {
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
};
/**
 * 清空
 */
const handleClear = (func: any) => {
    func.table.forEach((item: any) => {
        item.value = undefined;
        proxy.$refs[`valueItemRef${item.id}`][0].myValue = undefined;
    });
};
</script>

<style lang="less" scoped>
.wrapper {
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
