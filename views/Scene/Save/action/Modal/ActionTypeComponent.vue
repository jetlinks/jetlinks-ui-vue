<template>
  <div>
      <Device
        v-if="actionType === 'device'"
        v-bind="props"
        :value="data?.device"
        :options="options"
        @cancel="onCancel"
        @save="onPropsOk"
      />
    <DeviceData
        v-else-if="actionType === 'device-data'"
        v-bind="props"
        :value="data?.configuration"
        :options="options"
        @cancel="onCancel"
        @save="onPropsOk"
      />
    <Notify
      v-else-if="actionType === 'notify'"
      :options="data?.options"
      :value="data?.notify"
      :name="name"
      :thenName="thenName"
      :branchesName="branchesName"
      @cancel="onCancel"
      @save="onPropsOk"
    />
    <Delay
      v-else-if="actionType === 'delay'"
      :value="data?.delay"
      @cancel="onCancel"
      @save="onPropsOk"
    />
    <Collector
      v-else-if="actionType === 'collector'"
      v-bind="props"
      :options="data?.options"
      :value="data?.collector"
      @cancel="onCancel"
      @save="onPropsOk"
    />
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { ActionsType } from "../../../typings";
import Delay from "../Delay/index.vue";
import Notify from "../Notify/index.vue";
import Device from "../Device/index.vue";
import Collector from "../Collector/index.vue";
import DeviceData from '../DeviceData/index.vue'
import { randomNumber } from "@jetlinks-web/utils";

const props = defineProps({
  branchesName: {
    type: Number,
    default: 0,
  },
  thenName: {
    type: Number,
    default: 0,
  },
  name: {
    type: Number,
    default: 0,
  },
  data: {
    type: Object as PropType<ActionsType>,
  },
  parallel: {
    type: Boolean,
  },
  actionType: {
    type: String,
    default: "",
  },
  options: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["cancel", "save"]);

const onCancel = () => {
  emit("cancel");
};

const onPropsOk = (data: any, options: any) => {

  const key = props.actionType === 'device-data' ? 'configuration' : props.actionType

  const _data = {
    type: props.actionType,
    executor: props.actionType,
    key: props?.data?.key || `${props.actionType}_${new Date().getTime()}`,
    actionId: props?.data?.actionId || randomNumber(),
    [key]: {
      ...data,
    },
  };
  emit("save", { ..._data }, options);
};
</script>
