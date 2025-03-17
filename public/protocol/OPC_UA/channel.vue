<template>
  <a-form-item :label="$lang('OPC_UA.channel.20250207-1')" :name="['configuration', 'endpoint']" :rules="[
    {
      required: true,
      message: $lang('OPC_UA.channel.20250207-2'),
    },
    {
      validator: checkEndpoint,
      trigger: 'blur',
    },
  ]">
    <a-input :placeholder="$lang('OPC_UA.channel.20250207-2')" v-model:value="formData.configuration.endpoint"/>
  </a-form-item>
  <a-form-item :label="$lang('OPC_UA.channel.20250207-3')" :name="['configuration', 'securityPolicy']" :rules="[
    {
      required: true,
      message: $lang('OPC_UA.channel.20250207-4'),
    },
  ]">
    <a-select style="width: 100%" allowClear show-search v-model:value="formData.configuration.securityPolicy"
              :options="options" :placeholder="$lang('OPC_UA.channel.20250207-4')" :filterOption="filterOption"/>
  </a-form-item>
  <a-form-item :label="$lang('OPC_UA.channel.20250207-5')" :name="['configuration', 'securityMode']" :rules="[
    {
      required: true,
      message: $lang('OPC_UA.channel.20250207-6'),
    },
  ]">
    <a-select style="width: 100%" v-model:value="formData.configuration.securityMode" :options="securityOptions"
              :placeholder="$lang('OPC_UA.channel.20250207-6')" allowClear show-search :filter-option="filterOption"/>
  </a-form-item>
  <a-form-item
      v-if="isSecurityMode"
      :label="$lang('OPC_UA.channel.20250207-16')"
      :name="['configuration', 'certId']"
      :rules="[
          {
            required: true,
            message: $lang('OPC_UA.channel.20250207-17')
          }
      ]"
  >
    <a-select
        style="width: 100%"
        v-model:value="formData.configuration.certId"
        :options="certificateList"
        :placeholder="$lang('OPC_UA.channel.20250207-17')"
        allowClear
        show-search
        :filter-option="filterOption"
    />
  </a-form-item>
  <a-form-item :label="$lang('OPC_UA.channel.20250207-7')" :name="['configuration', 'authType']" :rules="[
    {
      required: true,
      message: $lang('OPC_UA.channel.20250207-14'),
    },
  ]">
    <j-card-select
        :placeholder="$lang('OPC_UA.channel.20250207-8')"
        v-model:value="formData.configuration.authType"
        :options="[
          { label: $lang('OPC_UA.channel.20250207-9'), value: 'anonymous' },
          { label: $lang('OPC_UA.channel.20250207-10'), value: 'username' },
        ]"
        :column="2"
        @change="onAuthTypeChange"
    />
  </a-form-item>
  <a-form-item
      v-if="formData.configuration.authType === 'username'"
      :label="$lang('OPC_UA.channel.20250207-10')"
      :name="['configuration', 'username']"
      :rules="[
        {required: true, message: $lang('OPC_UA.channel.20250207-11'), trigger: 'blur'},
        {max: 64, message: $lang('OPC_UA.channel.20250207-15')},
      ]"
  >
    <a-input :placeholder="$lang('OPC_UA.channel.20250207-11')" autocomplete="off"
             v-model:value="formData.configuration.username"/>
  </a-form-item>
  <a-form-item
      v-if="formData.configuration.authType === 'username'"
      :label="$lang('OPC_UA.channel.20250207-12')"
      :name="['configuration', 'password']"
      :rules="[
        {required: true, message: $lang('OPC_UA.channel.20250207-13'), trigger: 'blur'},
        {max: 64, message: $lang('OPC_UA.channel.20250207-15')},
      ]"
  >
    <a-input-password
        :placeholder="$lang('OPC_UA.channel.20250207-13')"
        autocomplete="off"
        v-model:value="formData.configuration.password"
    />
  </a-form-item>
</template>
<script setup>
import {inject, ref, computed, watch} from 'vue'
import {request} from '@jetlinks-web/core'
import {useLocales} from '@hooks'

const formData = inject('plugin-form')

const options = ref([])
const securityOptions = ref([])
const certificateList = ref([])

if (!('configuration' in formData)) {
  formData.configuration = {
    endpoint: undefined,
    securityPolicy: undefined,
    authType: undefined,
    username: undefined,
    password: undefined,
  }
}

const {$lang} = useLocales('OPC_UA')

const isSecurityMode = computed(() => {
  const { securityMode } = formData.configuration;
  return !!(securityMode === 'SignAndEncrypt' || securityMode === 'Sign')
});

const checkEndpoint = (_rule, value) =>
    new Promise(async (resolve, reject) => {
      if (!value) return resolve('');
      request.post('/data-collect/OPC_UA/command/HandleEndpointValidate', {endpoint: value}).then((resp) => {
        resp.result.passed ? resolve('') : reject(resp.result.reason)
      })
    });

const filterOption = (input, option) => {
  return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getOptions = () => {
  request.post('/data-collect/OPC_UA/command/QuerySecurityPolicies', {}).then(resp => {
    options.value = resp.result.map(i => ({label: i, value: i}))
  })
}

const getSecurityOptions = () => {
  request.post('/data-collect/OPC_UA/command/QuerySecurityModes', {}).then(resp => {
    securityOptions.value = resp.result.map(i => ({label: i, value: i}))
  })
}

const getCertificateList = () => {
  request.get('/network/certificate/_query/no-paging?paging=false', {}).then(resp => {
    certificateList.value = resp.result.map(i => ({label: i.name, value: i.id}))
  })
}

const onAuthTypeChange = () => {
  formData.configuration.username = undefined
  formData.configuration.password = undefined
}

const onChange = (e) => {
  if(e && (e === 'SignAndEncrypt' || e === 'Sign') && !certificateList.value.length){
    getCertificateList()
  }
}

watch(() => formData.configuration.securityMode, (val) => {
  onChange(val)
}, {
  immediate: true
})
getOptions()
getSecurityOptions()
</script>
<style></style>
