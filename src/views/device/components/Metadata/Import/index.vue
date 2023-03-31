<template>
  <j-modal :mask-closable="false" title="导入物模型" destroy-on-close v-model:visible="_visible" @cancel="close"
    @ok="handleImport" :confirm-loading="loading">
    <div class="import-content">
      <p class="import-tip">
        <AIcon type="ExclamationCircleOutlined" style="margin-right: 5px" />
        导入的物模型会覆盖原来的属性、功能、事件、标签，请谨慎操作。
      </p>
    </div>
    <j-form layout="vertical" v-model="formModel">
      <j-form-item v-if="type === 'product'" label="导入方式" v-bind="validateInfos.type">
        <j-select v-model:value="formModel.type">
          <j-select-option value="copy">拷贝产品</j-select-option>
          <j-select-option value="import">导入物模型</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item label="选择产品" v-bind="validateInfos.copy" v-if="formModel.type === 'copy'">
        <j-select :options="productList" v-model:value="formModel.copy" option-filter-prop="label" showSearch></j-select>
      </j-form-item>
      <j-form-item label="物模型类型" v-bind="validateInfos.metadata" v-if="type === 'device' || formModel.type === 'import'">
        <j-select v-model:value="formModel.metadata">
          <j-select-option value="jetlinks">Jetlinks物模型</j-select-option>
          <j-select-option value="alink">阿里云物模型TSL</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item label="导入类型" v-bind="validateInfos.metadataType"
        v-if="type === 'device' || formModel.type === 'import'">
        <j-select v-model:value="formModel.metadataType">
          <j-select-option value="file">文件上传</j-select-option>
          <j-select-option value="script">脚本</j-select-option>
        </j-select>
      </j-form-item>
      <j-form-item label="文件上传" v-bind="validateInfos.upload" v-if="formModel.metadataType === 'file'">
        <j-input v-model:value="formModel.upload">
          <template #addonAfter>
            <j-upload v-model:file-list="fileList" :before-upload="beforeUpload" accept=".json" :show-upload-list="false"
              :action="FILE_UPLOAD" @change="fileChange" :headers="{ 'X-Access-Token': getToken() }">
              <AIcon type="UploadOutlined" class="upload-button" />
            </j-upload>
          </template>
        </j-input>
      </j-form-item>
      <j-form-item v-bind="validateInfos.import" v-if="(type === 'device' || formModel.type === 'import') && formModel.metadataType === 'script'">
        <template #label>
          <j-space>
            物模型
            <j-tooltip title="在线编辑器中编写物模型脚本">
              <AIcon type="QuestionCircleOutlined" style="color: rgb(136, 136, 136);"/>
            </j-tooltip>
          </j-space>
        </template>
        <JMonacoEditor v-model="formModel.import" theme="vs" style="height: 300px" lang="json"></JMonacoEditor>
      </j-form-item>
    </j-form>
  </j-modal>
</template>
<script setup lang="ts" name="Import">
import { useForm } from 'ant-design-vue/es/form';
import { saveMetadata } from '@/api/device/instance'
import { queryNoPagingPost, convertMetadata, modify } from '@/api/device/product'
import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { UploadProps, UploadFile, UploadChangeParam } from 'ant-design-vue/es';
import type { DeviceMetadata } from '@/views/device/Product/typings'
import { message } from 'jetlinks-ui-components';
import { useInstanceStore } from '@/store/instance'
import { useProductStore } from '@/store/product';
import { FILE_UPLOAD } from '@/api/comm';
import { getToken } from '@/utils/comm';
import { useMetadataStore } from '@/store/metadata';

const route = useRoute()
const instanceStore = useInstanceStore()
const productStore = useProductStore()

interface Props {
  visible: boolean,
  type: 'device' | 'product',
}
interface Emits {
  (e: 'update:visible', data: boolean): void;
}
const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const loading = ref(false)

const _visible = computed({
  get: () => {
    return props.visible;
  },
  set: (val: any) => {
    emits('update:visible', val);
  },
})

const close = () => {
  emits('update:visible', false);
}

/** form表单 */
const formModel = reactive<Record<string, any>>({
  type: 'import',
  metadata: 'jetlinks',
  metadataType: 'script',
})
const rules = reactive({
  type: [
    {
      required: true,
      message: '请选择导入方式',
    },
  ],
  copy: [
    {
      required: true,
      message: '请选择产品',
    },
  ],
  metadata: [
    {
      required: true,
      message: '请选择物模型类型',
    },
  ],
  metadataType: [
    {
      required: true,
      message: '请选择导入类型',
    },
  ],
  upload: [
    {
      required: true,
      message: '请上传文件',
    },
  ],
  import: [
    {
      required: true,
      message: '请输入物模型',
    },
  ],
})
const { validate, validateInfos } = useForm(formModel, rules);
const fileList = ref<UploadFile[]>([])

