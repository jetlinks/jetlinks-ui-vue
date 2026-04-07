<template>
  <a-modal
    :maskClosable="false"
    width="45vw"
    :title="$t('Save.output.945943-0')"
    @cancel="close"
    @ok="save"
    open
    :cancelText="$t('Save.output.945943-1')"
    :okText="$t('Save.output.945943-2')"
  >
    <a-form layout="vertical" :model="outputData" ref="formRef">
      <a-form-item :label="$t('Save.output.945943-3')">
        <a-switch
          :checked-children="$t('Save.output.945943-4')"
          :un-checked-children="$t('Save.input.945944-10')"
          v-model:checked="outputData.status"
        ></a-switch>
      </a-form-item>
      <a-form-item
        v-if="outputData.status"
        :label="$t('Save.output.945943-5')"
        name="address"
        :rules="[
          {
            required: true,
            message: $t('Save.output.945943-6'),
          },
          {
            max: 64,
            message: $t('Save.output.945943-7'),
          },
        ]"
      >
        <a-input
          v-model:value="outputData.address"
          :placeholder="$t('Save.output.945943-6')"
        ></a-input>
      </a-form-item>
      <a-form-item
        v-if="outputData.status"
        label="topic"
        name="topic"
        :rules="[
          {
            required: true,
            message: $t('Save.output.945943-8'),
          },
          {
            max: 64,
            message: $t('Save.output.945943-7'),
          },
        ]"
      >
        <a-input v-model:value="outputData.topic"></a-input>
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
let outputData = reactive({
  status: false,
  address: "",
  topic: "",
});
watchEffect(() => {
  outputData.status =
    props.data?.data?.state?.value === "enabled" ? true : false;
  outputData.address = props.data?.data?.config?.config?.address;
  outputData.topic = props.data?.data?.config?.config?.topic;
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
          ...outputData,
          state: outputData?.status ? "enabled" : "disable",
        },
      },
      state: outputData?.status ? "enabled" : "disable",
      id: props?.data?.data?.id,
      sourceType: "kafka",
      exchangeType: "producer",
    }).then((res) => {
      if (res.status === 200) {
        onlyMessage($t('Save.output.945943-9'));
        emit("saveSuc");
      }
    });
  });
};
const emit = defineEmits(["closeModel", "saveSuc"]);
</script>
<style lang="less" scoped></style>
