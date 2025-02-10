<template>
  <a-form-item
      :label="$lang('DL645.collector.20250207-1')"
      :name="['configuration', 'meterNumber']"
      :rules="[
          { required: true, message: $lang('DL645.collector.20250207-2') },
      ]"
  >
    <a-auto-complete
        v-model:value="formData.configuration.meterNumber"
        :options="meterNumberList"
        :placeholder="$lang('DL645.collector.20250207-2')"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('DL645.collector.20250207-3')"
      :name="['configuration', 'passwordPermission']"
      :rules="[{ required: true, message: $lang('DL645.collector.20250207-4') }]"
  >
    <a-select
        v-model:value="formData.configuration.passwordPermission"
        :placeholder="$lang('DL645.collector.20250207-4')"
        :options="[
  { label: $lang('DL645.collector.20250207-11'), value: '02' },
  { label: $lang('DL645.collector.20250207-12'), value: '04' },
]"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('DL645.collector.20250207-5')"
      :name="['configuration', 'password']"
  >
    <a-input v-model:value="formData.configuration.password"
             :placeholder="$lang('DL645.collector.20250207-6')"/>
    <div class="tip">{{ $lang('DL645.collector.20250207-7') }}</div>
  </a-form-item>
  <a-form-item
      :label="$lang('DL645.collector.20250207-8')"
      :name="['configuration', 'operatorCode']"
  >
    <a-input v-model:value="formData.configuration.operatorCode"
             :placeholder="$lang('DL645.collector.20250207-9')"/>
    <div class="tip">{{ $lang('DL645.collector.20250207-10') }}</div>
  </a-form-item>
</template>

<script setup>
import {inject, ref} from 'vue'
import {request} from '@jetlinks-web/core'
import {useLocales} from '@hooks'

const {$lang} = useLocales('DL645')
const formData = inject('plugin-form', {
  configuration: {
    meterNumber: undefined,
    passwordPermission: undefined,
    password: undefined,
    operatorCode: undefined
  }
})
const channel = inject('plugin-form-channel', {})
const meterNumberList = ref([])

const getList = () => {
  request.post('/data-collect/DL645/command/GetMeterNumber', {
    channelId: channel.value.id,
    version: String(channel.value.configuration?.version),
  }).then(resp => {
    if (resp.success) {
      meterNumberList.value = (resp.result || []).map(i => {
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
</script>

<style scoped>
.tip {
  color: rgb(97, 97, 97);
  margin-top: .5rem;
}
</style>
