<template>
  <a-modal class="add-device-or-product-dialog-container" :title="$t('components.AddDeviceOrProductDialog.314014-0')" width="1440px" :maskClosable="false" @ok="confirm"
      :confirmLoading="loading" @cancel="cancel" open>
      <div class="batch-config">
          <a-space>
              <div class="row">
              <span style="margin-right: 8px">{{ $t('components.AddDeviceOrProductDialog.314014-2') }}</span>
              </div>
              <div v-show="bulkBool">
                  <a-checkbox-group v-model:value="bulkList" :options="options" />
              </div>
          </a-space>
          <a-switch v-model:checked="bulkBool" :disabled="activeKey !== 'customize'" :checked-children="$t('components.AddDeviceOrProductDialog.314014-3')" :un-checked-children="$t('components.AddDeviceOrProductDialog.314014-4')" style="width: 56px" />
      </div>

      <!-- <pro-search
          type="simple"
          :columns="searchColumns"
          target="category-bind-modal"
          @search="search"
      /> -->
      <div style="display: flex; align-items: flex-end; margin: 16px; justify-content: space-between">
        <div>
          <TabsCard :options="typeOptions" v-model:activeKey="activeKey"/>
        </div>
        <div style="color: rgba(0, 0, 0, 0.25)">
          {{ $t('components.AddDeviceOrProductDialog.314014-1') }}
        </div>
      </div>
      <Customize v-if="activeKey === 'customize'" ref="typeRef" v-bind="props" :productIds="productIds" :bulkBool="bulkBool" :bulkList="bulkList" />
      <All v-else-if="activeKey === 'all'" ref="typeRef" v-bind="props" :bulkBool="bulkBool" :bulkList="bulkList" :request="bindAssetsApi"/>
      <Org v-else-if="activeKey === 'org'" ref="typeRef" v-bind="props" :bulkBool="bulkBool" :bulkList="bulkList" :request="bindAssetsApi"/>
  </a-modal>
</template>

<script setup lang="ts">
import {  onlyMessage } from '@jetlinks-web-core/utils/comm';
import {
  bindDeviceOrProductList_api,
  getDeviceOrProductList_api,
  getDeviceProduct_api,
  getDeviceList_api,
  getDeviceNoPagingList_api
} from '@authentication-manager-ui/api/system/department';
import { dictType } from '../../typings';
import { useDepartmentStore } from '@jetlinks-web-core/store/department';
import { useI18n } from 'vue-i18n';
import Customize from './Customize.vue';
import All from './All.vue';
import Org from './Org.vue'
import { watch } from 'vue'

const { t: $t } = useI18n();
const departmentStore = useDepartmentStore();

const activeKey = ref<'customize' | 'all' | 'org'>('customize')
const emits = defineEmits(['confirm', 'update:visible','next']);
const props = defineProps<{
  visible: boolean;
  queryColumns: any[];
  parentId: string;
  allPermission: dictType;
  assetType: 'product' | 'device';
  productIds: array
}>();
// 弹窗相关
const loading = ref(false);
// 资产咨询次数, 产品分配后自动进入的设备资产, 第一次需要带上产品id查询
const queryCount = ref(0);
const typeRef = ref();

// 通过资产类型确定请求接口
const bindAssetsApi = computed(() => {
  switch (props.assetType) {
    case 'product':
      return {
        listApi: getDeviceOrProductList_api,
        noPagingListApi: getDeviceProduct_api,
      };
    case 'device':
      return {
        listApi: getDeviceList_api,
        noPagingListApi: getDeviceNoPagingList_api,
      };
  }
})

