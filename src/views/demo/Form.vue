<template>
  <Form
    ref='form'
    :options='options'
    :initValue='initValue'
  />
  <a-button @click='submit'>提交</a-button>
  <a-button @click='reset'>重置</a-button>
  <a-button @click='setValue'>修改name</a-button>
</template>

<script setup name='FormDemo'>
import { componentType } from 'components/Form'
const form = ref()
const initValue = reactive({})

const submit = () => {
  form.value.formValidate().then(res => {
    console.log(res)
  })
}

const reset = () => {
  form.value.reset()
}

const setValue =() => {
  initValue.name = '111111'
}

const options = reactive({
  name: {
    component: componentType.input,
    componentProps: {
      style: {
        width: '200px'
      }
    },
    title: '测试',
    required: true
  },
  sex: {
    component: componentType.select,
    title: '性别',
    options: [
      { label: '111', value: 1 },
      { label: '222', value: 2 },
    ],
    required: true,
    rules: [
      { required: true, message: '请选择性别'}
    ],
    tooltip: '性别',
    default: 1
  }
})
</script>

<style scoped>

</style>