const productList = ref<DefaultOptionType[]>([])

const loadData = async () => {
  const { id } = route.params || {}
  const product = await queryNoPagingPost({
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [{ column: 'id$not', value: id }],
  }) as any
  productList.value = product.result.filter((i: any) => i?.metadata).map((item: any) => ({
    label: item.name,
    value: item.metadata,
    key: item.id
  })) as DefaultOptionType[]
}
loadData()

const beforeUpload: UploadProps['beforeUpload'] = file => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = (json) => {
    formModel.import = json.target?.result;
  };
}
const fileChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    const { response } = info.file
    if (response.status === 200) {
      formModel.upload = response.result
    }
  }
}

const operateLimits = (mdata: DeviceMetadata) => {
  const obj: DeviceMetadata = { ...mdata };
  const old = JSON.parse(instanceStore.detail?.metadata || '{}');
  const fid = instanceStore.detail?.features?.map(item => item.id);
  if (fid?.includes('eventNotModifiable')) {
    obj.events = old?.events || [];
  }
  if (fid?.includes('propertyNotModifiable')) {
    obj.properties = old?.properties || [];
  }
  (obj?.events || []).map((item, index) => {
    return { ...item, sortsIndex: index };
  });
  (obj?.properties || []).map((item, index) => {
    return { ...item, sortsIndex: index };
  });
  (obj?.functions || []).map((item, index) => {
    return { ...item, sortsIndex: index };
  });
  (obj?.tags || []).map((item, index) => {
    return { ...item, sortsIndex: index };
  });
  return obj;
};
const metadataStore = useMetadataStore()
const handleImport = async () => {
  validate().then(async (data) => {
    loading.value = true
    const { id } = route.params || {}
    if (data.metadata === 'alink') {
      const res = await convertMetadata('from', 'alink', JSON.parse(data.import)).catch(err => err)
      if (res.status === 200) {
        const metadata = operateLimits(res.result)
        let result;
        if (props?.type === 'device') {
          result = await saveMetadata(id as string, metadata).catch(err => err)
        } else {
          result = await modify(id as string, { id, metadata: JSON.stringify(metadata) }).catch(err => err)
        }
        if (result.success) {
          message.success('导入成功')
        }
        loading.value = false
      } else {
        loading.value = false
        // message.error('物模型数据不正确!')
        return
      }
      if (props?.type === 'device') {
        await instanceStore.refresh(id as string)
      } else {
        await productStore.refresh(id as string)
      }
      metadataStore.set('importMetadata', true)
      // Store.set(SystemConst.GET_METADATA, true)
      // Store.set(SystemConst.REFRESH_METADATA_TABLE, true)
      close()
    } else {
      try {
        const _object = JSON.parse(data[props?.type === 'device' ? 'import' : data?.type] || '{}')
        if (
          !(!!_object?.properties || !!_object?.events || !!_object?.functions || !!_object?.tags)
        ) {
          message.error('物模型数据不正确')
          loading.value = false;
          return;
        }
        const { id } = route.params || {}
        const params = {
          id,
          metadata: JSON.stringify(operateLimits(_object as DeviceMetadata)),
        };
        const paramsDevice = operateLimits(_object as DeviceMetadata)
        let resp = undefined
        if (props?.type === 'device') {
          resp = await saveMetadata(id as string, paramsDevice)
        } else {
          resp = await modify(id as string, params)
        }
        loading.value = false
        if (resp.success) {
          if (props?.type === 'device') {
            // const detail = instanceStore.current
            // detail.metadata = JSON.stringify(paramsDevice)
            // instanceStore.setCurrent(detail)
            message.success('导入成功')
          } else {
            // const detail = productStore.current
            // detail.metadata = params.metadata
            // productStore.setCurrent(detail)
            message.success('导入成功')
          }
        }
        if (props?.type === 'device') {
          await instanceStore.refresh(id as string)
        } else {
          await productStore.refresh(id as string)
        }
        metadataStore.set('importMetadata', true)
        // Store.set(SystemConst.GET_METADATA, true)
        // Store.set(SystemConst.REFRESH_METADATA_TABLE, true)
        close();
      } catch (e) {
        loading.value = false
        message.error(e === 'error' ? '物模型数据不正确' : '上传json格式的物模型文件')
      }
    }
  })
}

// const showProduct = computed(() => formModel.type === 'copy')
</script>
<style scoped lang="less">
.import-content {
  background: rgb(236, 237, 238);

  .import-tip {
    padding: 10px;
  }
}

.upload-button {
  width: 37px;
  height: 30px;
  line-height: 30px;
  margin: 0 -11px;
}
</style>