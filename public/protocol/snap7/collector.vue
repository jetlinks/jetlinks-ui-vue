<template>
  <a-form-item label="IP" :name="['configuration', 'host']"
               :rules="[
    {required: true, trigger: 'blur', validator: validatorUrl,},
  ]"
  >
    <a-input v-model:value="formData.configuration.host" autocomplete="off"
             :placeholder="$lang('snap7.collector.20250207-1')"
             :disabled="false"/>
  </a-form-item>
  <a-form-item :label="$lang('snap7.collector.20250207-2')" :name="['configuration', 'port']" :rules="[{required: true, trigger: 'blur', validator: validator1}]">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.port" :precision="0" autocomplete="off"
                    :placeholder="$lang('snap7.collector.20250207-3')"/>
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.collector.20250207-4')" :name="['configuration', 'rack']" :rules="[{required: true, trigger: 'blur', validator: validator2}]">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.rack" autocomplete="off"
                    :placeholder="$lang('snap7.collector.20250207-5')" :maxlength="64"/>
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.collector.20250207-6')" :name="['configuration', 'type']" :rules="[{required: true, trigger: 'change', message: '请选择型号'}]">
    <a-select v-model:value="formData.configuration.type" :options="options"
              :placeholder="$lang('snap7.collector.20250207-7')"
              @change="typeChange"/>
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.collector.20250207-8')" :name="['configuration', 'slot']" :rules="[{required: true, trigger: 'blur', validator: validator3}]">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.slot" autocomplete="off"
                    :placeholder="$lang('snap7.collector.20250207-9')"
                    :maxlength="64" :disabled="showSlot"/>
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.collector.20250207-10')" :name="['configuration', 'timeout']" :rules="[{required: true, trigger: 'blur', validator: validator4}]">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.timeout" autocomplete="off"
                    :placeholder="$lang('snap7.collector.20250207-11')" :maxlength="64"/>
  </a-form-item>
  <a-form-item
      :label="$lang('snap7.collector.20250207-12')" :name="['configuration', 'serializable']">
    <a-radio-group v-model:value="formData.configuration.serializable">
      <a-radio-button :value="false">{{ $lang('snap7.collector.20250207-13') }}</a-radio-button>
      <a-radio-button :value="true">{{ $lang('snap7.collector.20250207-14') }}</a-radio-button>
    </a-radio-group>
  </a-form-item>
</template>
<script setup>
import {inject, computed} from 'vue'
import {useLocales} from '@hooks'

const {$lang} = useLocales('snap7')
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
  {value: 'S200', label: 'S7-200'},
  {value: 'S300', label: 'S7-300'},
  {value: 'S400', label: 'S7-400'},
  {value: 'S1200', label: 'S7-1200'},
  {value: 'S1500', label: 'S7-1500'},
]

const validatorUrl = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject($lang('snap7.collector.20250207-1'))
  } else {
    if (DOMAIN_NAME.test(value) === false && IP_URL.test(value) === false) {
      return Promise.reject($lang('snap7.collector.20250207-15'))
    }
    return Promise.resolve()
  }
}
/**
 * 校验通道端口
 */
const validator1 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject($lang('snap7.collector.20250207-3'))
  } else {
    if (value < 1 || value > 65535) {
      return Promise.reject($lang('snap7.collector.20250207-16'))
    }
    return Promise.resolve()
  }
}

/**
 * 校验机架号
 */
const validator2 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject($lang('snap7.collector.20250207-5'))
  } else {
    if (value < 0 || value > 65535) {
      return Promise.reject($lang('snap7.collector.20250207-17'))
    }
    return Promise.resolve()
  }
}

/**
 *  校验槽位
 */
const validator3 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject($lang('snap7.collector.20250207-9'))
  } else {
    if (value < 0 || value > 65535) {
      return Promise.reject($lang('snap7.collector.20250207-17'))
    }
    return Promise.resolve()
  }
}

/**
 *  校验超时时间
 */
const validator4 = (rule, value) => {
  if (value === undefined || value === '' || value === null) {
    return Promise.reject($lang('snap7.collector.20250207-11'))
  } else {
    if (value < 0 || value > 65535) {
      return Promise.reject($lang('snap7.collector.20250207-17'))
    }
    return Promise.resolve()
  }
}

const typeChange = (val) => {
  if (val === 'S200' || val === 'S1200') {
    formData.configuration.slot = 1
  }
}
</script>
<style></style>
