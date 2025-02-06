<template>
  <a-form-item
    label="从机地址"
    :name="['configuration', 'host']"
    :rules="rules.host"
  >
    <a-input
      v-model:value="formData.configuration.host"
      autocomplete="off"
      placeholder="请输入"
      :disabled="false"
    />
  </a-form-item>
  <a-form-item
    label="从机端口"
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
      placeholder="请输入从机端口"
    />
  </a-form-item>
  <a-form-item
    label="分组地址"
    :name="['configuration', 'terminnalAddress']"
    :rules="rules.terminnalAddress"
  >
    <a-input-number
      style="width: 100%"
      :min="0"
      :max="65535"
      :precision="0"
      v-model:value="formData.configuration.terminnalAddress"
      autocomplete="off"
      placeholder="请输入分组地址"
    ></a-input-number>
  </a-form-item>
</template>

<script setup>
import { inject, computed } from "vue";
const formData = inject("plugin-form");
if (!("configuration" in formData)) {
  formData.configuration = {
    host: undefined,
    port: undefined,
    terminnalAddress: undefined,
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
    return Promise.reject("请输入通道端口");
  } else {
    if (value < 1 || value > 65535) {
      return Promise.reject("请输入1~65535的整数");
    }
    return Promise.resolve();
  }
};

const validatorUrl = (rule, value, callback) => {
  const reg = regular.DOMAIN_NAME;
  const reg1 = regular.IP_URL;
  if (value === undefined || value === "" || value === null) {
    return Promise.reject("请输入通道Ip");
  } else {
    if (reg.test(value) === false && reg1.test(value) === false) {
      return Promise.reject("请输入正确的域名或ip地址");
    }
    return Promise.resolve();
  }
};

const rules = {
  host: [{ required: true, trigger: "blur", validator: validatorUrl }],
  port: [{ required: true, trigger: "blur", validator: validator1 }],
  terminnalAddress: [
    { required: true, trigger: "blur", message: "请输入分组地址" },
  ],
};
</script>
<style lang="less" scoped></style>
