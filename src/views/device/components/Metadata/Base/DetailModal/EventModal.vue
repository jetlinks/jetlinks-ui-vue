<template>
  <j-modal
      visible
      :maskClosable="false"
      :title="$t('DetailModal.EventModal.6915917-0')"
      width="650px"
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
      <a-descriptions-item :label="$t('DetailModal.EventModal.6915917-1')">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.EventModal.6915917-2')">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.EventModal.6915917-3')">{{ EventLevel[data.expands.level] }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.EventModal.6915917-4')"></a-descriptions-item>
      <a-descriptions-item>
        <JsonView :value="dataTypeTable.dataSource"/>
      </a-descriptions-item>
      <a-descriptions-item v-if="showSetting && data.expands?.storageType" :label="$t('DetailModal.EventModal.6915917-5')">{{ settingData[data.expands?.storageType] }}</a-descriptions-item>
    </j-descriptions>
    <template #footer>
      <j-button type="primary" @click="ok">{{ $t('DetailModal.EventModal.6915917-6') }}</j-button>
    </template>
  </j-modal>
</template>

<script setup lang="ts" name="EventModal">
import JsonView from "./JsonView.vue";
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

const EventLevel = {
  ordinary: $t('DetailModal.EventModal.6915917-7'),
  warn: $t('DetailModal.EventModal.6915917-8'),
  urgent: $t('DetailModal.EventModal.6915917-9')
}

const { settingData } = useStoreType(props.type)

const showSetting = computed(() => {

})

const dataTypeTable = reactive<{ dataSource: any }>({
  dataSource: props.data?.valueType?.properties || []
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
