<template>
  <div class="table-header">
    <div>
      <j-input-search v-model:value="searchValue" :placeholder="$t('Base.index.691584-0')" @search="handleSearch" allowClear></j-input-search>
    </div>
    <div>
      <PermissionButton type="primary" :hasPermission="`${permission}:update`" key="add" @click="handleAddClick"
        :disabled="operateLimits('add', type)" :tooltip="{
          title: operateLimits('add', type) ? $t('Base.index.691584-1') : $t('Base.index.691584-2'),
        }">
        <template #icon>
          <AIcon type="PlusOutlined" />
        </template>
        {{ $t('Base.index.691584-2') }}
      </PermissionButton>
      <Edit v-if="metadataStore.model.edit" :type="target" :tabs="type" @refresh="refreshMetadata"></Edit>
    </div>
  </div>
  <j-table :loading="loading" :data-source="data" :columns="columns" row-key="id" model="TABLE" size="small"
    :pagination="pagination">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'id'">
        <div style="width: 100px"><Ellipsis>{{ record.id || '-' }}</Ellipsis></div>
      </template>
      <template v-if="column.dataIndex === 'name'">
        <div style="width: 200px"><Ellipsis>{{ record.name || '-' }}</Ellipsis></div>
      </template>
      <template v-if="column.dataIndex === 'description'">
        <div style="width: 200px"><Ellipsis>{{ record.description || '-' }}</Ellipsis></div>
      </template>
      <template v-if="column.dataIndex === 'level'">
        {{ levelMap[record.expands?.level] || '-' }}
      </template>
      <template v-if="column.dataIndex === 'async'">
        {{ record.async ? $t('Base.index.691584-3') : $t('Base.index.691584-4') }}
      </template>
      <template v-if="column.dataIndex === 'valueType'">
        {{ record.valueType?.type }}
      </template>
      <template v-if="column.dataIndex === 'source'">
        {{ sourceMap[record.expands?.source] }}
      </template>
      <template v-if="column.dataIndex === 'type'">
        <j-tag v-for="item in (record.expands?.type || [])" :key="item">
          {{ expandsType[item] }}
        </j-tag>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <j-space>
          <PermissionButton :has-permission="`${permission}:update`" type="link" key="edit" style="padding: 0"
            :disabled="operateLimits('updata', type)" @click="handleEditClick(record)" :tooltip="{
              title: operateLimits('updata', type) ? $t('Base.index.691584-5') : $t('Base.index.691584-6'),
            }">
            <AIcon type="EditOutlined" />
          </PermissionButton>
          <PermissionButton :has-permission="`${permission}:delete`" type="link" key="delete" style="padding: 0" danger
            :pop-confirm="{
              title: $t('Base.index.691584-7'), onConfirm: async () => {
                await removeItem(record);
              },
            }" :tooltip="{
  title: $t('Base.index.691584-8'),
}">
            <AIcon type="DeleteOutlined" />
          </PermissionButton>
        </j-space>
      </template>
    </template>
  </j-table>
