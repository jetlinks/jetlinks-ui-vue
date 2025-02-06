<template>
  <a-form-item
    label="clsId"
    :name="['configuration', 'clsId']"
    :rules="{
      required: true,
      trigger: 'blur',
    }"
  >
    <a-auto-complete
      v-model:value="formData.configuration.clsId"
      :options="clsIdOptions"
      placeholder="请输入clsId"
    >
      <template #option="item">
        <span> {{ item.value }}({{ item.label }}) </span>
      </template>
    </a-auto-complete>
    <template #extra>
      <span>应用在windows上的程序id</span>
    </template>
  </a-form-item>
</template>

<script setup>
import { inject, ref } from "vue";
import { request } from "@jetlinks-web/core";
const formData = inject("plugin-form", {
  configuration: {},
});

const clsIdOptions = ref([]);
const getList = () => {
  request
    .post("/data-collect/OPC_DA/command/BrowseItemIds", {
      collectorId: formData?.collectorId || "",
    })
    .then((resp) => {
      if (resp.success) {
        clsIdOptions.value = (resp.result || []).map((i) => {
          return {
            value: item.clsId,
            label: item.description,
          };
        });
      }
    });
};

getList();
</script>

<style scoped></style>
