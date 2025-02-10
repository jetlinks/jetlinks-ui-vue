<template>
  <a-form-item
    :label="$lang('EtherNetIp.point.20250207-1')"
    :name="['pointKey']"
    validateFirst
    :rules="{
      required: true,
      trigger: 'blur',
      message: $lang('EtherNetIp.point.20250207-2')
    }"
  >
    <a-input
      v-model:value="formData.pointKey"
      :placeholder="$lang('EtherNetIp.point.20250207-3')"
      :maxlength="64"
    />
  </a-form-item>
  <a-form-item :label="$lang('EtherNetIp.point.20250207-7')" :name="['configuration', 'type']"
               :rules="[
    {
      required: true,
      message: $lang('EtherNetIp.point.20250207-8')
  },
  ]">
    <a-select
      v-model:value="formData.configuration.type"
      show-search
      :placeholder="$lang('EtherNetIp.point.20250207-8')"
    >
      <a-select-option
        v-for="item in opcuaDataTypeList"
        :key="item"
        :value="item"
        >{{ item }}</a-select-option
      >
    </a-select>
  </a-form-item>
  <a-form-item :label="$lang('EtherNetIp.point.20250207-9')" name="accessModes" :rules="[
    {
      required: true,
      message: $lang('EtherNetIp.point.20250207-4')
  },
  ]">
    <j-check-button
      v-model:value="formData.accessModes"
      :multiple="true"
      :options="[
        { label: $lang('EtherNetIp.point.20250207-5'), value: 'read' },
        { label: $lang('EtherNetIp.point.20250207-6'), value: 'write' },
      ]"
    />
  </a-form-item>
</template>
<script setup>
import { inject, ref } from "vue";
import { request } from "@jetlinks-web/core";
import {useLocales} from '@hooks'

const {$lang} = useLocales('EtherNetIp')
const formData = inject("plugin-form");
const opcuaDataTypeList = ref([]);

const getOpcuaDataType = async () => {
  const res = await request.post(
    "/data-collect/EtherNetIp/command/QuerySecurityMode",
    {}
  );
  if (res.success) {
    opcuaDataTypeList.value = res.result;
  }
};
getOpcuaDataType();
</script>
<style></style>
