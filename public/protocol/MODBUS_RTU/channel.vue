<template>
  <a-form-item :label="$lang('MODBUS_RTU.channel.20250207-1')" :rules="[
    {
      required: true,
      message: $lang('MODBUS_RTU.channel.20250207-2')
    },
  ]" :name="['configuration', 'serialPortId']">
    <a-select :options="serialPort" :placeholder="$lang('MODBUS_RTU.channel.20250207-2')" v-model:value="formData.configuration.serialPortId" @change="handleSerialPortChange"/>
  </a-form-item>
  <a-form-item :label="$lang('MODBUS_RTU.channel.20250207-3')" :rules="[
    {
      required: true,
      message: $lang('MODBUS_RTU.channel.20250207-4')
    },
  ]" :name="['configuration', 'requestTimeout']">
    <a-input-number
      :min="0"
      :max="9999999999999"
      v-model:value="formData.configuration.requestTimeout"
      addon-after="ms"
      style="width: 100%"
      :placeholder="$lang('MODBUS_RTU.channel.20250207-4')"
    />
  </a-form-item>
  <a-form-item :label="$lang('MODBUS_RTU.channel.20250207-5')" :rules="[
    {
      required: true,
      message: $lang('MODBUS_RTU.channel.20250207-6')
    },
  ]" :name="['configuration', 'communicationInterval']">
    <a-input-number
      :min="0"
      :max="9999999999999"
      v-model:value="formData.configuration.communicationInterval"
      addon-after="ms"
      style="width: 100%"
      :placeholder="$lang('MODBUS_RTU.channel.20250207-6')" />
  </a-form-item>
</template>

<script setup>
import {request} from "@jetlinks-web/core";
import {inject, ref} from "vue";
import {useLocales} from '@hooks'

const {$lang} = useLocales('MODBUS_RTU')
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
const handleSerialPortChange = (_, option) => {
  formData.configuration.serialPortProperties = option.source;
}

const getList = () => {
  request.post('/data-collect/MODBUS_RTU/command/GetRtuPorts', {}).then(resp => {
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
