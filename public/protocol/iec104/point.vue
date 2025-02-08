<template>
  <a-form-item
      :label="$lang('iec104.point.20250207-1')"
      :name="['configuration', 'typeIdentifierName']"
      :rules='[
    {
      required: true,
      message: $lang("iec104.point.20250207-2"),
      trigger: "change",
    },
  ]'
  >
    <a-select
        v-model:value="formData.configuration.typeIdentifierName"
        :options="dataTypeList"
        :placeholder="$lang('iec104.point.20250207-2')"
        allowClear
        show-search
    />
  </a-form-item>
  <a-form-item
      :label="$lang('iec104.point.20250207-3')"
      :name="['configuration', 'pointAddress']"
      :rules="[
    {
      required: true,
      message: $lang('iec104.point.20250207-4'),
  trigger: 'blur',
  },
  ]"
  >
    <a-input
        v-model:value="formData.configuration.pointAddress"
        :placeholder="$lang('iec104.point.20250207-4')"
        :min="1"
        :max="65535"
        :precision="0"
    />
  </a-form-item>
  <a-form-item :label="$lang('iec104.point.20250207-8')" name="accessModes" :rules="[
    {
      required: true,
      message: $lang('iec104.point.20250207-9'),
  },
  ]">
    <j-check-button
        multiple
        v-model:value="formData.accessModes"
        :options="[
        { label: $lang('iec104.point.20250207-5'), value: 'read' },
        { label: $lang('iec104.point.20250207-6'), value: 'write' },
        { label: $lang('iec104.point.20250207-7'), value: 'subscribe' },
      ]"
        :column="3"
    />
  </a-form-item>
</template>

<script setup>
import {inject, ref} from "vue";
import {request} from "@jetlinks-web/core";
import {randomString} from "@jetlinks-web/utils";
import {useLocales} from '@hooks'

const {$lang} = useLocales('iec104')
const dataTypeList = ref([]);
const formData = inject("plugin-form");
if (!("configuration" in formData)) {
  formData.configuration = {
    typeIdentifierName: undefined,
    pointAddress: undefined,
    accessModes: undefined,
  };
}

if (!("pointKey" in formData)) {
  formData.pointKey = randomString(9);
}

const getDataType = async () => {
  const res = await request.post("/data-collect/iec104/command/QueryTypes", {});
  if (res.success) {
    dataTypeList.value = res.result.map((i) => {
      return {
        label: i.name,
        value: i.key,
      };
    });
  }
};
getDataType();
</script>
<style lang="less" scoped></style>