</template>
<script setup lang="ts" name="BaseMetadata">
import type { MetadataItem, MetadataType } from '@/views/device/Product/typings'
import { useColumns } from './columns';
import { useInstanceStore } from '@/store/instance'
import { useProductStore } from '@/store/product'
import { useMetadataStore } from '@/store/metadata'
import PermissionButton from '@/components/PermissionButton/index.vue'
import { TablePaginationConfig } from 'ant-design-vue/es'
import { asyncUpdateMetadata, removeMetadata } from '../metadata'
import Edit from './Edit/index.vue'
import { ColumnProps } from 'ant-design-vue/es/table'
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
  ordinary: $t('Base.index.691584-9'),
  warn: $t('Base.index.691584-10'),
  urgent: $t('Base.index.691584-11'),
})
const sourceMap = ref({
  device: $t('Base.index.691584-12'),
  manual: $t('Base.index.691584-13'),
  rule: $t('Base.index.691584-14'),
});
const expandsType = ref({
  read: $t('Base.index.691584-15'),
  write: $t('Base.index.691584-16'),
  report: $t('Base.index.691584-17'),
});
const actions: ColumnProps[] = [
  {
    title: $t('Base.index.691584-18'),
    align: 'left',
    width: 80,
    dataIndex: 'action',
  },
];
const pagination = {
  showTotal: (num: number, range: number[]) => {
    return $t('Base.index.691584-19', [range[0],range[1],num]);
  },
  showSizeChanger: true,
  showQuickJumper: false,
  defaultPageSize: 10,
  size: 'small',
} as TablePaginationConfig
// const columns = computed(() => MetadataMapping.get(type)!.concat(actions))
const { columns } = useColumns(type)
const items = computed(() => JSON.parse((target === 'product' ? productStore.current?.metadata : instanceStore.current.metadata) || '{}'))
const searchValue = ref<string>()
const handleSearch = (searchValue: string) => {
  if (searchValue) {
    const arr = items.value[type].filter((item: MetadataItem) => item.name!.indexOf(searchValue) > -1).sort((a: MetadataItem, b: MetadataItem) => b?.sortsIndex - a?.sortsIndex)
    data.value = arr
  } else {
    data.value = items.value[type]
  }
}

const refreshMetadata = () => {
  loading.value = true
  // const res = target === 'product'
  //       ? await productDetail(route.params.id as string)
  //       : await detail(route.params.id as string);
  const result = target === 'product' ? productStore.current?.metadata : instanceStore.current.metadata
  const item = JSON.parse(result || '{}') as MetadataItem[]
  console.log(item)
  data.value = item[type]?.sort((a: any, b: any) => b?.sortsIndex - a?.sortsIndex)
  loading.value = false
}
watch([route.params.id, type], refreshMetadata, { immediate: true })

const metadataStore = useMetadataStore()
watch(() => metadataStore.model.importMetadata,
  (val: boolean) => {
    if (!!val) {
      refreshMetadata()
      metadataStore.set('importMetadata', false)
    }
  })
const handleAddClick = () => {
  metadataStore.set('edit', true)
  metadataStore.set('item', undefined)
  metadataStore.set('type', type)
  metadataStore.set('action', 'add')
  if (props.target === 'device' && !instanceStore.detail?.independentMetadata) {
    onlyMessage($t('Base.index.691584-20'), 'warning')
  }
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

const handleEditClick = (record: MetadataItem) => {
  metadataStore.model.edit = true;
  metadataStore.model.item = record;
  metadataStore.model.type = type;
  metadataStore.model.action = 'edit';
  if (props.target === 'device' && !instanceStore.detail?.independentMetadata) {
    onlyMessage($t('Base.index.691584-20'), 'warning');
  }
}

const resetMetadata = async () => {
  // const { id } = route.params
  // const resp = await detail(id as string);
  // if (resp.status === 200) {
  //   instanceStore.setCurrent(resp?.result || []);
  // }
  const { id } = route.params
  if (target === 'device') {
    await instanceStore.refresh(id as string)
  } else {
    await productStore.getDetail(id as string)
  }
  metadataStore.set('importMetadata', true)
  
};

const removeItem = async (record: MetadataItem) => {
  // const removeDB = () => {
  //   return DB.getDB().table(`${type}`).delete(record.id!);
  // };
  const _currentData = removeMetadata(type, [record], target === 'device' ? instanceStore.current : productStore.detail);
  const result = await asyncUpdateMetadata(target, _currentData);
  if (result.status === 200) {
    onlyMessage($t('Base.index.691584-21'));
    // Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
    metadataStore.model.edit = false;
    metadataStore.model.item = {};
    resetMetadata();
  } else {
    onlyMessage($t('Base.index.691584-22'), 'error');
  }
};
</script>
<style scoped lang="less">
.table-header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
}
</style>