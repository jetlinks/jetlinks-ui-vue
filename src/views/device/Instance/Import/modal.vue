<template>
  <j-modal
    :maskClosable="false"
    :visible="true"
    width="800px"
    title="导入"
  >
    <div>
      <!--   选择产品   -->
      <div v-if='steps === 0'>
        <Product
          v-model:rowKey='importData.productId'
        />
      </div>
    </div>
    <template #footer>
      <j-button v-if='steps === 0' @click='cancel' >取消</j-button>
      <j-button v-if='steps !== 0' @click='prev' >上一步</j-button>
      <j-button v-if='steps !== 2' @click='next' type='primary'>下一步</j-button>
      <j-button v-if='steps === 2' @click='save' type='primary'>确认</j-button>
    </template>
  </j-modal>
</template>

<script lang='ts' setup name='DeviceImport'>
import Product from './product.vue'
import { onlyMessage } from '@/utils/comm'

import { queryList } from '@/api/device/product';

const emit = defineEmits(['cancel', 'save']);

const steps = ref(0) // 步骤

const importData = reactive({
  productId: undefined,
  type: undefined,
})

const next = () => {
  if (steps.value === 0 && !importData.productId) {
    return onlyMessage('请选择产品', 'error')
  }
  if (steps.value === 1 && !importData.type) {
    return onlyMessage('请选择导入方式', 'error')
  }
  steps.value += 1
}

const prev = () => {
  if (steps.value === 2 && importData.type) {
    steps.value = 0
  } else {
    steps.value -= 1
  }
}

const cancel = () => {
  emit('cancel')
}

const save = () => {
  emit('save')
}
</script>

<style scoped>

</style>