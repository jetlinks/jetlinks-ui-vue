<template>
  <j-row :gutter='[24]'>
    <j-col :span='10'>
      <j-form-item
        name='readProperties'
        :rules="[{ required: true, message: '请选择属性' }]"
      >
        <j-select
          show-search
          mode='multiple'
          max-tag-count='responsive'
          placeholder='请选择属性'
          style='width: 100%'
          v-model:value='readProperties'
          :options='properties'
          :filter-option='filterSelectNode'
          @change='change'
        />
      </j-form-item>
    </j-col>
      <j-col :span='4'>
        <a-popover v-model:open="visible" title="批量绑定属性" trigger="click">
          <template #content>
            <a-row :gutter="[10, 10]">
              <a-col :span="24">
                <a-switch v-model:checked="isAllSelect" checked-children="全选" un-checked-children="取消全选" />
              </a-col>
              <a-col :span="24">
                <a-form :model="bind_value" name="basic" layout="inline" ref="formRef" :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }" autocomplete="off" @finish="handleBinding" :rules="rules">
                  <a-form-item name="start">
                    <a-input-number id="inputNumber" v-model:value="bind_value.start" :min="1"
                      :max="props.properties.length - 1" />
                  </a-form-item>
                  <div class="symbol">-</div>
                  <a-form-item name="end">
                    <a-input-number id="inputNumber" v-model:value="bind_value.end" :min="bind_value.start"
                      :max="props.properties.length" />
                  </a-form-item>
                  <a-button type="primary" html-type="submit">确定</a-button>
                </a-form>
              </a-col>
            </a-row>
          </template>
          <a-button type="primary">批量绑定属性</a-button>
        </a-popover>
      </j-col>
    <j-col :span='5'>
      <j-form-item>定时读取所选属性值</j-form-item>
    </j-col>
  </j-row>
</template>

<script setup lang='ts' name='ReadProperties'>
import { filterSelectNode } from '@/utils/comm'
import type { PropType } from 'vue'
import { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue';

type Emit = {
  (e: 'update:value', data: Array<string>): void
  (e: 'update:action', data: string): void
}

const props = defineProps({
  value: {
    type: Array as PropType<Array<string>>,
    default: () => []
  },
  action: {
    type: String,
    default: ''
  },
  properties: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<Emit>()

const readProperties = ref<string[]>(props.value)

const change = (values: string[], optionItems: any[]) => {
  const names = optionItems.map((item) => item.name);
  let extraStr = '';
  let isLimit = false;
  let indexOf = 0;
  extraStr = names.reduce((_prev, next, index) => {
    if (_prev.length <= 30) {
      indexOf = index;
      return index === 0 ? next : _prev + '、' + next;
    } else {
      isLimit = true;
    }
    return _prev;
  }, '');

  if (isLimit && names.length - 1 > indexOf) {
    extraStr += `等${optionItems.length}个属性`;
  }
  emit('update:value', values)
  emit('update:action', `读取 ${extraStr}`)
}
//范围绑定属性
const visible = ref(false)
const bind_value: {
  start: number | undefined
  end: number | undefined
} = reactive({
  start: undefined,
  end: undefined,
})
const formRef = ref<FormInstance>()
const validate = {
  start: async (_rule: Rule, value: number) => {
    if (!value) {
      return Promise.reject('请输入');
    }
    else {
      return Promise.resolve();
    }
  },
  end: async (_rule: Rule, value: number) => {
    if (!value) {
      return Promise.reject('请输入');
    }
    else {
      return Promise.resolve();
    }
  }
}
const rules: Record<string, Rule[]> = {
  start: [{ required: true, validator: validate.start, trigger: 'change' }],
  end: [{ required: true, validator: validate.end, trigger: 'change' }],
};
const handleBinding = (values: any) => {
  const valueObjArr = props.properties.slice(bind_value.start! - 1, bind_value.end)
  const value = valueObjArr.map((item: any) => item.id)
  change(value, valueObjArr)
  readProperties.value = value
  visible.value = false
}
//全选属性逻辑
const isAllSelect = ref<boolean>(false)
watch(isAllSelect, (newval) => {
  if (newval) {
    bind_value.start = 1
    bind_value.end = props.properties.length
  } else {
    bind_value.start = undefined
    bind_value.end = undefined
  }
})
</script>

<style scoped>

</style>