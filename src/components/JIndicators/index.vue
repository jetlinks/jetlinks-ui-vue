<template>
  <div class="indicator-box">
    <template v-if="['int', 'long', 'double', 'float'].includes(type)">
      <template v-if="value.range">
        <a-input-number v-model:value="value.value[0]" :max="value.value[1]" size="small"
          style="width: 100%;"></a-input-number>
        ~
        <a-input-number v-model:value="value.value[1]" :min="value.value[0]" size="small"
          style="width: 100%;"></a-input-number>
      </template>
      <a-input-number v-else v-model:value="value.value" size="small" style="width: 100%;"></a-input-number>
    </template>
    <template v-else-if="type === 'date'">
      <a-range-picker v-if="value.range" show-time v-model:value="value.value" size="small" />
      <a-date-picker v-else show-time v-model:value="value.value" size="small" />
    </template>
    <template v-else-if="type === 'boolean'">
      <a-select v-model:value="value.value[0]" :options="list" size="small" placeholder="请选择"></a-select>
    </template>
    <template v-else-if="type === 'string'">
      <a-input v-model:value="value.value" size="small" placeholder="请输入"></a-input>
    </template>
    <template v-else>
      <template v-if="value.range">
        <a-input v-model:value="value.value[0]" :max="value.value[1]" size="small" placeholder="请输入"></a-input>
        ~
        <a-input v-model:value="value.value[1]" :min="value.value[0]" size="small" placeholder="请输入"></a-input>
      </template>
      <a-input-number v-else v-model:value="value.value" size="small" placeholder="请输入"></a-input-number>
    </template>
    <div v-if="type !== 'boolean' && type !== 'string'">
      <a-checkbox style="min-width: 60px; margin-left: 5px;" v-model:checked="value.range" @change="changeChecked">
        范围
      </a-checkbox>
    </div>
  </div>
</template>
<script setup lang="ts" name="JIndicators">
import { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';
import { Form } from 'ant-design-vue'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  range: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number, Array] as any
  },
  enum: {
    type: Object,
    default: () => ({})
  }
})

Form.useInjectFormItemContext()

const changeChecked = (e: CheckboxChangeEvent) => {
  if (e.target.checked) {
    props.value.value = []
  } else {
    delete props.value.value
  }
}

const list = ref<{ label: any; value: any; }[]>([])
watch(() => props.enum,
  () => {
    const arr = [];
    if (!!props.enum?.falseText && props.enum?.falseValue !== undefined) {
      arr.push({ label: props.enum?.falseText, value: props.enum?.falseValue });
    }
    if (!!props.enum?.trueText && props.enum?.trueValue !== undefined) {
      arr.push({ label: props.enum?.trueText, value: props.enum?.trueValue });
    }
    list.value = arr
  },
  { immediate: true, deep: true })

watch(() => props.type,
  (value) => {
    if (value === 'boolean') {
      if (!props.value.value) props.value.value = []
    }
  },
  { immediate: true })

</script>
<style lang="less" scoped>
.indicator-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.ant-form-item-label) {
  line-height: 1;

  >label {
    font-size: 12px;

    &.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
      font-size: 12px;
    }
  }
}

:deep(input) {
  height: 22px;
}
</style>