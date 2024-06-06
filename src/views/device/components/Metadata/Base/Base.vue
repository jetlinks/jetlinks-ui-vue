<template>
  <EditTable
      v-if="!heavyLoad"
      ref="tableRef"
      :data-source="dataSource"
      :columns="columns"
      :height="560"
      :selectedRowKeys="selectedRowKeys"
      @scrollDown="scrollDown"
      @rightMenuClick="rightMenuClick"
      @editChange="editStatusChange"
  >
    <template #extra="{ isFullscreen, fullScreenToggle }">
      <div class="extra-header">
        <div class="extra-left">
          <a-space>
            <a-input-search
              allowClear
              placeholder="请输入搜索名称"
              @search="handleSearch"
            />
            <AIcon
                :type="isFullscreen ? 'FullscreenExitOutlined' : 'FullscreenOutlined' "
                @click="fullScreenToggle"
            />
            <span v-if="searchData.show">
              已查询到
              <span style="color: #ff7875">{{ searchData.len}}</span>
              条相关数据
            </span>
          </a-space>
        </div>
        <div class="extra-right">
          <PermissionButton
              type="primary"
              key="update"
              placement="topRight"
              :hasPermission="`${permission}:update`"
              :loading="loading"
              :disabled="hasOperate('add', type)"
              :tooltip="{
                    title: hasOperate('add', type)
                        ? '当前的存储方式不支持新增'
                        : '保存',
                    placement: hasOperate('add', type) ? 'topRight' : 'top',
                    getPopupContainer: getPopupContainer,
                }"
              @click="handleSaveClick()"
          >
            保存
          </PermissionButton>
        </div>
      </div>
    </template>
    <template #id="{ record, index }">
      <EditTableFormItem :name="[index, 'id']">
        <a-input v-model:value="record.id" placeholder="请输入标识" :disabled="record.expands?.isProduct"/>
      </EditTableFormItem>
    </template>
    <template #name="{ record, index }">
      <EditTableFormItem :name="[index, 'name']">
        <a-input v-model:value="record.name" placeholder="请输入名称" :disabled="record.expands?.isProduct"/>
      </EditTableFormItem>
    </template>
    <template #valueType="{ record, index }">
      <EditTableFormItem :name="[index, 'valueType']">
        <div style="display: flex; align-items: center" v-if="['properties', 'tags'].includes(type)">
          <TypeSelect v-model:value="record.valueType.type" style="flex: 1 1 0;min-width: 0" :disabled="record.expands?.isProduct"/>
          <IntegerParams v-if="['int', 'long'].includes(record.valueType.type)" v-model:value="record.valueType.unit" :disabled="record.expands?.isProduct"/>
          <DoubleParams v-else-if="['float', 'double'].includes(record.valueType.type)" v-model:value="record.valueType" :disabled="record.expands?.isProduct"/>
          <StringParams v-else-if="record.valueType.type === 'string'" v-model:value="record.valueType.maxLength" :disabled="record.expands?.isProduct"/>
          <DateParams v-else-if="record.valueType.type === 'date'" v-model:value="record.valueType.format" :disabled="record.expands?.isProduct"/>
          <FileParams v-else-if="record.valueType.type === 'file'" v-model:value="record.valueType.bodyType" :disabled="record.expands?.isProduct"/>
          <EnumParams v-else-if="record.valueType.type === 'enum'" v-model:value="record.valueType.elements" :disabled="record.expands?.isProduct"/>
          <BooleanParams
              v-else-if="record.valueType.type === 'boolean'"
              v-model:falseText="record.valueType.falseText"
              v-model:falseValue="record.valueType.falseValue"
              v-model:trueText="record.valueType.trueText"
              v-model:trueValue="record.valueType.trueValue"
              :disabled="record.expands?.isProduct"
          />
          <ObjectParams v-else-if="record.valueType.type === 'object'" v-model:value="record.valueType.properties" :disabled="record.expands?.isProduct"/>
          <ArrayParams v-else-if="record.valueType.type === 'array'" v-model:value="record.valueType.elementType" :disabled="record.expands?.isProduct"/>
        </div>
        <div v-else-if="type === 'events'">
          <ObjectParams v-model:value="record.valueType.properties">
            <a-button type="link" style="padding: 0" :disabled="record.expands?.isProduct">
              <template #icon>
                <AIcon type="SettingOutlined"/>
              </template>
              配置
            </a-button>
          </ObjectParams>
        </div>
      </EditTableFormItem>
    </template>
    <template #expands="{ record, index }">
      <EditTableFormItem :name="[index, 'expands']">
        <Source
            v-if="props.type === 'properties'"
            v-model:value="record.expands"
            :target="target"
            :record="record"
            :disabled="record.expands?.isProduct"
        />
        <a-select
            v-else-if="props.type === 'events'"
            v-model:value="record.expands.level"
            style="width: 100%"
            :options="EventLevel"
            :getPopupContainer="(node) => tableRef.tableWrapperRef || node"
            :disabled="record.expands?.isProduct"
        />
        <a-select
            v-else-if="props.type === 'tags'"
            v-model:value="record.expands.type"
            mode="multiple"
            style="width: 100%;"
            :options="[
              { label: '读', value: 'read'},
              { label: '写', value: 'write'},
              { label: '上报', value: 'report'},
            ]"
            :getPopupContainer="(node) => tableRef.tableWrapperRef || node"
            :disabled="record.expands?.isProduct"
            placeholder="请选择读写类型"
        />
      </EditTableFormItem>
    </template>
    <template #other="{ record }">
      <OtherSetting
          v-model:value="record.expands"
          :type="['functions', 'events'].includes(props.type) ? 'object' : record.valueType?.type"
          :id="record.id"
          :disabled="record.expands?.isProduct"
          :metadataType="props.type"
      />
    </template>
    <template #async="{ record }">
      <a-select
          v-model:value="record.async"
          style="width: 100%"
          :options="[
            { label: '是', value: true },
            { label: '否', value: false }
          ]"
          :disabled="record.expands?.isProduct"
          :getPopupContainer="(node) => tableRef.tableWrapperRef || node"
      />
    </template>
    <template #inputs="{ record, index }">
      <EditTableFormItem :name="[index, 'inputs']">
        <ObjectParams v-model:value="record.inputs" :type="type">
          <a-button type="link" style="padding: 0" :disabled="record.expands?.isProduct">
            <template #icon>
              <AIcon type="SettingOutlined"/>
            </template>
            配置
          </a-button>
        </ObjectParams>
      </EditTableFormItem>
    </template>
    <template #output="{ record, index }">
      <EditTableFormItem :name="[index, 'output']">
        <div style="display: flex; align-items: center">
          <TypeSelect v-model:value="record.output.type" style="flex: 1 1 0;min-width: 0" :disabled="record.expands?.isProduct"/>
          <IntegerParams v-if="['int', 'long'].includes(record.output.type)" v-model:value="record.output.unit" :disabled="record.expands?.isProduct"/>
          <DoubleParams v-else-if="['float', 'double'].includes(record.output.type)" v-model:value="record.output" :disabled="record.expands?.isProduct"/>
          <StringParams v-else-if="record.output.type === 'string'" v-model:value="record.output.maxLength" :disabled="record.expands?.isProduct"/>
          <DateParams v-else-if="record.output.type === 'date'" v-model:value="record.output.format" :disabled="record.expands?.isProduct"/>
          <FileParams v-else-if="record.output.type === 'file'" v-model:value="record.output.bodyType" :disabled="record.expands?.isProduct"/>
          <EnumParams v-else-if="record.output.type === 'enum'" v-model:value="record.output.elements" :disabled="record.expands?.isProduct"/>
          <BooleanParams
              v-else-if="record.output.type === 'boolean'"
              v-model:falseText="record.output.falseText"
              v-model:falseValue="record.output.falseValue"
              v-model:trueText="record.output.trueText"
              v-model:trueValue="record.output.trueValue"
              :disabled="record.expands?.isProduct"
          />
          <ObjectParams
              v-else-if="record.output.type === 'object'"
              v-model:value="record.output.properties"
              :disabled="record.expands?.isProduct"
          />
          <ArrayParams v-else-if="record.output.type === 'array'" v-model:value="record.output.elementType" :disabled="record.expands?.isProduct"/>
        </div>
      </EditTableFormItem>
    </template>
    <template #description="{ record }">
      <a-input v-model:value="record.description" placeholder="请输入说明" :disabled="record.expands?.isProduct"/>
    </template>
    <template #properties="{ record, index }">
      <EditTableFormItem :name="[index, 'properties']">
        <ObjectParams v-model:value="record.valueType.properties" :disabled="record.expands?.isProduct"/>
      </EditTableFormItem>
    </template>
    <template #group="{ record }">
      <GroupSelect v-model:value="record.expands.group" :disabled="record.expands?.isProduct"/>
    </template>
  </EditTable>
  <PropertiesModal
      v-if="type === 'properties' && detailData.visible"
      :data="detailData.data"
      :getPopupContainer="getPopupContainer"
      :unitOptions="unitOptions"
      @cancel="cancelDetailModal"
  />
  <FunctionModal
      v-else-if="type === 'functions' && detailData.visible"
      :data="detailData.data"
      :getPopupContainer="getPopupContainer"
      @cancel="cancelDetailModal"
  />
  <EventModal
      v-else-if="type === 'events' && detailData.visible"
      :data="detailData.data"
      :getPopupContainer="getPopupContainer"
      @cancel="cancelDetailModal"
  />
  <TagsModal
      v-else-if="type === 'tags' && detailData.visible"
      :data="detailData.data"
      :getPopupContainer="getPopupContainer"
      :unitOptions="unitOptions"
      @cancel="cancelDetailModal"
  />
