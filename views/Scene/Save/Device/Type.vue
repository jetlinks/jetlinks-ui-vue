<template>
  <div class="type">
    <div class="alert">
      <AIcon type="InfoCircleOutlined" />
      <span style="padding-left: 10px">{{ $t('Device.Type.372529-0') }}</span>
    </div>
    <a-form ref="typeForm" :model="formModel" layout="vertical" :colon="false">
      <a-form-item required :label="$t('Device.Type.372529-1')">
        <TopCard
          :label-bottom="true"
          :options="topOptions"
          v-model:value="formModel.operator"
        />
      </a-form-item>
      <template v-if="showTimer">
        <Timer ref="timerRef" v-model:value="formModel.timer" />
      </template>
      <ReadProperties
        v-if="showReadProperty"
        v-model:value="formModel.readProperties"
        v-model:action="optionCache.action"
        :properties="readProperties"
      />
      <WriteProperty
        ref="writeRef"
        v-if="showWriteProperty"
        v-model:value="formModel.writeProperties"
        v-model:action="optionCache.action"
        :properties="writeProperties"
      />
      <a-form-item
        v-if="showReportEvent"
        name="eventId"
        :rules="[{ required: true, message: $t('Device.Type.372529-2') }]"
      >
        <a-select
          v-model:value="formModel.eventId"
          :filter-option="filterSelectNode"
          :options="eventOptions"
          :placeholder="$t('Device.Type.372529-2')"
          style="width: 100%"
          @select="eventSelect"
        />
      </a-form-item>
      <template v-if="showInvokeFunction">
        <InvokeFunction
          ref="invokeRef"
          v-model:functionId="formModel.functionId"
          v-model:functionParameters="formModel.functionParameters"
          v-model:action="optionCache.action"
          :functions="functionOptions"
        />
      </template>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { filterSelectNode } from "../../../../utils/comm";
import { TopCard, Timer } from "../components";
import type { metadataType, TriggerDeviceOptions } from "../../typings";
import type { PropType } from "vue";
import { TypeEnum } from "./util";
import ReadProperties from "./ReadProperties.vue";
import WriteProperty from "./WriteProperty.vue";
import InvokeFunction from "./InvokeFunction.vue";
import { defineExpose } from "vue";
import { cloneDeep, omit } from "lodash-es";
import { sceneImages } from "../../../../assets/index";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
  metadata: {
    type: Object as PropType<metadataType>,
    default: () => ({}),
  },
  operator: {
    type: Object as PropType<TriggerDeviceOptions>,
    default: () => ({}),
  },
  options: {
    type: Object,
    default: () => ({})
  }
});

const formModel = reactive({
  operator: "online",
  timer: {},
  readProperties: [],
  writeProperties: {},
  eventId: undefined,
  functionId: undefined,
  functionParameters: [],
});

Object.assign(formModel, props.operator);

const optionCache = reactive({
  action: props.options?.action || "",
});

const readProperties = ref<any[]>([]);
const writeProperties = ref<any[]>([]);
const eventOptions = ref<any[]>([]);
const functionOptions = ref<any[]>([]);

const typeForm = ref();
const timerRef = ref();
const writeRef = ref();
const invokeRef = ref();

