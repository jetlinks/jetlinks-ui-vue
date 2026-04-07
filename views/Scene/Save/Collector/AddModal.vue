<template>
  <a-modal
    :title="$t('Device.index.372524-0')"
    open
    :width="950"
    @ok="save"
    @cancel="cancel"
    :maskClosable="false"
  >
    <div class="body_height_60">
      <a-steps :current="addModel.stepNumber" @change="stepChange">
        <a-step>
          <template #title>{{
            $t("Collector.actions.index-6100078-7")
          }}</template>
        </a-step>
        <a-step>
          <template #title>{{
            $t("Collector.actions.index-6100078-8")
          }}</template>
        </a-step>
        <a-step>
          <template #title>{{ $t("Device.AddModal.3725211-3") }}</template>
        </a-step>
      </a-steps>
      <div class="steps-content">
        <Channel
          v-if="addModel.stepNumber === 0"
          v-model:rowKey="addModel.pointSelectInfo.channelId"
          v-model:detail="addModel.channelDetail"
          @change="channelChange"
        />
        <Collector
          v-if="addModel.stepNumber === 1"
          :channelId="addModel.pointSelectInfo.channelId"
          v-model:rowKey="addModel.pointSelectInfo.collectorId"
          v-model:collectorName="addModel.pointSelectInfo.collectorName"
          v-model:detail="addModel.collectorDetail"
          @change="collectorChange"
        />
        <Type
          ref="typeRef"
          v-else-if="addModel.stepNumber === 2"
          :operator="addModel.operator"
          :collectorConfig="omit(addModel, ['operator'])"
          :collectorId="addModel.pointSelectInfo?.collectorId"
          :pointList="pointList"
        />
      </div>
    </div>
    <template #footer>
      <div class="steps-action">
        <a-button v-if="addModel.stepNumber === 0" @click="cancel">{{
          $t("Save.index.551009-1")
        }}</a-button>
        <a-button v-else @click="prev">{{
          $t("DeviceAccess.index.551011-21")
        }}</a-button>
        <a-button
          type="primary"
          v-if="addModel.stepNumber < 2"
          @click="saveClick"
          >{{ $t("DeviceAccess.index.551011-20") }}</a-button
        >
        <a-button type="primary" v-else @click="saveClick">{{
          $t("Save.index.551009-0")
        }}</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts" name="AddModel">
import type { PropType } from "vue";
import type { TriggerCollector, metadataType } from "../../typings";
import { onlyMessage } from "@jetlinks-web/utils";
import { detail as deviceDetail } from "@rule-engine-manager-ui/api/instance";
import Channel from "./Channel.vue";
import Collector from "./Collector.vue";
import Type from "./Type.vue";
import { handleTimerOptions } from "../components/Timer/util";
import { Form } from "ant-design-vue";
import { queryPointNoPagingV2 } from "@rule-engine-manager-ui/api/collector";
import { useI18n } from "vue-i18n";
import { cloneDeep, omit } from "lodash-es";

type Emit = {
  (e: "cancel"): void;
  (e: "change", data: TriggerCollector): void;
  (e: "save", data: TriggerCollector, options: Record<string, any>): void;
};

interface AddModelType extends TriggerCollector {
  channelDetail: any;
  collectorDetail: any;
  stepNumber: number;
  metadata: metadataType;
  operator: string;
}

const formItemContext = Form.useInjectFormItemContext();

const { t: $t } = useI18n();
const emit = defineEmits<Emit>();
const typeRef = ref();

const props = defineProps({
  value: {
    type: Object as PropType<TriggerCollector>,
    default: () => ({
      productId: "",
      selector: "fixed",
      selectorValues: [],
    }),
  },
  options: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
});

const addModel = reactive<AddModelType>({
  channelDetail: {},
  collectorDetail: props.value?.collectorDetail || {
    id: props.value?.pointSelectInfo?.collectorId,
    name: props.value?.pointSelectInfo?.collectorName,
  },
  pointSelectInfo: {
    channelId: props.options?.channelId || "",
    collectorId: props.value?.pointSelectInfo?.collectorId || "",
    collectorName: props.value?.pointSelectInfo?.collectorName || "",
    pointIds: props.value?.pointSelectInfo?.pointIds || [],
  },
  stepNumber: 0,
  metadata: {},
  collectorConfig: props.value?.collectorConfig || {},
  operator: props.value.operator || "readPoints",
  timer: props.value.timer,
});

const optionsCache = ref(cloneDeep(props.options));
const pointList = ref<Record<string, any>[]>([]);

