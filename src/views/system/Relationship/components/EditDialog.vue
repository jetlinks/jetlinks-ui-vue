<template>
  <a-modal
    visible
    :title="dialogTitle"
    :maskClosable="false"
    width="675px"
    @ok="confirm"
    @cancel="emits('update:visible', false)"
    :confirmLoading="loading"
    class="edit-dialog-container"
  >
    <a-form ref="formRef" :model="form.data" layout="vertical">
      <a-form-item
        name="relation"
        :label="$t('components.EditDialog.375810-0')"
        :rules="[
          { required: true, message: $t('components.EditDialog.375810-1') },
          { max: 64, message: $t('components.EditDialog.375810-2') },
          { validator: form.rules.checkRelation, trigger: 'change' },
        ]"
      >
        <a-input
          v-model:value="form.data.relation"
          :placeholder="$t('components.EditDialog.375810-1')"
          :disabled="!!form.data.id"
        />
      </a-form-item>

            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        name="objectType"
                        :label="$t('components.EditDialog.375810-3')"
                        :rules="[{ required: true, message: $t('components.EditDialog.375810-4') }]"
                    >
                        <a-select
                            v-model:value="form.data.objectType"
                            :disabled="!!form.data.id"
                            @change="form.handleObjectTypeChange"
                            :placeholder="$t('components.EditDialog.375810-4')"
                        >
                            <a-select-option
                                v-for="item in relationTypes"
                                :value="item.id"
                                :key="item.id"
                            >
                                {{ item.i18nName || item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        name="targetType"
                        :label="$t('components.EditDialog.375810-5')"
                        :rules="[{ required: true, message: $t('components.EditDialog.375810-6') }]"
                    >
                        <a-select
                            v-model:value="form.data.targetType"
                            :disabled="!!form.data.id"
                            @change="form.rules.checkUnique"
                            :placeholder="$t('components.EditDialog.375810-6')"
                        >
                            <a-select-option
                                v-for="item in beRelationTypes"
                                :value="item.id"
                                :key="item.id"
                            >
                                {{ item.i18nName || item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item
                :label="$t('components.EditDialog.375810-7')"
                name="name"
                :rules="[
                    { required: true, message: $t('components.EditDialog.375810-8') },
                    { max: 64, message: $t('components.EditDialog.375810-2') },
                    { required: true , validator:validateName, trigger: 'blur',}
                ]"
            >
                <a-input
                    v-model:value="form.data.name"
                    :placeholder="$t('components.EditDialog.375810-8')"
                />
                <span class="example">{{ $t('components.EditDialog.375810-9') }}</span>
            </a-form-item>
          
            <a-form-item
                :label="$t('components.EditDialog.375810-10')"
                name="reverseName"
                :rules="[
                    { required: true, message: $t('components.EditDialog.375810-8') },
                    { max: 64, message: $t('components.EditDialog.375810-2') },
                    { required: true , validator:validateName, trigger: 'blur',}
                ]"
            >
                <a-input
                    v-model:value="form.data.reverseName"
                    :placeholder="$t('components.EditDialog.375810-8')"
                />
                <span class="example">{{ $t('components.EditDialog.375810-11') }}</span>
            </a-form-item>
            <a-form-item name="description" :label="$t('components.EditDialog.375810-12')">
                <a-textarea
                    v-model:value="form.data.description"
                    :placeholder="$t('components.EditDialog.375810-13')"
                    show-count
                    :maxlength="200"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance } from "ant-design-vue";
import { Rule } from "ant-design-vue/es/form";
import {
  addRelation_api,
  editRelation_api,
  validateField,
} from "@/api/system/relationship";
import { dictItemType } from "../typing";
import { onlyMessage } from "@/utils/comm";
import { useI18n } from "vue-i18n";
import { useRelationTypes } from "../hooks/useRelationTypes";

const { t: $t } = useI18n();
const emits = defineEmits(["refresh", "update:visible"]);
const props = defineProps<{
  visible: boolean;
  data: formType;
}>();

const { relationTypes, beRelationTypes } = useRelationTypes();
// 弹窗相关
const loading = ref(false);
const dialogTitle = computed(() =>
  props.data.id
    ? $t("components.EditDialog.375810-14")
    : $t("components.EditDialog.375810-15"),
);
const confirm = () => {
  loading.value = true;
  formRef.value
    ?.validate()
    .then(() => form.submit())
    .then((resp: any) => {
      if (resp.status === 200) {
        onlyMessage($t("components.EditDialog.375810-16"));
        emits("refresh");
        emits("update:visible", false);
      }
    })
    .finally(() => (loading.value = false));
};

const formRef = ref<FormInstance>();
const form = reactive({
    data: props.data,
    rules: {
        /**
         * 验证标识
         * @param _rule
         * @param value
         */
        checkRelation: async (_rule: Rule, value: string) => {
            const reg = new RegExp('^[0-9a-zA-Z_\\\\-]+$');
            if (!value) return Promise.reject('');
            if (!reg.test(value))
                return Promise.reject(
                    $t('components.EditDialog.375810-17'),
                );
            return form.rules.checkUnique();
        },
        /**
         * 验证标识唯一性
         * @param value
         */
        checkUnique: () => {
            if (
                props.data?.id ||
                !form.data.relation ||
                !form.data.objectType ||
                !form.data.targetType
            )
                return;
            return new Promise(async (resolve, reject) => {
                const { result } = await validateField({
                    relation: form.data.relation,
                    objectType: form.data.objectType,
                    targetType: form.data.targetType,
                });
                result.passed ? resolve('') : reject(result.reason);
            });
        },
    },
    handleObjectTypeChange: () => {
        form.data.targetType = undefined;
        form.rules.checkUnique();
    },
    submit: () => {
        const params = {
            ...form.data,
            objectTypeName: relationTypes.value.find(
                (item) => item.id === form.data.objectType,
            )?.name,
            targetTypeName: beRelationTypes.value.find(
                (item: dictItemType) => item.id === form.data.targetType,
            )?.name,
        };
        const api = props.data.id ? editRelation_api : addRelation_api;
        return api(params);
    },
});
const validateName = async (_: any, value: any) => {
  if (!value) {
    return Promise.resolve();
  }
  return form.data.reverseName === form.data.name
    ? Promise.reject($t("components.EditDialog.375810-18"))
    : Promise.resolve();
};

type formType = {
  name: string;
  reverseName: string;
  relation: string;
  objectType: string | undefined;
  targetType: string | undefined;
  description: string;
  id?: string;
};
</script>
<style scoped lang="less">
.example {
  color: rgb(192, 192, 192);
  font-size: 12px;
}
</style>
