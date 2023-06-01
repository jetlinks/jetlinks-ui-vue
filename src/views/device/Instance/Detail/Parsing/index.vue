
<template>
    <div>
        <div class="top">
            <div class="top-left">
                <div>
                    <AIcon type="ExclamationCircleOutlined" />
                    <template v-if="topTitle === 'rest'">
                        当前数据解析内容已脱离产品影响，
                        <PermissionButton
                            type="link"
                            hasPermission="device/Instance:update"
                            @click="rest()"
                        >
                            重置
                        </PermissionButton>
                        后将继承产品数据解析内容
                    </template>
                    <template v-else>
                        当前数据解析内容继承自产品,
                        <PermissionButton
                            type="link"
                            hasPermission="device/Instance:update"
                            @click="readOnly = false"
                            :style="color"
                        >
                            修改
                        </PermissionButton>
                        后将脱离产品影响。
                    </template>
                </div>
            </div>
            <div>
                脚本语言:
                <j-select
                    :defaultValue="'JavaScript'"
                    style="width: 200px; margin-left: 5px"
                >
                    <j-select-option value="JavaScript"
                        >JavaScript(ECMAScript 5)</j-select-option
                    >
                </j-select>
                <AIcon
                    type="ExpandOutlined"
                    style="margin-left: 20px"
                    @click="toggle"
                />
            </div>
        </div>
        <div class="edit" ref="el">
            <div
                v-show="readOnly"
                class="edit-only"
                @click="
                    () => {
                        message.warning({
                            key: 1,
                            content: () => '请点击上方修改字样,用以编辑脚本',
                            style: {
                                marginTop: '260px',
                            },
                        });
                    }
                "
            ></div>
            <j-monaco-editor
                language="javascript"
                style="height: 100%"
                theme="vs"
                v-model:modelValue="editorValue"
            />
        </div>
        <div class="bottom">
            <div style="width: 49.5%">
                <div class="bottom-title">
                    <div class="bottom-title-text">模拟输入</div>
                    <div class="bottom-title-topic">
                        <template
                            v-if="instanceStore.current.transport === 'MQTT'"
                        >
                            <div style="margin-right: 5px">Topic:</div>
                            <j-auto-complete
                                placeholder="请输入Topic"
                                style="width: 300px"
                                :options="topicList"
                                :allowClear="true"
                                :filterOption="filterOption"
                                v-model:value="topic"
                            />
                        </template>
                        <template v-else>
                            <div style="margin-right: 5px">URL:</div>
                            <j-input
                                placeholder="请输入URL"
                                v-model:value="url"
                                style="width: 300px"
                            ></j-input>
                        </template>
                    </div>
                </div>
                <j-textarea
                    :rows="5"
                    placeholder="// 二进制数据以0x开头的十六进制输入，字符串数据输入原始字符串"
                    style="margin-top: 10px"
                    v-model:value="simulation"
                />
            </div>
            <div style="width: 49.5%">
                <div class="bottom-title">
                    <div class="bottom-title-text">运行结果</div>
                </div>
                <j-textarea
                    :autoSize="{ minRows: 5 }"
                    :style="resStyle"
                    v-model:value="result"
                />
            </div>
        </div>
    </div>
    <div style="margin-top: 10px; margin-left: 10px">
        <PermissionButton
            type="primary"
            hasPermission="device/Instance:update"
            :loading="loading"
            :disabled="isDisabled"
            @click="debug()"
            :tooltip="{
                title: '需输入脚本和模拟数据后再点击',
            }"
        >
            调试
        </PermissionButton>
        <PermissionButton
            hasPermission="device/Instance:update"
            :loading="loading"
            :disabled="!isTest"
            @click="save()"
            :style="{ marginLeft: '10px' }"
            :tooltip="{
                title: isTest ? '' : '请先调试',
            }"
        >
            保存
        </PermissionButton>
    </div>
</template>

<script setup lang='ts' name="Parsing">
import PermissionButton from '@/components/PermissionButton/index.vue';
// import MonacoEditor from '@/components/MonacoEditor/index.vue';
import { useFullscreen } from '@vueuse/core';
import { useInstanceStore } from '@/store/instance';
import {
    deviceCode,
    getProtocal,
    testCode,
    saveDeviceCode,
    delDeviceCode,
} from '@/api/device/instance';
import { message } from 'jetlinks-ui-components';
import { isBoolean } from 'lodash';

const defaultValue =
    '//解码函数\r\nfunction decode(context) {\r\n    //原始报文\r\n    var buffer = context.payload();\r\n    // 转为json\r\n    // var json = context.json();\r\n    //mqtt 时通过此方法获取topic\r\n    // var topic = context.topic();\r\n\r\n    // 提取变量\r\n    // var topicVars = context.pathVars("/{deviceId}/**",topic)\r\n    //温度属性\r\n    var temperature = buffer.getShort(3) * 10;\r\n    //湿度属性\r\n    var humidity = buffer.getShort(6) * 10;\r\n    return {\r\n        "temperature": temperature,\r\n        "humidity": humidity\r\n    };\r\n}\r\n';