const handleOptions = (data: TriggerCollector) => {
  const typeIconMap = {
    write: "icon-bianji1",
    sub: "icon-shijian",
    read: "icon-Group",
  };

  const _options: any = {
    name: "", // 名称
    extraName: "", // 拓展参数
    onlyName: false,
    type: "", // 触发类型
    typeIcon: typeIconMap[data.operator],
    selectorIcon: "icon-shebei1",
    time: undefined,
    when: undefined,
    extraTime: undefined,
    action: optionsCache.value?.action,
    pointsName: "",
    channelId: addModel.pointSelectInfo.channelId,
  };
  _options.name = addModel.collectorDetail?.name;
  if (data.operator === "sub") {
    _options.action = $t("Collector.actions.index-6100078-9");
  }

  if (data.timer) {
    const _timer = data.timer;
    const { time, extraTime, when } = handleTimerOptions(_timer);
    _options.when = when;
    _options.time = time;
    _options.extraTime = extraTime;
  }

  if (data.operator === "reportProperty") {
    _options.type = $t("Device.AddModal.3725211-13");
    _options.action = "";
    _options.typeIcon = "icon-file-upload-outline";
  }
  return _options;
};

const prev = () => {
  addModel.stepNumber = addModel.stepNumber - 1;
};

const cancel = () => {
  emit("cancel");
};

const handleMetadata = (metadata?: string) => {
  try {
    addModel.metadata = JSON.parse(metadata || "{}");
  } catch (e) {
    console.warn("handleMetadata: " + e);
  }
};

const channelChange = () => {
  addModel.operator = {
    operator: "read",
  };
  addModel.pointSelectInfo = {
    channelId: addModel.pointSelectInfo.channelId,
    collectorId: "",
    pointIds: [],
  };
};

const collectorChange = (e) => {
  addModel.pointSelectInfo.pointIds = [];
};

const getDeviceDetailByMetadata = async (deviceId: string) => {
  const resp = await deviceDetail(deviceId);
  return resp.result?.metadata;
};

const save = async (step?: number) => {
  let _step = step !== undefined ? step : addModel.stepNumber;
  if (_step === 0) {
    addModel.pointSelectInfo.channelId
      ? (addModel.stepNumber = 1)
      : onlyMessage($t("Collector.actions.index-6100078-10"), "error");
  } else if (_step === 1) {
    // 选择方式为设备且仅选中一个设备时，物模型取该设备
    addModel.pointSelectInfo.collectorId
      ? (addModel.stepNumber = 2)
      : onlyMessage($t("Collector.actions.index-6100078-11"), "error");
    const res = await queryPointNoPagingV2({
      terms: [
        {
          column: "collectorId",
          value: addModel.pointSelectInfo.collectorId,
        },
      ],
    });
    if (res.success) {
      pointList.value = res.result;
    }
  } else {
    const typeData = await typeRef.value.vail();
    if (typeData) {
      optionsCache.value.action = typeData.action
        ? typeData.action
        : optionsCache.value.action;
      const _options = handleOptions(typeData.data);
      const data =
        typeData.data.operator !== "sub"
          ? {
              ...typeData.data,
              collectorConfig: {
                handlerType: typeData.data.operator,
                source: "fixed",
                pointSelectInfos: [
                  {
                    collectorId: addModel.pointSelectInfo.collectorId,
                    collectorName: addModel.pointSelectInfo.collectorName,
                    pointIds:
                      typeData.data.readPoints ||
                      Object.keys(typeData.data?.writePoints) ||
                      [],
                  },
                ],
                value:
                  typeData.data?.writePoints?.[
                    Object.keys(typeData.data?.writePoints || {})?.[0]
                  ] || "",
              },
              pointSelectInfo: {
                collectorId: addModel.pointSelectInfo.collectorId,
                collectorName: addModel.pointSelectInfo.collectorName,
                pointIds:
                  typeData.data.readPoints ||
                  Object.keys(typeData.data?.writePoints) ||
                  [],
              },
            }
          : {
              ...typeData.data,
              pointSelectInfo: {
                collectorId: addModel.pointSelectInfo.collectorId,
                collectorName: addModel.pointSelectInfo.collectorName,
                pointIds: pointList.value.map((item) => item.id),
              },
            };
      emit("save", data, _options);
      formItemContext.onFieldChange();
    }
  }
};

const saveClick = () => save();

const stepChange = (step: number) => {
  if (step !== 0) {
    save(step - 1);
  } else {
    addModel.stepNumber = 0;
  }
};

const initQuery = async () => {
  if (props.value.selector === "fixed" && props.value.selectorValues?.length) {
    handleMetadata(
      await getDeviceDetailByMetadata(props.value.selectorValues[0].value),
    );
  }
};

nextTick(() => {
  initQuery();
});
</script>

<style scoped>
.steps-content {
  width: 100%;
  height: calc(100% - 35px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
