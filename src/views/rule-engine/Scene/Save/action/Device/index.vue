<template>
    <j-modal title="执行动作" visible :width="860" @cancel="onCancel" @ok="save" :maskClosable="false">
        <j-steps :current='DeviceModel.current' @change='stepChange'>
            <j-step>
                <template #title>选择产品</template>
            </j-step>
            <j-step>
                <template #title>选择设备</template>
            </j-step>
            <j-step>
                <template #title>执行动作</template>
            </j-step>
        </j-steps>
        <j-divider style='margin-bottom: 10px;' />
        <div class='steps-content'>
            <Product v-if='DeviceModel.current === 0' v-model:rowKey='DeviceModel.productId'
                v-model:detail='DeviceModel.productDetail' />
        </div>
        <template #footer>
      <div class='steps-action'>
        <j-button v-if='DeviceModel.current === 0' @click='cancel'>取消</j-button>
        <j-button v-else @click='prev'>上一步</j-button>
        <j-button type='primary' v-if='DeviceModel.current < 2' @click='saveClick'>下一步</j-button>
        <j-button type='primary' v-else @click='saveClick'>确定</j-button>
      </div>
    </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { DeviceModelType } from './typings';
import Product from './Product.vue';
import { onlyMessage } from '@/utils/comm';

type Emit = {
    (e: 'cancel'): void
    (e: 'save', data: any, options: Record<string, any>): void
}


const DeviceModel = reactive<DeviceModelType>({
    steps: [],
    current: 0,
    productId: '',
    deviceId: '',
    productDetail: {},
    device: {},
    deviceDetail: {},
    options: {},
    selector: 'fixed',
    selectorValues: [],
    upperKey: '',
    source: 'fixed',
    relationName: '',
    message: {},
    propertiesName: '',
    propertiesValue: '',
    columns: [],
    actionName: '',
    tagList: [],
})

const emit = defineEmits<Emit>()
const cancel = () => {
    emit('cancel');
};
const save = async(step?: number) => {
    let _step = step !== undefined ? step : DeviceModel.current
  if (_step === 0) {
    DeviceModel.productId ? DeviceModel.current = 1 : onlyMessage('请选择产品', 'error')
  } else if (_step === 1) {
   
  } else {
   
    }
};

const stepChange = (step: number) => {
    if (step !== 0) {
        save(step - 1)
    } else {
        DeviceModel.current = 0
    }
}


const prev = () => {
    DeviceModel.current =  DeviceModel.current - 1
}
const saveClick = () => save()

</script>
<style lang="less" scoped>
.steps-steps {
    width: 100%;
    margin-bottom: 17px;
    padding-bottom: 17px;
    border-bottom: 1px solid #f0f0f0;
}

.steps-content {
    width: 100%;
}
</style>