</template>

<script setup lang="ts" name="MetadataBase">
import type {
  MetadataItem,
  MetadataType,
  ProductItem,
} from '@/views/device/Product/typings';
import type {PropType} from 'vue';
import {TOKEN_KEY} from '@/utils/variable'
import {useRouter, onBeforeRouteUpdate} from 'vue-router'
import {useMetadata, useOperateLimits, useGroup} from './hooks';
import {useColumns, useSaveUnit} from './columns';
import {getMetadataItemByType, limitsMap} from './utils';
import {Source, OtherSetting} from './components';
import {saveProductVirtualProperty} from '@/api/device/product';
import {saveDeviceVirtualProperty} from '@/api/device/instance';
import {useInstanceStore} from '@/store/instance';
import {useProductStore} from '@/store/product';
import {asyncUpdateMetadata, updateMetadata} from '../metadata';
import {useMetadataStore} from '@/store/metadata';
import {DeviceInstance} from '@/views/device/Instance/typings';
import {onlyMessage, LocalStore} from '@/utils/comm';
import {omit} from "lodash-es";
import {PropertiesModal, FunctionModal, EventModal, TagsModal} from './DetailModal'
import {Modal} from 'jetlinks-ui-components'
import {EventEmitter} from "@/utils/utils";
import {watch} from "vue";
import {useSystem} from "store/system";
import {storeToRefs} from "pinia";
import {usePermissionStore} from '@/store/permission';
import {
  EditTable,
  TypeSelect,
  IntegerParams,
  StringParams,
  DateParams,
  FileParams,
  EnumParams,
  BooleanParams,
  ObjectParams,
  ArrayParams,
  DoubleParams,
  GroupSelect,
  EditTableFormItem
} from '@/components/Metadata/Table'
import {EventLevel} from "@/views/device/data";

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

