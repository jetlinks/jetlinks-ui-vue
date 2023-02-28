<template>
  <div class="boolean-param">
    <a-row :gutter="4">
      <a-col :span="12">
        <a-form-item label=" " :name="name.concat(['trueText'])" :rules="[
          { required: true, message: '请输入trueText' },
        ]">
          <a-input v-model:value="value.trueText" placeholder="trueText" size="small" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="-" :name="name.concat(['trueValue'])" :rules="[
          { required: true, message: '请输入trueValue' },
        ]">
          <a-input v-model:value="value.trueValue" placeholder="trueValue" size="small"/>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label=" " :name="name.concat(['falseText'])" :rules="[
          { required: true, message: '请输入falseText' },
        ]">
          <a-input v-model:value="value.falseText" placeholder="falseText" size="small" />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="-" :name="name.concat(['falseValue'])" :rules="[
          { required: true, message: '请输入falseValue' },
        ]">
          <a-input v-model:value="value.falseValue" placeholder="falseValue" size="small" />
        </a-form-item>
      </a-col>
    </a-row>
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
    default: () => ({
    })
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