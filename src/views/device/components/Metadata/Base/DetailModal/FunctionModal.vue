<template>
  <j-modal
      visible
      title="功能详情"
      width="650px"
      :maskClosable="false"
      @cancel="cancel"
      @ok="ok"
  >
    <j-descriptions
        :column="1"
        :labelStyle="{
          width: '72px',
          textAlign: 'right',
          justifyContent: 'end'
        }"
    >
      <a-descriptions-item label="功能标识">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item label="功能名称">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item label="是否异步">{{ data.async ? '是' : '否' }}</a-descriptions-item>
      <a-descriptions-item label="输入参数"></a-descriptions-item>
      <a-descriptions-item>
        <JsonView :value="dataTypeTable.input"/>
      </a-descriptions-item>
      <a-descriptions-item label="输出参数"></a-descriptions-item>
      <a-descriptions-item>
        <JsonView :value="dataTypeTable.output"/>
      </a-descriptions-item>
    </j-descriptions>
    <template #footer>
      <j-button type="primary" @click="ok">确认</j-button>
    </template>
  </j-modal>
</template>

<script setup lang="ts" name="FunctionModal">
import JsonView from './JsonView.vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const dataTypeTable = reactive<{ input: any[], output: any[] }>({
  input: props.data?.inputs || [],
  output: props.data?.output || []
})

const emit = defineEmits(['cancel'])
const cancel = () => {
  emit('cancel')
}

const ok = () => {
  cancel()
}



</script>

<style scoped>

</style>