<template>
    <div class="shakeLimit">
      <a-switch
          :checkedChildren="$t('ShakeLimit.index.9093426-0')"
          :unCheckedChildren="$t('ShakeLimit.index.9093426-1')"
          v-model:checked="shakeLimit.enabled"
          style="min-width: 90px"
      />
      <a-form-item name="shakeLimit" style="margin-bottom: 0;" :rules="{
          validator,
          trigger: 'change'
        }">
        <template v-if="shakeLimit.enabled">
            <div style="display: flex;flex-wrap: wrap;gap: 8px;align-items: center;flex: 1;">
                <a-input-number :min="1" :precision="0" size="small" v-model:value="shakeLimit.time" style="width: 38px" />
                <span>{{ $t('ShakeLimit.index.9093426-7') }}</span>
                <!-- <span>{{ $t('ShakeLimit.index.9093426-2') }}</span> -->
                <a-radio-group :options="continuousOptions" :disabled="!shakeLimit.alarmFirst" optionType="button" buttonStyle="solid" v-model:value="shakeLimit.continuous" size="small" @change="handleChange"/>
                <span>{{ $t('ShakeLimit.index.9093426-8') }}</span>
                <a-input-number :min="1" :max="10000" :precision="0" size="small" v-model:value="shakeLimit.threshold" style="width: 38px" />
                <span>{{ $t('ShakeLimit.index.9093426-9') }}</span>
                <!-- <span>{{ $t('ShakeLimit.index.9093426-3') }}</span> -->
                <a-radio-group :options="alarmFirstOptions" :disabled="shakeLimit.continuous" optionType="button" buttonStyle="solid" v-model:value="shakeLimit.alarmFirst" size="small" @change="handleChangeAlarmFirst"/>
                <span>{{ $t('ShakeLimit.index.9093426-10') }}</span>
                <a-radio-group :options="outputFirstOptions" optionType="button" buttonStyle="solid" v-model:value="shakeLimit.outputFirst" size="small" />
                <span>{{ $t('ShakeLimit.index.9093426-11') }}</span>
                <a-radio-group :options="rollingOptions" :disabled="!shakeLimit.alarmFirst" optionType="button" buttonStyle="solid" v-model:value="shakeLimit.rolling" size="small" />
                <span>{{ $t('ShakeLimit.index.9093426-12') }}</span>
            </div>
        </template>
      </a-form-item>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
type ShakeLimitType = {
    enabled?: boolean,
    time?: number | null,
    threshold?: number | null,
    alarmFirst?: boolean
    outputFirst?: boolean
    continuous?: boolean
    rolling?: boolean
}

type Emit = {
  (e: 'update:value', data: ShakeLimitType): void
}

const alarmFirstOptions = [
  { label: $t('ShakeLimit.index.9093426-13'), value: true },
  { label: $t('ShakeLimit.index.9093426-14'), value: false },
];

const continuousOptions = [
  { label: $t('ShakeLimit.index.9093426-15'), value: true },
  { label: $t('ShakeLimit.index.9093426-16'), value: false },
]

const outputFirstOptions = [
  { label: $t('ShakeLimit.index.9093426-17'), value: true },
  { label: $t('ShakeLimit.index.9093426-18'), value: false },
]

const rollingOptions = [
  { label: $t('ShakeLimit.index.9093426-19'), value: true },
  { label: $t('ShakeLimit.index.9093426-20'), value: false },
]
const props = defineProps({
  value: {
    type: Object as PropType<ShakeLimitType>,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()

const shakeLimit = reactive<ShakeLimitType>({
    enabled: false,
    time: 1,
    threshold: 1,
    alarmFirst: true,
    outputFirst: false,
    continuous: true,
    rolling: true,
})

const validator = (rule: any, value: ShakeLimitType) => {
  if (shakeLimit.enabled) {
    if (!shakeLimit.time || !shakeLimit.threshold) {
      return Promise.reject($t('ShakeLimit.index.9093426-6'))
    } else {
      return Promise.resolve()
    }
  } else {
    return Promise.resolve()
  }
}

Object.assign(shakeLimit, props.value)

const handleChange = (e: InputEvent) => {
  // shakeLimit.outputFirst = e.target?.value
}

const handleChangeAlarmFirst = (e: InputEvent) => {
  if(!e.target?.value) {
    shakeLimit.rolling = false;
  }
}

watch(() => shakeLimit, () => {
    emit('update:value', {...shakeLimit})
}, {
    deep: true
})

</script>

<style lang="less" scoped>
.shakeLimit {
  display: flex;
  gap: 16px;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  flex: 1;
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
:deep(.ant-radio-button-wrapper-disabled.ant-radio-button-wrapper-checked) {
  background-color: @primary-color !important;
  color: #fff;
}
:deep(.ant-form-item) {
  margin-bottom: 0 !important;
}
</style>
