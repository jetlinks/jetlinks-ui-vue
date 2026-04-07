<template>
    <div class="simple-wrapper">
        <div class="tips">
            <a-space>
                <AIcon type="QuestionCircleOutlined" />
                <span>{{ $t('components.Simple.448047-0') }}</span>
            </a-space>
        </div>
        <a-tabs
            v-model="activeKey"
            tab-position="left"
            :style="{ height: '400px' }"
            @change="onTabChange"
            :destroyInactiveTabPane="true"
        >
            <template #leftExtra>
                <a-input-search v-model:value="serchName" allow-clear placeholder="请输入名称"></a-input-search>
            </template>
            <a-tab-pane v-for="func in filteredFunctions" :key="func.id">
                <template #tab>
                    <a-tooltip>
                        <template #title>
                            {{ func.name }}
                        </template>
                        <div style="max-width: 150px" class="tabTitle">
                            {{ func.name }}
                        </div>
                    </a-tooltip>
                </template>
                <a-row :gutter="30">
                    <a-col :span="15">
                        <div class="description">
                            <span class="description-title">说明</span>
                            <j-ellipsis style="width: 80%;">{{ func.description || '--' }}</j-ellipsis>             
                        </div>
                        <a-form :ref="(el) => setRefMap(el, func)" :model="func">
                            <a-table
                                :columns="columns"
                                :data-source="func.table"
                                :pagination="false"
                                :scroll="{y: '400px'}"
                                rowKey="id"
                            >
                                <template #bodyCell="{ column, record, index }">
                                    <template
                                        v-if="column.dataIndex === 'type'"
                                    >
                                        <span>{{ record.type }}</span>
                                        <a-tooltip
                                            v-if="['object', 'array'].includes(record.type)"
                                        >
                                            <template #title>
                                                {{ $t('components.Simple.448047-1') }}
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
                                    <template
                                        v-if="column.dataIndex === 'value'"
                                    >
                                        <a-form-item
                                            :name="['table', index, 'value']"
                                            :rules="{
                                                required: record.required,
                                                message: $t('components.Simple.448047-2'),
                                            }"
                                        >
                                            <SelectAMap
                                                v-if="record.type === 'geoPoint'"
                                                v-model:point="record.value"
                                            />
                                            <j-value-item
                                                v-else
                                                :ref="`valueItemRef${record.id}`"
                                                v-model:modelValue="
                                                    record.value
                                                "
                                                valueFormat="YYYY-MM-DD HH:mm:ss"
                                                :itemType="record.type === 'array' ? 'object' : (record.type === 'file' ? 'string' : record.type)"
                                                :options="
                                                    (record?.options || []).map((item:any) => ({
                                                        label: item.text,
                                                        value: item.value,
                                                    }))
                                                "
                                                :extraProps="{
                                                      style: {
                                                        zIndex: 999,
                                                        width: '100%'
                                                      }
                                                }"
                                            />
                                        </a-form-item>
                                    </template>
                                </template>
                            </a-table>
                        </a-form>
                        <div class="editor-btn">
                            <a-space>
                                <a-button
                                    type="primary"
                                    :loading="loading"
                                    @click="handleExecute(func)"
                                >
                                    {{ $t('components.Simple.448047-3') }}
                                </a-button>
                                <a-button
                                    type="default"
                                    @click="handleClear(func)"
                                >
                                    {{ $t('components.Simple.448047-4') }}
                                </a-button>
                            </a-space>
                        </div>
                    </a-col>
                    <a-col :span="9">
                        <h4>{{ $t('components.Simple.448047-5') }}</h4>
                        <span
                            :ref="`result${func.id}Ref`"
                            class="execute-result"
                        >
                            {{ executeResult || '' }}
                        </span>
                    </a-col>
                </a-row>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
import { useInstanceStore } from '../../../../../../store/instance';
import { execute } from '../../../../../../api/instance';
import { onlyMessage } from '@jetlinks-web/utils';
import { isNil } from "lodash-es";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const instanceStore = useInstanceStore();
const route = useRoute();

