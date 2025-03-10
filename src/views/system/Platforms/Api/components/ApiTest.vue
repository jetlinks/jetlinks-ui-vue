<template>
  <div class="api-test-container">
    <div class="top">
      <h5>{{ props.selectApi.summary }}</h5>
      <div class="input">
        <InputCard :value="props.selectApi.method"/>
        <a-input :value="props.selectApi?.url" disabled/>
        <a-button type="primary" @click="send" :loading="loading">{{ $t('components.ApiTest.726024-0') }}</a-button>
      </div>
    </div>

    <div class="api-card">
      <h5>{{ $t('components.ApiTest.726024-1') }}</h5>
      <div class="content">
        <div class="table" v-if="requestBody.params.paramsTable.length">
          <a-form :model="requestBody.params" ref="formRef">
            <a-table
              :columns="requestBody.tableColumns"
              :dataSource="requestBody.params.paramsTable"
              size="small"
              bordered
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'name'">
                  <a-form-item
                    :name="[
                      'paramsTable',
                      index,
                      'name',
                    ]"
                    :rules="[
                      {
                        required: true,
                        message: $t('components.ApiTest.726024-2'),
                      },
                    ]"
                  >
                    <a-input
                      v-model:value="record.name"
                    ></a-input>
                  </a-form-item>
                </template>
                <template v-else-if="column.key === 'value'">
                  <a-form-item
                    :name="[
                      'paramsTable',
                      index,
                      'value',
                    ]"
                  >
                    <a-input
                      v-model:value="record.value"
                    ></a-input>
                  </a-form-item>
                </template>
                <template v-else-if="column.key === 'action'">
                  <j-permission-button
                    type="text"
                    :popConfirm="{
                    title: $t('components.ApiTest.726024-3'),
                    onConfirm: () =>
                        requestBody.clickDel(index),
                    }"
                  >
                    <AIcon type="DeleteOutlined"/>
                  </j-permission-button>
                </template>
              </template>
            </a-table>
          </a-form>
          <a-button
            type="dashed"
            @click="requestBody.addRow"
            style="width: 100%; text-align: center; margin-top: 5px"
          >
            <AIcon type="PlusOutlined"/>
            {{ $t('components.ApiTest.726024-4') }}
          </a-button>
        </div>
        <a-select v-model:value="bodyType" @change="handleChangeBodyType">
          <a-select-option value="json">Json</a-select-option>
          <a-select-option value="text">Text</a-select-option>
        </a-select>
        <template
          v-if="showRequestBody"
        >
          <monaco-editor
            v-if="bodyType === 'json'"
            ref="editorRef"
            language="json"
            style="height: 100% ; min-height: 200px;"
            theme="vs"
            v-model:modelValue="requestBody.code"
          />
          <monaco-editor
            v-else
            ref="editorRef"
            language="text"
            style="height: 100% ; min-height: 200px;"
            theme="vs"
            v-model:modelValue="requestBody.code"
          />
        </template>

      </div>
    </div>
    <div class="api-card">
      <h5>{{ $t('components.ApiTest.726024-5') }}</h5>
      <div class="content">
        <JsonViewer :value="responsesContent" copyable/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {JsonViewer} from 'vue3-json-viewer';
