<template>
  <a-form-item
    label="地址"
    :name="['pointKey']"
    validateFirst
    :rules="{
      required: true,
      trigger: 'blur',
      message: '请输入正确的地址',
    }"
  >
    <a-input
      v-model:value="formData.pointKey"
      placeholder="请输入地址"
      :maxlength="64"
    />
  </a-form-item>
  <a-form-item label="数据类型" :name="['configuration', 'type']" :rules="rules.type">
    <a-select
      v-model:value="formData.configuration.type"
      show-search
      placeholder="请选择数据类型"
    >
      <a-select-option
        v-for="item in opcuaDataTypeList"
        :key="item"
        :value="item"
        >{{ item }}</a-select-option
      >
    </a-select>
  </a-form-item>
  <a-form-item label="访问类型" name="accessModes" :rules="rules.accessModes">
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
import { inject, ref } from "vue";
import { request } from "@jetlinks-web/core";

const formData = inject("plugin-form");
const opcuaDataTypeList = ref([]);

const rules = {
  type: [
    {
      required: true,
      message: "请选择数据类型",
    },
  ],
  accessModes: [
    {
      required: true,
      message: "请选择访问类型",
    },
  ],
};

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