const system = useSystem();
const {basicLayout} = storeToRefs(system);
const router = useRouter()

const { unitOptions } = useSaveUnit()

const {data: metadata, noEdit, productNoEdit} = useMetadata(_target, props.type);
const {data: tagsMetadata} = useMetadata(_target, 'tags')
const {hasOperate} = useOperateLimits(_target);

const permissionStore = usePermissionStore()
const instanceStore = useInstanceStore()
const productStore = useProductStore()

const dataSource = ref<MetadataItem[]>(metadata.value || []);
const tableRef = ref();
const loading = ref(false)
const editStatus = ref(false) // 编辑表格的编辑状态
const selectedRowKeys = ref<string[]>([])

const searchData = reactive({
  len: 0,
  show: false
})

const {initOptions} = useGroup()

const {columns} = useColumns(dataSource, props.type, _target, noEdit, productNoEdit)

const detailData = reactive({
  data: {},
  visible: false
})

const heavyLoad = ref<Boolean>(false)

const getPopupContainer = (node: any) => {
  return node || document.body
}

provide('_tagsDataSource', tagsMetadata)
provide('metadataSource', dataSource)

const cancelDetailModal = () => {
  detailData.data = {}
  detailData.visible = false
}

const operateLimits = (action: 'add' | 'updata', types: MetadataType) => {
  return (
      _target === 'device' &&
      (instanceStore.detail.features || []).find((item: {
        id: string;
        name: string
      }) => item.id === limitsMap.get(`${types}-${action}`))
  );
};

