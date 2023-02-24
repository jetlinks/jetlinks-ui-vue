<template>
  <a-modal
    title='触发规则'
    visible
    :width='820'
    @click='save'
    @cancel='cancel'
  >
    <a-steps :current='addModel.stepNumber' @change='stepChange'>
      <a-step>
        <template #title>选择产品</template>
      </a-step>
      <a-step>
        <template #title>选择设备</template>
      </a-step>
      <a-step>
        <template #title>触发类型</template>
      </a-step>
    </a-steps>
    <a-divider style='margin-bottom: 0px' />
    <div class='steps-content'>
      <Product v-if='addModel.stepNumber === 0' v-model:rowKey='addModel.productId' v-model:detail='addModel.productDetail' />
      <DeviceSelect
        v-else-if='addModel.stepNumber === 1'
        :productId='addModel.productId'
        v-model:deviceKeys='addModel.deviceKeys'
        v-model:orgId='addModel.orgId'
        v-model:selector='addModel.selector'
        v-model:selectorValues='addModel.selectorValues'
      />
      <Type
        v-else-if='addModel.stepNumber === 2'
        :metadata='addModel.metadata'
      />
    </div>
    <template #footer>
      <div class='steps-action'>
        <a-button v-if='addModel.stepNumber === 0' @click='cancel'>取消</a-button>
        <a-button v-else @click='prev'>上一步</a-button>
        <a-button type='primary' v-if='addModel.stepNumber < 2' @click='saveClick'>下一步</a-button>
        <a-button type='primary' v-else @click='saveClick'>确定</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang='ts' name='AddModel'>
import type { PropType } from 'vue'
import type { metadataType, TriggerDevice } from '@/views/rule-engine/Scene/typings'
import { onlyMessage } from '@/utils/comm'
import { detail as deviceDetail  } from '@/api/device/instance'
import Product from './Product.vue'
import DeviceSelect from './DeviceSelect.vue'
import Type from './Type.vue'

type Emit = {
  (e: 'cancel'): void
  (e: 'update:value', data: TriggerDevice): void
  (e: 'update:options', data: any): void
}

interface AddModelType extends Omit<TriggerDevice, 'selectorValues'> {
  stepNumber: number
  deviceKeys: Array<{ label: string, value: string }>
  orgId: Array<{ label: string, value: string }>
  productDetail: any
  selectorValues: Array<{ label: string, value: string }>
  metadata: metadataType
}

const emit = defineEmits<Emit>()

const props = defineProps({
  value: {
    type: Object as PropType<TriggerDevice>,
    default: () => ({
      productId: '',
      selector: 'fixed',
      selectorValues: [],
    })
  },
  options: {
    type: Object as PropType<any>,
    default: () => ({

    })
  }
})

const addModel = reactive<AddModelType>({
  productId: '',
  selector: 'fixed',
  selectorValues: [],
  stepNumber: 0,
  deviceKeys: [],
  orgId: [],
  productDetail: {},
  metadata: {}
})

Object.assign(addModel, props.value)

const handleOptions = () => {

}

const prev = () => {
  addModel.stepNumber = addModel.stepNumber - 1
}

const cancel = () => {
  emit("cancel")
}

const handleMetadata = (metadata?: string) => {
  try {
    addModel.metadata = JSON.parse(metadata || "{}")
  } catch (e) {
    console.warn('handleMetadata: ' + e)
  }
}

const save = async (step?: number) => {
  let _step = step !== undefined ? step : addModel.stepNumber
  if (_step === 0) {
    addModel.productId ? addModel.stepNumber = 1 : onlyMessage('请选择产品', 'error')
  } else if (_step === 1) {
    const isFixed = addModel.selector === 'fixed' // 是否选择方式为设备
    if ((['fixed', 'org'].includes(addModel.selector) ) && !addModel.selectorValues?.length) {
      return onlyMessage(isFixed ? '请选择设备' : '请选择部门', 'error')
    }
    // 选择方式为设备且仅选中一个设备时，物模型取该设备
    if (isFixed && addModel.selectorValues?.length === 1) {
      const resp = await deviceDetail(addModel.selectorValues[0].value)
      handleMetadata(resp.result.metadata)
    } else {
      handleMetadata(addModel.productDetail?.metadata)
    }
    addModel.stepNumber = 2
  } else {

  }
  // handleOptions()
  // emit('update:value', {})
}

const saveClick = () => save()

const stepChange = (step: number) => {
  if (step !== 0) {
    save(step - 1)
  } else {
    addModel.stepNumber = 0
  }
}

</script>

<style scoped>

</style>