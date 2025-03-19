<template>
  <a-form-item
    :label="$lang('iec104.collector.20250207-1')"
    :name="['configuration', 'host']"
    :rules="rules.host"
  >
    <a-input
      v-model:value="formData.configuration.host"
      autocomplete="off"
      :placeholder="$lang('iec104.collector.20250207-2')"
      :disabled="false"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('iec104.collector.20250207-3')"
    :name="['configuration', 'port']"
    :rules="rules.port"
  >
    <a-input-number
      style="width: 100%"
      v-model:value="formData.configuration.port"
      :min="1"
      :max="65535"
      :precision="0"
      autocomplete="off"
      :placeholder="$lang('iec104.collector.20250207-4')"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('iec104.collector.20250207-5')"
    :name="['configuration', 'terminnalAddress']"
    :rules="[
    { required: true, message: $lang('iec104.collector.20250207-11') },
  ]"
  >
    <a-input-number
      style="width: 100%"
      :min="0"
      :max="65535"
      :precision="0"
      v-model:value="formData.configuration.terminnalAddress"
      autocomplete="off"
      :placeholder="$lang('iec104.collector.20250207-6')"
    ></a-input-number>
  </a-form-item>
  <a-form-item
      :label="$lang('iec104.collector.20250207-12')"
      :name="['configuration', 'frameAmountMax']"
      :rules="[
    { required: true, message: $lang('iec104.collector.20250207-13') },
  ]"
  >
    <a-input-number
        style="width: 100%"
        :min="1"
        :maxLength="16"
        :precision="0"
        v-model:value="formData.configuration.frameAmountMax"
        autocomplete="off"
        :placeholder="$lang('iec104.collector.20250207-13')"
    ></a-input-number>
  </a-form-item>
</template>

<script setup>
import { inject } from "vue";
import {useLocales} from '@hooks'

const {$lang} = useLocales('iec104')
const formData = inject("plugin-form");
if (!("configuration" in formData)) {
  formData.configuration = {
    host: undefined,
    port: undefined,
    terminnalAddress: undefined,
    frameAmountMax: undefined
  };
}
const regular = {
  // IP地址
  IP_URL:
    /^((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))(\.((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))){3}$/,
  // 域名
  DOMAIN_NAME:
    /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/,
};

/**
 * 校验通道端口
 */
const validator1 = (rule, value, callback) => {
  if (value === undefined || value === "" || value === null) {
    return Promise.reject($lang('iec104.collector.20250207-7'));
  } else {
    if (value < 1 || value > 65535) {
      return Promise.reject($lang('iec104.collector.20250207-8'));
    }
    return Promise.resolve();
  }
};

const validatorUrl = (rule, value, callback) => {
  const reg = regular.DOMAIN_NAME;
  const reg1 = regular.IP_URL;
  if (value === undefined || value === "" || value === null) {
    return Promise.reject($lang('iec104.collector.20250207-9'));
  } else {
    if (reg.test(value) === false && reg1.test(value) === false) {
      return Promise.reject($lang('iec104.collector.20250207-10'));
    }
    return Promise.resolve();
  }
};

const rules = {
  host: [{ required: true, trigger: "blur", validator: validatorUrl }],
  port: [{ required: true, trigger: "blur", validator: validator1 }],
};
</script>
<style lang="less" scoped></style>
