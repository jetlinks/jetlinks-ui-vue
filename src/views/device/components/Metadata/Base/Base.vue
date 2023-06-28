<template>
    <div class="table-header">
        <div>
            <j-input-search
                placeholder="请输入名称"
                @search="handleSearch"
                allowClear
            />
        </div>
        <div>
            <PermissionButton
                type="primary"
                v-if="!dataSource.length"
                :hasPermission="`${permission}:update`"
                key="add"
                @click="handleAddClick"
                :disabled="hasOperate('add', type)"
                :tooltip="{
                    title: hasOperate('add', type)
                        ? '当前的存储方式不支持新增'
                        : '新增',
                }"
            >
                新增
            </PermissionButton>
            <PermissionButton
                type="primary"
                :hasPermission="`${permission}:update`"
                key="update"
                v-else
                @click="handleSaveClick"
                :disabled="hasOperate('add', type)"
                :tooltip="{
                    title: hasOperate('add', type)
                        ? '当前的存储方式不支持新增'
                        : '保存',
                }"
            >
                保存
            </PermissionButton>
        </div>
    </div>
    <j-data-table
        ref="tableRef"
        :data-source="dataSource"
        :columns="columns"
        row-key="id"
        serial
    >
        <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'id'">
                <div style="width: 100px">
                    <j-ellipsis>{{ record.id || '-' }}</j-ellipsis>
                </div>
            </template>
            <template v-if="column.dataIndex === 'name'">
                <div style="width: 200px">
                    <j-ellipsis>{{ record.name || '-' }}</j-ellipsis>
                </div>
            </template>
            <template v-if="column.dataIndex === 'description'">
                <div style="width: 200px">
                    <j-ellipsis>{{ record.description || '-' }}</j-ellipsis>
                </div>
            </template>
            <template v-if="column.dataIndex === 'level'">
                {{ levelMap[record.expands?.level] || '-' }}
            </template>
            <template v-if="column.dataIndex === 'async'">
                {{ record.async ? '是' : '否' }}
            </template>

            <template v-if="column.dataIndex === 'source'">
                {{ sourceMap[record.expands?.source] }}
                <Rule
                    v-if="record.expands?.source === 'rule'"
                    v-model:value="record.expands"
                />
                <Source v-else v-model:value="record.expands" />
            </template>
            <template v-if="column.dataIndex === 'type'">
                <j-tag v-for="item in record.expands?.type || []" :key="item">
                    {{ expandsType[item] }}
                </j-tag>
            </template>
            <template v-if="column.dataIndex === 'action'"> </template>
        </template>
        <template #valueType="{ data }">
            {{ data.record.valueType?.type }}
        </template>
        <template #expands="{ data }">
            {{ sourceMap?.[data.record?.expands?.source] || '' }}
        </template>
        <template #inputs="{ data }">
        {{ data.record.inputs.map(item => item.name).join(',') }}
      </template>
      <template #output="{ data }">
        {{ data.record.output.type }}
      </template>
      <template #async="{ data }">
        {{ data.record.async ? '是' : '否' }}
      </template>
    </j-data-table>
</template>

<script setup lang="ts" name="BaseMetadata">
import type {
    MetadataItem,
    MetadataType,
    ProductItem,
} from '@/views/device/Product/typings';
import type { PropType } from 'vue';
import { useMetadata, useOperateLimits } from './hooks';
import MetadataMapping from './columns';
import { levelMap, sourceMap, expandsType } from './utils';
import Rule from '@/components/Metadata/Rule';
import { Source } from './components';
import { saveProductVirtualProperty } from '@/api/device/product';
import { saveDeviceVirtualProperty } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import { asyncUpdateMetadata, updateMetadata } from '../metadata';
import { useMetadataStore } from '@/store/metadata';
import { DeviceInstance } from '@/views/device/Instance/typings';
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    // target: {
    //     type: String as PropType<'device' | 'product'>,
    //     default: 'product',
    // },
    type: {
        type: String as PropType<MetadataType>,
        default: undefined,
    },
    permission: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
});

const target = inject<'device' | 'product'>('_metadataType', 'product');

const { data: metadata } = useMetadata(target, props.type);
const { hasOperate } = useOperateLimits(target);

const metadataStore = useMetadataStore()
const instanceStore = useInstanceStore()
const productStore = useProductStore()

const dataSource = ref<MetadataItem[]>(metadata.value);
const tableRef = ref();
const columns = computed(() => MetadataMapping.get(props.type!));

const handleSearch = (searchValue: string) => {
    dataSource.value = searchValue
        ? metadata.value
              .filter((item) => item.name!.indexOf(searchValue) > -1)
              .sort((a, b) => b?.sortsIndex - a?.sortsIndex)
        : metadata.value;
};

const handleAddClick = () => {
  dataSource.value.push({
    id: undefined,
    name: undefined,
    expands: {
      source: 'device'
    },
    valueType: {
      type: undefined
    }
  })
};

const handleSaveClick = async () => {
    const resp = await tableRef.value.getData().finally(() => {

    });
    if(resp && resp.length) {
      const virtual: any[] = [];
      const arr = resp.map((item: any) => {
        if(item.expands.virtualRule) {
          virtual.push({
            ...item.expands.virtualRule,
            propertyId: item.id
          })
        }
        return {
          ...item,
          expands: {
            ...item.expands,
            virtualRule: undefined
          }
        }
      })
      // 保存规则
      if(virtual.length) {
        let res = undefined
        if(target === 'device') {
          res = await saveDeviceVirtualProperty(instanceStore.current.productId, instanceStore.current.id, virtual)
        } else {
          res = await saveProductVirtualProperty(productStore.current.id, virtual)
        }
      }
      // 保存属性
      const updateStore = (metadata: string) => {
        if (target === 'device') {
          const detail = instanceStore.current
          detail.metadata = metadata
          instanceStore.setCurrent(detail)
        } else {
          const detail = productStore.current || {} as ProductItem
          detail.metadata = metadata
          productStore.setCurrent(detail)
        }
      }
      const _detail: ProductItem | DeviceInstance = target === 'device' ? instanceStore.detail : productStore.current
      const type = metadataStore.model.type
      const _data = updateMetadata(type, arr, _detail, updateStore)
      const result = await asyncUpdateMetadata(target, _data)
      if(result.success) {
        onlyMessage('操作成功！')
      }
    }
};
</script>

<style scoped>
.table-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
}
</style>