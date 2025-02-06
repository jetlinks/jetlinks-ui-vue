<template>
  <a-form-item label="串口" :rules="rules.serialPortId" :name="['configuration', 'serialPortId']">
    <a-select :options="serialPort" placeholder="请选择串口" v-model:value="formData.configuration.serialPortId" @change="handleSerialPortChange"/>
  </a-form-item>
  <a-form-item label="请求超时" :rules="rules.requestTimeout" :name="['configuration', 'requestTimeout']">
    <a-input-number
      :min="0"
      :max="9999999999999"
      v-model:value="formData.configuration.requestTimeout"
      addon-after="ms"
      style="width: 100%"
      placeholder="请输入请求超时时间"/>
  </a-form-item>
  <a-form-item label="通讯间隔" :rules="rules.communicationInterval" :name="['configuration', 'communicationInterval']">
    <a-input-number
      :min="0"
      :max="9999999999999"
      v-model:value="formData.configuration.communicationInterval"
      addon-after="ms"
      style="width: 100%"
      placeholder="请输入通讯间隔" />
  </a-form-item>
</template>

<script setup>
import {request} from "@jetlinks-web/core";
import {inject, ref, watch} from "vue";

const formData = inject('plugin-form')
const serialPort = ref([])

if (!('configuration' in formData)) {
  formData.configuration = {
    properties: {},
    serialPortId: undefined,
    serialPortProperties: null,
    requestTimeout: 3000,
    communicationInterval: 0,
    type: 'rtu',
  };
}

const rules = {
  serialPortId: [
    {
      required: true,
      message: '请输入串口',
    },
  ],
  requestTimeout: [
    {
      required: true,
      message: '请输入请求超时',
    },
  ],
  communicationInterval: [
    {
      required: true,
      message: '请输入通讯间隔',
    },
  ],
}

const handleSerialPortChange = (_, option) => {
  formData.configuration.serialPortProperties = option.source;
}

const getList = () => {
  request.get('/edge/serial-port/info').then(resp => {
    if (resp.success){
      serialPort.value = (resp.result || []).map(i => {
        return {
          source: {
            id: i.port,
            ...i,
          },
          label: i.name,
          value: i.port,
        }
      })
    }
  })
}

getList()
</script>

<style scoped lang="less">

</style>
