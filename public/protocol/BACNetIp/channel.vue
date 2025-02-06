<template>
  <a-form-item label="BACnet实例号" :name="['configuration', 'instanceNumber']" :rules="rules.instanceNumber">
    <a-input-number style="width: 100%" v-model:value="formData.configuration.instanceNumber" placeholder="请输入BACnet实例号"
                    :min="0" :precision="0" :max="999999999999" />
  </a-form-item>
  <a-form-item label="网卡" :name="['configuration', 'overIp', 'localBindAddress']" :rules="rules.localBindAddress">
    <a-input v-model:value="formData.configuration.overIp.localBindAddress" placeholder="请输入网卡" />
  </a-form-item>
  <a-form-item label="广播端口" :name="['configuration', 'overIp', 'port']" :rules="rules.port">
    <a-input-number v-model:value="formData.configuration.overIp.port" style="width: 100%" :min="0" :max="65535"
                    :maxlength="64" placeholder="请输入广播端口" />
  </a-form-item>
  <a-form-item label="子网地址" :name="['configuration', 'overIp', 'subnetAddress']" :rules="rules.subnetAddress">
    <a-input v-model:value="formData.configuration.overIp.subnetAddress
      " style="width: 100%" placeholder="请输入子网地址" />
  </a-form-item>
  <a-form-item label="网络前缀长度" :name="['configuration', 'overIp', 'networkPrefixLength']">
    <a-input-number v-model:value="formData.configuration.overIp.networkPrefixLength
      " style="width: 100%" :min="1" :max="65535" :precision="0" placeholder="请输入网络前缀长度" />
  </a-form-item>
</template>
<script setup>
import { inject } from 'vue'
import { regular } from '@jetlinks-web/utils'

const formData = inject('plugin-form')

const rules = {
  instanceNumber: [
    {
      required: true,
      message: '请输入BACnet实例号',
    },
  ],
  localBindAddress: [
    {
      required: true,
      message: '请选择网卡',
    },
  ],
  port: [
    {
      required: true,
      message: '请输入广播端口',
    }
  ],
  subnetAddress: [
    {
      validator: (_rule, value) => {
        if (value && !(regular.isIpv6(value) || regular.isIpReg(value))) {
          return Promise.reject('请输入正确的子网地址');
        }
        return Promise.resolve();
      }
    }
  ]
}

if (!('configuration' in formData)) {
  formData.configuration = {
    instanceNumber: undefined,
    overIp: {
      localBindAddress: undefined,
      port: undefined,
      subnetAddress: undefined,
      networkPrefixLength: undefined
    }
  }
}

if (!('overIp' in formData.configuration)) {
  formData.configuration.overIp = {
    localBindAddress: undefined,
    port: undefined,
    subnetAddress: undefined,
    networkPrefixLength: undefined
  }
}

</script>
<style></style>
