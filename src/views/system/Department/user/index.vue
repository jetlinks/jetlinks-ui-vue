<template>
  <div style="overflow-y: auto;">
    <pro-search
        :columns="columns"
        noMargin
        target="category-user"
        style="margin: 0;"
        @search="handleParams"
    />
    <j-pro-table
        ref="tableRef"
        :columns="columns"
        :request="handleSearch"
        :params="queryParams"
        :rowSelection="{
          selectedRowKeys: _selectedRowKeys,
          onSelect: onSelect,
          onSelectAll: onSelectAll,
          onSelectNone: cancelSelect,
        }"
        mode="TABLE"
        :scroll="{y: 'calc(100vh - 450px)'}"
    >
      <template #headerTitle>
        <a-space>
          <j-permission-button
              type="primary"
              :hasPermission="`${permission}:bind-user`"
              @click="dialogVisible = true"
              style="margin-right: 15px"
              :disabled="isShow"
          >
            <AIcon type="PlusOutlined"/>
            绑定用户
          </j-permission-button>
          <j-permission-button
              :hasPermission="`${permission}:bind`"
              :popConfirm="{
                title: `是否解除绑定`,
                onConfirm: () => unBind(),
              }"
          >
            <AIcon type="DisconnectOutlined"/>
            批量解绑
          </j-permission-button>
        </a-space>
      </template>
      <template #status="slotProps">
        <j-badge-status
            :status="slotProps.status"
            :text="slotProps.status ? '正常' : '禁用'"
            :statusNames="{
              1: 'success',
              0: 'error',
            }"
        ></j-badge-status>
      </template>
      <template #action="slotProps">
        <a-space :size="16">
          <j-permission-button
              type="link"
              :hasPermission="`${permission}:bind`"
              :popConfirm="{
                title: `是否解除绑定`,
                onConfirm: () => unBind(slotProps),
              }"
          >
            <AIcon type="DisconnectOutlined"/>
          </j-permission-button>
        </a-space>
      </template>
    </j-pro-table>

    <AddBindUserDialog
        v-if="dialogVisible"
        :parent-id="props.parentId"
        @save="onSave"
        @close="dialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts" name="user">
import AddBindUserDialog from './components/AddBindUserDialog.vue'
import {unBindUser_api} from '@/api/system/department'
import {columns, requestFun} from '../util'
import {onlyMessage} from '@jetlinks-web/utils'

const permission = 'system/Department'

const props = defineProps({
  parentId: {
    type: String,
    default: '',
  },
})

const isShow = computed(() => {
  return !props.parentId
})

// 搜索参数
const queryParams = ref({})
const dialogVisible = ref(false)
// 表格
const tableRef = ref<any>() // 表格实例
const _selectedRowKeys = ref<string[]>([])

// 刷新列表
const refresh = () => {
  tableRef.value?.reload()
}

const onSave = () => {
  dialogVisible.value = false
  refresh()
}
//取消选择
const cancelSelect = () => {
  _selectedRowKeys.value = []
}

// 选择
const onSelect = (record: any, selected: boolean) => {
  const arr = [..._selectedRowKeys.value]
  const _index = arr.findIndex((item) => item === record?.id)
  if (selected) {
    if (!(_index > -1)) {
      _selectedRowKeys.value.push(record.id)
    }
  } else {
    if (_index > -1) {
      // 去掉数据
      _selectedRowKeys.value.splice(_index, 1)
    }
  }
}

// 全选
const onSelectAll = (selected: boolean, _: any[], changeRows: any) => {
  if (selected) {
    changeRows.map((i: any) => {
      if (!_selectedRowKeys.value.includes(i.id)) {
        _selectedRowKeys.value.push(i.id)
      }
    })
  } else {
    const arr = changeRows.map((item: any) => item.id)
    const _ids: string[] = []
    _selectedRowKeys.value.map((i: any) => {
      if (!arr.includes(i)) {
        _ids.push(i)
      }
    })
    _selectedRowKeys.value = _ids
  }
}

// 搜索
const handleParams = (e: any) => {
  queryParams.value = e
}

// 请求数据
const handleSearch = (oParams: any) =>
    requestFun(props.parentId, oParams, [
      {
        terms: [
          {
            column: 'id$in-dimension$org',
            value: props.parentId,
          },
        ],
      },
    ])

// 取消绑定
const unBind = (row?: any) => {
  const ids = row ? [row.id] : _selectedRowKeys.value
  if (ids.length < 1) return onlyMessage('请勾选需要解绑的数据', 'warning')

  unBindUser_api(props.parentId, ids).then((resp) => {
    if (resp.success) {
      onlyMessage('操作成功')
      refresh()
    }
  })
}

watch(
    () => props.parentId,
    () => {
      refresh()
    },
)
</script>
