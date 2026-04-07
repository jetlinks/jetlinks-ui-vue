<script setup name="Positions">
import {useI18n} from 'vue-i18n';
import {queryPage, del} from '@authentication-manager-ui/api/system/positions';
import BindModal from './Bind.vue'
import {useMenuStore} from '@jetlinks-web-core/store';
import {onlyMessage} from '@jetlinks-web/utils';
import {queryRole_api} from "@authentication-manager-ui/api/system/user";
import {getPositionTree} from "./data";

const {t: $t} = useI18n();
const menuStore = useMenuStore();
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
      first: true,
    },
  },
  {
    title: '角色',
    dataIndex: 'roles',
    key: 'roles',
    ellipsis: true,
    search: {
      type: 'select',
      termFilter: ['not', 'in', 'nin'],
      options: () =>
          new Promise((resolve) => {
            queryRole_api({
              paging: false,
              sorts: [
                {name: 'createTime', order: 'desc'},
                {name: 'id', order: 'desc'},
              ],
            }).then((resp) => {
              resolve(
                  resp.result.map((item) => ({
                    label: item.name,
                    value: item.id,
                  })),
              );
            });
          }),
    },
    scopedSlots: true
  },
  {
    title: '上级职位',
    dataIndex: 'parentId',
    key: 'parentId',
    ellipsis: true,
    scopedSlots: true,
    search: {
      type: 'treeSelect',
      termFilter: ['not', 'in', 'nin'],
      options() {
        // const params = props.parentId ? {
        //   terms: [{column: 'orgId', value: props.parentId}],
        //   sorts: [{name: 'createTime', order: 'desc'}],
        //   paging: false
        // } : {sorts: [{name: 'createTime', order: 'desc'}], paging: false}
        // return queryPageNoPage(params).then(resp => {
        //   if (resp.success) {
        //     return resp.result.map(item => {
        //       return {
        //         label: item.name,
        //         value: item.id
        //       }
        //     })
        //   }
        //   return []
        // })
        return getPositionTree()
      }
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
    width: 130,
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
  (params.terms || []).map(a => {
    return (a.terms || []).map(b => {
      if (b.column === 'roles') {
        b.column = 'id$position-role$position'
        b.termType = undefined
        b.value = b.value ? [b.value] : []
      }
      return b
    })
  })
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
  menuStore.jumpPage('system/Department/positions/Detail', {
    params: {
      id: record.id,
    },
    query: {
      departmentId: props.parentId,
      tab: 'user'
    }
  })
}

//跳转职位详情页面
const toPositionDetail = (data) => {
  menuStore.jumpPage('system/Department/positions/Detail', {
    params: {
      id: data.id
    },
    query: {
      departmentId: props.parentId
    }
  })
}

//删除职位
const deletePosition = async (id) => {
  const res = await del(id)
  if (res.success) {
    onlyMessage($t('Tags.index.675027-4'))
    tableRef.value?.reload();
  }
}

const showBindUser = (record) => {
  positionId.value = record.id
  dialogVisible.value = true
}

//新增组织
const handleAdd = () => {
  menuStore.jumpPage('system/Department/positions/Detail', {
    params: {
      id: ':id',
    },
    query: {
      departmentId: props.parentId
    }
  })
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
  <div style="overflow-y: auto;" :key="parentId">
    <pro-search
        :columns="columns"
        noMargin
        target="category-position"
        style="margin: 0;"
        @search="handleParams"
        ref="searchRef"
    />
    <FullPage>
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
        <template #headerLeftRender>
          <j-permission-button v-if="parentId" hasPermission="system/Department:bind-position" type="primary"
                               @click="handleAdd">
            <AIcon type="PlusOutlined"/>
            {{ $t('position.index.252066-2') }}
          </j-permission-button>
        </template>
        <template #roles="slotProps">
          {{ slotProps.roles?.map(item => item.name).join(',') }}
        </template>
        <template #parentId="slotProps">
          {{ slotProps.parentName || "--" }}
        </template>
        <template #memberCount="slotProps">
          <a @click="onJumpPage(slotProps)">{{ slotProps.memberCount }}</a>
        </template>
        <template #action="slotProps">
          <!-- <j-permission-button
            type="link"
            :hasPermission="`${permission}:bind-user`"
            :tooltip="{ title: $t('user.index.252066-0') }"
            @click="showBindUser(slotProps)"
          >
            <AIcon type="UserAddOutlined" />
          </j-permission-button> -->
          <j-permission-button
              type="link"
              :hasPermission="`${permission}:update-position`"
              :tooltip="{ title: $t('Tags.index.675027-1') }"
              @click="toPositionDetail(slotProps)"
          >
            <AIcon type="EditOutlined"/>
          </j-permission-button>
          <j-permission-button
              type="link"
              danger
              :hasPermission="`${permission}:delete-position`"
              :tooltip="{ title: $t('Tags.index.675027-2') }"
              :popConfirm="{
              title: $t('Tags.index.675027-3'),
              onConfirm: () => {
                deletePosition(slotProps.id)
              }
            }"
          >
            <AIcon type="DeleteOutlined"/>
          </j-permission-button>
        </template>
      </j-pro-table>
    </FullPage>
  </div>
  <BindModal v-if="dialogVisible" :orgId="parentId" :positionId="positionId" @save="onSave"
             @close="dialogVisible = false"/>
</template>

<style scoped lang="less">

</style>
