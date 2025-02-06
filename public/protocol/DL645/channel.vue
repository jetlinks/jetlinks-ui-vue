<template>
  <a-form-item label="串口" :rules="rules.serialPortId" :name="['configuration', 'serialPortId']">
    <a-select :options="serialPort" placeholder="请选择串口" v-model:value="formData.configuration.serialPortId" />
  </a-form-item>
  <a-form-item label="协议版本" :rules="rules.version" :name="['configuration', 'version']">
    <a-select :disabled="formData.id" :options="protocolVersion" placeholder="请选择协议版本"
              v-model:value="formData.configuration.version"/>
  </a-form-item>
  <a-form-item label="唤醒长度" :rules="rules.preambleLength" :name="['configuration', 'preambleLength']">
    <j-card-select
      :showImage="false"
      v-model:value="formData.configuration.preambleLength"
      :options="options"
      :column="4"
    />
  </a-form-item>
</template>
<script setup>
import {inject, ref} from 'vue'
import {request} from "@jetlinks-web/core";

const formData = inject('plugin-form')
const serialPort = ref([])
const protocolVersion = [
  {
    label: '1997',
    value: '1997'
  },
  {
    label: '2007',
    value: '2007'
  },
]

const options = [
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
  {label: '4', value: 4},
]

if (!('configuration' in formData)) {
  formData.configuration = {
    properties: {},
    serialPortId: undefined,
    version: undefined,
    preambleLength: undefined
  }
}

if (!('properties' in formData.configuration)) {
  formData.configuration.properties = {
    "id": "123",
    "name": "Test Port",
    "alias": "TP",
    "port": "COM3",
    "position": "Rack 1",
    "baudRate": 115200,
    "dataBits": 8
  }
}

const rules = {
  serialPortId: [
    {
      required: true,
      message: '请输入串口',
    },
  ],
  version: [
    {
      required: true,
      message: '请选择协议版本',
    },
  ],
  preambleLength: [
    {
      required: true,
      message: '请选择唤醒长度',
    },
  ]
}

const getList = () => {
  request.get('/edge/serial-port/info').then(resp => {
    if (resp.success) {
      serialPort.value = (resp.result || []).map(i => {
        return {
          label: i.name,
          value: i.port,
        }
      })
    }
  })
}

getList()
</script>
<style></style>
