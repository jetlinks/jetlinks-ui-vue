<template>
  <div class="boolean-param ant-form-horizontal">
    <j-row :gutter="4">
      <j-col :span="12">
        <j-form-item label=" " :name="name.concat(['trueText'])" :rules="[
          { required: true, message: '请输入trueText' },
          { max: 64, message: '最多可输入64个字符' },
        ]">
          <j-input v-model:value="value.trueText" placeholder="trueText" size="small" />
        </j-form-item>
      </j-col>
      <j-col :span="12">
        <j-form-item label="-" :name="name.concat(['trueValue'])" :rules="[
          { required: true, message: '请输入trueValue' },
          { max: 64, message: '最多可输入64个字符' },
        ]">
          <j-input v-model:value="value.trueValue" placeholder="trueValue" size="small"/>
        </j-form-item>
      </j-col>
      <j-col :span="12">
        <j-form-item label=" " :name="name.concat(['falseText'])" :rules="[
          { required: true, message: '请输入falseText' },
          { max: 64, message: '最多可输入64个字符' },
        ]">
          <j-input v-model:value="value.falseText" placeholder="falseText" size="small" />
        </j-form-item>
      </j-col>
      <j-col :span="12">
        <j-form-item label="-" :name="name.concat(['falseValue'])" :rules="[
          { required: true, message: '请输入falseValue' },
          { max: 64, message: '最多可输入64个字符' },
        ]">
          <j-input v-model:value="value.falseValue" placeholder="falseValue" size="small" />
        </j-form-item>
      </j-col>
    </j-row>
  </div>
</template>
<script setup lang="ts" name="BooleanParam">
import { PropType } from 'vue';
type ModelValueType = Record<string, string>

interface Emits {
  (e: 'update:value', data: ModelValueType): void;
}
const emit = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Object as PropType<ModelValueType>,
    default: () => ({})
  },
  name: {
    type: Array as PropType<(string| number)[]>,
    required: true
  }
})

onMounted(() => {
  emit('update:value',
    {
      trueText: '是',
      trueValue: 'true',
      falseText: '否',
      falseValue: 'false',
      ...props.value
    })
})

watchEffect(() => {
  if (typeof props.value.trueValue === 'boolean') {
    props.value.trueValue = String(props.value.trueValue)
  }
  if (typeof props.value.falseValue === 'boolean') {
    props.value.falseValue = String(props.value.falseValue)
  }
})

</script>
<style lang="less" scoped>
.boolean-param {
  :deep(.ant-form-item) {
    flex-direction: row;

    .ant-form-item-label {
      >label {
        margin: 0 10px 0 0;
        height: 28px;
        line-height: 28px;
      }
    }
  }
  :deep(input) {
    height: 22px;
  }
}
</style>