const confirm = async () => {
  let params = {}
  if (activeKey.value === 'customize') {
    if (typeRef.value?.selectedRows.length < 1) {
        return onlyMessage($t('components.AddDeviceOrProductDialog.314014-6'), 'warning');
    }
    loading.value = true;
    params = typeRef.value?.selectedRows.map((item: any) => ({
        targetType: 'org',
        targetId: props.parentId,
        assetType: props.assetType,
        assetIdList: [item.id],
        // 保存时, 过滤没有的权限
        permission: item.selectPermissions.filter((f: any) =>
            (item.permissionList || []).map((m: any) => m.value).includes(f),
        ),
    }));
  } else if (activeKey.value === 'all') {
    loading.value = true;
    const data = await typeRef.value?.getAllAssets().catch(() => loading.value = false);
    if(!data.length) {
      loading.value = false;
      return onlyMessage($t('请选择数据'), 'warning');
    }
    params = data.map((item: any) => ({
        targetType: 'org',
        targetId: props.parentId,
        assetType: props.assetType,
        assetIdList: [item.id],
        // 保存时, 过滤没有的权限
        permission: bulkList.value,
    }));
  } else if (activeKey.value === 'org') {
    loading.value = true;
    const data = await typeRef.value?.getOrgAssets().catch(() => loading.value = false);
    if(!data.length) {
      loading.value = false;
      return onlyMessage($t('该组织下暂无可共享数据'), 'warning');
    }
    params = data.map((item: any) => ({
        targetType: 'org',
        targetId: props.parentId,
        assetType: props.assetType,
        assetIdList: [item.id],
        // 保存时, 过滤没有的权限
        permission: bulkList.value,
    }));
  }

  // 分配产品资产后, 进入设备资产分配
  // departmentStore.setProductId(table.selectedRows.map((item: any) => item.id));

  bindDeviceOrProductList_api(props.assetType, params)
      .then(() => {
          onlyMessage($t('components.AddDeviceOrProductDialog.314014-7'));
          emits('confirm');
          emits('next',typeRef.value?.selectedRows.map((item: any) => item.id))
          if(props.assetType === 'device'){
              departmentStore.setProductId(undefined)
          }
          emits('update:visible', false);
      })
      .finally(() => {
          loading.value = false;
      });
};

const typeOptionsLabel = () => {
  let result = '';
  switch(props.assetType) {
    case 'product':
      result = $t('Department.index.945805-0')
      break;
    case 'device':
      result = $t('Department.index.945805-1')
      break;
  }
  return result
}

const typeOptions = [
  {
    label: $t('property.Assign.385242-0'),
    value: 'customize',
    desc: $t('property.Assign.385242-1', [typeOptionsLabel()])
  },
  {
    label: $t('property.Assign.385242-2'),
    value: 'all',
    desc: $t('property.Assign.385242-3', [typeOptionsLabel()])
  },
  {
    label: $t('property.Assign.385242-4'),
    value: 'org',
    desc: $t('property.Assign.385242-5', [typeOptionsLabel()])
  }
]

const queryParams = ref({});
const bulkBool = ref<boolean>(true);
const bulkList = ref<string[]>(['read']);
const options = computed(() =>
  props.allPermission.map((item) => ({
      label: item.name,
      value: item.id,
      disabled: item.id === 'read',
  })),
);


const cancel = () => {
  departmentStore.setProductId(undefined)
  emits('update:visible', false)
}

const search = (query: any) => {
  queryParams.value = query
}
// onUnmounted(()=>{
//     if(props.assetType ==='device'){
//         departmentStore.setProductId(undefined)
//     }
// })

watch(() => activeKey.value, (val) => {
  if(val !== 'customize') {
    bulkBool.value = true;
  }
})
</script>

<style lang="less" scoped>
.add-device-or-product-dialog-container {
  .ant-spin-nested-loading {
      height: calc(100vh - 400px);
      overflow-y: auto;
  }

  h5 {
      padding: 12px;
      padding-left: 24px;
      background-color: #f6f6f6;
      font-size: 14px;
  }
  .batch-config {
      padding: 8px 16px;
      background: #F5F5F5;
      border-radius: 6px;
      border: 1px solid #CCCCCC;
      display: flex;
      align-items: center;
      justify-content: space-between;
      display: flex;
      margin: 16px;
  }
}
:deep(.jtable-body-header-left){
  width: 80%;
}
</style>
