<template>
  <a-form-item label="IP" :name="['configuration', 'host']" :rules="rules.host">
    <a-input v-model:value="formData.configuration.host" autocomplete="off" placeholder="请输入通道IP" :disabled="false" />
  </a-form-item>
  <a-form-item label="端口" :name="['configuration', 'port']" :rules="rules.port">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.port" :precision="0" autocomplete="off"
                    placeholder="请输入通道端口" />
  </a-form-item>
  <a-form-item label="机架号" :name="['configuration', 'rack']" :rules="rules.rack">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.rack" autocomplete="off"
                    placeholder="请输入机架号" :maxlength="64" />
  </a-form-item>
  <a-form-item label="型号" :name="['configuration', 'type']" :rules="rules.type">
    <a-select v-model:value="formData.configuration.type" :options="options" placeholder="请选择型号" @change="typeChange" />
  </a-form-item>
  <a-form-item label="槽位" :name="['configuration', 'slot']" :rules="rules.slot">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.slot" autocomplete="off" placeholder="请输入槽位"
                    :maxlength="64" :disabled="showSlot" />
  </a-form-item>
  <a-form-item label="超时时间（毫秒）" :name="['configuration', 'timeout']" :rules="rules.timeout">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.timeout" autocomplete="off"
                    placeholder="请输入超时时间" :maxlength="64" />
  </a-form-item>
  <a-form-item label="数据读取方式" :name="['configuration', 'serializable']">
    <a-radio-group v-model:value="formData.configuration.serializable">
      <a-radio-button :value="false">并行</a-radio-button>
      <a-radio-button :value="true">串行</a-radio-button>
    </a-radio-group>
  </a-form-item>
</template>
<script setup>
import { inject, ref, computed } from 'vue'

const formData = inject('plugin-form')

if (!('configuration' in formData)) {
  formData.configuration = {
    host: undefined,
    port: undefined,
    rack: undefined,
    type: undefined,
    slot: 1,
    timeout: undefined,
    serializable: false,
  }
}

if (!('serializable' in formData.configuration)) {
  formData.configuration.serializable = false
}

const showSlot = computed(() => {
  return formData.configuration.type === 'S200' || formData.configuration.type === 'S1200'
})

const DOMAIN_NAME = /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/
const IP_URL = /^((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))(\.((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))){3}$/

const options = [
  { value: 'S200', label: 'S7-200' },
  { value: 'S300', label: 'S7-300' },
  { value: 'S400', label: 'S7-400' },
  { value: 'S1200', label: 'S7-1200' },
  { value: 'S1500', label: 'S7-1500' },
]

const validatorUrl = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject("请输入通道Ip")
  } else {
    if (DOMAIN_NAME.test(value) === false && IP_URL.test(value) === false) {
      return Promise.reject("请输入正确的域名或ip地址")
    }
    return Promise.resolve()
  }
}
/**
 * 校验通道端口
 */
const validator1 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject("请输入通道端口")
  } else {
    if (value < 1 || value > 65535) {
      return Promise.reject("请输入1~65535的整数")
    }
    return Promise.resolve()
  }
}

/**
 * 校验机架号
 */
const validator2 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject("请输入机架号")
  } else {
    if (value < 0 || value > 65535) {
      return Promise.reject("请输入0~65535的整数")
    }
    return Promise.resolve()
  }
}

/**
 *  校验槽位
 */
const validator3 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject("请输入槽位")
  } else {
    if (value < 0 || value > 65535) {
      return Promise.reject("请输入0~65535的整数")
    }
    return Promise.resolve()
  }
}

/**
 *  校验超时时间
 */
const validator4 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject("请输入超时时间")
  } else {
    if (value < 0 || value > 65535) {
      return Promise.reject("请输入0~65535的整数")
    }
    return Promise.resolve()
  }
}

const typeChange = (val) => {
  if (val === 'S200' || val === 'S1200') {
    formData.configuration.slot = 1
  }
}

const rules = {
  host: [
    { required: true, trigger: 'blur', validator: validatorUrl, },
  ],
  port: [{ required: true, trigger: 'blur', validator: validator1 }],
  rack: [{ required: true, trigger: 'blur', validator: validator2 }],
  slot: [{ required: true, trigger: 'blur', validator: validator3 }],
  timeout: [{ required: true, trigger: 'blur', validator: validator4 }],
  type: [{ required: true, trigger: 'change', message: '请选择型号' }],
  serializable: [{ required: true, trigger: 'change', message: '请选择型号' }],
}

</script>
<style></style>
