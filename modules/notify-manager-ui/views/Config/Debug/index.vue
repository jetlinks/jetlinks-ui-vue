<!-- 调试 -->
<template>
  <a-modal
      v-model:open="_vis"
      :title="$t('Debug.index.013560-0')"
      :cancelText="$t('Debug.index.013560-1')"
      :okText="$t('Debug.index.013560-2')"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="btnLoading"
  >
    <a-form ref="formRef" layout="vertical" :model="formData">
      <a-form-item
          :label="$t('Debug.index.013560-3')"
          name="templateId"
          :rules="{ required: true, message: $t('Debug.index.013560-4') }"
      >
        <a-select
            v-model:value="formData.templateId"
            :placeholder="$t('Debug.index.013560-5')"
            @change="getTemplateDetail"
        >
          <a-select-option
              v-for="(item, index) in templateList"
              :key="index"
              :value="item.id"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
          :label="$t('Debug.index.013560-6')"
          v-if="
          formData.templateDetailTable && formData.templateDetailTable.length
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
            <template v-if="['id', 'name'].includes(column.dataIndex)">
              <span>{{ record[column.dataIndex] }}</span>
            </template>
            <template v-else>
              <a-form-item
                  :name="['templateDetailTable', index, 'value']"
                  :rules="[
                  {
                    required: record.required,
                    message: $t('Debug.index.013560-4'),
                  },
                  ...record.otherRules,
                ]"
              >
                <template
                    v-if="data.type === 'dingTalk' || data.type === 'weixin'"
                >
                  <template v-if="record.type === 'user'">
                    <ToUserModal
                        v-if="data.type === 'weixin'"
                        v-model:toUser="record.value"
                        :type="data.type"
                        :config-id="data.id"
                    />
                    <ToUser
                        v-else
                        v-model:toUser="record.value"
                        :type="data.type"
                        :config-id="data.id"
                    />
                  </template>
                  <ToOrg
                      v-else-if="record.type === 'org'"
                      :type="data.type"
                      :config-id="data.id"
                      v-model:toParty="record.value"
                  />
                  <ToTag
                      v-else-if="record.type === 'tag'"
                      :type="data.type"
                      :config-id="data.id"
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

<script setup lang="ts">
import {PropType} from "vue";
import ConfigApi from "@notify-manager-ui/api/config";
import type {
  TemplateFormData,
  IVariableDefinitions,
} from "../../Template/types";
import ToUser from "../../Template/Detail/components/ToUser.vue";
import ToUserModal from "../../Template/Detail/components/ToUserModal/index.vue";
import ToOrg from "../../Template/Detail/components/ToOrg.vue";
import ToTag from "../../Template/Detail/components/ToTag.vue";
import type {Rule} from "ant-design-vue/es/form";
import {phoneRegEx} from "@jetlinks-web-core/utils/validate";
import {getToken, onlyMessage} from "@jetlinks-web/utils";
import {useI18n} from 'vue-i18n';
import {FileStaticPath} from "@jetlinks-web-core/api/comm";
import {TOKEN_KEY} from "@jetlinks-web/constants";

const {t: $t} = useI18n();
type Emits = {
  (e: "update:visible", data: boolean): void;
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
  set: (val) => emit("update:visible", val),
});

/**
 * 获取通知模板
 */
const templateList = ref<TemplateFormData[]>([]);

// 为了处理#34939
const fileNames = reactive<any>({})
const getTemplateList = async () => {
  const params = {
    terms: [
      {column: "type", value: props.data.type},
      {column: "provider", value: props.data.provider},
    ],
  };
  const {result} = await ConfigApi.getTemplate(params, props.data.id);
  templateList.value = result;
  if (result.length) {
    formData.value.templateId = result[0]?.id as string;
    getTemplateDetail();
  }
};

watch(
    () => _vis.value,
    (val) => {
      if (val) getTemplateList();
    }
);

/**
 * 获取模板详情
 */
const getTemplateDetail = async () => {
  const {result} = await ConfigApi.getTemplateDetail(
      formData.value.templateId
  );
  formData.value.templateDetailTable = result.variableDefinitions.map(
      (m: any) => ({
        ...m,
        type: m.expands?.businessType || m.type,
        value: undefined,
        // 电话字段校验
        otherRules:
            m.id === "calledNumber" || m.id === "phoneNumber"
                ? [
                  {
                    max: 64,
                    message: $t('Debug.index.013560-7'),
                    trigger: "change",
                  },
                  {
                    trigger: "change",
                    validator(_rule: Rule, value: string) {
                      if (!value) return Promise.resolve();
                      if (!phoneRegEx(value))
                        return Promise.reject($t('Debug.index.013560-8'));
                      return Promise.resolve();
                    },
                  },
                ]
                : [],
      })
  );
};

const columns = [
  {
    title: $t('Debug.index.013560-6'),
    dataIndex: "id",
    width: 100,
    ellipsis: true,
    scopedSlots: {customRender: "id"},
  },
  {
    title: $t('Debug.index.013560-9'),
    dataIndex: "name",
    ellipsis: true,
    width: 100,
    scopedSlots: {customRender: "name"},
  },
  {
    title: $t('Debug.index.013560-10'),
    dataIndex: "type",
    // width: 160,
    scopedSlots: {customRender: "type"},
  },
];

// 表单数据
const formData = ref<{
  templateId: string;
  variableDefinitions: string;
  templateDetailTable: IVariableDefinitions[];
}>({
  templateId: "",
  variableDefinitions: "",
  templateDetailTable: [],
});

/**
 * 提交
 */
const formRef = ref();
const btnLoading = ref(false);

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
  formRef.value
      .validate()
      .then(async () => {
        const params = {};
        formData.value.templateDetailTable?.forEach((item) => {
          params[item.id] = item.value;
        });
        btnLoading.value = true;
        ConfigApi.debug({...params, ...fileNames}, props.data.id, formData.value.templateId)
            .then((res) => {
              if (res.success) {
                onlyMessage($t('Debug.index.013560-11'));
                handleCancel();
              }
            })
            .finally(() => {
              btnLoading.value = false;
            });
      })
      .catch((err: any) => {
        console.log("err: ", err);
      });
};

const handleCancel = () => {
  _vis.value = false;
  formRef.value.resetFields();
  formData.value.templateDetailTable = [];
};
</script>

<style lang="less" scoped>
:deep(.ant-table-cell .ant-form-item) {
  margin-bottom: 0;
}
</style>
