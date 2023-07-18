<template>
    <j-data-table
        ref="tableRef"
        :data-source="dataSource"
        :columns="columns"
        :height="560"
        :searchProps="{
          placeholder: '请输入搜索名称'
        }"
        serial
        @editStatus="editStatusChange"
        @change="(data) => dataSourceCache = data"
    >
        <template #expand>
          <PermissionButton
              type="primary"
              v-if="!showSave"
              :hasPermission="`${permission}:update`"
              key="add"

              :disabled="hasOperate('add', type)"
              :tooltip="{
                    placement: hasOperate('add', type) ? 'topRight' : 'top',
                    title: hasOperate('add', type)
                        ? '当前的存储方式不支持新增'
                        : '新增',
                }"
              @click="handleAddClick()"
          >
            新增
          </PermissionButton>
          <PermissionButton
              type="primary"
              :hasPermission="`${permission}:update`"
              key="update"
              v-else
              :loading="loading"

              :disabled="hasOperate('add', type) || !editStatus"
              :tooltip="{
                    title: hasOperate('add', type)
                        ? '当前的存储方式不支持新增'
                        : !editStatus ? '暂无改动数据': '保存',
                    placement: hasOperate('add', type) ? 'topRight' : 'top',
                }"
              @click="handleSaveClick()"
          >
            保存
          </PermissionButton>
        </template>
        <template #valueType="{ data }">
            {{ TypeStringMap[data.record.valueType?.type] }}
        </template>
        <template #expands="{ data }">
            {{ sourceMap?.[data.record?.expands?.source] || '' }}
        </template>
        <template #inputs="{ data }">
          <InputParams v-model:value="data.record.inputs" />
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
          <ConfigParams v-model:value="data.record.valueType" />
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
          <j-tooltip
            v-if="target === 'device' && productNoEdit.id?.includes?.(data.record._sortIndex)"
            title="继承自产品物模型的数据不支持删除"
          >
<!--            <ModelButton :disabled="true"/>-->
            <j-button :disabled="true" type="link" style="padding-left: 0;">
              <AIcon type="SettingOutlined" />
              配置
            </j-button>
          </j-tooltip>
          <OtherSetting
              v-else
           v-model:value="data.record.expands"
              :id="data.record.id"
           :type="data.record.valueType.type"
          :disabled="target === 'device' && productNoEdit.id?.includes?.(data.record._sortIndex)"
           :tooltip="target === 'device' && productNoEdit.id?.includes?.(data.record._sortIndex) ? {
              title: '继承自产品物模型的数据不支持删除',
            } : undefined"
          />
        </template>
        <template #action="{data}">
          <j-space>
            <PermissionButton
                :has-permission="`${permission}:add`"
                type="link"
                key="edit"
                style="padding: 0"
                :disabled="!!operateLimits('add', type)"
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
                :disabled="!!operateLimits('add', type)"
                @click="handleAddClick(null, data.index)"
                :tooltip="{
                  title: operateLimits('add', type) ? '当前的存储方式不支持新增' : '新增',
                }"
            >
              <AIcon type="PlusSquareOutlined" />
            </PermissionButton>
            <PermissionButton
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
                  placement: 'topRight',
                  title: showLastDelete ? '这是最后一条数据了，确认删除？' : '确认删除？',
                  onConfirm: async () => {
                      await removeItem(data.index);
                    },
                  }"
                :tooltip="{
                  placement: 'topRight',
                  title: target === 'device' && productNoEdit.id?.includes?.(data.record._sortIndex) ? '继承自产品物模型的数据不支持删除' :'删除',
                }"
                :disabled="target === 'device' && productNoEdit.id?.includes?.(data.record._sortIndex)"
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
    <TagsModal
        v-else-if="type === 'tags' && detailData.visible"
        :data="detailData.data"
        @cancel="cancelDetailModal"
    />
</template>

<script setup lang="ts" name="MetadataBase">
import type {
    MetadataItem,
    MetadataType,
    ProductItem,
} from '@/views/device/Product/typings';
import type { PropType } from 'vue';
import { onBeforeRouteLeave } from 'vue-router'
import { useMetadata, useOperateLimits } from './hooks';
import {TypeStringMap, useColumns} from './columns';
import { levelMap, sourceMap, expandsType, limitsMap } from './utils';
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
import { PropertiesModal, FunctionModal, EventModal, TagsModal } from './DetailModal'
import { Modal } from 'jetlinks-ui-components'
import {EventEmitter} from "@/utils/utils";
import {watch} from "vue";
import {cloneDeep} from "lodash";

const props = defineProps({
    target: {
        type: String as PropType<'device' | 'product'>,
        default: 'product',
    },
    type: {
        type: String as PropType<MetadataType>,
        default: undefined,
    },
    permission: {
        type: [String, Array] as PropType<string | string[]>,
        default: undefined,
    },
});

const _target = inject<'device' | 'product'>('_metadataType', props.target);

