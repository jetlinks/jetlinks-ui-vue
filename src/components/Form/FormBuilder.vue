<template>
  <div class='JForm-content'>
    <a-form
      v-bind='props'
      :model='formData.data'
      layout='vertical'
    >
      <a-row :type='rowType'>
        <a-col v-for='item in formOptions.data' :key='item.key' :span='item.span'>
          <a-form-item
            :name='item.name'
            :required='item.required'
            :rules='item.rules'
            :noStyle='item.noStyle'
          >
            <template #label>
              <span>{{ item.title }}</span>
              <a-tooltip :title='item.tooltip'>
                <QuestionCircleOutlined v-if='!!item.tooltip' style='margin-left: 4px; color: rgba(0,0,0,.45) ' />
              </a-tooltip>
            </template>
            <a-input
              v-if='item.component === componentType.input'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
            <a-select
              v-else-if='item.component === componentType.select'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
              :options='item.options'
            />
            <a-inputnumber
              v-else-if='item.component === componentType.inputNumber'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
            <a-input-password
              v-else-if='item.component === componentType.password'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
            <a-switch
              v-else-if='item.component === componentType.switch'
              v-bind='item.componentProps'
              v-model:checked='formData.data[item.name]'
            />
            <a-radio-group
              v-else-if='item.component === componentType.radio'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
            <a-checkbox-group
              v-else-if='item.component === componentType.checkbox'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
              :options='item.options'
            />
            <a-time-picker
              v-else-if='item.component === componentType.time'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
            <a-date-picker
              v-else-if='item.component === componentType.date'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
            <a-tree-select
              v-else-if='item.component === componentType.tree'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
              :tree-data='item.options'
            />
            <a-upload
              v-else-if='item.component === componentType.upload'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
            <component
              v-else
              :is='item.component'
              v-bind='item.componentProps'
              v-model:value='formData.data[item.name]'
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script setup lang='ts' name='FormBuilder'>
import type { Options, OptionsItem, OptionsComponent } from './index.modules'
import { PropType } from 'vue'
import { get, isArray, isString, pick, set } from 'lodash-es'
import { formProps } from 'ant-design-vue/es/form'
import { Form } from 'ant-design-vue';
import componentType from './util'
import {
  QuestionCircleOutlined
} from '@ant-design/icons-vue';

const useform = Form.useForm;

const props = defineProps({
  ...formProps,
  options: {
    type: Object as PropType<Options>,
    default: () => []
  },
  initValue: {
    type: Object,
    default: () => ({})
  },
  column: {
    type: Number,
    default: 1
  }
})

// 表单数据
const formData = reactive({
  data: {}
})

const formOptions = reactive<{ data: OptionsComponent[]}>({
  data: []
}) // 表单Item

const { resetFields, validate} = useform(formData, props.rules)

const rowType = ref<string | undefined>(undefined)

const calculateItemSpan = (span?: number | string) => {
  const itemSpan = 24 / props.column
  if (!span) return itemSpan

  if (isString(span) && span.includes('px')) {
    rowType.value = 'flex'
  } else {
    return span
  }
}

/**
 * 根据传入的表单options生成表单
 * @param data {Options}
 * @param parentKey
 */
const handleFormData = (data: Options, parentKey: Array<string> = []): any => {
  const cacheModel: any = {}

  Object.keys(data).forEach(async (key) => {
    const optionItem = data[key]
    const _key = [...parentKey, key]
    if ('type' in optionItem && optionItem.type === 'Object') {
      const dataModel = handleFormData(optionItem.properties, _key)
      cacheModel[key] = dataModel
    } else if (!('visible' in optionItem) || ('visible' in optionItem && optionItem.visible !== true)){
      // 处理默认值以及原始值
      const keyValue = get(formData.data, _key)
      let _options: any[] = []

      if (keyValue) { // 当前值在formModel中
        cacheModel[key] = keyValue
      } else {
        cacheModel[key] = (optionItem as OptionsItem).default
      }
      // 处理options
      if ('options' in optionItem) {
        _options = optionItem.options!
      }
      // 处理 onSearch 请求
      if ('onSearch' in optionItem) {
        const data = await optionItem.onSearch!()
        if (data) {
          _options = data
        }
      }
      const optionsItemProps = pick(optionItem, ['componentProps', 'title', 'component', 'rules', 'required', 'hidden', 'tooltip', 'noStyle'])
      //
      formOptions.data.push({
        ...optionsItemProps,
        name: _key,
        options: _options,
        key: isArray(_key) ? _key.toString() : _key,
        span: calculateItemSpan((optionItem as OptionsItem).span)
      })
    }
  })
  return cacheModel
}

/**
 * 重置表单
 */
const resetModel = () => {
  resetFields()
}

/**
 * 验证并提交表单
 */
const formValidate = () => {
  return new Promise((res, rej) => {
    validate().then(data => {
      res(formData.data)
    }).catch(err => {
      rej(err)
    })
  })
}
/**
 * 改变单个值
 */
const setItemValue = (key: string | (string | number)[], value: any) => {
  set(formData.data, key, value)
}

/**
 * 修改整个表单值
 * @param data
 */
const setData = (data: any) => {
  formData.data = data
}


if (props.initValue) {
  formData.data = props.initValue
}

formData.data = handleFormData(props.options)

watch(props.options, (newValue: any) => {
  formOptions.data = []
  formData.data = handleFormData(newValue)
})

watch(props.initValue, (newValue: any) => {
  formData.data = newValue
})

defineExpose({
  resetModel,
  formValidate,
  setItemValue,
  setData
})

</script>

<style scoped>

</style>