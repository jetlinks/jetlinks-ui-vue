<template>
  <a-drawer :mask-closable="false" width="25vw" visible :title="`${title}-${typeMapping[metadataStore.model.type]}`"
    @close="close" destroy-on-close :z-index="1000" placement="right">
    <template #extra>
      <a-button :loading="save.loading" type="primary" @click="save.saveMetadata">保存</a-button>
    </template>
    <PropertyForm v-if="metadataStore.model.type === 'properties'" :type="type"></PropertyForm>
  </a-drawer>
</template>
<script lang="ts" setup name="Edit">
import { useInstanceStore } from '@/store/instance';
import { useMetadataStore } from '@/store/metadata';
import { useProductStore } from '@/store/product';
import { MetadataItem, ProductItem } from '@/views/device/Product/typings';
import { message } from 'ant-design-vue/es';
import type { FormInstance } from 'ant-design-vue/es';
import { updateMetadata, asyncUpdateMetadata } from '../../metadata'
import { Store } from 'jetlinks-store';
import { SystemConst } from '@/utils/consts';
import { detail } from '@/api/device/instance';
import { DeviceInstance } from '@/views/device/Instance/typings';
import PropertyForm from './PropertyForm.vue';
import { PropType } from 'vue';

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

const addFormRef = ref<FormInstance>()
/**
 * 保存按钮
 */
const save = reactive({
  loading: false,
  saveMetadata: (deploy?: boolean) => {
    save.loading = true
    addFormRef.value?.validateFields().then(async (formValue) => {
      const type = metadataStore.model.type
      const _detail: ProductItem | DeviceInstance = props.type === 'device' ? instanceStore.detail : productStore.current
      const _metadata = JSON.parse(_detail?.metadata || '{}')
      const list = _metadata[type] as any[]
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
      }
      const _data = updateMetadata(type, [formValue], _detail, updateStore)
      const result = await asyncUpdateMetadata(props.type, _data)
      if (result.status === 200) {
        if ((window as any).onTabSaveSuccess) {
          if (result) {
            (window as any).onTabSaveSuccess(result);
            setTimeout(() => window.close(), 300);
          }
        } else {
          Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
          if (deploy) {
            Store.set('product-deploy', deploy);
          } else {
            save.resetMetadata();
            message.success({
              key: 'metadata',
              content: '操作成功！',
            });
          }
          metadataStore.set('edit', false)
          metadataStore.set('item', {})
          if (instanceStore.detail) {
            instanceStore.detail.independentMetadata = true;
          }
        }
      } else {
        message.error('操作失败！');
      }
      save.loading = false
    })
  },
  resetMetadata: async () => {
    const { id } = route.params
    const resp = await detail(id as string);
    if (resp.status === 200) {
      instanceStore.detail = resp?.result || [];
    }
  }
})

const form = reactive({
  model: {} as Record<string, any>
})
</script>
<style lang="less" scoped>

</style>