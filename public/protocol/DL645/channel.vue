<template>
  <a-form-item :label="$lang('DL645.channel.20250207-1')"
               :rules="[
    {
      required: true,
      message: $lang('DL645.channel.20250207-2')
    },
  ]"
               :name="['configuration', 'serialPortId']">
    <a-select :options="serialPort" :placeholder="$lang('DL645.channel.20250207-2')" v-model:value="formData.configuration.serialPortId" />
  </a-form-item>
  <a-form-item :label="$lang('DL645.channel.20250207-3')" :rules="[
    {
      required: true,
      message: $lang('DL645.channel.20250207-4')
    },
  ]" :name="['configuration', 'version']">
    <a-select :disabled="formData.id" :options="protocolVersion" :placeholder="$lang('DL645.channel.20250207-4')"
              v-model:value="formData.configuration.version"/>
  </a-form-item>
  <a-form-item :label="$lang('DL645.channel.20250207-5')" :rules="[
    {
      required: true,
      message: $lang('DL645.channel.20250207-6')
    },
  ]" :name="['configuration', 'preambleLength']">
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
import {useLocales} from '@hooks'

const {$lang} = useLocales('DL645')
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

const getList = () => {
  request.post('/data-collect/DL645/command/GetRtuPorts', {}).then(resp => {
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
