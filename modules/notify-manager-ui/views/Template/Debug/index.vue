<!-- 调试 -->
<template>
  <a-modal
      v-model:open="_vis"
      :title="$t('Debug.index.329614-0')"
      :cancelText="$t('Debug.index.329614-1')"
      :okText="$t('Debug.index.329614-2')"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="btnLoading"
  >
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-form-item
          :label="$t('Debug.index.329614-3')"
          name="configId"
          :rules="{ required: true, message: $t('Debug.index.329614-4') }"
      >
        <a-select
            v-model:value="formData.configId"
            :placeholder="$t('Debug.index.329614-4')"
        >
          <a-select-option
              v-for="(item) in configList"
              :key="item.id"
              :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          :label="$t('Debug.index.329614-5')"
          v-if="
                    formData.templateDetailTable &&
                    formData.templateDetailTable.length
                "
      >
        <a-table
            row-key="id"
            :columns="columns"
            :data-source="formData.templateDetailTable"
            :pagination="false"
            bordered
        >
          <template #bodyCell="{ column, record, index }">
            <template
                v-if="['id', 'name'].includes(column.dataIndex)"
            >
              <span>{{ record[column.dataIndex] }}</span>
            </template>
            <template v-else>
              <a-form-item
                  :name="['templateDetailTable', index, 'value']"
                  :rules="[
                                    {
                                        required: record.required,
                                        message: $t('Debug.index.329614-6'),
                                    },
                                    ...record.otherRules,
                                ]"
              >
                <template
                    v-if="
                                        data.type === 'dingTalk' ||
                                        data.type === 'weixin'
                                    "
                >
                  <template v-if="record.type === 'user'">
                    <ToUserModal
                        v-if="data.type === 'weixin'"
                        v-model:toUser="record.value"
                        :config-id="formData.configId"
                    />
                    <ToUser
                        v-else
                        v-model:toUser="record.value"
                        :type="data.type"
                        :config-id="formData.configId"
                    />
                  </template>
                  <ToOrg
                      v-else-if="record.type === 'org'"
                      :type="data.type"
                      :config-id="formData.configId"
                      v-model:toParty="record.value"
                  />
                  <ToTag
                      v-else-if="record.type === 'tag'"
                      :type="data.type"
                      :config-id="formData.configId"
                      v-model:toTag="record.value"
                  />
                  <j-value-item
                      v-else
                      v-model:modelValue="record.value"
                      :itemType="record.type === 'array' ? 'object' : record.type"
                      :action="FileStaticPath()"
                      style="width: 100%"
                      :headers="{ [TOKEN_KEY]: getToken() }"
                  />
                </template>
                <template v-else>
                  <j-value-item
                      v-model:modelValue="record.value"
                      :itemType="record.type === 'array' ? 'object' : record.type"
                      :action="FileStaticPath()"
                      style="width: 100%"
                      :headers="{ [TOKEN_KEY]: getToken() }"
                      :handleFileChange="(info, resp) => handleFileChange(info, resp, index)"
                  />
                </template>
              </a-form-item>
            </template>
          </template>
        </a-table>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts" name="TemplateDebugger">
import {PropType} from 'vue';
import TemplateApi from '@notify-manager-ui/api/template';
import {IVariableDefinitions, BindConfig} from '../types';
import ToUserModal from '../Detail/components/ToUserModal/index.vue';
import ToUser from '../Detail/components/ToUser.vue';
import ToOrg from '../Detail/components/ToOrg.vue';
import ToTag from '../Detail/components/ToTag.vue';
import type {Rule} from 'ant-design-vue/es/form';
import {phoneRegEx} from '@jetlinks-web-core/utils/validate';
import {getToken, onlyMessage} from '@jetlinks-web/utils';
import {useI18n} from 'vue-i18n';
import {FileStaticPath} from "@jetlinks-web-core/api/comm";
import {TOKEN_KEY} from "@jetlinks-web/constants";

const {t: $t} = useI18n();
type Emits = {
  (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
  visible: {type: Boolean, default: false},
  data: {
    type: Object as PropType<Partial<Record<string, any>>>,
    default: () => ({}),
  },
});

const _vis = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val),
});

/**
 * 获取通知模板
 */
