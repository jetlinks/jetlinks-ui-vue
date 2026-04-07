<template>
    <div class="advance-wrapper">
        <div style="width: 150px">
            <a-tabs
                v-model="activeKey"
                tab-position="left"
                :tabBarStyle="{ width: '100%' }"
                :style="{ height: '400px' }"
                @change="onTabChange"
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
                            <div style="max-width: 100px" class="tabTitle">
                                {{ func.name }}
                            </div>
                        </a-tooltip>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div style="flex: 1">
            <a-row :gutter="30">
                <a-col :span="15">
                    <div class="description">
                        <span class="description-title">说明</span>
                        <j-ellipsis style="width: 80%;">{{ current.description || '--' }}</j-ellipsis>             
                    </div>
                    <MonacoEditor
                        :ref="`monacoEditor${current.id}`"
                        v-model="current.json"
                        theme="vs-dark"
                        style="height: 400px"
                    />
                    <div class="editor-btn">
                        <a-space>
                            <a-button
                                type="primary"
                                :loading="loading"
                                @click="handleExecute(current)"
                            >
                                {{ $t('components.Advance.648416-0') }}
                            </a-button>
                            <a-button type="default" @click="handleClear()">
                                {{ $t('components.Advance.648416-1') }}
                            </a-button>
                        </a-space>
                    </div>
                </a-col>
                <a-col :span="9">
                    <h4>{{ $t('components.Advance.648416-2') }}</h4>
                    <span class="execute-result">
                        {{ executeResult }}
                    </span>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useInstanceStore } from '../../../../../../store/instance';
import { execute } from '../../../../../../api/instance';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const instanceStore = useInstanceStore();
const route = useRoute();

const activeKey = ref('');
const serchName = ref('')
const loading = ref<boolean>(false);
// 物模型数据
const metadata = computed(() => JSON.parse(instanceStore.detail.metadata));
const current = ref<any>({});
const executeResult = ref<string>('');

const newFunctions = ref<any[]>([]);

const filteredFunctions = computed(() => {
    return newFunctions.value.filter((func: any) => func.name.includes(serchName.value))
})

/**
 * 根据数据类型, 赋初始值
 * @param type
 * @param json
 */
const setInitValue = (type: string, json?: any) => {
    let initVal: any = '';
    if (['int', 'long', 'float', 'double'].includes(type)) {
        initVal = 0;
    } else if (
        ['string', 'date', 'enum', 'password', 'geoPoint'].includes(type)
    ) {
        initVal = '';
    } else if (['boolean'].includes(type)) {
        initVal = false;
    } else if (['array'].includes(type)) {
        initVal = [];
    } else if (['object'].includes(type)) {
        initVal = {};
        if (json) {
            const childObj = json['properties'][0];
            initVal[childObj.id] = setInitValue(childObj.valueType.type);
        }
    }
    return initVal;
};

// 设备功能数据处理
watch(
    () => metadata.value.functions,
    (newVal) => {
        const result: any = [];
        newVal?.forEach((func: any) => {
            const obj = {};
            const jsonData = func.inputs || func.properties;
            for (const jsonItem of jsonData) {
                const type = jsonItem.valueType ? jsonItem.valueType.type : '-';
                obj[jsonItem.id] = setInitValue(type, jsonItem['json']);
            }

            result.push({
                ...func,
                json: JSON.stringify(obj),
            });
        });
        newFunctions.value = result;
        current.value = result?.[0];
        activeKey.value = result?.[0]?.id;
    },
    {
        immediate: true,
        deep: true,
    },
);

watch(
    () => serchName.value,
    (newVal) => {
        activeKey.value = filteredFunctions.value?.[0]?.id || '';
        onTabChange(activeKey.value)
    }
)

const onTabChange = (_key: string) => {
    const _item = newFunctions.value.find((item: any) => item.id === _key);
    current.value = { ..._item };
};

/**
 * 执行
 */
const handleExecute = async (func: any) => {
    loading.value = true;
    let funcJson = '';
    try {
        funcJson = JSON.parse(func.json || '{}')
        if(typeof funcJson !== 'object') {
            throw new Error('')
        }
    } catch (e) {
        loading.value = false;
        onlyMessage($t('components.Advance.648416-4'), 'error');
        return;
    }
    const resp: any = await execute(
        route.params.id as string,
        func.id,
        funcJson,
    )
        .catch(() => {
            loading.value = false;
        })
        .finally(() => {
            loading.value = false;
        });
    if (resp.success) {
        executeResult.value =
            resp?.result instanceof Array ? resp?.result?.[0] : resp.result;
        onlyMessage($t('components.Advance.648416-3'));
    }
};
/**
 * 清空
 */
const handleClear = () => {
    current.json = '';
    executeResult.value = '';
};
</script>

<style lang="less" scoped>
.advance-wrapper {
    display: flex;
    gap: 12px;
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
