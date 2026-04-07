<template>
  <a-modal
    :title="$t('DeviceAccess.metadataModal.306037-0')"
    open
    width="900px"
    :okText="$t('DeviceAccess.metadataModal.306037-1')"
    :cancelText="$t('DeviceAccess.metadataModal.306037-2')"
    :confirmLoading='loading'
    @ok="submitData"
    @cancel="cancel"
  >
    <div class='tip'>
      <a-icon type='ExclamationCircleOutlined'/>
      {{ $t('DeviceAccess.metadataModal.306037-3') }}
      <span style='font-weight: bold;padding:0 4px;'>{{ $t('DeviceAccess.metadataModal.306037-4') }}</span>
      {{ $t('DeviceAccess.metadataModal.306037-5') }}
      <a-tooltip :title="$t('DeviceAccess.metadataModal.306037-6')">
        <a-icon type='QuestionCircleOutlined' />
      </a-tooltip>
    </div>
    <a-form :layout="'vertical'" ref='formRef' :model='handleData'>
      <a-form-item :label="$t('DeviceAccess.metadataModal.306037-7')" :rules="[{ required: true, message: $t('DeviceAccess.metadataModal.306037-8')}]" >
        <j-card-select
          v-model:value="handleData.type"
          :column='4'
          :options="options"
        >
          <template #image='{image}'>
            <img :src='image' />
          </template>
        </j-card-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang='ts' setup name='MetadataModal'>
import { useProductStore } from '../../../../../store/product';
import { onlyMessage } from '@jetlinks-web/utils'
import { storeToRefs } from 'pinia'
import { modify, updateDevice } from '../../../../../api/product'
import { savePluginData } from '../../../../../api/link/plugin'
import { device } from '../../../../../assets'
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const route = useRoute();
type Emit = {
  (e: 'submit'): void
  (e: 'cancel'): void
}

const emit = defineEmits<Emit>()

const props = defineProps({
  metadata: {
    type: Object,
    default: () => ({})
  },
  access: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Object,
    default: () => ({})
  }
})

const productStore = useProductStore();
const { current: productDetail } = storeToRefs(productStore)
const formRef = ref()
const handleData = reactive({
  type: undefined
})
const loading = ref(false)
const { onBack } = useTabSaveSuccessBack()
const options = [
  {
    value: 'intersection',
    label: $t('DeviceAccess.metadataModal.306037-9'),
    subLabel: $t('DeviceAccess.metadataModal.306037-10'),
    iconUrl: device.intersection,
  },
  {
    value: 'union',
    label: $t('DeviceAccess.metadataModal.306037-11'),
    subLabel: $t('DeviceAccess.metadataModal.306037-12'),
    iconUrl: device.union,
  },
  {
    value: 'ignore',
    label: $t('DeviceAccess.metadataModal.306037-13'),
    subLabel: $t('DeviceAccess.metadataModal.306037-14'),
    iconUrl: device.ignore,
  },
  {
    value: 'cover',
    label: $t('DeviceAccess.metadataModal.306037-15'),
    subLabel: $t('DeviceAccess.metadataModal.306037-16'),
    iconUrl: device.cover,
  }
]


const flatObj = (obj: any, result: any) => {
  Object.keys(obj).forEach((key: string) => {
    if (typeof obj[key] === 'string') {
      result[key] = obj[key];
    } else {
      flatObj(obj[key], result);
    }
  });
};


const updateAccessData = async (id: string, values: any, metadata: string) => {
  // const result: any = {};
  // flatObj(values, result);
  // const { storePolicy, ...extra } = result;
  const { storePolicy, ...extra } = values;
  // 更新选择设备(设备接入)
  const accessObj = {
    ...productDetail.value,
    metadata: JSON.stringify(metadata),
    transportProtocol: props.access?.transport,
    protocolName: props.access?.protocolDetail?.name,
    accessId: props.access?.id,
    accessName: props.access?.name,
    accessProvider: props.access?.provider,
    messageProtocol: props.access?.protocol,
  }
  loading.value = true
  const updateDeviceResp = await updateDevice(accessObj)

  if (!updateDeviceResp.success) {
    loading.value = false
    return
  }

  if (props.access?.provider === 'plugin_gateway' && props.data.productTypeId) {
    await savePluginData(
      'product',
      props.access.id,
      props.data.id,
      props.data.productTypeId
    ).catch(() => ({}))
  }

  // 更新产品配置信息
  const resp = await modify(id || '', {
    id: id,
    configuration: { ...extra },
    storePolicy: storePolicy,
  });
  loading.value = false
  if (resp.status === 200) {
    onlyMessage($t('DeviceAccess.metadataModal.306037-17'));
    productStore.current!.storePolicy = storePolicy;
    const isTabBack = await onBack(resp, { onBefore: () => !!resp.result })

    if (!isTabBack) {
      await productStore.getDetail(productDetail.value.id)
      emit('submit')
    }
  }
}


const submitData = () => {
  formRef.value.validate().then((res) => {
    if (res) {
      let metadata = JSON.parse(productDetail.value?.metadata || '{}') // 产品物模型
      switch (handleData.type) {
        case 'intersection': // 交集
          metadata.properties = IntersectionFn(metadata.properties, props.metadata.properties)
          metadata.events = IntersectionFn(metadata.events, props.metadata.events)
          metadata.functions = IntersectionFn(metadata.functions, props.metadata.functions)
          metadata.tags = IntersectionFn(metadata.tags, props.metadata.tags)
          break;
        case 'union': // 并集
          metadata.properties = UnionFn(metadata.properties, props.metadata.properties)
          metadata.functions = UnionFn(metadata.functions, props.metadata.functions)
          metadata.events = UnionFn(metadata.events, props.metadata.events)
          metadata.tags = UnionFn(metadata.tags, props.metadata.tags)
          break;
        case 'cover': // 覆盖
          metadata = props.metadata
          break;
        default:
          break
      }
      updateAccessData(
        props.data.id,
        props.data.values,
        metadata
      )
    }
  }).catch(() => {

  })
}

const cancel = () => {
  emit('cancel')
}

/**
 * 交集处理函数， 只保留来自插件中的属性
 * @param DataA 产品物模型
 * @param DataB 插件物模型
 * @constructor
 */
const IntersectionFn = (DataA: any[] = [], DataB: any[] = []): any[] => {
  const newData: any[] = []
  if (!DataA.length) return []
  DataB.forEach((item) => {
    console.log(item, item.id)
    if (DataA.some((aItem) => aItem.id === item.id)) {
      newData.push(item)
    }
  })
  return newData
}

/**
 * 并集函数处理，保留平台、插件中的所有属性，ID重复时，只保留来自插件中的1条属性。
 * @param DataA 产品物模型
 * @param DataB 插件物模型
 * @constructor
 */
const UnionFn = (DataA: any[] = [], DataB: any[] = []): any[] => {
  const dataMap = new Map()

  DataB.forEach((item) => {
    dataMap.set(item.id, item)
  })

  DataA.forEach((item) => {
    if (!dataMap.has(item.id)) {
      dataMap.set(item.id, item)
    }
  })
  console.log(DataA, DataB, [...dataMap.values()])
  return [...dataMap.values()]
}


</script>

<style scoped lang='less'>
.tip {
  background: #F6F6F6;
  color: #999;
  padding: 10px 26px;
  margin-bottom: 24px;
}
:deep(.j-card-item) {
  padding: 16px !important;
}
</style>
