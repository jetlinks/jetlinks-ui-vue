<template>
  <a-form-item
    label="寄存器类型"
    :name="['configuration', 'registerType']"
    :rules="rules.registerType"
  >
    <a-select
      v-model:value="formData.configuration.registerType"
      :options="registerTypeOptions"
      placeholder="请选择寄存器类型"
      :fieldNames="{ label: 'name', value: 'ID' }"
      @change="handleChangeRegisterType"
    ></a-select>
  </a-form-item>
  <a-form-item
    label="数据类型"
    :name="['configuration', 'type']"
    :rules="rules.type"
  >
    <a-select
      v-model:value="formData.configuration.type"
      @change="handleChangeDataType"
      placeholder="请选择数据类型"
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
    label="寄存器数量(word)"
    :name="['configuration', 'quantity']"
    :rules="rules.quantity"
    v-if="formData.configuration.type === 'Hex'"
  >
    <a-input-number
      v-model:value="formData.configuration.quantity"
      placeholder="请输入寄存器数量"
      :min="1"
      :max="960"
    />
  </a-form-item>
  <a-form-item
    label="寄存器地址"
    :name="['configuration', 'address']"
    :rules="rules.address"
  >
    <a-input-number
      v-model:value="formData.configuration.address"
      style="width: 100%"
      :precision="0"
      :min="0"
      :max="65535"
      placeholder="请输入寄存器地址"
    />
  </a-form-item>
  <a-form-item label="位号" name="bits" v-if="showBits">
    <a-input-number
      v-model:value="formData.configuration.bits"
      placeholder="请输入位号"
      :min="0"
      :max="16"
    />
  </a-form-item>
  <a-form-item label="访问类型" name="accessModes" :rules="rules.accessModes">
    <j-check-button
      multiple
      v-model:value="formData.accessModes"
      :options="[
        { label: '读', value: 'read' },
        { label: '写', value: 'write' },
      ]"
      :column="3"
    />
  </a-form-item>
</template>

<script setup>
import { request } from "@jetlinks-web/core";
import { omit } from "lodash-es";
import { inject, ref, computed, watch } from "vue";
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

const rules = {
  type: [{ required: true, message: "请选择数据类型", trigger: "change" }],
  registerType: [
    { required: true, message: "请选择寄存器", trigger: "change" },
  ],
  quantity: [{ required: true, message: "请输入数量", trigger: "blur" }],
  address: [{ required: true, message: "请输入地址", trigger: "blur" }],
};

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
