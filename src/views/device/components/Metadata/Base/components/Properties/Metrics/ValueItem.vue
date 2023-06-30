<template>
  <j-popconfirm-modal
      :show-cancel="false"
      body-style="width: 300px"
      @confirm="confirm"
  >
    <template #content>
      <j-form ref="formRef" :model="formData">
        <j-form-item v-if="value.range === 'false'" name="value" :rule="[{ required: true, message: '请输入指标值'}]">
          <j-input-number
              v-model:value="formData.value"
              :precision="0"
              style="width: 100%"
          />
        </j-form-item>
        <div v-else class="data-table-boolean-item">
          <div class="data-table-boolean-item--value">
            <j-form-item :name="['rangeValue', 0]" :rule="[{ required: true, message: '请输入指标值'}]">
              <j-input-number
                  v-model:value="formData.rangeValue[0]"
                  :precision="0"
                  style="width: 100%"
              />
            </j-form-item>
          </div>
          <div>-</div>
          <div class="data-table-boolean-item--value">
            <j-form-item :name="['rangeValue', 1]" :rule="[{ required: true, message: '请输入指标值'}]">
              <j-input-number
                  v-model:value="formData.rangeValue[1]"
                  :precision="0"
                  style="width: 100%"
              />
            </j-form-item>
          </div>
        </div>
      </j-form>
    </template>
    <j-button my-icon="EditOutlined" style="padding: 4px 8px"></j-button>
  </j-popconfirm-modal>
</template>

<script setup lang="ts" name="MetricValueItem">
import { reactive } from 'vue';
import type { PropType } from 'vue';

type ValueType = number | Array<number | undefined> | undefined;

type Emit = {
  (e: 'update:value', value: ValueType): void;
};

const props = defineProps({
  value: {
    type: Object as PropType<any>,
    default: undefined,
  },
});

const emit = defineEmits<Emit>();

const formData = reactive<{
  value: ValueType;
  rangeValue: ValueType;
}>({
  value: props.value.range === 'false' ? props.value.value : undefined,
  rangeValue: props.value.range === 'true'
      ? props.value.value || [undefined, undefined]
      : [undefined, undefined],
});

const formRef = ref()

const confirm = () => {
  return new Promise((resolve, reject) => {
    formRef.value.validate().then(() => {
      const value = props.value.range === 'true' ? formData.rangeValue : formData.value
      emit('update:value', {
        ...props.value,
        value: value
      });
      resolve(true)
    }).catch(() => {
      reject()
    })
  })

};

watch(() => props.value.range,(value, oldValue) => {
  if (value !== oldValue) {
    if (value === 'false') {
      formData.value = undefined
    } else {
      formData.rangeValue = [undefined, undefined]
    }
  }
})
</script>

<style scoped></style>