const activeKey = ref('');
const loading = ref<boolean>(false);
const serchName = ref('')
// 物模型数据
const metadata = computed(() => JSON.parse(instanceStore.detail.metadata));
const columns = ref([
    {
        title: $t('components.Simple.448047-6'),
        dataIndex: 'name',
        width: 150,
        ellipsis: true,
    },
    {
        title: $t('components.Simple.448047-7'),
        dataIndex: 'type',
        width: 150,
    },
    {
        title: $t('components.Simple.448047-8'),
        dataIndex: 'value',
    },
]);

const executeResult = ref('');
const RefMap = {}

const filteredFunctions = computed(() => {
    return newFunctions.value.filter((func: any) => func.name.includes(serchName.value))
})
const newFunctions = computed({
    get() {
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
                    required: tableItem.expands?.required,
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
    },
    set(e) {
        return e
    }
})

// 设备功能数据处理
// const newFunctions = computed(() => {
//     const result: any = [];
//     metadata.value.functions?.forEach((func: any) => {
//         const array = [];
//         const tableData = func.inputs || func.properties;
//         for (const tableItem of tableData) {
//             const type = tableItem.valueType ? tableItem.valueType.type : '-';
//             if (type === 'boolean') {
//                 tableItem.valueType.elements = [
//                     {
//                         text: tableItem.valueType.trueText,
//                         value: String(tableItem.valueType.trueValue),
//                     },
//                     {
//                         text: tableItem.valueType.falseText,
//                         value: String(tableItem.valueType.falseValue),
//                     },monacoEditor 页面无法滚动
//                 ];
//             }
//             array.push({
//                 id: tableItem.id,
//                 name: tableItem.name,
//                 type: type,
//                 format: tableItem.valueType
//                     ? tableItem.valueType.format
//                     : undefined,
//                 options: tableItem.valueType
//                     ? tableItem.valueType.elements
//                     : undefined,
//                 json:
//                     type === 'object'
//                         ? tableItem['json']?.['properties'][0]
//                         : undefined,
//                 value: undefined,
//                 required: tableItem.expands?.required,
//             });
//         }
//
//         result.push({
//             ...func,
//             table: array,
//             executeResult: '',
//         });
//     });
//     // console.log('newFunctions: ', result);
//     return result;
// });

/**
 * 执行
 */
const handleExecute = async (func: any) => {
    RefMap[func.id]
        .validate()
        .then(async () => {
            const obj = {};
            func.table.forEach((item: any) => {
                if (item.type === 'object' && item.value) {
                    obj[item.id] = JSON.parse(item.value);
                } else if (!isNil(item.value)) {
                    obj[item.id] = item.value;
                }
            });
            loading.value = true;
            const { success, result } = await execute(
                route.params.id as string,
                func.id,
                obj,
            )
                .catch(() => {
                    loading.value = false;
                })
                .finally(() => {
                    loading.value = false;
                });
            if (!success) return;
            onlyMessage($t('components.Simple.448047-9'));
            executeResult.value = result instanceof Array ? result[0] : result;
            RefMap[func.id]?.$forceUpdate();
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};
/**
 * 清空
 */
const handleClear = (func: any) => {
    newFunctions.value = newFunctions.value.map(item => {
        if (item.id === func.id) {
            item.table = item.table.map(tItem => {
                tItem.value = undefined
                return tItem
            })
        }
        return item
    })

    executeResult.value = '';
    RefMap[func.id]?.resetFields()
};

const onTabChange = (_key: string) => {
    executeResult.value = '';
};

const getPopupContainer = () => {
    return document.body
}

const setRefMap = (el, item) => {
    RefMap[item.id] = el
}

watch(
    () => serchName.value,
    (newVal) => {
        activeKey.value = filteredFunctions.value?.[0]?.id || '';
        onTabChange(activeKey.value)
    }
)

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
    .description {
        margin-bottom: 10px;
        padding: 8px 11px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        display: flex;
        .description-title {
            color: #777777;
            margin-right: 24px;
        }
    }
}
.tabTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
