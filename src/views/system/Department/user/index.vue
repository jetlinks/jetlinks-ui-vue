<template>
  <div style="height: 100%; display: flex; flex-direction: column">
    <pro-search
        v-if="show"
        noMargin
        target="category-user"
        style="margin: 0;"
        :columns="columns"
        @search="handleParams"
        ref="searchRef"
    />
    <div style="flex: 1; min-height: 0">
      <j-pro-table
          v-if="show"
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
      >
        <template #headerLeftRender>
          <a-space>
            <j-permission-button
                type="primary"
                :hasPermission="`${permission}:bind-user`"
                @click="dialogVisible = true"
                style="margin-right: 15px"
                :disabled="isShow"
            >
              <AIcon type="PlusOutlined"/>
              {{ $t('user.index.252066-0') }}
            </j-permission-button>
            <j-permission-button
                :hasPermission="`${permission}:bind`"
                :popConfirm="{
                title: !isNoCommunity ? $t('device.index.988419-6') : $t('user.index.252066-1'),
                onConfirm: () => unBind(),
              }"
            >
              <AIcon type="DisconnectOutlined"/>
              {{ $t('user.index.252066-2') }}
            </j-permission-button>
          </a-space>
        </template>
        <template #positions="slotProps">
          {{ slotProps.positions?.filter(item => item.orgId === props.parentId)?.map(item => item.name).join(',') || '--' }}
        </template>
        <template #status="slotProps">
          <j-badge-status
              :status="slotProps.status"
              :text="slotProps.status ? $t('user.index.252066-3') : $t('user.index.252066-4')"
              :statusNames="{
              1: 'success',
              0: 'error',
            }"
          ></j-badge-status>
        </template>
        <template #action="slotProps">
          <j-permission-button
              type="link"
              :hasPermission="`${permission}:bind`"
              :popConfirm="{
                title: !isNoCommunity ? $t('device.index.988419-6') : $t('user.index.252066-1'),
                onConfirm: () => unBind(slotProps),
              }"
          >
            <AIcon type="DisconnectOutlined"/>
          </j-permission-button>
        </template>
      </j-pro-table>
    </div>
  </div>
  <AddBindUserDialog
      v-if="dialogVisible"
      :parent-id="props.parentId"
      @save="onSave"
      @close="dialogVisible = false"
  />
</template>

<script setup lang="ts" name="user">
import AddBindUserDialog from './components/AddBindUserDialog.vue'
import {unBindUser_api} from '@/api/system/department'
import {useColumns, requestFun} from '../util'
import {onlyMessage} from '@jetlinks-web/utils'
import {useI18n} from 'vue-i18n';
import {useRouteQuery} from '@vueuse/router'
import {isNoCommunity} from '@/utils/utils';

const {t: $t} = useI18n();
const permission = 'system/Department'

const props = defineProps({
  parentId: {
    type: String,
    default: '',
  },
  positionId: {
    type: String,
    default: ''
  }
})

const isShow = computed(() => {
  return !props.parentId
})
const show = ref(false)
const search = useRouteQuery('q')
const searchTarget = useRouteQuery('target')

// 搜索参数
const queryParams = ref({})
const dialogVisible = ref(false)
// 表格
const tableRef = ref<any>() // 表格实例
const searchRef = ref<any>() // 表格实例
const _selectedRowKeys = ref<string[]>([])

const columns = ref(useColumns(props.parentId))

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
  e?.terms.map(a => {
    return a.terms.map(b => {
      if (b.column === 'positions') {
        b.column = 'id$in-dimension$position'
        b.termType = undefined
      }
      return b
    })
  })
  queryParams.value = e
}

// 请求数据
const handleSearch = (oParams: any) =>
    requestFun(props.parentId, oParams, [
        {
          terms: isNoCommunity ? [
              {
                  terms: [
                      {
                          "column": "id$in-org-user$org",
                          "value": [
                              props.parentId
                          ]
                      },
                  ],
              },
              {
                  type: 'or',
                  terms: [
                      {
                          "column": "id$in-org-user$position",
                          "value": [
                              props.parentId
                          ]
                      }
                  ]
              }
          ] : [
            {
              terms: [
                  {
                      "column": "id$in-org-user$org",
                      "value": [
                          props.parentId
                      ]
                  },
              ],
            }
          ]
        }
    ])

// 取消绑定
const unBind = (row?: any) => {
  const ids = row ? [row.id] : _selectedRowKeys.value
  if (ids.length < 1) return onlyMessage($t('user.index.252066-5'), 'warning')

  unBindUser_api(props.parentId, ids).then((resp) => {
    if (resp.success) {
      onlyMessage($t('user.index.252066-6'))
      refresh()
      _selectedRowKeys.value = []
    }
  })
}

const handleRouteQuery = (v) => {
  const terms = [
    {
      terms: [{
        column: 'positions',
        termType: 'eq',
        value: v
      }, null, null],
    },
    {
      terms: [null, null, null],
    }
  ]

  if (v) {
    search.value = encodeURI(JSON.stringify({terms}))
    searchTarget.value = 'category-user'
    setTimeout(() => {
      show.value = true
    })
  } else {
    show.value = true
  }

}

watch(() => props.positionId, (v) => {
  handleRouteQuery(v)
}, {immediate: true})

watch(
    () => props.parentId,
    () => {
      refresh()
      columns.value = useColumns(props.parentId)
      searchRef.value?.reset?.()
    },
)
</script>
