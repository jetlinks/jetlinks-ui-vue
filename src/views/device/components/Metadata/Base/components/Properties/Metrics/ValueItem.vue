<template>
  <div class="metrics-item-value">
    <div class="metrics-item-text">
      <j-ellipsis>
        {{ showText }}
      </j-ellipsis>
    </div>
    <j-popconfirm-modal
        :show-cancel="false"
        body-style="width: 300px"
        :get-popup-container="(node) => fullRef || node"
        @confirm="confirm"
    >
      <template #content>
        <j-form ref="formRef" :model="formData">
          <j-form-item v-if="value.range === false" :rules="[{ validator: typeValidator}]" name="value">
            <Item v-model:value="formData.value" :options="options" />
          </j-form-item>
          <div v-else class="data-table-boolean-item">
            <div class="data-table-boolean-item--value">
              <j-form-item :name="['rangeValue', 0]" :rules="[{ required: true, message: '请输入指标值'}]">
                <Item v-model:value="formData.rangeValue[0]" />
              </j-form-item>
            </div>
            <div>-</div>
            <div class="data-table-boolean-item--value">
              <j-form-item :name="['rangeValue', 1]" :rules="[{ required: true, message: '请输入指标值'}, { validator: validator}]">
                <Item v-model:value="formData.rangeValue[1]" />
              </j-form-item>
            </div>
          </div>
        </j-form>
      </template>
      <j-button my-icon="EditOutlined" type="link" style="padding: 4px 8px"></j-button>
    </j-popconfirm-modal>
  </div>
</template>

<script setup lang="ts" name="MetricValueItems">
import { reactive } from 'vue';
import type { PropType } from 'vue';
import Item from './item.vue'
import {Form} from "jetlinks-ui-components";
import {cloneDeep} from "lodash";
import { FULL_CODE } from 'jetlinks-ui-components/es/DataTable'
import dayjs from "dayjs";

type ValueType = number | Array<number | undefined> | undefined;

type Emit = {
  (e: 'update:value', value: ValueType): void;
};

const props = defineProps({
  value: {
    type: Object as PropType<any>,
    default: undefined,
  },
  options: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits<Emit>();
const formItemContext = Form.useInjectFormItemContext();
const fullRef = inject(FULL_CODE);
const type = inject<string>('metricsType')

const formData = reactive<{
  value: ValueType;
  rangeValue: ValueType;
}>({
  value: props.value?.range === false ? props.value?.value : undefined,
  rangeValue: props.value?.range === true
      ? cloneDeep(props.value?.value) || [undefined, undefined]
      : [undefined, undefined],
});

const formRef = ref()


const showText = computed(() => {
  if (props.value.range === false) {
    switch (type) {
      case 'date':
        return props.value?.value;
      case 'boolean':
        const item = props.options.find(item => item.value === props.value?.value)
        return item ? item.label : props.value?.value === 'true' ? '是' : '否'
      default:
        return props.value?.value
    }
  } else {
    return props.value?.value?.[0] ? props.value.value.join('-') : ''
  }
})

const validatorTip = () =>{
  let tip = '请输入'
  if (['boolean', 'date'].includes(type!)) {
    tip = '请选择'
  }
  return `${tip}指标值`
}

const validator = (_: any, value: any) => {

  if (props.value.range && formData.rangeValue![0] >= formData.rangeValue![1]) {
    return Promise.reject('需大于左侧数值')
  }
  return Promise.resolve()
}

const typeValidator = (_: any, value: any) => {
  if (value === undefined) {
    return  Promise.reject(validatorTip())
  }
  if (type === 'string' && value?.length > 64) {
    return Promise.reject('最多可输入64个字符')
  }
  return Promise.resolve()
}

const handleValueByType = (value: any, isRange: boolean = false) => {
  if (isRange) {
    return (value as number[]).map(item => {
      const itemStr = String(item)
      const index = String(item).indexOf('.')

      return index === -1 ? item : Number(itemStr.substring(0, index))
    })
  } else {
    const itemStr = String(value)
    const index = String(value).indexOf('.')
    return index === -1 ? value : Number(itemStr.substring(0, index))
  }
}

const confirm = () => {
  return new Promise((resolve, reject) => {
    formRef.value.validate().then(() => {
      let value = props.value.range === true ? formData.rangeValue : formData.value

      if (['int', 'long'].includes(type)) {
        value = handleValueByType(value, props.value.range)
        console.log('confirm',value, type)
      }

      emit('update:value', {
        ...props.value,
        value: value
      });
      formItemContext.onFieldChange()
      resolve(true)
    }).catch(() => {
      reject()
    })
  })

};

watch(() => props.value.range,(value, oldValue) => {
  if (value !== oldValue  ) {
    if (value === false) {
      formData.value = undefined
    } else {
      formData.rangeValue = [undefined, undefined]
    }
  }
})
</script>

<style scoped lang="less">
.metrics-item-value {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;

  .metrics-item-text {
    flex: 1;
  }
}
</style>
