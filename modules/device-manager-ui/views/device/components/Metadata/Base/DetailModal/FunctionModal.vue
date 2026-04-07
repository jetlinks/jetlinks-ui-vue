<template>
  <a-modal
      open
      :title="$t('DetailModal.FunctionModal.475375-0')"
      width="650px"
      :maskClosable="false"
      :getContainer="getPopupContainer"
      @cancel="cancel"
      @ok="ok"
  >
    <a-descriptions
        :column="1"
        :labelStyle="{
          width: '72px',
          textAlign: 'right',
          justifyContent: 'end'
        }"
    >
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.475375-1')">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.475375-2')">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.475375-3')">{{ data.async ? $t('DetailModal.FunctionModal.475375-4') : $t('DetailModal.FunctionModal.475375-5') }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.475375-6')"></a-descriptions-item>
      <a-descriptions-item>
        <JsonView :value="dataTypeTable.input"/>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.475375-7')"></a-descriptions-item>
      <a-descriptions-item>
        <JsonView :value="dataTypeTable.output"/>
      </a-descriptions-item>
      <a-descriptions-item v-if="showSetting && data.expands?.storageType" :label="$t('DetailModal.FunctionModal.475375-8')">{{ settingData[data.expands?.storageType] }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.475375-9')" v-if="data.description">
        <a-textarea :value="data.description" disabled></a-textarea>
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button type="primary" @click="ok">{{ $t('DetailModal.FunctionModal.475375-10') }}</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts" name="FunctionModal">
import JsonView from './JsonView.vue'
import {useStoreType} from "../utils";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  getPopupContainer: {
    type: Function,
    default: undefined
  },
  unitOptions: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: undefined
  },
})

const emit = defineEmits(['cancel'])

const { settingData } = useStoreType(props.type)

const dataTypeTable = reactive<{ input: any[], output: any[] }>({
  input: props.data?.inputs || [],
  output: props.data?.output || []
})

const cancel = () => {
  emit('cancel')
}

const ok = () => {
  cancel()
}



</script>

<style scoped>

</style>
