<template>
  <a-form-item
      :label="$lang('BACNetIp.channel.20250207-1')"
      :name="['configuration', 'instanceNumber']"
      :rules="[
        {
          required: true,
          message: $lang('BACNetIp.channel.20250207-2'),
        },
      ]"
  >
    <a-input-number
        style="width: 100%"
        v-model:value="formData.configuration.instanceNumber"
        :placeholder="$lang('BACNetIp.channel.20250207-2')"
        :min="0"
        :precision="0"
        :max="999999999999"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('BACNetIp.channel.20250207-3')"
      :name="['configuration', 'overIp', 'localBindAddress']"
      :rules="[
    {
      required: true,
      message: $lang('BACNetIp.channel.20250207-4')
    },
  ]"
  >
    <a-input
        v-model:value="formData.configuration.overIp.localBindAddress"
        :placeholder="$lang('BACNetIp.channel.20250207-4')"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('BACNetIp.channel.20250207-5')"
      :name="['configuration', 'overIp', 'port']"
      :rules="[
    {
      required: true,
      message: $lang('BACNetIp.channel.20250207-6')
    }
  ]"
  >
    <a-input-number
        v-model:value="formData.configuration.overIp.port"
        style="width: 100%"
        :min="0"
        :max="65535"
        :maxlength="64"
        :precision="0"
        :placeholder="$lang('BACNetIp.channel.20250207-6')"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('BACNetIp.channel.20250207-7')"
      :name="['configuration', 'overIp', 'subnetAddress']"
      :rules="[
        {
          validator: valValue
        }
      ]"
  >
    <a-input
        v-model:value="formData.configuration.overIp.subnetAddress"
        style="width: 100%"
        :placeholder="$lang('BACNetIp.channel.20250207-8')"
    />
  </a-form-item>
  <a-form-item
      :label="$lang('BACNetIp.channel.20250207-9')"
      :name="['configuration', 'overIp', 'networkPrefixLength']"
  >
    <a-input-number
        v-model:value="formData.configuration.overIp.networkPrefixLength"
        style="width: 100%"
        :min="1"
        :max="65535"
        :precision="0"
        :placeholder="$lang('BACNetIp.channel.20250207-10')"
    />
  </a-form-item>
</template>
<script setup>
import {inject} from 'vue'
import {regular} from '@jetlinks-web/utils'
import {useLocales} from '@hooks'

const formData = inject('plugin-form')

const {$lang} = useLocales('BACNetIp')

const valValue = (_rule, value) => {
  if (value && !(regular.isIpv6(value) || regular.isIpReg(value))) {
    return Promise.reject($lang('BACNetIp.channel.20250207-11'));
  }
  return Promise.resolve();
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
