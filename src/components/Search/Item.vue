<template>
  <div class='JSearch-item'>
    <div class='JSearch-item--type'>
      <a-select
        v-if='index !== 1 && index !== 4'
        :options='typeOptions'
        v-model:value='termsModel.type'
        style='width: 100%;'
      />
      <span v-else>
        {{
          index === 1 ? '第一组' : '第二组'
        }}
      </span>
    </div>
    <a-select
      class='JSearch-item--column'
      :options='columnOptions'
      v-model:value='termsModel.column'
    />
    <a-select
      class='JSearch-item--termType'
      :options='termTypeOptions'
      v-model:value='termsModel.termType'
    />
    <div class='JSearch-item--value'>
      <a-input
        v-if='component === componentType.input'
        v-model:value='termsModel.value'
      />
      <a-select
        v-else-if='component === componentType.select'
        v-model:value='termsModel.value'
        :options='options'
      />
      <a-inputnumber
        v-else-if='component === componentType.inputNumber'
        v-model:value='termsModel.value'
      />
      <a-input-password
        v-else-if='component === componentType.password'
        v-model:value='termsModel.value'
      />
      <a-switch
        v-else-if='component === componentType.switch'
        v-model:checked='termsModel.value'
      />
      <a-radio-group
        v-else-if='component === componentType.radio'
        v-model:value='termsModel.value'
      />
      <a-checkbox-group
        v-else-if='component === componentType.checkbox'
        v-model:value='termsModel.value'
        :options='options'
      />
      <a-time-picker
        v-else-if='component === componentType.time'
        v-model:value='termsModel.value'
      />
      <a-date-picker
        v-else-if='component === componentType.date'
        v-model:value='termsModel.value'
      />
      <a-tree-select
        v-else-if='component === componentType.tree'
        v-model:value='termsModel.value'
        :tree-data='options'
      />
    </div>
  </div>
</template>

<script setup lang='ts' name='SearchItem'>
import { componentType } from 'components/Form'
import { typeOptions } from './util'

const props = defineProps({
  component: {
    type: String,
    default: componentType.input
  },
  index: {
    type: Number,
    default: 1
  }
})

const termsModel = reactive({})

const options = ref([])

const columnOptions = reactive([])

const termTypeOptions = reactive([])


</script>

<style scoped lang='less'>
.JSearch-item {
  display: flex;
  gap: 16px;

  .JSearch-item--type {
    min-width: 120px;
    > span {
      line-height: 34px;
      font-weight: bold;
    }
  }

  .JSearch-item--column {
    min-width: 120px;
  }

  .JSearch-item--termType {
    min-width: 120px;
  }

  .JSearch-item--value {
    flex: 1 1 auto;
  }
}
</style>