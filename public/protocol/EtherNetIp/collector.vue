<template>
  <a-form-item
      :label="$lang('EtherNetIp.collector.20250207-1')"
    :name="['configuration', 'host']"
    :rules="[
      { required: true, message: $lang('EtherNetIp.collector.20250207-2') },
      {
        trigger: 'blur',
        validator: validateUrl,
        message: $lang('EtherNetIp.collector.20250207-3'),
      },
    ]"
  >
    <a-input
      v-model:value="formData.configuration.host"
      :placeholder="$lang('EtherNetIp.collector.20250207-2')"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('EtherNetIp.collector.20250207-4')"
    :name="['configuration', 'port']"
    :rules="[{ required: true, message: $lang('EtherNetIp.collector.20250207-5'), trigger: 'change' }]"
  >
    <a-input-number
        style="width: 100%;"
      v-model:value="formData.configuration.port"
      :placeholder="$lang('EtherNetIp.collector.20250207-5')"
      :max="65535"
      :min="1"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('EtherNetIp.collector.20250207-6')"
    :name="['configuration', 'connectionLimit']"
    :rules="[{ required: true, message: $lang('EtherNetIp.collector.20250207-7'), trigger: 'blur' }]"
  >
    <a-input-number
      v-model:value="formData.configuration.connectionLimit"
      :placeholder="$lang('EtherNetIp.collector.20250207-7')"
      :precision="0"
      :min="1"
      :max="2147483647"
      style="width: 100%;"
    ></a-input-number>
  </a-form-item>
</template>

<script setup>
import { inject } from "vue";
import { testIpv4_6 } from "local-utils";
import {useLocales} from '@hooks'

const {$lang} = useLocales('EtherNetIp')
const formData = inject("plugin-form", {
  configuration: {},
});

const validateUrl = async (_rule, value) => {
  if (!value) {
    return Promise.resolve();
  } else {
    if (!testIpv4_6(value)) {
      return Promise.reject($lang('EtherNetIp.collector.20250207-3'));
    }
    return Promise.resolve();
  }
};
</script>

<style scoped></style>