const el = ref<HTMLElement | null>(null);
const { toggle } = useFullscreen(el);
const instanceStore = useInstanceStore();

const topTitle = ref<string>('');
const readOnly = ref<boolean>(true);
const url = ref<string>('');
const topic = ref<string>('');
const topicList = ref([]);
const simulation = ref<string>('');
const resultValue = ref<any>({});
const loading = ref<boolean>(false);
const isTest = ref<boolean>(false);
const editorValue = ref<string>('');

const color = computed(() => ({
    color: readOnly.value ? '#415ed1' : '#a6a6a6',
}));
const resStyle = computed(() =>
    isBoolean(resultValue.value.success)
        ? {
              'margin-top': '10px',
              'border-color': resultValue.value.success ? 'green' : 'red',
          }
        : {
              'margin-top': '10px',
          },
);
const filterOption = (inputValue: any, option: any) =>
    option!.value.indexOf(inputValue) !== -1;

const isDisabled = computed(() => simulation.value === '');

const result = computed(() =>
    resultValue.value.success
        ? JSON.stringify(resultValue.value.outputs?.[0])
        : resultValue.value.reason,
);

//重置
const rest = async () => {
    const res = await delDeviceCode(
        instanceStore.current.productId,
        instanceStore.current.id,
    );
    if (res.status === 200) {
        getDeviceCode();
        message.success('操作成功');
    }
};
//获取topic
const getTopic = async () => {
    const res: any = await getProtocal(
        instanceStore.current.protocol,
        instanceStore.current.transport,
    );
    if (res.status === 200) {
        const item = res.result.routes?.map((items: any) => ({
            value: items.topic,
        }));
        // setTopicList(item);
        topicList.value = item;
    }
};
//获取设备解析规则
const getDeviceCode = async () => {
    const res: any = await deviceCode(
        instanceStore.current.productId,
        instanceStore.current.id,
    );
    if (res.status === 200) {
        const item = res.result?.configuration?.script
            ? res.result?.configuration?.script
            : defaultValue;
        if (res.result?.deviceId) {
            readOnly.value = false;
            topTitle.value = 'rest';
            editorValue.value = item;
        } else {
            readOnly.value = true;
            topTitle.value = 'edit';
            editorValue.value = item;
        }
    }
};
//调试
const test = async (dataTest: any) => {
    loading.value = true;
    const res = await testCode(dataTest);
    if (res.status === 200) {
        loading.value = false;
        resultValue.value = res?.result;
    } else {
        loading.value = false;
    }
};

//保存设备解析规则
const save = async () => {
    const item = {
        provider: 'jsr223',
        configuration: {
            script: editorValue.value,
            lang: 'javascript',
        },
    };
    const res = await saveDeviceCode(
        instanceStore.current.productId,
        instanceStore.current.id,
        item,
    );
    if (res.status === 200) {
        message.success('保存成功');
        getDeviceCode();
    }
};

const debug = () => {
    if (instanceStore.current.transport === 'MQTT') {
        if (topic.value !== '') {
            test({
                headers: {
                    topic: topic.value,
                },
                configuration: {
                    script: editorValue.value,
                    lang: 'javascript',
                },
                provider: 'jsr223',
                payload: simulation.value,
            });
            isTest.value = true;
        } else {
            message.error('请输入topic');
        }
    } else {
        if (url.value !== '') {
            test({
                headers: {
                    url: url.value,
                },
                provider: 'jsr223',
                configuration: {
                    script: editorValue.value,
                    lang: 'javascript',
                },
                payload: simulation.value,
            });
            isTest.value = true;
        } else {
            message.error('请输入url');
        }
    }
};

// onMounted(() => {
//     getDeviceCode();
//     getTopic();
// });

watch(() => instanceStore.current?.id, () => {
  if (instanceStore.current?.id) {
    getDeviceCode();
    getTopic();
  }
}, { immediate: true })
</script>

<style scoped lang='less'>
.top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .top-left {
        display: flex;
        align-items: center;
    }
}

.edit {
    height: 550px;
    border: 1px solid #dcdcdc;

    .edit-only {
        height: 550px;
        width: 97%;
        position: absolute;
        z-index: 1;
        background-color: #eeeeee70;
        cursor: not-allowed;
    }
}

.bottom {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #f7f7f7;

    .bottom-title {
        display: flex;
        justify-content: space-between;

        .bottom-title-text {
            font-weight: 600;
            font-size: 14px;
            margin-top: 10px;
        }

        .bottom-title-topic {
            display: flex;
            align-items: center;
        }
    }
}
</style>