<template>
  <a-form-item label="端点url" :name="['configuration', 'endpoint']" :rules="rules.endpoint">
    <a-input placeholder="请输入端点url" v-model:value="formData.configuration.endpoint" />
  </a-form-item>
  <a-form-item label="安全策略" :name="['configuration', 'securityPolicy']" :rules="rules.securityPolicy">
    <a-select style="width: 100%" allowClear show-search v-model:value="formData.configuration.securityPolicy"
              :options="options" placeholder="请选择安全策略" :filterOption="filterOption" />
  </a-form-item>
  <a-form-item label="安全模式" :name="['configuration', 'securityMode']" :rules="rules.securityMode">
    <a-select style="width: 100%" v-model:value="formData.configuration.securityMode" :options="securityOptions"
              placeholder="请选择安全模式" allowClear show-search :filter-option="filterOption" />
  </a-form-item>
  <a-form-item label="权限认证" :name="['configuration', 'authType']" :rules="rules.authType">
    <j-card-select placeholder="请输入Modbus主机IP" v-model:value="formData.configuration.authType" :options="[
      { label: '匿名用户', value: 'anonymous' },
      { label: '用户名', value: 'username' },
    ]" :column="2" />
  </a-form-item>
  <a-form-item v-if="formData.configuration.authType === 'username'" label="用户名" :name="['configuration', 'username']"
               :rules="rules.username">
    <a-input placeholder="请输入用户名" autocomplete="off" v-model:value="formData.configuration.username" />
  </a-form-item>
  <a-form-item v-if="formData.configuration.authType === 'username'" label="密码" :name="['configuration', 'password']"
               :rules="rules.password">
    <a-input-password placeholder="请输入密码" autocomplete="off" v-model:value="formData.configuration.password" />
  </a-form-item>
</template>
<script setup>
import { inject, ref } from 'vue'
import { request } from '@jetlinks-web/core'

const formData = inject('plugin-form')

const options = ref([])
const securityOptions = ref([])

if (!('configuration' in formData)) {
  formData.configuration = {
    endpoint: undefined,
    securityPolicy: undefined,
    authType: undefined,
    username: undefined,
    password: undefined,
  }
}

const checkEndpoint = (_rule, value) =>
  new Promise(async (resolve, reject) => {
    if (!value) return resolve('');
    request.post('/data-collect/OPC_UA/command/HandleEndpointValidate', { endpoint: value }).then((resp) => {
      resp.result.passed ? resolve('') : reject(resp.result.reason)
    })
  });

const rules = {
  endpoint: [
    {
      required: true,
      message: '请输入端点url',
    },
    {
      validator: checkEndpoint,
      trigger: 'blur',
    },
  ],
  securityPolicy: [
    {
      required: true,
      message: '请选择安全策略',
    },
  ],
  securityMode: [
    {
      required: true,
      message: '请选择安全模式',
    },
  ],
  authType: [
    {
      required: true,
      message: '请选择权限认证',
    },
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { max: 64, message: '最多可输入64个字符' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { max: 64, message: '最多可输入64个字符' },
  ],
}

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getOptions = () => {
  request.post('/data-collect/OPC_UA/command/QuerySecurityPolicies', {}).then(resp => {
    options.value = resp.result.map(i => ({ label: i, value: i }))
  })
}

const getSecurityOptions = () => {
  request.post('/data-collect/OPC_UA/command/QuerySecurityModes', {}).then(resp => {
    securityOptions.value = resp.result.map(i => ({ label: i, value: i }))
  })
}

getOptions()
getSecurityOptions()
</script>
<style></style>
