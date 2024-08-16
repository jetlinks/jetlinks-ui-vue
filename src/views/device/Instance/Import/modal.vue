<template>
  <j-modal
    :maskClosable="false"
    :visible="visible"
    width="800px"
    :title="$t('Import.modal.957443-0')"
    @cancel='cancel'
  >
    <div>
      <!--   选择产品   -->
      <div v-if='steps === 0'>
        <Product
          v-model:rowKey='importData.productId'
          @change='productChange'
        />
      </div>
      <div v-else-if='steps === 1'>
        <j-form :layout="'vertical'">
          <j-form-item required :label="$t('Import.modal.957443-1')">
            <j-card-select
              :value="[importData.type]"
              :column='typeOptions.length'
              :options="typeOptions"
              @change='typeChange'
            >
              <template #image='{image}'>
                <img :src='image' />
              </template>
            </j-card-select>
          </j-form-item>
        </j-form>
      </div>
      <div v-else>
        <File v-if='importData.type ==="file"' :product='importData.productId'  />
        <Plugin v-else :accessId='productDetail.accessId'  @change='pluginChange'/>
      </div>
    </div>
    <template #footer>
      <j-button v-if='steps === 0' @click='cancel' >{{ $t('Import.modal.957443-2') }}</j-button>
      <j-button v-if='steps !== 0' @click='prev' >{{ $t('Import.modal.957443-3') }}</j-button>
      <j-button v-if='steps !== 2' @click='next' type='primary'>{{ $t('Import.modal.957443-4') }}</j-button>
      <j-button v-if='steps === 2' @click='save' type='primary' :disabled="flag">{{ $t('Import.modal.957443-5') }}</j-button>
    </template>
  </j-modal>
  <j-modal
    :maskClosable="false"
    :visible="importVisible"
    width="400px"
    :title="$t('Import.modal.957443-6')"
    @cancel='importCancel'
    @ok='importCancel'
  >
    <a-icon type='CheckOutlined' style='color: #2F54EB;' /> {{ $t('Import.modal.957443-7') }} <span style='color: #2F54EB;'>{{count}}</span>
  </j-modal>
</template>

<script lang='ts' setup name='DeviceImport'>
import {provide} from 'vue'
import Product from './product.vue'
import { getImage, onlyMessage } from '@/utils/comm'
import File from './file.vue'
import Plugin from './plugin.vue'
import { importDeviceByPlugin } from '@/api/device/instance'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const emit = defineEmits(['cancel', 'save']);
const steps = ref(0) // 步骤
const importData = reactive<{productId?: string, type?: string}>({
  productId: undefined,
  type: undefined,
})
const productDetail = ref()
const deviceList = ref<any[]>([])
const visible = ref(true)
const importVisible = ref(false)
const count = ref(0)
const flag = ref<boolean>(false)
provide("flag",flag)
const typeOptions = computed(() => {
  const array = [
    {
      value: 'file',
      label: $t('Import.modal.957443-8'),
      subLabel: $t('Import.modal.957443-9'),
      iconUrl: getImage('/device/import1.png'),
    },
  ]
  if (productDetail.value?.accessProvider === 'plugin_gateway') {
    array.push({
      value: 'plugin',
        label: $t('Import.modal.957443-10'),
      subLabel: $t('Import.modal.957443-11'),
      iconUrl: getImage('/device/import2.png'),
    })
  }
  return array
})

const typeChange = (types: string[]) => {
  importData.type = types[0]
}

const productChange = (detail: any) => {
  productDetail.value = detail
}

const next = () => {
  if (steps.value === 0) {
    if (!importData.productId) {
      return onlyMessage($t('Import.modal.957443-12'), 'error')
    }
    if (productDetail.value?.accessProvider !== 'plugin_gateway') {
      importData.type = 'file'
      importData.productId = productDetail.value?.id
      steps.value = 2
      return
    }
  }
  if (steps.value === 1 && !importData.type) {
    return onlyMessage($t('Import.modal.957443-13'), 'error')
  }
  steps.value += 1
}

const prev = () => {
  if (productDetail.value?.accessProvider !== 'plugin_gateway') {
    steps.value = 0
  } else {
    steps.value -= 1
  }
}

const cancel = () => {
  emit('cancel')
}

const pluginChange = (options: any[]) => {
  deviceList.value = options
}

const save = () => {
  if (importData.type === 'file') {
    cancel()
    emit('save')
  } else {
    if (deviceList.value.length) {
      importDeviceByPlugin(importData.productId!, deviceList.value).then(res => {
        if (res.success) {
          onlyMessage($t('Import.modal.957443-14'))
          // cancel()
          visible.value = false
          importVisible.value = true
          count.value = res.result?.[0]?.result?.updated
        }
      })
    } else {
      onlyMessage($t('Import.modal.957443-15'), 'error')
    }
  }
}

const importCancel = () => {
  importVisible.value = false
  emit('save')
  cancel()
}
</script>

<style scoped>

</style>