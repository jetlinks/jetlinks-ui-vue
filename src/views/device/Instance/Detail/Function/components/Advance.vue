<template>
    <div class="advance-wrapper">
        <div style="width: 150px">
            <j-tabs
                v-model="activeKey"
                tab-position="left"
                :tabBarStyle="{ width: '100%' }"
                @change="onTabChange"
            >
                <j-tab-pane v-for="func in newFunctions" :key="func.id">
                    <template #tab>
                        <j-tooltip>
                            <template #title>
                                {{ func.name }}
                            </template>
                            <div style="max-width: 100px" class="tabTitle">
                                {{ func.name }}
                            </div>
                        </j-tooltip>
                    </template>
                </j-tab-pane>
            </j-tabs>
        </div>
        <div style="flex: 1">
            <j-row :gutter="30">
                <j-col :span="15">
                    <JMonacoEditor
                        :ref="`monacoEditor${current.id}`"
                        v-model="current.json"
                        theme="vs-dark"
                        style="height: 400px"
                    />
                    <div class="editor-btn">
                        <j-space>
                            <j-button
                                type="primary"
                                :loading="loading"
                                @click="handleExecute(current)"
                            >
                                {{ $t('components.Advance.155742-0') }}
                            </j-button>
                            <j-button type="default" @click="handleClear()">
                                {{ $t('components.Advance.155742-1') }}
                            </j-button>
                        </j-space>
                    </div>
                </j-col>
                <j-col :span="9">
                    <h4>{{ $t('components.Advance.155742-2') }}</h4>
                    <span class="execute-result">
                        {{ executeResult }}
                    </span>
                </j-col>
            </j-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useInstanceStore } from '@/store/instance';
import { execute } from '@/api/device/instance';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const instanceStore = useInstanceStore();
const route = useRoute();

const activeKey = ref('');
const loading = ref<boolean>(false);
// 物模型数据
const metadata = computed(() => JSON.parse(instanceStore.detail.metadata));
const current = ref<any>({});
const executeResult = ref<string>('');

const newFunctions = ref<any[]>([]);

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

const onTabChange = (_key: string) => {
    const _item = newFunctions.value.find((item: any) => item.id === _key);
    current.value = { ..._item };
};

/**
 * 执行
 */
const handleExecute = async (func: any) => {
    loading.value = true;
    const resp: any = await execute(
        route.params.id as string,
        func.id,
        JSON.parse(func.json),
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
        onlyMessage($t('components.Advance.155742-3'));
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
}
.tabTitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
