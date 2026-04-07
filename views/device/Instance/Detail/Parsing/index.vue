
<template>
    <div class="parsing">
      <div class="parsing-top">
        <div class="top">
          <div class="top-left">
            <div>
              <AIcon type="ExclamationCircleOutlined" />
              <template v-if="topTitle === 'rest'">
                {{ $t('Parsing.index.217769-0') }}
                <j-permission-button
                    type="link"
                    hasPermission="device/Instance:update"
                    @click="rest()"
                >
                  {{ $t('Parsing.index.217769-1') }}
                </j-permission-button>
                {{ $t('Parsing.index.217769-2') }}
              </template>
              <template v-else>
                {{ $t('Parsing.index.217769-3') }}
                <j-permission-button
                    type="link"
                    hasPermission="device/Instance:update"
                    @click="readOnly = false"
                    :style="color"
                >
                  {{ $t('Parsing.index.217769-4') }}
                </j-permission-button>
                {{ $t('Parsing.index.217769-5') }}
              </template>
            </div>
          </div>
          <div>
            {{ $t('Parsing.index.217769-6') }}
            <a-select
                :defaultValue="'JavaScript'"
                style="width: 200px; margin-left: 5px"
            >
              <a-select-option value="JavaScript"
              >JavaScript(ECMAScript 5)</a-select-option
              >
            </a-select>
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
                            content: () => $t('Parsing.index.217769-7'),
                            style: {
                                marginTop: '260px',
                            },
                        });
                    }
                "
          ></div>
          <monaco-editor
              language="javascript"
              style="height: 100%"
              theme="vs"
              v-model:modelValue="editorValue"
              :registrationTypescript="typescriptTip"
              :init="editorInit"
          />
        </div>
        <div class="bottom">
          <div style="width: 49.5%">
            <div class="bottom-title">
              <div class="bottom-title-text">{{ $t('Parsing.index.217769-8') }}</div>
              <div class="bottom-title-topic">
                <template
                    v-if="instanceStore.current.transport === 'MQTT'"
                >
                  <div style="margin-right: 5px">Topic:</div>
                  <a-auto-complete
                      :placeholder="$t('Parsing.index.217769-9')"
                      style="width: 300px"
                      :options="topicList"
                      :allowClear="true"
                      :filterOption="filterOption"
                      v-model:value="topic"
                  />
                </template>
                <template v-else>
                  <div style="margin-right: 5px">URL:</div>
                  <a-input
                      :placeholder="$t('Parsing.index.217769-10')"
                      v-model:value="url"
                      style="width: 300px"
                  ></a-input>
                </template>
              </div>
            </div>
            <a-textarea
                :rows="5"
                placeholder="// 二进制数据以0x开头的十六进制输入，字符串数据输入原始字符串"
                style="margin-top: 10px"
                v-model:value="simulation"
            />
          </div>
          <div style="width: 49.5%">
            <div class="bottom-title">
              <div class="bottom-title-text">{{ $t('Parsing.index.217769-11') }}</div>
            </div>
            <a-textarea
                :autoSize="{ minRows: 5 }"
                :style="resStyle"
                v-model:value="result"
            />
          </div>
        </div>
      </div>
      <div style="padding-top: 10px">
        <j-permission-button
            type="primary"
            hasPermission="device/Instance:update"
            :loading="loading"
            :disabled="isDisabled"
            @click="debug()"
            :tooltip="{
                title: $t('Parsing.index.217769-12'),
            }"
        >
          {{ $t('Parsing.index.217769-13') }}
        </j-permission-button>
        <j-permission-button
            hasPermission="device/Instance:update"
            :loading="loading"
            :disabled="!isTest"
            @click="save()"
            :style="{ marginLeft: '10px' }"
            :tooltip="{
                title: isTest ? '' : $t('Parsing.index.217769-14'),
            }"
        >
          {{ $t('Parsing.index.217769-15') }}
        </j-permission-button>
      </div>
    </div>
</template>

<script setup lang='ts' name="Parsing">
import { useFullscreen } from '@vueuse/core';
import { useInstanceStore } from '../../../../../store/instance';
import {
  deviceCode,
  getProtocal,
  testCode,
  saveDeviceCode,
  delDeviceCode, queryCodeTips,
} from '../../../../../api/instance';
import { message } from 'ant-design-vue';
import { isBoolean } from 'lodash-es';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const defaultValue =
    `//${$t('Parsing.index.217769-20')}
      codec.onDownstream(function(ctx){

      });

      //${$t('Parsing.index.217769-21')}
      codec.onUpstream(function(ctx){

      });
    `;

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

const typescriptTip = reactive({
  typescript: ''
})


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

const isDisabled = computed(() => simulation.value === '' || readOnly.value);

const result = computed(() =>
    resultValue.value.success
        ? JSON.stringify(resultValue.value.outputs?.[0])
        : resultValue.value.reason,
);

const editorInit = (editor: any, monaco: any) => {
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  });

  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowJs: true,
    checkJs: true,
    allowNonTsExtensions: true,
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    strictNullChecks: false,
    strictPropertyInitialization: true,
    strictFunctionTypes: true,
    strictBindCallApply: true,
    useDefineForClassFields: true,//permit class static fields with private name to have initializer
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    typeRoots: ["types"],
    lib: ["esnext"]
  });
}

//重置
const rest = async () => {
    const res = await delDeviceCode(
        instanceStore.current.productId,
        instanceStore.current.id,
    );
    if (res.status === 200) {
        getDeviceCode();
        onlyMessage($t('Parsing.index.217769-16'));
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

const queryCode = () => {
  queryCodeTips(instanceStore.current.productId,
      instanceStore.current.id,).then(res => {
    if (res.success) {
      typescriptTip.typescript = res.result
    }
  })
}

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
        onlyMessage($t('Parsing.index.217769-17'));
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
            onlyMessage($t('Parsing.index.217769-18'), 'error');
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
            onlyMessage($t('Parsing.index.217769-19'), 'error');
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
    queryCode()
  }
}, { immediate: true })
</script>

<style scoped lang='less'>
.parsing {
  height: 100%;
  display: flex;
  flex-direction: column;

  .parsing-top {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;

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
      flex: 1;
      min-height: 340px;
      position: relative;
      border: 1px solid #dcdcdc;

      .edit-only {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
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
  }
}
</style>
