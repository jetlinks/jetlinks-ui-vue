<template>
  <div
      style="display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px"
  >
    <a-radio-group
        v-if="quickBtn && isShowTime"
        default-value="today"
        button-style="solid"
        v-model:value="radioValue"
        @change="(e) => handleBtnChange(e.target.value)"
    >
      <a-radio-button
          v-for="item in quickBtnList"
          :key="item.value"
          :value="item.value"
      >
        {{ item.label }}
      </a-radio-button>
    </a-radio-group>
    <a-range-picker
        format="YYYY-MM-DD HH:mm:ss"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        :show-time="{ format: 'HH:mm:ss' }"
        style="margin-left: 12px"
        @change="rangeChange"
        v-model:value="rangeVal"
        :allowClear="false"
    >
      <template #renderExtraFooter>
        <a-radio-group
            v-if="!isShowTime"
            default-value="today"
            button-style="solid"
            v-model:value="radioValue"
            @change="(e) => handleBtnChange(e.target.value)"
        >
          <a-radio-button
              v-for="item in quickBtnList"
              :key="item.value"
              :value="item.value"
          >
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </template>
    </a-range-picker>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { PropType } from "vue";

interface BtnOptions {
  label: string;
  value: string;
}

interface EmitProps {
  (e: "change", data: Record<string, any>): void;
}

const emit = defineEmits<EmitProps>();

const props = defineProps({
  // 显示快捷按钮
  quickBtn: {
    type: Boolean,
    default: true,
  },
  // 快捷按钮列表
  quickBtnList: {
    type: Array as PropType<BtnOptions[]>,
    default: [
      { label: "今日", value: "today" },
      { label: "近一周", value: "week" },
      { label: "近一月", value: "month" },
      { label: "近一年", value: "year" },
    ],
  },
  type: {
    type: String,
    default: "today",
  },
  isTimer: {
    type: Boolean,
    default: undefined,
  },
  isShowTime: {
    type: Boolean,
    default: true,
  },
});

const radioValue = ref(props.type || "week" || undefined);
const rangeVal = ref<[string, string]>([
  dayjs().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().format('YYYY-MM-DD HH:mm:ss')
]);

const rangeChange = (val: any) => {
  radioValue.value = undefined;
  const differenceTime = dayjs(val[1]).valueOf() - dayjs(val[0]).valueOf();
  emit("change", {
    start: dayjs(val[0]).valueOf(),
    end: dayjs(val[1]).valueOf(),
    type: differenceTime > 24 * 60 * 60 * 1000 ? undefined : "day",
  });
};

const getTimeByType = (type?: string) => {
  switch (type) {
    case "hour":
      return dayjs().subtract(1, "hours").valueOf();
    case "week":
      return dayjs().subtract(6, "days").valueOf();
    case "month":
      return dayjs().subtract(29, "days").valueOf();
    case "year":
      return dayjs().subtract(365, "days").valueOf();
    default:
      return dayjs().startOf("day").valueOf();
  }
};

const handleBtnChange = (val?: string) => {
  let endTime = dayjs(new Date()).valueOf();
  let startTime = getTimeByType(val);
  if (val === "yesterday") {
    startTime = dayjs().subtract(1, "days").startOf("day").valueOf();
    endTime = dayjs().subtract(1, "days").endOf("day").valueOf();
  }
  rangeVal.value = [
    dayjs(startTime).format("YYYY-MM-DD HH:mm:ss"),
    dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
  ];
  // console.log(startTime, endTime)
  emit("change", {
    start: startTime,
    end: endTime,
    type: val,
  });
};

watch(
    () => props.isTimer,
    () => {
      nextTick(() => {
        handleBtnChange(radioValue.value);
      });
    },
);

onMounted(() => {
  handleBtnChange(radioValue.value)
})
</script>
