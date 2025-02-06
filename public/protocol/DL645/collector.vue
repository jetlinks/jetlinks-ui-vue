<template>
  <a-form-item
      label="电表号"
      :name="['configuration', 'meterNumber']"
      :rules="[
          { required: true, message: '请输入电表号' },
      ]"
  >
    <a-auto-complete
        v-model:value="formData.configuration.meterNumber"
        :options="meterNumberList"
        placeholder="请输入电表号"
    />
  </a-form-item>
  <a-form-item
      label="密码权限"
      :name="['configuration', 'passwordPermission']"
      :rules="[{ required: true, message: '请选择密码权限' }]"
  >
    <a-select
        v-model:value="formData.configuration.passwordPermission"
        placeholder="请选择密码权限"
        :options="permissionOptions"
    />
  </a-form-item>
  <a-form-item
      label="密码"
      :name="['configuration', 'password']"
  >
    <a-input v-model:value="formData.configuration.password" placeholder="请输入密码"/>
    <div class="tip">提示信息：固定长度为6位，可咨询设备厂商获知</div>
  </a-form-item>
  <a-form-item
      label="操作者id"
      :name="['configuration', 'operatorCode']"
  >
    <a-input v-model:value="formData.configuration.operatorCode" placeholder="请输入操作者id"/>
    <div class="tip">提示信息：固定长度为8位十六进制，可咨询设备厂商获知</div>
  </a-form-item>
</template>

<script setup>
import {inject, ref} from 'vue'
import {request} from '@jetlinks-web/core'

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

const permissionOptions = [
  { label: '02（02+明文+编程键）', value: '02' },
  { label: '04（04+明文+编程键）', value: '04' },
];

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
