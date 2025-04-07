<template>
  <a-modal
    visible
    :title="
      type === 'add' ? $t('Save.index.134000-0') : $t('Save.index.134000-1')
    "
    @cancel="close"
    @ok="submitData"
    :maskClosable="false"
    :confirmLoading="loading"
  >
    <a-form :model="form" layout="vertical" :rules="rules" ref="formRef">
      <a-form-item label="name" name="name">
        <a-input
          :placeholder="$t('Save.index.134000-2')"
          v-model:value="form.name"
        ></a-input>
      </a-form-item>
      <a-form-item label="value" name="value">
        <a-input
          :placeholder="$t('Save.index.134000-3')"
          v-model:value="form.value"
        ></a-input>
      </a-form-item>
      <a-form-item label="text" name="text">
        <a-input
          :placeholder="$t('Save.index.134000-4')"
          v-model:value="form.text"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup name="DictionaryItemEdit">
import type { Rule } from "ant-design-vue/es/form";
import { saveDicItem, verifyValue } from "@/api/system/dictionary";
import { onlyMessage } from "@jetlinks-web/utils";
import { cloneDeep } from "lodash-es";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const props = defineProps({
  type: {
    type: String,
    default: "add",
  },
  dicId: {
    type: String,
    default: "",
  },
  sort: {
    type: Number,
    default: 1,
  },
  data: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["closeModal", "refresh"]);
const form: any = ref({
  dictId: "",
  name: "",
  value: "",
  text: "",
  ordinal: 0,
  searchCode: "",
});
const lastValue = ref();
const loading = ref(false);
const formRef = ref();
/*
 * 校验name
 */
const validateInput = async (_rule: Rule, value: string) => {
  if (value) {
    if (!/^[a-zA-Z0-9_\-]+$/.test(value)) {
      return Promise.reject($t("Save.index.134000-5"));
    }
  } else {
    return Promise.resolve();
  }
};
/**
 * 校验value唯一
 */
const validateValue = async (_rule: Rule, value: string) => {
  if (value && lastValue.value !== value) {
    const res: any = await verifyValue({
      terms: [
        {
          terms: [
            {
              value: value,
              termType: "eq",
              column: "value",
            },
            {
              value: form.value.dictId,
              termType: "eq",
              column: "dictId",
            },
          ],
        },
      ],
    });
    if (res.success && res.result) {
      return Promise.reject($t("Save.index.134000-6"));
    } else {
      return Promise.resolve();
    }
  } else {
    return Promise.resolve();
  }
};
const rules = {
  name: [
    { required: true, message: $t("Save.index.134000-2") },
    { validator: validateInput, trigger: "change" },
    { max: 64, message: $t("Save.index.134000-7"), trigger: "change" },
  ],
  value: [
    { required: true, message: $t("Save.index.134000-3"), trigger: "blur" },
    { max: 64, message: $t("Save.index.134000-7"), trigger: "change" },
    { validator: validateValue, trigger: "blur" },
  ],
  text: [
    { required: true, message: $t("Save.index.134000-4"), trigger: "blur" },
    { max: 64, message: $t("Save.index.134000-7"), trigger: "change" },
  ],
};
const submitData = () => {
  formRef.value.validate().then(async () => {
    loading.value = true;
    form.value.searchCode =
      form.value.name + ":" + form.value.value + ":" + form.value.text;
    const res = await saveDicItem(form.value);
    if (res.status === 200) {
      onlyMessage($t("Save.index.134000-8"));
      emit("refresh");
    } else {
      onlyMessage($t("Save.index.134000-9"), "error");
    }
    loading.value = false;
  });
};
const close = () => {
  emit("closeModal");
};

onMounted(() => {
  if (props.type === "add") {
    form.value.dictId = props.dicId;
    form.value.ordinal = props.sort;
  } else {
    form.value = cloneDeep(props.data);
    lastValue.value = props.data.value;
  }
});
</script>
<style lang="less" scoped></style>
