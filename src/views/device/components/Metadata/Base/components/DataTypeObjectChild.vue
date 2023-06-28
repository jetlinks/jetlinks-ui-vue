<template>
  <j-space>
    <div class="config">其他配置</div>
    <PopconfirmModal @confirm="confirm">
      <template #content>
        <j-form layout="vertical">
          <j-form-item label="精度" v-if="['float', 'double'].includes(value.type)">
            <j-input-number v-model:value="value.scale" style="width: 100%;" :min="0" :max="99" maxlength="2" :precision="0"></j-input-number>
          </j-form-item>
        </j-form>
      </template>
      <AIcon type="EditOutlined" />
    </PopconfirmModal>
  </j-space>
</template>

<script setup lang="ts" name="DataTypeObjectChild">
import { PopconfirmModal } from 'jetlinks-ui-components';
const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  }
})

const emit = defineEmits(['update:value', 'cancel']);

const confirm = () => {
  emit('update:value', { ...props.value });
}
</script>

<style scoped>
.metadata-type {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