const topOptions = computed(() => {
  const cloneTypeEnum = cloneDeep(TypeEnum);
  const baseOptions = [
    {
      label: $t('Device.Type.372529-3'),
      value: "online",
      img: sceneImages.online,
    },
    {
      label: $t('Device.Type.372529-4'),
      value: "offline",
      img: sceneImages.offline,
    },
    cloneTypeEnum.reportEvent,
    cloneTypeEnum.readProperty,
    cloneTypeEnum.writeProperty,
    cloneTypeEnum.reportProperty,
    cloneTypeEnum.invokeFunction,
  ];

  if (!props.metadata) return baseOptions;

  if (props.metadata.events?.length) {
    // baseOptions.push(TypeEnum.reportEvent)
    cloneTypeEnum.reportEvent.disabled = false;
    eventOptions.value = props.metadata.events.map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
  }

  if (props.metadata.properties?.length) {
    const _properties = props.metadata.properties;
    readProperties.value = _properties
      .filter((item: any) => item.expands?.type?.includes("read"))
      .map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }));
    writeProperties.value = _properties
      .filter((item: any) => item.expands?.type?.includes("write"))
      .map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }));
    // 兼容上传的设备物模型没有type时，type值默认为上报
    const reportProperties = _properties
      .filter(
        (item: any) =>
          item.expands?.type?.includes("report") || !item.expands?.type
      )
      .map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }));

    if (readProperties.value.length) {
      // baseOptions.push(TypeEnum.readProperty)
      cloneTypeEnum.readProperty.disabled = false;
    }

    if (writeProperties.value.length) {
      // baseOptions.push(TypeEnum.writeProperty)
      cloneTypeEnum.writeProperty.disabled = false;
    }

    if (reportProperties.length) {
      // baseOptions.push(TypeEnum.reportProperty)
      cloneTypeEnum.reportProperty.disabled = false;
    }
  }

  if (props.metadata.functions?.length) {
    cloneTypeEnum.invokeFunction.disabled = false;
    // baseOptions.push(TypeEnum.invokeFunction)
    functionOptions.value = props.metadata.functions.map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }));
  }

  return baseOptions;
});

const showReadProperty = computed(() => {
  return formModel.operator === TypeEnum.readProperty.value;
});

const showWriteProperty = computed(() => {
  return formModel.operator === TypeEnum.writeProperty.value;
});

const showReportEvent = computed(() => {
  return formModel.operator === TypeEnum.reportEvent.value;
});

const showInvokeFunction = computed(() => {
  return formModel.operator === TypeEnum.invokeFunction.value;
});

const showTimer = computed(() => {
  return [
    TypeEnum.readProperty.value,
    TypeEnum.writeProperty.value,
    TypeEnum.invokeFunction.value,
  ].includes(formModel.operator);
});

const eventSelect = (_: string, eventItem: any) => {
  optionCache.action = $t('Device.Type.372529-5', [eventItem.name]);
};

defineExpose({
  vail: () => {
    return new Promise(async (resolve, reject) => {
      const cloneModel = cloneDeep(formModel);

      const filterKey: string[] = [];
      const typeData = await typeForm.value?.validateFields();

      if (!typeData) return resolve(false);

      if (!showReadProperty.value) {
        filterKey.push("readProperties");
      }

      if (showInvokeFunction.value) {
        const invokeData = await invokeRef.value?.validateFields();
        if (!invokeData) {
          return resolve(false);
        } else {
          cloneModel.functionParameters = invokeData.functionData
        }
      } else {
        filterKey.push("functionId");
        filterKey.push("functionParameters");
      }

      if (showTimer.value) {
        const timerData = await timerRef.value?.validateFields();
        if (!timerData) return resolve(false);
      } else {
        filterKey.push("timer");
      }

      if (!showReportEvent.value) {
        filterKey.push("eventId");
      }
      if (showWriteProperty.value) {
        const writeData = await writeRef.value?.validateFields();
        if (!writeData) {
          return resolve(false);
        } else {
          cloneModel.writeProperties = writeData.data
        }
      } else {
        filterKey.push("writeProperties");
      }

      resolve({
        data: omit(cloneModel, filterKey),
        action: optionCache.action,
      });
    });
  },
});
watch(() => formModel.operator, (newVal, oldVal) => {
  typeForm.value?.resetFields();
  if(newVal === 'readProperty') {
    formModel.writeProperties = {}
  } else if(newVal === 'writeProperty') {
    formModel.readProperties = []
  }
})
</script>

<style scoped lang="less">
.type {
  margin-top: 24px;

  .alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
  }
}
</style>
