<template>
  <div class="role-container">
    <pro-search
      noMargin
      :columns="columns"
      target="system-role"
      @search="handelSearch"
    />
    <div class="role-table">
      <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :columns="columns"
        :request="getRoleList_api"
        :params="queryParams"
        :defaultParams="{
          sorts: [
            { name: 'createTime', order: 'desc' },
            { name: 'id', order: 'desc' }
          ]
        }"
      >
        <template #headerLeftRender>
          <j-permission-button
            type="primary"
            :hasPermission="`${permission}:add`"
            @click="addRole"
          >
            <AIcon type="PlusOutlined" />{{ $t('RoleRight.index.470525-0') }}
          </j-permission-button>
        </template>

        <template #action="slotProps">
          <a-space>
            <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
              <j-permission-button
                :disabled="i.disabled"
                :popConfirm="i.popConfirm"
                :tooltip="{
                  ...i.tooltip,
                }"
                @click="i.onClick"
                type="link"
                style="padding: 0 5px"
                :danger="i.key === 'delete'"
                :hasPermission="'system/Role:' + i.key"
              >
                <template #icon>
                  <AIcon :type="i.icon" />
                </template>
              </j-permission-button>
            </template>
          </a-space>
        </template>
      </j-pro-table>
    </div>

    <AddDialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :groupId="groupId"
      :modalType="modalType"
      :current="current"
      @save="onSave"
    />
  </div>
</template>

<script setup lang="ts" name="RoleRight">
import AddDialog from './components/AddDialog.vue'
import { getRoleList_api, delRole_api } from '@/api/system/role'
import { useMenuStore } from '@/store/menu'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
  groupId: {
    type: String,
    default: undefined
  },
})
const permission = 'system/Role'
const { jumpPage } = useMenuStore()
const modalType = ref('add')
const current = ref()
const isSave = !!useRoute().query.save
const queryParams = ref<any>({ terms: [] })
// 表格
const tableRef = ref<Record<string, any>>()
const dialogVisible = ref(isSave)
const columns = [
  {
    title: $t('RoleRight.index.470525-1'),
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('RoleRight.index.470525-2'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('RoleRight.index.470525-3'),
    key: 'description',
    ellipsis: true,
    dataIndex: 'description',
    search: {
      type: 'string',
    },
  },
  {
    title: $t('RoleRight.index.470525-4'),
    dataIndex: 'action',
    key: 'action',
    width: 150,
    fixed: 'right',
    scopedSlots: true,
  },
]
const getActions = (
  data: Partial<Record<string, any>>,
  type: 'card' | 'table',
) => {
  if (!data) return []
  const actions = [
    {
      key: 'update',
      text: $t('RoleRight.index.470525-5'),
      tooltip: {
        title: $t('RoleRight.index.470525-5'),
      },
      icon: 'EditOutlined',
      onClick: () => {
        dialogVisible.value = true
        modalType.value = 'edit'
        current.value = data
      },
    },
    {
      key: 'update',
      text: $t('RoleRight.index.470525-6'),
      tooltip: {
        title: $t('RoleRight.index.470525-6'),
      },
      onClick: () => {
        jumpPage(`system/Role/Detail`, {
          params: {
            id: data.id,
          },
        })
      },
      icon: 'FormOutlined',
    },
    {
      key: 'delete',
      text: $t('RoleRight.index.470525-7'),
      tooltip: {
        title: $t('RoleRight.index.470525-7'),
      },
      popConfirm: {
        title: $t('RoleRight.index.470525-8'),
        onConfirm: async () => {
          const res = await delRole_api(data.id)
          if (res.status === 200) {
            onlyMessage($t('RoleRight.index.470525-9'))
            tableRef.value?.reload()
          } else {
            onlyMessage($t('RoleRight.index.470525-10'), 'error')
          }
        },
      },
      icon: 'DeleteOutlined',
    },
  ]
  if (type === 'card') return actions.filter((i: any) => i.key !== 'view')
  return actions
}

const addRole = () => {
  dialogVisible.value = true
  modalType.value = 'add'
}

const onSave = () => {
  tableRef.value?.reload()
}
const handelSearch = (search: any) => {
  queryParams.value.terms = props.groupId
    ? [
        {
          value: props.groupId,
          termType: 'eq',
          column: 'groupId',
        },
        ...search.terms,
      ]
    : [...search.terms]
}
watch(
  () => props.groupId,
  (value) => {
    queryParams.value = value
      ? {
          terms: [
            {
              value: props.groupId,
              termType: 'eq',
              column: 'groupId',
            },
          ],
        }
      : {
          terms: [],
        }
  },
)
</script>

<style lang="less" scoped>
.role-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .role-table {
    flex: 1 1 0;
    min-height: 0;
    background-color: #e50012;
  }
  :deep(.ant-table-cell) {
    .ant-btn-link {
      padding: 0;
    }
  }
}
</style>
