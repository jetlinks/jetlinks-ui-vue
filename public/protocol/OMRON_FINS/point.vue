<template>
  <a-form-item
      label="寄存器"
      :name="['configuration', 'memoryArea']"
      :rules="[{ required: true, message: '请选择寄存器' }]"
  >
    <a-select
        v-model:value="formData.configuration.memoryArea"
        placeholder="请选择设备型号"
        :options="list"
    />
  </a-form-item>
  <a-form-item
      label="地址"
      :name="['configuration', 'address']"
      :rules="[{ required: true, message: '请输入地址' }]"
  >
    <a-input-number
        v-model:value="formData.configuration.address"
        placeholder="请输入地址"
        :min="0"
        :max="65535"
        style="width: 100%"
        :precision="0"
    />
  </a-form-item>
  <a-form-item
    label="项目数"
    :name="['configuration', 'itemCount']"
    :rules="[{ required: true, message: '请输入项目数' }]"
  >
    <a-input-number
      v-model:value="formData.configuration.itemCount"
      placeholder="请输入项目数"
      :min="0"
      :max="999999999"
      style="width: 100%"
      :precision="0"
    />
  </a-form-item>
  <a-form-item
      label="数据类型"
      :name="['configuration', 'dataTypes']"
      :rules="[{ required: true, message: '请选择数据类型' }]"
  >
    <a-select
        v-model:value="formData.configuration.dataTypes"
        placeholder="请选择数据类型"
        :options="typeList || []"
        @change="onChange"
    />
  </a-form-item>
  <a-form-item
      label="偏移量"
      :name="['configuration', 'bitOffset']"
      :rules="[{ required: true, message: '请输入偏移量' }]"
  >
    <a-input-number
        style="width: 100%"
        v-model:value="formData.configuration.bitOffset"
        placeholder="请输入偏移量"
        :disabled="disabled"
    />
  </a-form-item>
  <a-form-item label="访问类型" name="accessModes" :rules="[
    {
      required: true,
        message: '请选择访问类型'
    },
  ]"
  >
    <j-check-button
        v-model:value="formData.accessModes"
        :multiple="true"
        :options="[
        { label: '读', value: 'read' },
        { label: '写', value: 'write' },
      ]"
    />
  </a-form-item>
</template>

<script setup>
import {inject, computed, ref} from 'vue'
import {request} from '@jetlinks-web/core'
import {randomString} from '@jetlinks-web/utils';

const formData = inject('plugin-form', {
  configuration: {
    bitOffset: 0
  }
})
const typeList = ref([])
const deviceList = ref([])
const disabled = ref(false)

if (!('pointKey' in formData)) {
  formData.pointKey = randomString(9)
}

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
  request.post('data-collect/OMRON_FINS/command/GetCodecInfo').then(resp => {
    if (resp.success) {
      typeList.value = (resp.result || []).map(i => {
        return {
          ...i,
          label: i.name,
          value: i.name
        }
      })
    }
  })
}

const list = computed(() => {
  return (deviceList.value.find(i => i.name === 'CP')?.supportAddressRange || []).map(item => {
    return {
      ...item,
      label: item.areaName,
      value: item.areaName
    }
  })
})

const onChange = (val) => {
  request.post('/data-collect/OMRON_FINS/command/JudgeBitOffset', {
    "dataType": val
  }).then(resp => {
    if (resp.success) {
      disabled.value = !resp.result
    }
  })
  formData.configuration.bitOffset = 0
}

getList()
</script>

<style scoped>

</style>
