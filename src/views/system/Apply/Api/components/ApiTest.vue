<template>
    <div class="api-test-container">
        <div class="top">
            <h5>{{ props.selectApi.summary }}</h5>
            <div class="input">
                <InputCard :value="props.selectApi.method" />
                <a-input :value="props.selectApi?.url" disabled />
                <span class="send">发送</span>
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

const props = defineProps<{
    selectApi: apiDetailsType;
    paramsTable: any[];
}>();

const requestBody = reactive({
    paramsTable: [] as requestObj[],
    paramsText: '',
});

const responsesContent = ref('{"a":123}');

watch(
    () => props.paramsTable,
    (n) => {
        const table = n?.map((item: any) => ({
            paramsName: item.paramsName,
            value: '',
        }));
        requestBody.paramsTable = table;
    },
);

type requestObj = {
    paramsName: string;
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
        }
    }
}
</style>
