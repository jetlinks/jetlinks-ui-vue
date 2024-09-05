<template>
  <div class="api-test-container">
    <div class="top">
      <h5>{{ props.selectApi.summary }}</h5>
      <div class="input">
        <InputCard :value="props.selectApi.method"/>
        <a-input :value="props.selectApi?.url" disabled/>
        <span class="send" @click="send">发送</span>
      </div>
    </div>

    <div class="api-card">
      <h5>请求参数</h5>
      <div class="content">
        <div class="table" v-if="paramsTable.length">
          <a-form :model="requestBody.params" ref="formRef">
            <a-table
                :columns="requestBody.tableColumns"
                :dataSource="paramsTable"
                :pagination="false"
                size="small"
                bordered
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'name'">
                  <a-form-item
                      :name="[
                                            'paramsTable',
                                            index +
                                                (requestBody.pageNum - 1) *
                                                    requestBody.pageSize,
                                            'name',
                                        ]"
                      :rules="[
                                            {
                                                required: true,
                                                message: '该字段是必填字段',
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
                                            index +
                                                (requestBody.pageNum - 1) *
                                                    requestBody.pageSize,
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
                                            title: `确认删除`,
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

          <div
              class="pager"
              v-if="
                            requestBody.params.paramsTable.length > 10 &&
                            requestBody.pageSize
                        "
          >
            <a-select
                v-model:value="requestBody.pageNum"
                style="width: 60px"
            >
              <a-select-option
                  v-for="(val, i) in pageArr"
                  :value="i + 1"
              >{{ i + 1 }}
              </a-select-option
              >
            </a-select>
            <a-pagination
                :pageSize="requestBody.pageSize"
                v-model:current="requestBody.pageNum"
                :total="requestBody.params.paramsTable.length"
                hideOnSinglePage
                style="text-align: center"
            />
          </div>
          <a-button
              type="dashed"
              @click="requestBody.addRow"
              style="width: 100%; text-align: center; margin-top: 5px"
          >
            <AIcon type="PlusOutlined"/>
            新增
          </a-button>
        </div>
        <a-monaco-editor
            v-if="showRequestBody"
            ref="editorRef"
            language="json"
            style="height: 100% ; min-height: 200px;"
            theme="vs"
            v-model:modelValue="requestBody.code"
        />
      </div>
    </div>
    <div class="api-card">
      <h5>响应参数</h5>
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
import {request} from '@jetlinks-web/core'
import {findData, getCodeText} from '../utils';

const props = defineProps<{
  selectApi: apiDetailsType;
  schemas: any;
}>();
const responsesContent = ref({});
const editorRef = ref();
const formRef = ref<FormInstance>();
const method = ref()
const showRequestBody = ref(!!props.selectApi?.requestBody)
const requestBody = reactive({
  tableColumns: [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: true,
    },
    {
      title: '参数值',
      dataIndex: 'value',
      key: 'value',
      scopedSlots: true,
    },
    {
      title: '操作',
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
    if (paramsTable.value.length === 10)
      requestBody.pageNum = requestBody.pageNum + 1;
    requestBody.params.paramsTable.push({
      name: '',
      value: '',
    });
  },
  clickDel: (index: number) => {
    if (paramsTable.value.length === 1 && requestBody.pageNum > 1)
      requestBody.pageNum = requestBody.pageNum - 1;
    requestBody.params.paramsTable.splice(index, 1);
  },
});
const paramsTable = computed(() => {
  const startIndex = (requestBody.pageNum - 1) * requestBody.pageSize;
  const endIndex = requestBody.pageNum * requestBody.pageSize;
  return requestBody.params.paramsTable.slice(startIndex, endIndex);
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

const send = () => {
  if (paramsTable.value.length)
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
  let params
  const urlParams = {};
  requestBody.params.paramsTable.forEach((item) => {
    urlParams[item.name] = item.value;
    if (url.includes(`{${item.name}}`))
      url = url.replace(`{${item.name}}`, item.value);
  });
  if (methodName === 'get') {
    params = {
      ...JSON.parse(requestBody.code || '{}'),
      ...urlParams,
    };
  } else {
    params = JSON.parse(requestBody.code || '{}')
  }

  request[methodObj[methodName]](url, params).then((resp: any) => {
    // 如果用户没填写参数且有body的情况下，给用户展示请求示例
    if (Object.keys(params).length === 0 && refStr.value) {
      requestBody.code = JSON.stringify(getDefaultParams());
      editorRef.value?.editorFormat();
    }
    responsesContent.value = resp;
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
const pageArr = computed(() => {
  const maxPageNum = Math.ceil(
      requestBody.params.paramsTable.length / requestBody.pageSize,
  );
  return new Array(maxPageNum).fill(1);
});
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
