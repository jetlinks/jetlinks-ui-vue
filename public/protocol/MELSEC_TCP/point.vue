<template>
  <a-form-item
    :label="$lang('MELSEC_TCP.point.20250207-1')"
    :name="['configuration', 'registerType']"
    :rules="[
    { required: true, message: $lang('MELSEC_TCP.point.20250207-2')},
  ]"
  >
    <a-select
      v-model:value="formData.configuration.registerType"
      :options="registerTypeOptions"
      :placeholder="$lang('MELSEC_TCP.point.20250207-2')"
      :fieldNames="{ label: 'name', value: 'ID' }"
      @change="handleChangeRegisterType"
    ></a-select>
  </a-form-item>
  <a-form-item
    :label="$lang('MELSEC_TCP.point.20250207-3')"
    :name="['configuration', 'type']"
    :rules="[{ required: true, message: $lang('MELSEC_TCP.point.20250207-4')}]"
  >
    <a-select
      v-model:value="formData.configuration.type"
      @change="handleChangeDataType"
      :placeholder="$lang('MELSEC_TCP.point.20250207-4')"
    >
      <a-select-option
        v-for="item in dataTypeOptions"
        :value="item.ID"
        :key="item.ID"
        >{{ item.name }}({{ item.ID }})</a-select-option
      >
    </a-select>
  </a-form-item>
  <a-form-item
    :label="$lang('MELSEC_TCP.point.20250207-5')"
    :name="['configuration', 'quantity']"
    :rules="[{ required: true, message: $lang('MELSEC_TCP.point.20250207-14'), trigger: 'blur'}]"
    v-if="formData.configuration.type === 'Hex'"
  >
    <a-input-number
      v-model:value="formData.configuration.quantity"
      :placeholder="$lang('MELSEC_TCP.point.20250207-6')"
      :min="1"
      :max="960"
    />
  </a-form-item>
  <a-form-item
    :label="$lang('MELSEC_TCP.point.20250207-7')"
    :name="['configuration', 'address']"
    :rules="[{ required: true, message: $lang('MELSEC_TCP.point.20250207-15'), trigger: 'blur' }]"
  >
    <a-input-number
      v-model:value="formData.configuration.address"
      style="width: 100%"
      :precision="0"
      :min="0"
      :max="65535"
      :placeholder="$lang('MELSEC_TCP.point.20250207-8')"
    />
  </a-form-item>
  <a-form-item :label="$lang('MELSEC_TCP.point.20250207-9')" name="bits" v-if="showBits">
    <a-input-number
      v-model:value="formData.configuration.bits"
      :placeholder="$lang('MELSEC_TCP.point.20250207-10')"
      :min="0"
      :max="16"
    />
  </a-form-item>
  <a-form-item :label="$lang('MELSEC_TCP.point.20250207-11')" name="accessModes" :rules="[{ required: true, message: $lang('MELSEC_TCP.point.20250207-16'), trigger: 'blur' }]">
    <j-check-button
      multiple
      v-model:value="formData.accessModes"
      :options="[
        { label: $lang('MELSEC_TCP.point.20250207-12'), value: 'read' },
        { label: $lang('MELSEC_TCP.point.20250207-13'), value: 'write' },
      ]"
      :column="3"
    />
  </a-form-item>
</template>

<script setup>
import { request } from "@jetlinks-web/core";
import { omit } from "lodash-es";
import { inject, ref, computed, watch } from "vue";
import {useLocales} from '@hooks'

const {$lang} = useLocales('MELSEC_TCP')
const formData = inject("plugin-form");
const registerTypeOptions = ref([]);
const dataTypeList = ref([]);

const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
if (!("configuration" in formData)) {
  formData.configuration = {
    registerType: undefined,
    type: undefined,
    quantity: undefined,
    address: undefined,
    bits: 0,
  };
}

if (!("pointKey" in formData)) {
  formData.pointKey = generateUUID();
}

const isBitRegister = computed(() => {
  return registerTypeOptions.value.find(
    (item) => item.ID === formData.configuration.registerType
  )?.isBitRegister;
});

const showBits = computed(() => {
  return !isBitRegister.value && formData.configuration.type === "Bool";
});

const dataTypeOptions = computed(() => {
  if (isBitRegister.value) {
    return dataTypeList.value.filter((item) => {
      if (isBitRegister.value && item.ID === "Bool") {
        return item;
      }
    });
  } else {
    return dataTypeList.value;
  }
});

/** 获取数据类型、寄存器类型 */
const getOptions = async () => {
  const res1 = await request.post(
    "/data-collect/MELSEC_TCP/command/GetDataType",
    {}
  );
  if (res1.success) {
    dataTypeList.value = res1.result;
  }

  const res2 = await request.post(
    "/data-collect/MELSEC_TCP/command/GetRegister",
    {}
  );
  if (res2.success) {
    registerTypeOptions.value = res2.result;
  }
};

getOptions();

/**change数据类型 */
const handleChangeDataType = (val) => {
  const result = dataTypeList.value.find((item) => item.ID === val);
  formData.configuration.quantity = result?.quantity;
};

const handleChangeRegisterType = (val) => {
  formData.configuration.type = undefined;
};

watch(
  () => showBits.value,
  (val) => {
    val
      ? (formData.configuration.bits = 0)
      : (formData.configuration = omit(formData.configuration, ["bits"]));
  }
);
</script>

<style lang="less" scoped></style>
