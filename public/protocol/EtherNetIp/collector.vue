<template>
  <a-form-item
    label="主机地址"
    :name="['configuration', 'host']"
    :rules="[
      { required: true, message: '请输入主机地址' },
      {
        trigger: 'blur',
        validator: validateUrl,
        message: '请输入正确的主机地址',
      },
    ]"
  >
    <a-input
      v-model:value="formData.configuration.host"
      placeholder="请输入主机地址"
    />
  </a-form-item>
  <a-form-item
    label="端口"
    :name="['configuration', 'port']"
    :rules="[{ required: true, message: '请输入端口', trigger: 'change' }]"
  >
    <a-input-number
        style="width: 100%;"
      v-model:value="formData.configuration.port"
      placeholder="请输入端口"
      :max="65535"
      :min="1"
    />
  </a-form-item>
  <a-form-item
    label="连接池大小"
    :name="['configuration', 'connectionLimit']"
    :rules="[{ required: true, message: '请输入连接池大小', trigger: 'blur' }]"
  >
    <a-input-number
      v-model:value="formData.configuration.connectionLimit"
      placeholder="请输入连接池大小"
      :precision="0"
      :min="1"
      :max="2147483647"
      style="width: 100%;"
    ></a-input-number>
  </a-form-item>
</template>

<script setup>
import { inject } from "vue";
import { testIpv4_6 } from "local-utils";

const formData = inject("plugin-form", {
  configuration: {},
});

const validateUrl = async (_rule, value) => {
  if (!value) {
    return Promise.resolve();
  } else {
    if (!testIpv4_6(value)) {
      return Promise.reject("请输入正确的主机地址");
    }
    return Promise.resolve();
  }
};
</script>

<style scoped></style>
