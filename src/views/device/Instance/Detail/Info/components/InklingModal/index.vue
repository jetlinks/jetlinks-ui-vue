<template>
  <j-modal
    :width="800"
    :mask-closable="false"
    :visible="true"
    :title="$t('InklingModal.index.735525-0')"
    :confirmLoading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <InklingDevice
      v-model:value='checkKey'
      type="device"
      :accessId='accessId'
      :pluginId="pluginId"
      :internalId="route.params.id"
    />
  </j-modal>
</template>

<script setup lang='ts' name='InklingModal'>
import InklingDevice from '@/views/device/components/InklingDevice'
import { onlyMessage } from '@/utils/comm'
import { savePluginData, getPluginData } from '@/api/link/plugin'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

type Emit = {
  (e: 'cancel'): void
  (e: 'submit', data: string): void
}

const props = defineProps({
  accessId: {
    type: String,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
  },
  pluginId:{
    type:String,
    default: undefined
  }
})

const emit = defineEmits<Emit>()
const checkKey = ref(props.id)
const loading = ref(false)
const route = useRoute()

const handleOk = async () => {
  if (checkKey.value) {
    loading.value = true
    const res = await savePluginData(
      'device',
      props.pluginId!,
      route.params.id as string,
      checkKey.value
    ).catch(() => ({ success: false }))
    loading.value = false
    if (res.success) {
      emit('submit', checkKey.value)
    }
  } else {
    onlyMessage($t('InklingModal.index.735525-1'), 'error')
  }
}

const handleCancel = () => {
  emit('cancel')
}

const getCheckedKeys = () => {
  getPluginData( 'device', props.pluginId!, route.params.id as string,).then(res => {
    if (res.success) {
      checkKey.value = res.result?.externalId || ''
    }
  })
}

onMounted(() => {
  getCheckedKeys()
})

</script>

<style scoped>

</style>
