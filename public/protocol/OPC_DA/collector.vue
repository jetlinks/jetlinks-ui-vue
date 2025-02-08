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
      :placeholder="$lang('OPC_DA.collector.20250207-1')"
    >
      <template #option="item">
        <span> {{ item.value }}({{ item.label }}) </span>
      </template>
    </a-auto-complete>
    <template #extra>
      <span>{{ $lang('OPC_DA.collector.20250207-2') }}</span>
    </template>
  </a-form-item>
</template>

<script setup>
import { inject, ref } from "vue";
import { request } from "@jetlinks-web/core";
import {useLocales} from '@hooks'

const {$lang} = useLocales('OPC_DA')
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
