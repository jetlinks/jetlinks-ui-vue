<template>
  <div class="table-header">
    <div>
      <j-input-search v-model:value="searchValue" placeholder="请输入名称" @search="handleSearch"></j-input-search>
    </div>
    <div>
      <PermissionButton type="primary" :uhas-permission="`${permission}:update`" key="add" @click="handleAddClick"
        :disabled="operateLimits('add', type)" :tooltip="{
          title: operateLimits('add', type) ? '当前的存储方式不支持新增' : '新增',
        }">
        <template #icon>
          <AIcon type="PlusOutlined" />
        </template>
        新增
      </PermissionButton>
      <Edit v-if="metadataStore.model.edit" :type="target" :tabs="type" @refresh="refreshMetadata"></Edit>
    </div>
  </div>
  <a-table :loading="loading" :data-source="data" :columns="columns" row-key="id" model="TABLE" size="small"
    :pagination="pagination">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'level'">
        {{ levelMap[record.expands?.level] || '-' }}
      </template>
      <template v-if="column.dataIndex === 'async'">
        {{ record.async ? '是' : '否' }}
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
              title: operateLimits('updata', type) ? '当前的存储方式不支持编辑' : '编辑',
            }">
            <AIcon type="EditOutlined" />
          </PermissionButton>
          <PermissionButton :has-permission="`${permission}:delete`" type="link" key="delete" style="padding: 0"
            :pop-confirm="{
              title: '确认删除？', onConfirm: async () => {
                await removeItem(record);
              },
            }" :tooltip="{
  title: '删除',
}">
            <AIcon type="DeleteOutlined" />
          </PermissionButton>
        </j-space>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts" name="BaseMetadata">
import type { MetadataItem, MetadataType } from '@/views/device/Product/typings'
import MetadataMapping from './columns'
import { useInstanceStore } from '@/store/instance'
import { useProductStore } from '@/store/product'
import { useMetadataStore } from '@/store/metadata'
import PermissionButton from '@/components/PermissionButton/index.vue'
import { TablePaginationConfig, message } from 'ant-design-vue/es'
import { asyncUpdateMetadata, removeMetadata } from '../metadata'
import Edit from './Edit/index.vue'
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
const actions = [
  {
    title: '操作',
    align: 'left',
    width: 200,
    dataIndex: 'action',
    scopedSlots: true,
  },
];
const pagination = {
  showTotal: (num: number, range: number[]) => {
    return `第 ${range[0]} - ${range[1]} 条/总共 ${num} 条`;
  },
  showSizeChanger: true,
  showQuickJumper: false,
  defaultPageSize: 10,
  size: 'small',
} as TablePaginationConfig
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

const refreshMetadata = () => {
  loading.value = true
  // const res = target === 'product'
  //       ? await productDetail(route.params.id as string)
  //       : await detail(route.params.id as string);
  const result = target === 'product' ? productStore.current?.metadata : instanceStore.current.metadata
  const item = JSON.parse(result || '{}') as MetadataItem[]
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
    message.warning('修改物模型后会脱离产品物模型')
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
    message.warning('修改物模型后会脱离产品物模型');
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
    instanceStore.refresh(id as string)
  } else {
    productStore.refresh(id as string)
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
    message.success('操作成功！');
    // Store.set(SystemConst.REFRESH_METADATA_TABLE, true);
    metadataStore.model.edit = false;
    metadataStore.model.item = {};
    resetMetadata();
  } else {
    message.error('操作失败！');
  }
};
</script>
<style scoped lang="less">
.table-header {
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
}
</style>