const { data: metadata, noEdit, productNoEdit } = useMetadata(_target, props.type);
const { hasOperate } = useOperateLimits(_target);

const metadataStore = useMetadataStore()
const instanceStore = useInstanceStore()
const productStore = useProductStore()

const dataSource = ref<MetadataItem[]>(metadata.value || []);
const tableRef = ref();
const loading = ref(false)
const editStatus = ref(false) // 编辑表格的编辑状态

// const columns = computed(() => MetadataMapping.get(props.type!));
const {columns} = useColumns(props.type, _target, noEdit, productNoEdit)

const detailData = reactive({
  data: {},
  visible:false
})

const showSave = ref(metadata.value.length !== 0)

const showLastDelete = ref(false)
const dataSourceCache = ref<any[]>(metadata.value)

provide('_dataSource', dataSourceCache)

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
      _target === 'device' &&
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
        level: 'ordinary'
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

  

  // const data = [...dataSource.value];
  //
  // if (index !== undefined) {
  //   //  校验
  //   const _data = await tableRef.value.getData()
  //   console.log(_data)
  //   if (_data) {
  //     data.splice(index + 1, 0, newObject);
  //   }
  // } else {
  //     data.push(newObject);
  // }
  // dataSource.value = data
  const _addData = await tableRef.value.addItem(newObject, index)
  if (_addData.length === 1) {
    showLastDelete.value = true
  }
  showSave.value = true
  // const _index = index !== undefined ? index + 1 : 0
  // tableRef.value?.addItemAll?.(_index)
};

const copyItem = (record: any, index: number) => {
  const copyData = cloneDeep(omit(record, ['_uuid', '_sortIndex']))
  copyData.id = `copy_${copyData.id}`.slice(0,64)
  handleAddClick(copyData, index)
}

const removeItem = (index: number) => {
  // const data = [...dataSource.value];
  // data.splice(index, 1);
  // dataSource.value = data
  const _data = tableRef.value.removeItem(index)
  if (_data.length === 1) {
    showLastDelete.value = true
  }
  if (_data.length === 0) {
    showSave.value = false

    handleSaveClick()
  }
}

const editStatusChange = (status: boolean) => {
  editStatus.value = status
}

const handleSaveClick = async (next?: Function) => {
    let resp = await tableRef.value.getData().finally(() => {

    });
    if(resp) {

      const virtual: any[] = [];
      const arr = resp.map((item: any) => {
        if(item.expands?.virtualRule) {
          const triggerProperties = item.expands.virtualRule.triggerProperties
          const rule = omit(item.expands.virtualRule, ['triggerProperties'])
          virtual.push({
            triggerProperties,
            rule,
            type: rule.type,
            propertyId: item.id
          })
        }
        return {
          ...item,
          expands: {
            ...omit(item.expands, ['virtualRule'])
          }
        }
        // return item
      })
      // 保存规则
      if(virtual.length) {
        let res = undefined
        if(_target === 'device') {
          res = await saveDeviceVirtualProperty(instanceStore.current.productId, instanceStore.current.id, virtual)
        } else {
          res = await saveProductVirtualProperty(productStore.current.id, virtual)
        }
      }
      // 保存属性
      const updateStore = (metadata: string) => {
        if (_target === 'device') {
          const detail = instanceStore.current
          detail.metadata = metadata
          instanceStore.setCurrent(detail)
        } else {
          const detail = productStore.current || {} as ProductItem
          detail.metadata = metadata
          productStore.setCurrent(detail)
        }
      }
      const _detail: ProductItem | DeviceInstance = _target === 'device' ? instanceStore.detail : productStore.current
      let _data = updateMetadata(props.type!, arr, _detail, updateStore)
      loading.value = true
      const result = await asyncUpdateMetadata(_target, _data).finally(() => {
        loading.value = false
      })
      if(result.success) {
        dataSource.value = resp
        tableRef.value.cleanEditStatus()
        onlyMessage('操作成功！')
        next?.()
      }
    }
};

const tabsChange = inject('tabsChange')

const parentTabsChange = (next?: Function) => {
  if (editStatus.value) {
    Modal.confirm({
      content: '页面改动数据未保存',
      okText: '保存',
      cancelText: '不保存',
      zIndex: 1400,
      onOk: () => {
        handleSaveClick(next as Function)
      },
      onCancel: () => {
        (next as Function)?.()
      }
    })
  } else {
    (next as Function)?.()
  }
}

EventEmitter.subscribe(['MetadataTabs'], parentTabsChange)

onUnmounted(() => {
  EventEmitter.unSubscribe(['MetadataTabs'], parentTabsChange)
})

watch(() => metadata.value, () => {
  dataSource.value = metadata.value
}, { immediate: true })

onBeforeRouteLeave((to, from, next) => {
  parentTabsChange(next as Function)
})

</script>

<style scoped>
.table-header {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
}
</style>