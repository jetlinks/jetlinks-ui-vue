<template>
    <j-data-table
        ref="tableRef"
        v-model:data-source="dataSource"
        :columns="columns"
        :height="560"
        :searchProps="{
          placeholder: '请输入搜索名称'
        }"
        serial
    >
        <template #expand>
          <PermissionButton
              type="primary"
              v-if="!dataSource.length"
              :hasPermission="`${permission}:update`"
              key="add"
              @click="handleAddClick()"
              :disabled="hasOperate('add', type)"
              :tooltip="{
                    placement: hasOperate('add', type) ? 'topRight' : 'top',
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
                    placement: hasOperate('add', type) ? 'topRight' : 'top',
                }"
          >
            保存
          </PermissionButton>
        </template>
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
          <InputParams v-model:value="dataSource[data.index]" />
        </template>
        <template #output="{ data }">
          {{ data.record.output?.type }}
        </template>
        <template #async="{ data }">
          {{ data.record.async ? '是' : '否' }}
        </template>
        <template #expands="{ data }" v-if="type === 'events'">
          {{ levelMap?.[data.record.expands?.level] || '-' }}
        </template>
        <template #properties="{ data }">
          <ConfigParams v-model:value="dataSource[data.index]" />
        </template>
        <template #outInput>
          object
        </template>
        <template #readType="{data}">
          <j-tag v-for="item in data.record?.expands?.type || []" :key="item">
            {{ expandsType[item] }}
          </j-tag>
        </template>
        <template #other="{ data }">
          <OtherSetting v-model:value="dataSource[data.index]" />
        </template>
        <template #action="{data}">
          <j-space>
            <PermissionButton
                :has-permission="`${permission}:add`"
                type="link"
                key="edit"
                style="padding: 0"
                :disabled="operateLimits('add', type)"
                @click="copyItem(data.record, data.index)"
                :tooltip="{
                  title: operateLimits('add', type) ? '当前的存储方式不支持复制' : '复制',
                }"
            >
              <AIcon type="CopyOutlined" />
            </PermissionButton>
            <PermissionButton
                :has-permission="`${permission}:update`"
                type="link"
                key="edit"
                style="padding: 0"
                :disabled="operateLimits('add', type)"
                @click="handleAddClick(null, data.index)"
                :tooltip="{
                  title: operateLimits('add', type) ? '当前的存储方式不支持新增' : '新增',
                }"
            >
              <AIcon type="PlusSquareOutlined" />
            </PermissionButton>
            <PermissionButton
                v-if="type !== 'tags'"
                :has-permission="true"
                type="link"
                key="edit"
                style="padding: 0"
                @click="showDetail(data.record)"
                :tooltip="{
                  title: '详情',
                }"
            >
              <AIcon type="FileSearchOutlined" />
            </PermissionButton>
            <PermissionButton
                :has-permission="`${permission}:delete`"
                type="link"
                key="delete"
                style="padding: 0"
                danger
                :pop-confirm="{
                title: dataSource.length === 1 ? '这是最后一条数据了，确认删除？' : '确认删除？',
                onConfirm: async () => {
                    await removeItem(data.index, dataSource.length === 1);
                  },
                }"
                :tooltip="{
                  title: '删除',
                }"
            >
              <AIcon type="DeleteOutlined" />
            </PermissionButton>
          </j-space>
        </template>
    </j-data-table>
    <PropertiesModal
        v-if="type === 'properties' && detailData.visible"
        :data="detailData.data"
        @cancel="cancelDetailModal"
    />
    <FunctionModal
        v-else-if="type === 'functions' && detailData.visible"
        :data="detailData.data"
        @cancel="cancelDetailModal"
    />
    <EventModal
        v-else-if="type === 'events' && detailData.visible"
        :data="detailData.data"
        @cancel="cancelDetailModal"
    />
</template>

