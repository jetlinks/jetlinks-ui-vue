<template>
  <j-modal
    title='触发规则'
    visible
    :width='820'
    @ok='save'
    @cancel='cancel'
    :maskClosable="false"
  >
    <j-steps :current='addModel.stepNumber' @change='stepChange'>
      <j-step>
        <template #title>选择产品</template>
      </j-step>
      <j-step>
        <template #title>选择设备</template>
      </j-step>
      <j-step>
        <template #title>触发类型</template>
      </j-step>
    </j-steps>
    <j-divider style='margin-bottom: 0px' />
    <div class='steps-content'>
      <Product
        v-if='addModel.stepNumber === 0'
        v-model:rowKey='addModel.productId'
        v-model:detail='addModel.productDetail'
        @change='productChange'
      />
      <DeviceSelect
        v-else-if='addModel.stepNumber === 1'
        :productId='addModel.productId'
        v-model:deviceKeys='addModel.deviceKeys'
        v-model:orgId='addModel.orgId'
        v-model:selector='addModel.selector'
        v-model:selectorValues='addModel.selectorValues'
      />
      <Type
        ref='typeRef'
        v-else-if='addModel.stepNumber === 2'
        :metadata='addModel.metadata'
        :operator='addModel.operator'
      />
    </div>
    <template #footer>
      <div class='steps-action'>
        <j-button v-if='addModel.stepNumber === 0' @click='cancel'>取消</j-button>
        <j-button v-else @click='prev'>上一步</j-button>
        <j-button type='primary' v-if='addModel.stepNumber < 2' @click='saveClick'>下一步</j-button>
        <j-button type='primary' v-else @click='saveClick'>确定</j-button>
      </div>
    </template>
  </j-modal>
</template>

<script setup lang='ts' name='AddModel'>
import type { PropType } from 'vue'
import type { metadataType, TriggerDevice, TriggerDeviceOptions, SelectorValuesItem } from '@/views/rule-engine/Scene/typings'
import { onlyMessage } from '@/utils/comm'
import { detail as deviceDetail } from '@/api/device/instance'
import Product from './Product.vue'
import DeviceSelect from './DeviceSelect.vue'
import Type from './Type.vue'
import { handleTimerOptions } from '@/views/rule-engine/Scene/Save/components/Timer/util'
import { Form } from 'jetlinks-ui-components'

type Emit = {
  (e: 'cancel'): void
  (e: 'change', data: TriggerDevice): void
  (e: 'save', data: TriggerDevice, options: Record<string, any>): void
}


interface AddModelType extends Omit<TriggerDevice, 'selectorValues'> {
  stepNumber: number
  deviceKeys: SelectorValuesItem[]
  orgId: SelectorValuesItem[]
  productDetail: any
  selectorValues: SelectorValuesItem[]
  metadata: metadataType,
  operator: TriggerDeviceOptions
}
const formItemContext = Form.useInjectFormItemContext();

const emit = defineEmits<Emit>()
const typeRef = ref()

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
    type: Object as PropType<Record<string, any>>,
    default: () => ({})
  }
})

const addModel = reactive<AddModelType>({
  productId: props.value.productId || '',
  selector: props.value.selector || 'fixed',
  selectorValues: props.value.selectorValues || [],
  stepNumber: 0,
  deviceKeys: props.value.selectorValues || [],
  orgId: props.value.selectorValues || [],
  productDetail: {},
  metadata: {},
  operator: props.value.operation || {
    operator: 'online'
  }
})

const optionsCache = ref(props.options)

const handleOptions = (data: TriggerDeviceOptions) => {
  const typeIconMap = {
    writeProperty: 'icon-bianji1',
    invokeFunction: 'icon-widgets',
    reportEvent: 'icon-shijian',
    readProperty: 'icon-Group',
  };

  const _options: any = {
    name: '', // 名称
    extraName: '', // 拓展参数
    onlyName: false,
    type: '', // 触发类型
    typeIcon: typeIconMap[data.operator],
    productName: '',
    selectorIcon: '',
    time: undefined,
    when: undefined,
    extraTime: undefined,
    action: optionsCache.value?.action,
  };

  if (addModel.selector === 'fixed') {
    let isLimit = false;
    let indexOf = 0;
    const nameStr = addModel.selectorValues!.reduce((_prev, next, index) => {
      if (_prev.length <= 30) {
        indexOf = index;
        return index === 0 ? next.name : _prev + '、' + next.name;
      } else {
        isLimit = true;
      }
      return _prev;
    }, '');
    // _options.name = TriggerDeviceModel.selectorValues?.map((item) => item.name).join('、');
    _options.name = nameStr;
    if (isLimit && addModel.selectorValues!.length > indexOf) {
      _options.extraName = `等${addModel.selectorValues!.length}台设备`;
    }
    _options.selectorIcon = 'icon-shebei1';
  } else if (addModel.selector === 'org') {
    _options.name = addModel.selectorValues?.[0].name + '的';
    _options.productName = addModel.productDetail.name; // 产品名称
    _options.selectorIcon = 'icon-zuzhi';
  } else {
    _options.name = '所有的' + addModel.productDetail.name;
  }

  if (data.timer) {
    const _timer = data.timer;
    const { time, extraTime, when } = handleTimerOptions(_timer)
    _options.when = when;
    _options.time = time;
    _options.extraTime = extraTime;
  }

  if (data.operator === 'online') {
    _options.type = '上线';
    _options.action = '';
    _options.typeIcon = 'icon-a-Group4713';
  }

  if (data.operator === 'offline') {
    _options.type = '离线';
    _options.action = '';
    _options.typeIcon = 'icon-a-Group4892';
  }

  if (data.operator === 'reportProperty') {
    _options.type = '属性上报';
    _options.action = '';
    _options.typeIcon = 'icon-file-upload-outline';
  }
  return _options;
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

const productChange = () => {
  addModel.deviceKeys = []
  addModel.orgId = []
  addModel.selector = 'fixed'
  addModel.operator = {
    operator: 'online'
  }
  addModel.selectorValues = []
}

const getDeviceDetailByMetadata = async (deviceId: string) => {
  const resp = await deviceDetail(deviceId)
  return resp.result?.metadata
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
    const onlyOneDevice = isFixed && addModel.selectorValues?.length === 1
    handleMetadata( onlyOneDevice ? await getDeviceDetailByMetadata(addModel.selectorValues[0].value) : addModel.productDetail?.metadata)
    addModel.stepNumber = 2
  } else {
    const typeData = await typeRef.value.vail()
    if (typeData) {
      optionsCache.value.action = typeData.action
      const _options = handleOptions(typeData.data);
      const data = {
        operation: typeData.data,
        selector: addModel.selector,
        selectorValues: addModel.selectorValues,
        productId: addModel.productId,
        source: 'fixed'
      }
      emit('save', data, _options)
      formItemContext.onFieldChange()
    }
  }
}

const saveClick = () => save()

const stepChange = (step: number) => {
  if (step !== 0) {
    save(step - 1)
  } else {
    addModel.stepNumber = 0
  }
}

const initQuery = async () => {
  if (props.value.selector === 'fixed' && props.value.selectorValues?.length) {
    handleMetadata(await getDeviceDetailByMetadata(props.value.selectorValues[0].value))
  }
}

nextTick(() => {
  initQuery()
})

</script>

<style scoped>
.steps-content {
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>