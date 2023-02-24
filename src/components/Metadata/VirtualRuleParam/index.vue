<template>
  <a-form-item :name="name.concat(['script'])">
    <f-rule-editor v-model:value="value.script" :id="id"></f-rule-editor>
  </a-form-item>
  <template v-if="showWindow">
    <a-form-item label="规则配置" :name="name.concat(['isVirtualRule'])">
      <a-switch v-model:checked="value.isVirtualRule" :checked-value="true" :un-checked-value="false"
        @change="changeWindow"></a-switch>
    </a-form-item>
    <template v-if="value.isVirtualRule">
      <a-form-item label="窗口" :name="name.concat(['windowType'])" :rules="[
        { required: true, message: '请选择窗口' },
      ]">
        <a-select v-model:value="value.windowType" :options="windowTypeEnum" size="small" allow-clear></a-select>
      </a-form-item>
      <a-form-item label="聚合函数" :name="name.concat(['aggType'])" :rules="[
        { required: true, message: '请选择聚合函数' },
      ]">
        <a-select v-model:value="value.aggType" :options="aggTypeOptions" size="small" allow-clear></a-select>
      </a-form-item>
      <a-form-item :label="spanLabel" :name="name.concat(['window', 'span'])" :rules="[
        { required: true, message: '请输入窗口长度' },
      ]">
        <a-input-number v-model:value="value.window.span" size="small" style="width: 100%;"></a-input-number>
      </a-form-item>
      <a-form-item :label="everyLabel" :name="name.concat(['window', 'every'])" :rules="[
        { required: true, message: '请输入步长' },
      ]">
        <a-input-number v-model:value="value.window.every" size="small" style="width: 100%;"></a-input-number>
      </a-form-item>
    </template>
  </template>
</template>
<script setup lang="ts" name="VirtualRuleParam">
import { PropType } from 'vue';
import FRuleEditor from '@/components/FRuleEditor/index.vue'
import { getStreamingAggType } from '@/api/device/product'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({
      type: 'script',
    })
  },
  name: {
    type: Array as PropType<string[]>,
    default: () => ([])
  },
  id: String,
  showWindow: {
    type: Boolean,
    default: false
  }
})

interface Emits {
  (e: 'update:value', data: Record<any, any>): void;
}
const emit = defineEmits<Emits>()

onMounted(() => {
  emit('update:value', {
    ...props.value,
    type: 'script'
  })
})

const aggTypeOptions = ref()
const getAggTypeList = async () => {
  aggTypeOptions.value = await getStreamingAggType().then((resp) =>
    resp.result.map((item: any) => ({
      label: `${item.value}(${item.text})`,
      value: item.value,
    })),
  );
}
getAggTypeList()

const changeWindow = (val: boolean | string | number) => {
  if (val as boolean) {
    props.value.type = 'window'
    if (!props.value.window) {
      props.value.window = {}
    }
  } else {
    delete props.value.type
  }
}

const windowTypeEnum = [
  { label: '时间窗口', value: 'time' },
  { label: '次数窗口', value: 'num' },
]

const spanLabel = computed(() => {
  switch(props.value.windowType) {
    case 'time':
      return '窗口长度（秒）';
    case 'num':
      return '窗口长度（次）';
    default:
      return '窗口长度'
  }
})

const everyLabel = computed(() => {
  switch(props.value.windowType) {
    case 'time':
      return '步长（秒）';
    case 'num':
      return '步长（次）';
    default:
      return '步长'
  }
})
</script>
<style lang="less" scoped></style>