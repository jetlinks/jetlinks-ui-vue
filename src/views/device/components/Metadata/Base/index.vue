<template>
  <JTable :loading="loading" :data-source="data" size="small" :columns="columns" row-key="id" model="TABLE">
    <template #headerTitle>
      <a-input-search v-model:value="searchValue" placeholder="请输入名称" @search="handleSearch"></a-input-search>
      <PermissionButton :has-permission="permission" key="add" @click="handleAddClick"
        :disabled="operateLimits('add', type)" type="primary" :tooltip="{
          title: operateLimits('add', type) ? '当前的存储方式不支持新增' : '新增',
        }">
        <template #icon>
          <PlusOutlined />
        </template>
        新增
      </PermissionButton>
      <Edit v-if="metadataStore.model.edit" :type="target" :tabs="type"></Edit>
    </template>
    <template #level="slotProps">
      {{ levelMap[slotProps.expands?.level] || '-' }}
    </template>
    <template #async="slotProps">
      {{ slotProps.async ? '是' : '否' }}
    </template>
    <template #valueType="slotProps">
      {{ slotProps.valueType?.type }}
    </template>
    <template #source="slotProps">
      {{ sourceMap[slotProps.expands?.source] }}
    </template>
    <template #type="slotProps">
      <a-tag v-for="item in (slotProps.expands?.type || [])" :key="item">
        {{ expandsType[item] }}
      </a-tag>
    </template>
  </JTable>
</template>
<script setup lang="ts" name="BaseMetadata">
import type { MetadataItem, MetadataType } from '@/views/device/Product/typings'
import MetadataMapping from './columns'
import JTable, { JColumnProps } from '@/components/Table'
import { useInstanceStore } from '@/store/instance'
import { useProductStore } from '@/store/product'
import { useMetadataStore } from '@/store/metadata'
import PermissionButton from '@/components/PermissionButton/index.vue'
// import { detail } from '@/api/device/instance'
// import { detail as productDetail } from '@/api/device/product'
interface Props {
  type: MetadataType;
  target: 'product' | 'device';
  permission: string | string[];
}
const props = defineProps<Props>()
const route = useRoute()
const instanceStore = useInstanceStore()
const productStore = useProductStore()

const loading = ref(false)
const data = ref<MetadataItem[]>([])
const { type, target = 'product' } = props
const levelMap = ref({
  ordinary: '普通',
  warn: '警告',
  urgent: '紧急',
})
const sourceMap = ref({
  device: '设备',
  manual: '手动',
  rule: '规则',
});
const expandsType = ref({
  read: '读',
  write: '写',
  report: '上报',
});
const actions: JColumnProps[] = [
  {
    title: '操作',
    align: 'left',
    width: 200,
    scopedSlots: true,
  },
];
const columns = computed(() => MetadataMapping.get(type)!.concat(actions))
const items = computed(() => JSON.parse((target === 'product' ? productStore.current?.metadata : instanceStore.current.metadata) || '{}') as MetadataItem[])
const searchValue = ref<string>()
const handleSearch = (searchValue: string) => {
  if (searchValue) {
    const arr = items.value.filter(item => item.name!.indexOf(searchValue) > -1).sort((a, b) => b?.sortsIndex - a?.sortsIndex)
    data.value = arr
  } else {
    data.value = items.value
  }
}

onMounted(() => {

})

watch([route.params.id, type], () => {
  // const res = target === 'product'
  //       ? await productDetail(route.params.id as string)
  //       : await detail(route.params.id as string);
  const result = target === 'product' ? productStore.current?.metadata : instanceStore.current.metadata
  const item = JSON.parse(result || '{}') as MetadataItem[]
  data.value = item[type]?.sort((a: any, b: any) => b?.sortsIndex - a?.sortsIndex)
  loading.value = false
}, { immediate: true })

const metadataStore = useMetadataStore()
const handleAddClick = () => {
  metadataStore.set('edit', true)
  metadataStore.set('item', undefined)
  metadataStore.set('type', type)
  metadataStore.set('action', 'add')
}

const limitsMap = new Map<string, any>();
limitsMap.set('events-add', 'eventNotInsertable');
limitsMap.set('events-updata', 'eventNotModifiable');
limitsMap.set('properties-add', 'propertyNotInsertable');
limitsMap.set('properties-updata', 'propertyNotModifiable');
const operateLimits = (action: 'add' | 'updata', types: MetadataType) => {
  return (
    target === 'device' &&
    (instanceStore.detail.features || []).find((item: { id: string; name: string }) => item.id === limitsMap.get(`${types}-${action}`))
  );
};
</script>
<style scoped lang="less">

</style>