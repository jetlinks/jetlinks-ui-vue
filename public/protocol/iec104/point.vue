<template>
  <a-form-item
    label="类型标识"
    :name="['configuration', 'typeIdentifierName']"
    :rules="rules.typeIdentifierName"
  >
    <a-select
      v-model:value="formData.configuration.typeIdentifierName"
      :options="dataTypeList"
      placeholder="请选择类型标识"
      allowClear
      show-search
    />
  </a-form-item>
  <a-form-item
    label="地址"
    :name="['configuration', 'pointAddress']"
    :rules="rules.pointAddress"
  >
    <a-input
      v-model:value="formData.configuration.pointAddress"
      placeholder="请输入地址"
      :min="1"
      :max="65535"
      :precision="0"
    />
  </a-form-item>
  <a-form-item label="访问类型" name="accessModes" :rules="rules.accessModes">
    <j-check-button
      multiple
      v-model:value="formData.accessModes"
      :options="[
        { label: '读', value: 'read' },
        { label: '写', value: 'write' },
        { label: '订阅', value: 'subscribe' },
      ]"
      :column="3"
    />
  </a-form-item>
</template>

<script setup>
import { inject, onMounted, ref } from "vue";
import { request } from "@jetlinks-web/core";
import { randomString } from "@jetlinks-web/utils";
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

const rules = {
  typeIdentifierName: [
    {
      required: true,
      message: "请输入类型标识",
      trigger: "change",
    },
  ],
  pointAddress: [
    {
      required: true,
      message: "请输入地址",
      trigger: "blur",
    },
  ],
  accessModes: [
    {
      required: true,
      message: "请选择访问类型",
      trigger: "change",
    },
  ],
};

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
