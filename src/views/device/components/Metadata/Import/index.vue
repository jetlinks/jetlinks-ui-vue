<template>
  <a-modal :mask-closable="false" title="导入物模型" destroy-on-close v-model:visible="_visible" @cancel="close"
    @ok="handleImport" :confirm-loading="loading">
    <div class="import-content">
      <p class="import-tip">
        <exclamation-circle-outlined style="margin-right: 5px" />
        导入的物模型会覆盖原来的属性、功能、事件、标签，请谨慎操作。
      </p>
    </div>
    <a-form layout="vertical" v-model="formModel">
      <a-form-item v-if="type === 'product'" label="导入方式" v-bind="validateInfos.type">
        <a-select v-model:value="formModel.type">
          <a-select-option value="copy">拷贝产品</a-select-option>
          <a-select-option value="import">导入物模型</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="选择产品" v-bind="validateInfos.copy" v-if="formModel.type === 'copy'">
        <a-select :options="productList" v-model:value="formModel.copy" option-filter-prop="label"></a-select>
      </a-form-item>
      <a-form-item label="物模型类型" v-bind="validateInfos.metadata"
        v-if="type === 'device' || formModel.type === 'import'">
        <a-select v-model:value="formModel.metadata">
          <a-select-option value="jetlinks">Jetlinks物模型</a-select-option>
          <a-select-option value="alink">阿里云物模型TSL</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="导入类型" v-bind="validateInfos.metadataType"
        v-if="type === 'device' || formModel.type === 'import'">
        <a-select v-model:value="formModel.metadataType">
          <a-select-option value="file">文件上传</a-select-option>
          <a-select-option value="script">脚本</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="文件上传" v-bind="validateInfos.upload" v-if="formModel.metadataType === 'file'">
        <a-input v-model:value="formModel.upload">
          <template #addonAfter>
            <label for="uploadFile"><upload-outlined/></label>
          </template>
        </a-input>
        <a-upload v-model:file-list="fileList" name="files" :before-upload="beforeUpload" accept=".json"
          :show-upload-list="false" :action="FILE_UPLOAD" @change="fileChange" :headers="{ 'X-Access-Token': token }">
          <button id="uploadFile" style="display: none;"></button>
        </a-upload>
      </a-form-item>
      <a-form-item label="物模型" v-bind="validateInfos.import" v-if="formModel.metadataType === 'script'">
        <!-- TODO代码编辑器 -->
        <a-textarea v-model:value="formModel.import"></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts" name="Import">
import { useForm } from 'ant-design-vue/es/form';
import { saveMetadata } from '@/api/device/instance'
import { queryNoPagingPost, convertMetadata, modify } from '@/api/device/product'
import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type { UploadProps, UploadFile, UploadChangeParam } from 'ant-design-vue/es';
import type { DeviceMetadata, ProductItem } from '@/views/device/Product/typings'
import { message } from 'ant-design-vue/es';
import { Store } from 'jetlinks-store';
import { SystemConst } from '@/utils/consts';
import { useInstanceStore } from '@/store/instance'
import { useProductStore } from '@/store/product';
import { UploadOutlined } from '@ant-design/icons-vue';
import { FILE_UPLOAD } from '@/api/comm';
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';

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
  console.log(1)
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
const onSubmit = () => {
  validate().then(() => {

  })
}
const fileList = ref<UploadFile[]>([])
const token = ref(LocalStore.get(TOKEN_KEY));

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
    console.log(info)
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

const handleImport = async () => {
  validate().then(async (data) => {
    loading.value = true
    if (data.metadata === 'alink') {
      const res = await convertMetadata('from', 'alink', data.import)
      if (res.status === 200) {
        const metadata = JSON.stringify(operateLimits(res.result))
        const { id } = route.params || {}
        if (props?.type === 'device') {
          await saveMetadata(id as string, metadata)
          instanceStore.setCurrent(JSON.parse(metadata || '{}'))
        } else {
          await modify(id as string, { metadata: metadata })
          productStore.setCurrent(JSON.parse(metadata || '{}'))
        }
        loading.value = false
        // MetadataAction.insert(JSON.parse(metadata || '{}'));
        message.success('导入成功')
      } else {
        loading.value = false
        message.error('发生错误!')
      }
      Store.set(SystemConst.GET_METADATA, true)
      Store.set(SystemConst.REFRESH_METADATA_TABLE, true)
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
        const paramsDevice = JSON.stringify(operateLimits(_object as DeviceMetadata))
        let resp = undefined
        if (props?.type === 'device') {
          resp = await saveMetadata(id as string, paramsDevice)
        } else {
          resp = await modify(id as string, params)
        }
        loading.value = false
        if (resp.status === 200) {
          if (props?.type === 'device') {
            const metadata: DeviceMetadata = JSON.parse(paramsDevice || '{}')
            // MetadataAction.insert(metadata);
            instanceStore.setCurrent(metadata)
            message.success('导入成功')
          } else {
            const metadata: ProductItem = JSON.parse(params?.metadata || '{}')
            // MetadataAction.insert(metadata);
            productStore.setCurrent(metadata)
            message.success('导入成功')
          }
        }
        Store.set(SystemConst.GET_METADATA, true)
        Store.set(SystemConst.REFRESH_METADATA_TABLE, true)
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
</style>