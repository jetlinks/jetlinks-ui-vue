<template>
  <j-modal
      visible
      :title="$t('DetailModal.FunctionModal.6915916-0')"
      width="650px"
      :maskClosable="false"
      :getContainer="getPopupContainer"
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
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.6915916-1')">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.6915916-2')">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.6915916-3')">{{ data.async ? $t('DetailModal.FunctionModal.6915916-4') : $t('DetailModal.FunctionModal.6915916-5') }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.6915916-6')"></a-descriptions-item>
      <a-descriptions-item>
        <JsonView :value="dataTypeTable.input"/>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.FunctionModal.6915916-7')"></a-descriptions-item>
      <a-descriptions-item>
        <JsonView :value="dataTypeTable.output"/>
      </a-descriptions-item>
      <a-descriptions-item v-if="showSetting && data.expands?.storageType" :label="$t('DetailModal.FunctionModal.6915916-8')">{{ settingData[data.expands?.storageType] }}</a-descriptions-item>
    </j-descriptions>
    <template #footer>
      <j-button type="primary" @click="ok">{{ $t('DetailModal.FunctionModal.6915916-9') }}</j-button>
    </template>
  </j-modal>
</template>

<script setup lang="ts" name="FunctionModal">
import JsonView from './JsonView.vue'
import {useStoreType} from "@/views/device/components/Metadata/Base/utils";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


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
  }
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
