<template>
  <a-form-item
    label="主机IP"
    :name="['configuration', 'host']"
    :rules="rules.host"
  >
    <a-input
      v-model:value="formData.configuration.host"
      placeholder="请输入主机IP"
    ></a-input>
  </a-form-item>
  <a-form-item
    label="端口"
    :name="['configuration', 'port']"
    :rules="rules.port"
  >
    <a-input-number
      v-model:value="formData.configuration.port"
      style="width: 100%"
      placeholder="请输入端口"
      :min="0"
      :max="65535"
      :precision="0"
    />
  </a-form-item>
  <a-form-item
    label="帧(数据通信报文)类型"
    :name="['configuration', 'frameType']"
    :rules="rules.frameType"
  >
    <a-select
      :options="frameTypeOptions"
      v-model:value="formData.configuration.frameType"
      placeholder="请选择帧类型"
    />
  </a-form-item>
</template>

<script setup>
import { inject, ref } from "vue";
import { request } from "@jetlinks-web/core";
const formData = inject("plugin-form");
if (!("configuration" in formData)) {
  formData.configuration = {
    host: undefined,
    port: undefined,
    frameType: undefined,
  };
}

/** 帧类型查询 */
const frameTypeOptions = ref([]);

const regular = {
  // IP地址
  IP_URL:
    /^((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))(\.((2((5[0-5])|([0-4]\d)))|([0-1]?\d{1,2}))){3}$/,
};

const validatorHost = (rule, value) => {
  const reg = regular.IP_URL;
  if (value === undefined || value === "" || value === null) {
    return Promise.reject("请输入主机IP");
  } else {
    if (reg.test(value) === false) {
      return Promise.reject("请输入正确的IP地址");
    }
    return Promise.resolve();
  }
};

const rules = {
  host: [
    {
      required: true,
      trigger: "blur",
      validator: validatorHost,
    },
  ],
  port: [
    {
      required: true,
      trigger: "blur",
      message: "请输入端口",
    },
  ],
  frameType: [
    {
      required: true,
      trigger: "change",
      message: "请选择帧类型",
    },
  ],
};

const frameType = async () => {
  const res = await request.post("/data-collect/MELSEC_TCP/command/GetFrameType",{});
  if (res.success) {
    frameTypeOptions.value = res.result?.map((item) => {
      return {
        label: item.name,
        value: item.ID,
      };
    });
  }
};
frameType();
</script>
<style lang="less" scoped></style>
