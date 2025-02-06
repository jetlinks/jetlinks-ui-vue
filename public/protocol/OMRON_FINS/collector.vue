<template>
  <a-form-item label="IP" :name="['configuration', 'address']"
               :rules="[{ required: true, message: '请输入IP地址' }, { trigger: 'blur',validator: validateUrl, message: '请输入正确的ip地址'}]">
    <a-input v-model:value="formData.configuration.address" placeholder="请输入IP地址"/>
  </a-form-item>
  <a-form-item label="协议类型" :name="['configuration', 'protocolType']"
               :rules="[{ required: true, message: '请选择协议类型' }]">
    <a-select v-model:value="formData.configuration.protocolType" :options="protocolTypeList || []" placeholder="请选择协议类型"/>
  </a-form-item>
  <a-form-item label="端口" :name="['configuration', 'port']" :rules="[{ required: true, message: '请输入端口' }]">
    <a-input-number :precision="0"
                    :min="0"
                    :max="65535" v-model:value="formData.configuration.port" style="width: 100%" placeholder="请输入端口"/>
  </a-form-item>
  <a-form-item label="节点号" :name="['configuration', 'local-node']"
               :rules="[{ required: true, message: '请输入节点号' }]">
    <a-input-number :precision="0"
                    :max="255"
                    :min="0" v-model:value="formData.configuration['local-node']" style="width: 100%"
                    placeholder="请输入节点号"/>
  </a-form-item>
  <a-form-item label="设备型号" :name="['configuration', 'deviceSeries']"
               :rules="[{ required: true, message: '请选择设备型号' }]">
    <a-select v-model:value="formData.configuration.deviceSeries" placeholder="请选择设备型号"
              :options="deviceList || []"/>
  </a-form-item>
</template>

<script setup>
import {inject, ref} from 'vue'
import {request} from '@jetlinks-web/core'
import {testIpv4_6} from 'local-utils'

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
      return Promise.reject('请输入正确的IP地址');
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