const handleSearch = (searchValue: string) => {
  const keys: string[] = []
  if (searchValue) {
    dataSource.value.forEach(item => {
      if (item.name && item.name.includes(searchValue)) {
        keys.push(item.id)
      }
    })
  }

  if (keys.length) {
    tableRef.value.scrollToById(keys[0])
  }
  selectedRowKeys.value = keys

  searchData.len = keys.length
  searchData.show = true
};

const scrollDown = (len: number = 5) => {
  dataSource.value.push(...(new Array(len).fill(1).map(() => getMetadataItemByType(props.type!))))
}

const removeItem = (index: number) => {

  dataSource.value.splice(index, 1)
}

const editStatusChange = (status: boolean) => {
  editStatus.value = status
}

const rightMenuClick = (type: string, record: Record<string, any>, copyRecord:  Record<string, any>) => {
  const _index = record.__index
  switch (type) {
    case 'add':
      dataSource.value.splice(_index + 1, 0, getMetadataItemByType(props.type!))
      break;
    // case 'copy':
    //   let _record = JSON.parse(JSON.stringify(record))
    //   _record.id = `copy_${_record.id}`
    //   copyRecordCache = _record
    //   break;
    case 'paste':
      const cloneRecord = JSON.parse(JSON.stringify(copyRecord))
      cloneRecord.id = `copy_${cloneRecord.id}`
      if (record.id) {
        Modal.confirm({
          title: '当前行存在数据',
          onOk() {
            dataSource.value.splice(_index, 1, cloneRecord)
          },
          onCancel() {
            console.log('Cancel');
          },
        })
      } else {
        dataSource.value.splice(_index, 1, cloneRecord)
      }
      break;
    case 'detail':
      detailData.data = record
      detailData.visible = true
      break;
    case 'delete':
      dataSource.value.splice(_index, 1)
      break;
  }
}

const handleSaveClick = async (next?: Function) => {
  let resp = await tableRef.value.validate().catch(err => {
    console.log('handleSaveClick--err', err)
  });
  console.log('handleSaveClick', dataSource.value)
  if (resp) {

    const virtual: any[] = [];
    const arr = resp.map((item: any) => {
      if (item.expands?.virtualRule) {
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
    console.log(virtual, arr)
    // 保存规则
    if (virtual.length) {
      let res = undefined
      if (_target === 'device') {
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
    if (result.success) {
      // dataSource.value = resp
      // tableRef.value.cleanEditStatus()
      editStatus.value = false
      onlyMessage('操作成功！')
      next?.()
    }
  }
};

const parentTabsChange = (next?: Function) => {
  if (editStatus.value && permissionStore.hasPermission(`${props.permission}:update`) && LocalStore.get(TOKEN_KEY)) {
    const modal = Modal.confirm({
      content: '页面改动数据未保存',
      okText: '保存',
      cancelText: '不保存',
      zIndex: 1400,
      closable: true,
      onOk: () => {
        handleSaveClick(next as Function)
      },
      onCancel: (e: any) => {
        if (!e.triggerCancel) { // 取消按钮
          modal.destroy();
          (next as Function)?.()
        } else {// 右上角取消按钮
          const paths = router.currentRoute.value.matched
          // basicLayout.value.selectedKeys = paths.map(item => item.path)
          basicLayout.value.openKeys = paths.map(item => item.path)
        }
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
  dataSource.value = metadata.value.map(item => {
    if (!item.expands) {
      item['expands'] = {
        group: undefined
      }
    }
    return item
  })
  console.log(JSON.parse(JSON.stringify(metadata.value)))
  initOptions(dataSource.value)
}, {immediate: true})

onBeforeRouteUpdate((to, from, next) => { // 设备管理内路由跳转
  parentTabsChange(next as Function)
})

onBeforeRouteLeave((to, from, next) => { // 设备管理外路由跳转
  parentTabsChange(next as Function)
})

</script>

<style scoped lang="less">
.extra-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
}
</style>
