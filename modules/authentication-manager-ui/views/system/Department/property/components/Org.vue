<template>
  <j-pro-table
    mode="TABLE"
    :columns="columns"
    :request="getTreeData_api"
    :multiple="false"
    :defaultParams="{
      paging: false,
      sorts: [
        { name: 'sortIndex', order: 'asc' },
        { name: 'name', order: 'asc' }
      ]
    }"
    type="TREE"
    :rowSelection="{
      type: 'radio',
      selectedRowKeys,
      onSelect,
      onSelectNone,
    }"
  >
    <template #alertRender>
      <a-alert :message="`包含${productCount}个${assetsName}`">
        <template #closeText>
          <a-button type="link" @click="onSelectNone">取消选择</a-button>
        </template>
      </a-alert>
    </template>
  </j-pro-table>
</template>

<script setup lang="ts">
import { getTreeData_api, getBindingsPermission } from '@authentication-manager-ui/api/system/department'

const props = defineProps({
  assetType: {
    type: String,
    default: ''
  },
  parentId: {
    type: String,
    default: ''
  },
  request: {
    type: Object,
    default: () => {}
  }
})
const columns = [
  {
    title: '名称',
    key: 'name',
    dataIndex: 'name',
    search: {
      type: 'string'
    }
  },
  {
    title: '排序',
    key: 'sortIndex',
    dataIndex: 'sortIndex',
    width: 300
  }
]

const selectedRowKeys = ref<string[]>([])
const productCount = ref<number>(0)

const assetsName = computed(() => {
  return props.assetType === 'product' ? '产品' : '设备'
})

const onSelect = (record: Record<string, any>) => {
  selectedRowKeys.value = [record.id]
  getOrgAssets()
}

const onSelectNone = () => {
  selectedRowKeys.value = [];
}

const getOrgAssets = async () => {
  console.log('selectedRowKeys', selectedRowKeys.value)
  const res = await props.request.noPagingListApi({
    terms: [{
      column: 'id',
      termType: 'dim-assets',
      value: {
        assetType: props.assetType,
        targets: [
          {
            type: 'org',
            id: selectedRowKeys.value?.[0],
          },
        ],
      },
      type: 'and'
    }]
  })
  const ids = res.result.map((item: any) => item.id);
  productCount.value = ids.length;
  const perRes = await getBindingsPermission(props.assetType, ids);
  res.result.forEach((item: any) => {
    item.permissionList = perRes.result
      .find((f: any) => f?.assetId === item.id)
      ?.permissionInfoList?.map((m: any) => ({
        label: m.name,
        value: m.id,
        disabled: true,
      })) || [];
  })
  return res.result
}

defineExpose({
  getOrgAssets
})
</script>

<style scoped lang="less">

</style>

