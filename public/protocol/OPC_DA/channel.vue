<template>
  <a-form-item
    :label="$lang('OPC_DA.channel.20250207-1')"
    :name="['configuration', 'host']"
    :rules="[
      { required: true, message: $lang('OPC_DA.channel.20250207-2') },
      {
        trigger: 'blur',
        validator: validateUrl,
        message: $lang('OPC_DA.channel.20250207-3'),
      },
    ]"
  >
    <a-input
      v-model:value="formData.configuration.host"
      :placeholder="$lang('OPC_DA.channel.20250207-2')"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('OPC_DA.channel.20250207-4')"
    :name="['configuration', 'username']"
    :rules="[{ required: true, message: $lang('OPC_DA.channel.20250207-5') }]"
  >
    <a-input
      v-model:value="formData.configuration.username"
      :maxlength="64"
      autocomplete="off"
      style="width: 100%"
      :placeholder="$lang('OPC_DA.channel.20250207-5')"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('OPC_DA.channel.20250207-6')"
    :name="['configuration', 'password']"
    :rules="[{ required: true, message: $lang('OPC_DA.channel.20250207-7') }]"
  >
    <a-input
      v-model:value="formData.configuration.password"
      :maxlength="64"
      autocomplete="off"
      style="width: 100%"
      :placeholder="$lang('OPC_DA.channel.20250207-7')"
    />
  </a-form-item>
</template>

<script setup>
import { inject } from "vue";
import { testIpv4_6 } from "local-utils";
import { useLocales } from "@hooks";

const { $lang } = useLocales("OPC_DA");
const formData = inject("plugin-form", {
  configuration: {},
});

const validateUrl = async (_rule, value) => {
  if (!value) {
    return Promise.resolve();
  } else {
    if (!testIpv4_6(value)) {
      return Promise.reject($lang("OPC_DA.channel.20250207-3"));
    }
    return Promise.resolve();
  }
};
</script>

<style scoped></style>
