<template>
  <a-modal
    title='触发规则'
    visible
    :width='820'
    @click='save'
    @cancel='cancel'
  >
    <a-steps :current='addModel.stepNumber'>
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
    <div class='steps-content'>
      <Product :rowKey='addModel.productId' />
    </div>
    <template #footer>
      <div class='steps-action'>
        <template>
          <a-button v-if='addModel.stepNumber === 0' @click='cancel'>取消</a-button>
          <a-button v-else>上一步</a-button>
        </template>
        <template>
          <a-button type='primary' v-if='addModel.stepNumber < 2'>下一步</a-button>
          <a-button type='primary' v-else>确定</a-button>
        </template>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang='ts' name='AddModel'>
import type { PropType } from 'vue'
import { TriggerDevice } from '@/views/rule-engine/Scene/typings'
import { onlyMessage } from '@/utils/comm'
import { detail as deviceDetail  } from '@/api/device/instance'
import Product from './Product.vue'

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
  metadata: {
    properties?: any[]
    functions?: any[]
    events?: any[]
  }
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

const cancel = () => {
  emit("cancel")
}

const handleMetadata = (metadata: string) => {
  try {
    addModel.metadata = JSON.parse(metadata)
  } catch (e) {
    console.warn('handleMetadata: ' + e)
  }
}

const save = async () => {
  if (addModel.stepNumber === 0) {
    addModel.productId ? addModel.stepNumber = 1 : onlyMessage('请选择产品', 'error')
  } else if (addModel.stepNumber === 1) {
    const isFixed = addModel.selector === 'fixed' // 是否选择方式为设备
    if ((['fixed', 'org'].includes(addModel.selector) ) && addModel.selectorValues?.length) {
      return onlyMessage(isFixed ? '请选择设备' : '请选择部门', 'error')
    }
    // 选择方式为设备且仅选中一个设备时，物模型取该设备
    if (isFixed && addModel.selectorValues?.length === 1) {
      const resp = await deviceDetail(addModel.selectorValues[0].value)
      addModel.metadata
    } else {

    }
    //
  }
  // handleOptions()
  // emit('update:value', {})
}

</script>

<style scoped>

</style>