const configList = ref<BindConfig[]>([]);

const columns = [
  {
    title: $t('Debug.index.329614-5'),
    dataIndex: 'id',
    width: 100,
    ellipsis: true,
    scopedSlots: {customRender: 'id'},
  },
  {
    title: $t('Debug.index.329614-7'),
    dataIndex: 'name',
    scopedSlots: {customRender: 'name'},
  },
  {
    title: $t('Debug.index.329614-8'),
    dataIndex: 'type',
    width: 160,
    scopedSlots: {customRender: 'type'},
  },
];

// 表单数据
const formData = ref<{
  configId: string;
  variableDefinitions: string;
  templateDetailTable: IVariableDefinitions[];
}>({
  configId: '',
  variableDefinitions: '',
  templateDetailTable: [],
});

/**
 * 提交
 */
const formRef = ref();
const btnLoading = ref(false);
// 为了处理#34939
const fileNames = reactive<any>({})
const getConfigList = async () => {
  const params = {
    terms: [
      {column: 'type', value: props.data.type},
      {column: 'provider', value: props.data.provider},
    ],
  };
  const {result} = await TemplateApi.getConfig(params);
  configList.value = result;
  // 设置默认配置
  if (configList.value.length) formData.value.configId = props.data.configId;
};

/**
 * 获取模板详情
 */
const getTemplateDetail = async () => {
  const {result} = await TemplateApi.getTemplateDetail(props.data.id);
  formData.value.templateDetailTable = result.variableDefinitions.map(
      (m: any) => ({
        ...m,
        type: m.expands?.businessType ? m.expands.businessType : m.type,
        value: undefined,
        // 电话字段校验
        otherRules:
            m.id === 'calledNumber' || m.id === 'phoneNumber'
                ? [
                  {
                    max: 64,
                    message: $t('Debug.index.329614-9'),
                    trigger: 'change',
                  },
                  {
                    trigger: 'change',
                    validator(_rule: Rule, value: string) {
                      if (!value) return Promise.resolve();
                      if (!phoneRegEx(value))
                        return Promise.reject($t('Debug.index.329614-10'));
                      return Promise.resolve();
                    },
                  },
                ]
                : [],
      }),
  );
};

const handleFileChange = (info, _, index) => {
  if (props.data.type === "email") {
    const dt = formData.value.templateDetailTable[index]
    if (dt.type === 'file') {
      const __key = dt.id.replace('location', 'name')
      if (__key) {
        fileNames[__key] = info.file.response?.result?.name
      }
    }
  }
  return info.file.response?.result?.accessUrl
}

const handleOk = () => {
  const filterData = formData.value.templateDetailTable.filter((item: any) =>
      ['user', 'org', 'tag', 'userIdList', 'departmentIdList'].includes(
          item.id,
      ),
  );
  const pass = filterData.length
      ? filterData.some((i: any) => {
        return i.value;
      })
      : true;
  if (!pass && props.data.type === 'dingTalk') {
    onlyMessage($t('Debug.index.329614-11'), 'warning');
    return;
  }
  if (!pass && props.data.type === 'weixin') {
    onlyMessage($t('Debug.index.329614-12'), 'warning');
    return;
  }
  formRef.value
      .validate()
      .then(async () => {
        const params = {};
        formData.value.templateDetailTable?.forEach((item) => {
          params[item.id] = item.value;
        });
        btnLoading.value = true;
        TemplateApi.debug({...params, ...fileNames}, formData.value.configId, props.data.id)
            .then((res) => {
              if (res.success) {
                onlyMessage($t('Debug.index.329614-13'));
                handleCancel();
              }
            })
            .finally(() => {
              btnLoading.value = false;
            });
      })
      .catch((err: any) => {
        console.log('err: ', err);
      });
};

const handleCancel = () => {
  _vis.value = false;
  formRef.value.resetFields();
  formData.value.templateDetailTable = [];
};

const handleConfigChange = (value: string) => {
  console.log('value: ', value);
};

watch(
    () => _vis.value,
    (val) => {
      if (val) {
        getConfigList();
        getTemplateDetail();
      }
    },
);
</script>

<style lang="less" scoped>
:deep(.ant-table-cell .ant-form-item) {
  margin-bottom: 0;
}
</style>
