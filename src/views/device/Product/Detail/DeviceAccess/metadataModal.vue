<template>
  <j-modal
    title="选择处理方式"
    visible
    width="900px"
    okText="确定"
    cancelText="取消"
    :confirmLoading='loading'
    @ok="submitData"
    @cancel="cancel"
  >
    <div class='tip'>
      <a-icon type='ExclamationCircleOutlined'/>
      平台
      <span style='font-weight: bold;padding:0 4px;'>物模型</span>
      中已有数据，请选择处理方式。
      <j-tooltip title='默认采用覆盖的方式处理功能、事件、标签下的数据'>
        <a-icon type='QuestionCircleOutlined' />
      </j-tooltip>
    </div>
    <j-form :layout="'vertical'" ref='formRef' :model='handleData'>
      <j-form-item label='处理方式' :rules='[{ required: true, message: "请选择处理方式"}]' >
        <j-card-select
          v-model:value="handleData.type"
          :column='4'
          :options="options"
        >
          <template #image='{image}'>
            <img :src='image' />
          </template>
        </j-card-select>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script lang='ts' setup name='MetadataModal'>
import { useProductStore } from '@/store/product';
import { getImage, onlyMessage } from '@/utils/comm'
import { storeToRefs } from 'pinia'
import { modify, updateDevice } from '@/api/device/product'
import { savePluginData } from '@/api/link/plugin'

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
const options = [
  {
    value: 'intersection',
    label: '取交集',
    subLabel: '仅保留标识一致的属性',
    iconUrl: getImage('/device/intersection.png'),
  },
  {
    value: 'union',
    label: '取并集',
    subLabel: '保留平台、插件中的所有属性',
    iconUrl: getImage('/device/union.png'),
  },
  {
    value: 'ignore',
    label: '忽略',
    subLabel: '仅保留平台中的属性',
    iconUrl: getImage('/device/ignore.png'),
  },
  {
    value: 'cover',
    label: '覆盖',
    subLabel: '仅保留插件中的属性',
    iconUrl: getImage('/device/cover.png'),
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
  const result: any = {};
  // flatObj(values, result);
  // const { storePolicy, ...extra } = result;
  const { storePolicy, ...extra } = result;
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
    onlyMessage('操作成功！');
    productStore.current!.storePolicy = storePolicy;
    if ((window as any).onTabSaveSuccess) {
      if (resp.result) {
        (window as any).onTabSaveSuccess(resp);
        setTimeout(() => window.close(), 300);
      }
    } else {
      await productStore.getDetail(productDetail.value.id)
      emit('submit')
    }
  }
}


const submitData = () => {
  formRef.value.validate().then((res) => {
    if (res) {
      let metadata = JSON.parse(productDetail.value?.metadata || '{}') // 产品物模型
      switch (handleData.type![0]) {
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