<script setup lang="ts" name="BaseMetadata">
import type {
    MetadataItem,
    MetadataType,
    ProductItem,
} from '@/views/device/Product/typings';
import type { PropType } from 'vue';
import { useMetadata, useOperateLimits } from './hooks';
import { useColumns } from './columns';
import { levelMap, sourceMap, expandsType, limitsMap } from './utils';
import Rule from '@/components/Metadata/Rule';
import { Source, OtherSetting, InputParams, ConfigParams } from './components';
import { saveProductVirtualProperty } from '@/api/device/product';
import { saveDeviceVirtualProperty } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import { asyncUpdateMetadata, updateMetadata } from '../metadata';
import { useMetadataStore } from '@/store/metadata';
import { DeviceInstance } from '@/views/device/Instance/typings';
import { onlyMessage } from '@/utils/comm';
import {omit} from "lodash-es";
import {useAction} from "@/views/device/components/Metadata/Base/hooks/useAction";
import { PropertiesModal, FunctionModal, EventModal } from './DetailModal'

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

const { data: metadata, noEdit } = useMetadata(target, props.type);
const { hasOperate } = useOperateLimits(target);

const metadataStore = useMetadataStore()
const instanceStore = useInstanceStore()
const productStore = useProductStore()

const dataSource = ref<MetadataItem[]>(metadata.value || []);
const tableRef = ref();

// const columns = computed(() => MetadataMapping.get(props.type!));
const {columns} = useColumns(props.type, target, dataSource, noEdit)

const detailData = reactive({
  data: {},
  visible:false
})
const { addAction, copyAction, removeAction } = useAction(tableRef)

provide('_dataSource', dataSource.value)

const showDetail = (data: any) => {
  detailData.data = data
  detailData.visible = true
}

const cancelDetailModal = () => {
  detailData.data = {}
  detailData.visible = false
}

const operateLimits = (action: 'add' | 'updata', types: MetadataType) => {
  return (
      target === 'device' &&
      (instanceStore.detail.features || []).find((item: { id: string; name: string }) => item.id === limitsMap.get(`${types}-${action}`))
  );
};

const handleSearch = (searchValue: string) => {
    dataSource.value = searchValue
        ? metadata.value
              .filter((item) => item.name!.indexOf(searchValue) > -1)
              .sort((a, b) => b?.sortsIndex - a?.sortsIndex)
        : metadata.value;
};

const getDataByType = () => {
  let _data: any = {
    id: undefined,
    name: undefined,
    expands: {
      source: 'device'
    },
    valueType: {
      type: undefined
    }
  }

  if (props.type === 'functions') {
    _data = {
      id: undefined,
      name: undefined,
      async: false,
      inputs: [],
      output: {
        type: undefined
      }
    }
  } else if (props.type === 'events') {
    _data = {
      id: undefined,
      name: undefined,
      async: false,
      valueType: {
        type: 'object',
        properties: []
      },
      expands: {
        level: undefined
      }

    }
  } else if (props.type === 'tags') {
    _data = {
      id: undefined,
      name: undefined,
      valueType: {
        type: undefined
      },
      expands: {
        type: undefined
      }
    }
  }

  return _data
}

const handleAddClick = async (_data?: any, index?: number) => {

  const newObject = _data || getDataByType()

  

  const data = [...dataSource.value];

  if (index !== undefined) {
    //  校验
    const _data = await tableRef.value.getData()
    console.log(_data)
    if (_data) {
      data.splice(index + 1, 0, newObject);
    }
  } else {
      data.push(newObject);
  }
  dataSource.value = data
  const _index = index !== undefined ? index + 1 : 0
  tableRef.value?.addItemAll?.(_index)
};

const copyItem = (record: any, index: number) => {
  const copyData = omit(record, ['_uuid', '_sortIndex'])
  copyData.id = `copy_${copyData.id}`.slice(0,64)
  handleAddClick(copyData, index)
}

const removeItem = (index: number, isSave: false) => {
  const data = [...dataSource.value];
  data.splice(index, 1);
  dataSource.value = data
  if (isSave) {
    handleSaveClick()
  }
}

const handleSaveClick = async () => {
    let resp = []
    if (dataSource.value.length) {
      resp = await tableRef.value.getData().finally(() => {

      });
    }
    if(resp) {

      const virtual: any[] = [];
      const arr = resp.map((item: any) => {
        if(item.expands?.virtualRule) {
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
      let _data = updateMetadata(props.type!, arr, _detail, updateStore)

      const result = await asyncUpdateMetadata(target, _data)
      if(result.success) {
        dataSource.value = resp
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