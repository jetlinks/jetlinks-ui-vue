<template>
  <j-modal
    :maskClosable="false"
    :visible="visible"
    width="800px"
    title="批量导入"
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
          <j-form-item required label='选择导入方式'>
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
        <File v-if='importData.type ==="file"' :product='importData.productId' />
        <Plugin v-else :accessId='productDetail.accessId' @change='pluginChange'/>
      </div>
    </div>
    <template #footer>
      <j-button v-if='steps === 0' @click='cancel' >取消</j-button>
      <j-button v-if='steps !== 0' @click='prev' >上一步</j-button>
      <j-button v-if='steps !== 2' @click='next' type='primary'>下一步</j-button>
      <j-button v-if='steps === 2' @click='save' type='primary'>确认</j-button>
    </template>
  </j-modal>
  <j-modal
    :maskClosable="false"
    :visible="importVisible"
    width="400px"
    title="导入完成"
    @cancel='importCancel'
    @ok='importCancel'
  >
    <a-icon type='CheckOutlined' style='color: #2F54EB;' /> 已完成 新增设备 <span style='color: #2F54EB;'>{{count}}</span>
  </j-modal>
</template>

<script lang='ts' setup name='DeviceImport'>
import Product from './product.vue'
import { getImage, onlyMessage } from '@/utils/comm'
import File from './file.vue'
import Plugin from './plugin.vue'
import { importDeviceByPlugin } from '@/api/device/instance'

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

const typeOptions = computed(() => {
  const array = [
    {
      value: 'file',
      label: '文件导入',
      subLabel: '支持上传XLSX、CSV格式文件',
      iconUrl: getImage('/device/import1.png'),
    },
  ]
  if (productDetail.value?.accessProvider === 'plugin_gateway') {
    array.push({
      value: 'plugin',
        label: '插件导入',
      subLabel: '读取插件中的设备信息同步至平台',
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
      return onlyMessage('请选择产品', 'error')
    }
    if (productDetail.value?.accessProvider !== 'plugin_gateway') {
      importData.type = 'file'
      importData.productId = productDetail.value?.id
      steps.value = 2
      return
    }
  }
  if (steps.value === 1 && !importData.type) {
    return onlyMessage('请选择导入方式', 'error')
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
          onlyMessage('操作成功')
          // cancel()
          visible.value = false
          importVisible.value = true
          count.value = res.result?.[0]?.result?.updated
        }
      })
    } else {
      onlyMessage('请选择设备', 'error')
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