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
      placeholder="请输入IP地址"
    />
  </a-form-item>
  <a-form-item
    label="用户名"
    :name="['configuration', 'username']"
    :rules="[{ required: true, message: '请输入用户名' }]"
  >
    <a-input
      v-model:value="formData.configuration.username"
      :maxlength="64"
      autocomplete="off"
      style="width: 100%"
      placeholder="请输入端口"
    />
  </a-form-item>
  <a-form-item
    label="密码"
    :name="['configuration', 'password']"
    :rules="[{ required: true, message: '请输入密码' }]"
  >
    <a-input
      v-model:value="formData.configuration.password"
      :maxlength="64"
      autocomplete="off"
      style="width: 100%"
      placeholder="请输入密码"
    />
  </a-form-item>
</template>

<script setup>
import { inject, ref } from "vue";
import {testIpv4_6} from 'local-utils'

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
