<template>
  <a-modal
      visible
      :confirm-loading="loading"
      @cancel="onClose"
      @ok="onSave"
      :title="title"
  >
    <div style="max-height: 500px; overflow-y: auto">
      <Form ref="formRef" v-bind="omit(props, 'title')">
        <template v-for="(_, key) in slots" :key="key" #[key]="slotProps">
          <slot :name="key" v-bind="slotProps"></slot>
        </template>
      </Form>
    </div>
  </a-modal>
</template>

<script setup>
import Form from './Form.vue'
import {omit} from "lodash-es";

const props = defineProps({
  title: {
    type: String,
  },
  layout: {
    type: String,
    default: 'vertical'
  },
  schema: {
    type: Array,
    default: []
  },
  data: {
    type: Object,
    default: () => ({})
  },
  request: {
    type: Function,
    default: undefined
  },
  handleRequestData: {
    type: Function,
    default: undefined
  }
})
const emits = defineEmits(['close','save'])

const slots = useSlots()

const loading = ref(false)
const formRef = ref()
const onClose = () => {
  emits('close')
}

const onSave = async () => {
  const resp = await formRef.value.onSave()
  if(resp){
    // 先处理数据
    let params;
    if(props.handleRequestData) {
      params = props.handleRequestData(resp, props.data)
    } else {
      params = resp
    }
    if(props.request){
      loading.value = true
      const response = await props.request(params).finally(() => {
        loading.value = false
      })
      if(response.success){
        emits('save')
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
