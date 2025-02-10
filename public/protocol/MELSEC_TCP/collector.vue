<template>
  <a-form-item
      :label="$lang('MELSEC_TCP.collector.20250207-1')"
      :name="['configuration', 'host']"
      :rules="[
    {
      required: true,
      trigger: 'blur',
  validator: validatorHost,
  },
  ]"
  >
    <a-input
        v-model:value="formData.configuration.host"
        :placeholder="$lang('MELSEC_TCP.collector.20250207-2')"
    ></a-input>
  </a-form-item>
  <a-form-item
      :label="$lang('MELSEC_TCP.collector.20250207-3')"
      :name="['configuration', 'port']"
      :rules="[
    {
      required: true,
      trigger: 'blur',
      message: $lang('MELSEC_TCP.collector.20250207-4')
  },
  ]"
  >
    <a-input-number
        v-model:value="formData.configuration.port"
        style="width: 100%"
        :placeholder="$lang('MELSEC_TCP.collector.20250207-4')"
        :min="0"
        :max="65535"
        :precision="0"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('MELSEC_TCP.collector.20250207-5')"
      :name="['configuration', 'frameType']"
      :rules="[
    {
      required: true,
      message: $lang('MELSEC_TCP.collector.20250207-8')
  },
  ]"
  >
    <a-select
        :options="frameTypeOptions"
        v-model:value="formData.configuration.frameType"
        :placeholder="$lang('MELSEC_TCP.collector.20250207-8')"
    />
  </a-form-item>
</template>

<script setup>
import {inject, ref} from "vue";
import {request} from "@jetlinks-web/core";
import {useLocales} from '@hooks'

const {$lang} = useLocales('MELSEC_TCP')
const formData = inject("plugin-form");
if (!("configuration" in formData)) {
  formData.configuration = {
    host: undefined,
    port: undefined,
    frameType: undefined,
  };
}

/** 帧类型查询 */
const frameTypeOptions = ref([]);

const regular = {
  // IP地址
  IP_URL:
      /^((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))(\.((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))){3}$/,
};

const validatorHost = (rule, value) => {
  const reg = regular.IP_URL;
  if (value === undefined || value === "" || value === null) {
    return Promise.reject($lang('MELSEC_TCP.collector.20250207-6'));
  } else {
    if (reg.test(value) === false) {
      return Promise.reject($lang('MELSEC_TCP.collector.20250207-7'));
    }
    return Promise.resolve();
  }
};
const frameType = async () => {
  const res = await request.post("/data-collect/MELSEC_TCP/command/GetFrameType", {});
  if (res.success) {
    frameTypeOptions.value = res.result?.map((item) => {
      return {
        label: item.name,
        value: item.ID,
      };
    });
  }
};
frameType();
</script>
<style lang="less" scoped></style>
