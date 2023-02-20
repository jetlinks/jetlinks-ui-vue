<template>
    <div class="wrapper">
        <a-tabs v-model="activeKey" tab-position="left">
            <a-tab-pane
                v-for="func in newFunctions"
                :key="func.id"
                :tab="func.name"
            >
                <a-row :gutter="30">
                    <a-col :span="15">
                        <MonacoEditor
                            :ref="`monacoEditor${func.id}`"
                            v-model="func.json"
                            theme="vs-dark"
                            style="height: 400px"
                        />
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

// 设备功能数据处理
const newFunctions = computed(() => {
    const result: any = [];
    metadata.value.functions?.forEach((func: any) => {
        const obj = {};
        const jsonData = func.inputs || func.properties;
        for (const jsonItem of jsonData) {
            const type = jsonItem.valueType ? jsonItem.valueType.type : '-';
            obj[jsonItem.id] = setInitValue(type, jsonItem['json']);
        }

        result.push({
            ...func,
            json: JSON.stringify(obj),
            executeResult: '',
        });
    });
    // console.log('newFunctions: ', result);
    return result;
});

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

/**
 * 执行
 */
const handleExecute = async (func: any) => {
    const { success, result } = await execute(
        route.params.id as string,
        func.id,
        JSON.parse(func.json),
    );
    if (!success) return;
    message.success('操作成功');
    func.executeResult = result instanceof Array ? result[0] : result;
    proxy?.$forceUpdate();
};
/**
 * 清空
 */
const handleClear = (func: any) => {
    func.json = '';
    proxy?.$forceUpdate();
};
</script>

<style lang="less" scoped>
.wrapper {
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