import 'vue3-json-viewer/dist/index.css';
import type {apiDetailsType} from '../typing';
import InputCard from './InputCard.vue';
import {cloneDeep, toLower} from 'lodash-es';
import {FormInstance} from 'ant-design-vue';
import { request } from "@jetlinks-web/core";
import {findData, getCodeText} from '../utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps<{
  selectApi: apiDetailsType;
  schemas: any;
}>();
const responsesContent = ref({});
const editorRef = ref();
const formRef = ref<FormInstance>();
const method = ref()
const showRequestBody = ref(!!props.selectApi?.requestBody)
const bodyType = ref('text');
const loading = ref(false);
const requestBody = reactive({
  tableColumns: [
    {
      title: $t('components.ApiTest.726024-6'),
      dataIndex: 'name',
      key: 'name',
      scopedSlots: true,
    },
    {
      title: $t('components.ApiTest.726024-7'),
      dataIndex: 'value',
      key: 'value',
      scopedSlots: true,
    },
    {
      title: $t('components.ApiTest.726024-8'),
      dataIndex: 'action',
      key: 'action',
      width: '80px',
      scopedSlots: true,
    },
  ],
  pageSize: 10,
  pageNum: 1,
  params: {
    paramsTable: cloneDeep(
      props.selectApi.parameters || [],
    ) as requestObj[],
  },

  code: '',

  addRow: () => {
    requestBody.params.paramsTable.push({
      name: '',
      value: '',
    });
  },
  clickDel: (index: number) => {
    requestBody.params.paramsTable.splice(index, 1);
  },
});

let schema: any = {};
const refStr = ref('');

const init = () => {
  method.value = props.selectApi.method
  // if (!props.selectApi.requestBody) return;
  // schema = props.selectApi.requestBody.content['application/json'].schema;
  // refStr.value = schema.$ref || schema?.items?.$ref;
};
init();

const handleChangeBodyType = () => {
  // editorRef.value?.setModelLanguage(editorRef.value?.getModel(), bodyType.value);
}

const send = () => {
  if (requestBody.params.paramsTable.length)
    formRef.value &&
    formRef.value.validate().then(() => {
      _send();
    });
  else _send();
};
const _send = () => {
  const methodName = toLower(props.selectApi.method);
  const methodObj = {
    get: 'get',
    post: 'post',
    patch: 'patch',
    put: 'put',
    delete: 'remove',
  };

  let url = props.selectApi?.url;
  let _data;
  let _params;
  const urlParams = {};
  requestBody.params.paramsTable.forEach((item) => {
    urlParams[item.name] = item.value;
    if (url.includes(`{${item.name}}`))
      url = url.replace(`{${item.name}}`, item.value);
  });
  if (methodName === 'get') {
    _data = {
      ...JSON.parse(requestBody.code || '{}'),
      ...urlParams,
    };
    _params = {}
  } else {
    if (bodyType.value == 'text') {
      _data = requestBody.code
    } else {
      _data = JSON.parse(requestBody.code || '{}')
    }
    _params = urlParams
  }
  loading.value = true;
  request[methodObj[methodName]](url, _data, bodyType.value === 'text' ? {headers: {'Content-Type': 'text/plain'}} : {}).then((resp: any) => {
    // 如果用户没填写参数且有body的情况下，给用户展示请求示例
    if (Object.keys(_data).length === 0 && refStr.value) {
      requestBody.code = JSON.stringify(getDefaultParams());
      editorRef.value?.editorFormat();
    }
    responsesContent.value = resp;
  }).catch((err) => {
    responsesContent.value = err.response?.data || {};
  }).finally(() => {
    loading.value = false;
  });
};

/**
 * 获取默认参数
 */
function getDefaultParams() {
  if (!props.selectApi.requestBody) return {};
  if (!refStr.value) return ''; // schema不是Java中的类的话则不进行解析，直接结束
  const schemaName = refStr.value?.split('/').pop() as string;
  const type = schema.type || '';
  const tableData = findData(props.schemas, schemaName);

  return type === 'array'
    ? [getCodeText(props.schemas, tableData, 3)]
    : getCodeText(props.schemas, tableData, 3);
}

type requestObj = {
  name: string;
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
        cursor: pointer;
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
        background-color: @primary-color;
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

      .table {
        margin-bottom: 22px;

        :deep(.ant-table-cell) {
          padding: 0 8px;
          height: 56px;
        }

        .pager {
          display: flex;
          justify-content: center;
          margin: 8px 0;

          .ant-pagination {
            margin-left: 8px;

            :deep(.ant-pagination-item) {
              display: none;
            }
          }
        }
      }

      :deep(.ant-form-item) {
        margin-bottom: 0;
      }
    }
  }
}
</style>
