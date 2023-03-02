<template>
    <div class="shakeLimit">
        <a-switch
            checkedChildren="开启防抖"
            unCheckedChildren="关闭防抖"
            v-model:checked="shakeLimit.enabled"
            style="margin-right: 12px"
        />
        <template v-if="shakeLimit.enabled">
            <a-input-number :min="1" :max="100" :precision="0" size="small" v-model:value="shakeLimit.time" style="width: 32px" />
            <span>秒内发送</span>
            <a-input-number :min="1" :max="100" :precision="0" size="small" v-model:value="shakeLimit.threshold" style="width: 32px" />
            <span>次及以上时，处理</span>
            <a-radio-group :options="alarmFirstOptions" optionType="button" v-model:value="shakeLimit.alarmFirst" size="small" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash-es";
import { PropType } from "vue";

type ShakeLimitType = {
    enabled: boolean | undefined,
    time?: number | undefined | null,
    threshold?: number | undefined | null,
    alarmFirst?: boolean | undefined
}

type Emit = {
  (e: 'update:value', data: ShakeLimitType): void
}

const alarmFirstOptions = [
  { label: '第一次', value: true },
  { label: '最后一次', value: false },
];

const props = defineProps({
  value: {
    type: Object as PropType<ShakeLimitType>,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()

const shakeLimit = reactive<ShakeLimitType>({
    enabled: undefined,
    time: 1,
    threshold: 1,
    alarmFirst: undefined
})

Object.assign(shakeLimit, props.value)

watch(() => shakeLimit, () => {
    const cloneValue = cloneDeep(shakeLimit)
    emit('update:value', cloneValue)
}, {
    deep: true
})

</script>

<style lang="less" scoped>
.shakeLimit {
  display: flex;
  gap: 4px;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  :deep(.ant-input-number-handler-wrap) {
    display: none;
  }

  :deep(.ant-radio-button-wrapper) {
    padding: 0 16px;
  }

  input {
    padding: 0 4px;
  }
}
</style>