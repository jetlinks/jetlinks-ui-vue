<template>
  <a-popover :visible="visible" placement="left">
    <template #title>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="width: 150px;">配置元素</div>
        <AIcon type="CloseOutlined" @click="visible = false" />
      </div>
    </template>
    <template #content>
      <div style="max-width: 400px;">
        <div class="ant-form-vertical">
          <value-type-form v-model:value="_value" :name="name" isSub key="sub"></value-type-form>
          <a-form-item label="说明" :name="name.concat(['description'])" :rules="[
            { max: 200, message: '最多可输入200个字符' },
          ]">
            <a-textarea v-model:value="_value.description" size="small"></a-textarea>
          </a-form-item>
        </div>
      </div>
    </template>
    <a-button type="dashed" block @click="visible = true">
      配置元素
      <AIcon type="EditOutlined" class="item-icon" />
    </a-button>
  </a-popover>
</template>
<script setup lang="ts" name="ArrayParam">
import ValueTypeForm from '@/views/device/components/Metadata/Base/Edit/ValueTypeForm.vue';
import { PropType } from 'vue';

type ValueType = Record<any, any>;

const props = defineProps({
  value: {
    type: Object as PropType<ValueType>,
    default: () => ({ extends: {} })
  },
  name: {
    type: Array as PropType<(string | number)[]>,
    required: true
  }
})
interface Emits {
  (e: 'update:value', data: ValueType): void;
}
const emit = defineEmits<Emits>()

const _value = computed({
  get: () => props.value,
  set: val => {
    emit('update:value', val)
  }
})

const visible = ref(false)

onMounted(() => {
  emit('update:value', { extends: {}, ...props.value })
})
</script>
<style lang="less" scoped>
.item-icon {
  color: rgb(136, 136, 136);
  font-size: 12px;
}
</style>