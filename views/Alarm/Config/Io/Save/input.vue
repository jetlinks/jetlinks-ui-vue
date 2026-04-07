<template>
  <a-modal
    :maskClosable="false"
    width="45vw"
    :title="$t('Save.input.945944-0')"
    @cancel="close"
    @ok="save"
    open
    :cancelText="$t('Save.input.945944-1')"
    :okText="$t('Save.input.945944-2')"
  >
    <a-form layout="vertical" :model="inputData" ref="formRef">
      <a-form-item :label="$t('Save.input.945944-3')">
        <a-switch
          :checked-children="$t('Save.input.945944-4')"
          :un-checked-children="$t('Save.input.945944-10')"
          v-model:checked="inputData.status"
        ></a-switch>
      </a-form-item>
      <a-form-item
        v-if="inputData.status"
        :label="$t('Save.input.945944-5')"
        name="address"
        :rules="[
          {
            required: true,
            message: $t('Save.input.945944-6'),
          },
          {
            max: 64,
            message: $t('Save.input.945944-7'),
          },
        ]"
      >
        <a-input
          v-model:value="inputData.address"
          :placeholder="$t('Save.input.945944-8')"
        ></a-input>
      </a-form-item>
      <a-form-item
        v-if="inputData.status"
        label="topic"
        name="topic"
        :rules="[
          {
            required: true,
            message: $t('Save.input.945944-6'),
          },
          {
            max: 64,
            message: $t('Save.input.945944-7'),
          },
        ]"
      >
        <a-input v-model:value="inputData.topic"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { saveOutputData } from "../../../../../api/config";
import { onlyMessage } from "@jetlinks-web/utils";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const formRef = ref();
const props = defineProps({
  data: {
    default: "",
  },
});
let inputData = reactive({
  status: false,
  address: "",
  topic: "",
});
watchEffect(() => {
  inputData.status =
    props.data?.data?.state?.value === "enabled" ? true : false;
  inputData.address = props.data?.data?.config?.config?.address;
  inputData.topic = props.data?.data?.config?.config?.topic;
});

const close = () => {
  emit("closeModel");
};
const save = () => {
  formRef.value.validateFields().then(() => {
    saveOutputData({
      config: {
        sourceType: "kafka",
        config: {
          ...inputData,
          state: inputData?.status ? "enabled" : "disable",
        },
      },
      state: inputData?.status ? "enabled" : "disable",
      id: props?.data?.data?.id,
      sourceType: "kafka",
      exchangeType: "consume",
    }).then((res) => {
      if (res.status === 200) {
        onlyMessage($t('Save.input.945944-9'));
        emit("saveSuc");
      }
    });
  });
};
const emit = defineEmits(["closeModel", "saveSuc"]);
</script>
<style lang="less" scoped></style>
