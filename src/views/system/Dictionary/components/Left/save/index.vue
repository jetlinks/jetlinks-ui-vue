<template>
  <a-modal
    :title="
      type === 'add' ? $t('save.index.551811-0') : $t('save.index.551811-1')
    "
    visible
    @cancel="closeModal"
    @ok="submitData"
    width="650px"
    :maskClosable="false"
    :confirmLoading="loading"
  >
    <a-form layout="vertical" :rules="rules" ref="formRef" :model="form">
      <a-form-item :label="$t('save.index.551811-2')" name="id">
        <a-input
          v-model:value="form.id"
          :disabled="type === 'edit'"
          :placeholder="$t('save.index.551811-3')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('save.index.551811-4')" name="name">
        <a-input
          v-model:value="form.name"
          :placeholder="$t('save.index.551811-5')"
        ></a-input>
      </a-form-item>
      <a-form-item :label="$t('save.index.551811-6')" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio-button :value="1">{{
            $t("save.index.551811-7")
          }}</a-radio-button>
          <a-radio-button :value="0">{{
            $t("save.index.551811-8")
          }}</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('save.index.551811-9')" name="describe">
        <a-textarea
          :rows="4"
          :maxlength="200"
          v-model:value="form.describe"
          :placeholder="$t('save.index.551811-10')"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup name="DictionaryEdit">
import { onlyMessage } from "@jetlinks-web/utils";
import type { Rule } from "ant-design-vue/es/form";
import { verifyId, addDictionary } from "@/api/system/dictionary";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
const props = defineProps({
  type: {
    type: String,
    default: "add",
  },
  data: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["closeSave", "success"]);
const loading = ref(false);
const formRef = ref();
const form = reactive({
  id: "",
  name: "",
  describe: "",
  status: 1,
});
/**
 * 校验id
 */
const validateInput = async (_rule: Rule, value: string) => {
  if (value) {
    if (!/^[a-zA-Z0-9_\-]+$/.test(value)) {
      return Promise.reject($t("save.index.551811-11"));
    } else {
      if (props.type === "add") {
        const res: any = await verifyId(value);
        if (res.status === 200 && res.result) {
          return Promise.reject($t("save.index.551811-12"));
        } else {
          return Promise.resolve();
        }
      }
    }
  } else {
    return Promise.resolve();
  }
};

const rules = {
  id: [
    { required: true, message: $t("save.index.551811-13") },
    { validator: validateInput, trigger: "blur" },
    { max: 64, message: $t("save.index.551811-14"), trigger: "change" },
  ],
  name: [
    { required: true, message: $t("save.index.551811-15"), trigger: "blur" },
    { max: 64, message: $t("save.index.551811-14"), trigger: "change" },
  ],
  status: [
    {
      required: true,
      message: $t("save.index.551811-16"),
      trigger: "blur",
    },
  ],
  description: [
    { max: 200, message: $t("save.index.551811-17"), trigger: "blur" },
  ],
};

const submitData = () => {
  formRef.value.validate().then(async () => {
    loading.value = true;
    const res = await addDictionary(form);
    if (res.status === 200) {
      onlyMessage($t("save.index.551811-18"));
      emit("success");
    } else {
      onlyMessage($t("save.index.551811-19"), "error");
    }
    loading.value = false;
  });
};
const closeModal = () => {
  emit("closeSave");
};
onMounted(() => {
  if (props.type === "edit" && props.data) {
    form.describe = props.data.describe;
    form.id = props.data.id;
    form.name = props.data.name;
    form.status = props.data.status;
  }
});
</script>
<style lang="less" scoped></style>
