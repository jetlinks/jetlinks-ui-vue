<template>
  <a-form-item label="IP" :name="['configuration', 'address']"
               :rules="[{ required: true, message: $lang('OMRON_FINS.collector.20250207-1') }, { trigger: 'blur',validator: validateUrl}]">
    <a-input v-model:value="formData.configuration.address"
             :placeholder="$lang('OMRON_FINS.collector.20250207-1')"/>
  </a-form-item>
  <a-form-item :label="$lang('OMRON_FINS.collector.20250207-10') " :name="['configuration', 'protocolType']"
               :rules="[{ required: true, message: $lang('OMRON_FINS.collector.20250207-2') }]">
    <a-select v-model:value="formData.configuration.protocolType" :options="protocolTypeList || []"
              :placeholder="$lang('OMRON_FINS.collector.20250207-2') "/>
  </a-form-item>
  <a-form-item :label="$lang('OMRON_FINS.collector.20250207-3') " :name="['configuration', 'port']"
               :rules="[{ required: true, message: $lang('OMRON_FINS.collector.20250207-4')  }]">
    <a-input-number :precision="0"
                    :min="0"
                    :max="65535" v-model:value="formData.configuration.port" style="width: 100%"
                    :placeholder="$lang('OMRON_FINS.collector.20250207-4') "/>
  </a-form-item>
  <a-form-item :label="$lang('OMRON_FINS.collector.20250207-5') " :name="['configuration', 'local-node']"
               :rules="[{ required: true,
               message: $lang('OMRON_FINS.collector.20250207-6')  }]">
    <a-input-number :precision="0"
                    :max="255"
                    :min="0" v-model:value="formData.configuration['local-node']" style="width: 100%"
                    placeholder="请输入节点号"/>
  </a-form-item>
  <a-form-item :label="$lang('OMRON_FINS.collector.20250207-7') " :name="['configuration', 'deviceSeries']"
               :rules="[{ required: true, message: $lang('OMRON_FINS.collector.20250207-8')  }]">
    <a-select v-model:value="formData.configuration.deviceSeries"
              :placeholder="$lang('OMRON_FINS.collector.20250207-8') "
              :options="deviceList || []"/>
  </a-form-item>
</template>

<script setup>
import {inject, ref} from 'vue'
import {request} from '@jetlinks-web/core'
import {testIpv4_6} from 'local-utils'
import {useLocales} from '@hooks'

const {$lang} = useLocales('OMRON_FINS')
const formData = inject('plugin-form', {
  configuration: {}
})
const deviceList = ref([])
const protocolTypeList = ref([])
const validateUrl = async (_rule, value) => {
  if (!value) {
    return Promise.resolve();
  } else {
    if (!testIpv4_6(value)) {
      return Promise.reject($lang('OMRON_FINS.collector.20250207-9'));
    }
    return Promise.resolve();
  }
};

const getList = () => {
  request.post('/data-collect/OMRON_FINS/command/GetDeviceSeries').then(resp => {
    if (resp.success) {
      deviceList.value = (resp.result || []).map(i => {
        return {
          ...i,
          label: i.name,
          value: i.name
        }
      })
    }
  })
}

const getProtocolTypeList = () => {
  request.post('data-collect/OMRON_FINS/command/GetProtocolType').then(resp => {
    if (resp.success) {
      protocolTypeList.value = (resp.result || []).map(i => {
        return {
          ...i,
          label: i.name,
          value: i.name
        }
      })
    }
  })
}

getList()
getProtocolTypeList()
</script>

<style scoped>

</style>
