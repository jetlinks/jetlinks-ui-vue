<script setup name="Positions">
import { useI18n } from 'vue-i18n';
import { queryPage } from '@/api/system/positions';
import BindModal from './Bind.vue'

const { t: $t } = useI18n();
const permission = 'system/Department'

const props = defineProps({
  parentId: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['changeTabs'])

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('components.EditUserDialog.939453-3-1'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('position.index.252066-1'),
    dataIndex: 'memberCount',
    key: 'memberCount',
    scopedSlots: true,
  },
  {
    title: $t('Save.index.551010-24'),
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('User.index.673867-17'),
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 100,
    scopedSlots: true,
  },
]

// 搜索参数
const queryParams = ref({})
const dialogVisible = ref(false)
// 表格
const tableRef = ref() // 表格实例
// const _selectedRowKeys = ref([])
const searchRef = ref()

const positionId = ref()

// 刷新列表
const refresh = () => {
  tableRef.value?.reload()
}

const onSave = () => {
  dialogVisible.value = false
  refresh()
}
//取消选择
// const cancelSelect = () => {
//   _selectedRowKeys.value = []
// }

// 选择
// const onSelect = (record, selected) => {
//   const rowSet = new Set([..._selectedRowKeys.value])
//
//   if (selected) {
//     rowSet.add(record.id)
//   } else {
//     rowSet.delete(record.id)
//   }
//
//   _selectedRowKeys.value = [...rowSet.values()]
// }

// 全选
// const onSelectAll = (selected, _, changeRows) => {
//   const rowSet = new Set([..._selectedRowKeys.value])
//
//   changeRows.forEach((item) => {
//     if (selected) {
//       rowSet.add(item.id)
//     } else {
//       rowSet.delete(item.id)
//     }
//   })
//
//   _selectedRowKeys.value = [...rowSet.values()]
// }

const handleQuery = (params) => {
  const _params = {
    ...params,
    terms: [
      ...params.terms,
      {
        column: 'orgId',
        termType: 'eq',
        value: props.parentId,
      }
    ]
  }

  return queryPage(_params)
}

// 搜索
const handleParams = (e) => {
  queryParams.value = e
}

const onJumpPage = (record) => {
  emits('changeTabs', record.id)
}

const showBindUser = (record) => {
  positionId.value = record.id
  dialogVisible.value = true
}

watch(
  () => props.parentId,
  () => {
    refresh()
    searchRef.value?.reset?.()
  },
)
</script>

<template>
  <div style="overflow-y: auto;">
    <pro-search
      :columns="columns"
      noMargin
      target="category-position"
      style="margin: 0;"
      @search="handleParams"
      ref="searchRef"
    />
    <j-pro-table
      ref="tableRef"
      :columns="columns"
      :request="handleQuery"
      :params="queryParams"
      :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
      }"
      mode="TABLE"
      :scroll="{y: 'calc(100vh - 450px)'}"
    >
      <template #memberCount="slotProps">
        <a @click="onJumpPage(slotProps)">{{ slotProps.memberCount }}</a>
      </template>
      <template #action="slotProps">
        <j-permission-button
          type="link"
          :hasPermission="`${permission}:bind-user`"
          :tooltip="{ title: $t('user.index.252066-0') }"
          @click="showBindUser(slotProps)"
        >
          <AIcon type="UserAddOutlined" />
        </j-permission-button>
      </template>
    </j-pro-table>
  </div>
  <BindModal v-if="dialogVisible" :orgId="parentId" :positionId="positionId" @save="onSave" @close="dialogVisible = false" />
</template>

<style scoped lang="less">

</style>
