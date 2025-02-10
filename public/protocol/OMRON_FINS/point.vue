<template>
  <a-form-item
      :label="$lang('OMRON_FINS.point.20250207-1')"
      :name="['configuration', 'memoryArea']"
      :rules="[{ required: true, message: $lang('OMRON_FINS.point.20250207-2) }]"
  >
    <a-select
        v-model:value="formData.configuration.memoryArea"
        :placeholder="$lang('OMRON_FINS.point.20250207-2')"
        :options="list"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('OMRON_FINS.point.20250207-3')"
      :name="['configuration', 'address']"
      :rules="[{ required: true, message: $lang('OMRON_FINS.point.20250207-4') }]"
  >
    <a-input-number
        v-model:value="formData.configuration.address"
        :placeholder="$lang('OMRON_FINS.point.20250207-4')"
        :min="0"
        :max="65535"
        style="width: 100%"
        :precision="0"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('OMRON_FINS.point.20250207-5')"
    :name="['configuration', 'itemCount']"
    :rules="[{ required: true, message: $lang('OMRON_FINS.point.20250207-6') }]"
  >
    <a-input-number
      v-model:value="formData.configuration.itemCount"
      :placeholder="$lang('OMRON_FINS.point.20250207-6')"
      :min="0"
      :max="999999999"
      style="width: 100%"
      :precision="0"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('OMRON_FINS.point.20250207-7')"
      :name="['configuration', 'dataTypes']"
      :rules="[{ required: true, message: $lang('OMRON_FINS.point.20250207-8') }]"
  >
    <a-select
        v-model:value="formData.configuration.dataTypes"
        :placeholder="$lang('OMRON_FINS.point.20250207-8')"
        :options="typeList || []"
        @change="onChange"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('OMRON_FINS.point.20250207-9')"
      :name="['configuration', 'bitOffset']"
      :rules="[{ required: true, message: $lang('OMRON_FINS.point.20250207-10') }]"
  >
    <a-input-number
        style="width: 100%"
        v-model:value="formData.configuration.bitOffset"
        :placeholder="$lang('OMRON_FINS.point.20250207-10')"
        :disabled="disabled"
    />
  </a-form-item>
  <a-form-item :label="$lang('OMRON_FINS.point.20250207-11')" name="accessModes" :rules="[
    {
      required: true,
        message: $lang('OMRON_FINS.point.20250207-12')
    },
  ]"
  >
    <j-check-button
        v-model:value="formData.accessModes"
        :multiple="true"
        :options="[
        { label: $lang('OMRON_FINS.point.20250207-13'), value: 'read' },
        { label: $lang('OMRON_FINS.point.20250207-14'), value: 'write' },
      ]"
    />
  </a-form-item>
</template>

<script setup>
import {inject, computed, ref} from 'vue'
import {request} from '@jetlinks-web/core'
import {randomString} from '@jetlinks-web/utils';
import {useLocales} from '@hooks'

const {$lang} = useLocales('OMRON_FINS')
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
