<template>
  <j-drawer :mask-closable="false" width="25vw" visible :title="`${title}-${typeMapping[metadataStore.model.type]}`"
    @close="close" destroy-on-close :z-index="1000" placement="right">
    <template #extra>
      <j-button :loading="save.loading" type="primary" @click="() => save.saveMetadata()">保存</j-button>
    </template>
    <j-form ref="formRef" :model="form.model" layout="vertical">
      <BaseForm :model-type="metadataStore.model.type" :type="type" v-model:value="form.model"></BaseForm>
    </j-form>
  </j-drawer>
</template>
<script lang="ts" setup name="Edit">
import { useInstanceStore } from '@/store/instance';
import { useMetadataStore } from '@/store/metadata';
import { useProductStore } from '@/store/product';
import { ProductItem } from '@/views/device/Product/typings';
import { message } from 'ant-design-vue/es';
import type { FormInstance } from 'ant-design-vue/es';
import { updateMetadata, asyncUpdateMetadata } from '../../metadata'
import { detail } from '@/api/device/instance';
import { DeviceInstance } from '@/views/device/Instance/typings';
import BaseForm from './BaseForm.vue';
import { PropType } from 'vue';
import { _deploy } from '@/api/device/product';
import { cloneDeep } from 'lodash';

const props = defineProps({
  type: {
    type: String as PropType<'product' | 'device'>,
    required: true,
    default: 'product'
  },
  tabs: {
    type: String
  }
})
interface Emits {
  (e: 'refresh'): void;
}
const emit = defineEmits<Emits>()

const route = useRoute()

const instanceStore = useInstanceStore()
const productStore = useProductStore()
const metadataStore = useMetadataStore()
const typeMapping: Record<string, string> = {
  properties: '属性',
  events: '事件',
  functions: '功能',
  tags: '标签',
};
const close = () => {
  metadataStore.set('edit', false)
  metadataStore.set('item', {})
}

const title = computed(() => metadataStore.model.action === 'add' ? '新增' : '修改')

const form = reactive({
  model: {} as any,
})
if (metadataStore.model.action === 'edit') {
  form.model = cloneDeep(metadataStore.model.item)
}

const formRef = ref<FormInstance>()
/**
 * 保存按钮
 */
const save = reactive({
  loading: false,
  saveMetadata: (deploy?: boolean) => {
    save.loading = true
    formRef.value?.validateFields().then(async (formValue) => {
      const type = metadataStore.model.type
      const _detail: ProductItem | DeviceInstance = props.type === 'device' ? instanceStore.detail : productStore.current
      const _metadata = JSON.parse(_detail?.metadata || '{}')
      const list = (_metadata[type] as any[]) || []
      if (formValue.id) {
        if (metadataStore.model.action === 'add' && list.some(item => item.id === formValue.id)) {
          message.error('标识已存在')
          save.loading = false
          return
        }
      }
      const updateStore = (metadata: string) => {
        if (props.type === 'device') {
          const detail = instanceStore.current
          detail.metadata = metadata
          instanceStore.setCurrent(detail)
        } else {
          const detail = productStore.current || {} as ProductItem
          detail.metadata = metadata
          productStore.setCurrent(detail)
        }
        emit('refresh')
      }
      const _data = updateMetadata(type, [formValue], _detail, updateStore)
      const result = await asyncUpdateMetadata(props.type, _data)
      if (result.success) {
        if ((window as any).onTabSaveSuccess) {
          if (result) {
            (window as any).onTabSaveSuccess(result);
            setTimeout(() => window.close(), 300);
          }
        } else {
          const { id } = route.params
          if (props?.type === 'device') {
            instanceStore.refresh(id as string)
          } else {
            productStore.getDetail(id as string)
          }
          // Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
          if (deploy) {
            const res = await _deploy(id as string)
            if (res.success) {
              save.resetMetadata();
              message.success({
                key: 'metadata',
                content: '操作成功！',
              });
            } else {
              message.error('操作失败！');
            }
            // Store.set('product-deploy', deploy);
          } else {
            // save.resetMetadata();
            message.success({
              key: 'metadata',
              content: '操作成功！',
            });
          }
          metadataStore.set('edit', false)
          metadataStore.set('item', {})
          // if (props?.type === 'device' && instanceStore.detail) {
          //   instanceStore.detail.independentMetadata = true;
          // }
        }
      } else {
        message.error('操作失败！');
      }
      save.loading = false
    })
    save.loading = false
  },
  resetMetadata: async () => {
    const { id } = route.params
    const resp = await detail(id as string);
    if (resp.status === 200) {
      instanceStore.detail = resp?.result || [];
    }
  }
})

</script>
<style scoped lang="less">
:deep(.ant-form-item-label) {
  line-height: 1;

  >label {
    font-size: 12px;

    &.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
      font-size: 12px;
    }
  }
}

:deep(.ant-form-item-explain) {
  font-size: 12px;
}

:deep(.ant-form-item-with-help) {
  .ant-form-item-explain {
    min-height: 20px;
    line-height: 20px;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 20px;

  &.ant-form-item-with-help {
    margin-bottom: 0;
  }

  input {
    font-size: 12px;
  }
}

:deep(.ant-input),
:deep(.ant-select) {
  font-size: 12px;
}
</style>