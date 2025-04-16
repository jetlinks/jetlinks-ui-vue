<template>
  <div class="role-user-container">
    <pro-search
      :columns="columns"
      target="system-role-user"
      @search="(params)=> queryParams = {...params}"
      style="padding: 0"
    />
    <div style="min-height: 0; flex: 1">
      <j-pro-table
          ref="tableRef"
          :columns="columns"
          style="padding: 0"
          :request="table.getList"
          mode="TABLE"
          :params="queryParams"
          :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onSelect: onSelect,
                onSelectAll: onSelectAll,
                onSelectNone: cancelSelect,
            }"
          :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
      >
        <template #headerLeftRender>
          <a-space>
            <a-button type="primary" @click="dialogVisible = true">
              <AIcon type="PlusOutlined" />{{ $t('User.index.667995-0') }}
            </a-button>
            <j-permission-button
                :popConfirm="{
              title: $t('User.index.667995-1'),
              onConfirm: () => table.unbind(),
            }"
            >
              <AIcon type="DisconnectOutlined" />{{ $t('User.index.667995-2') }}
            </j-permission-button>
          </a-space>
        </template>
        <template #status="slotProps">
          <j-badge-status
              :status="slotProps.status"
              :text="slotProps.status ? $t('User.index.667995-3') : $t('User.index.667995-4')"
              :statusNames="{
            1: 'success',
            0: 'error',
          }"
          ></j-badge-status>
        </template>
        <template #createTime="slotProps">
          {{ slotProps.createTime ? dayjs(slotProps.createTime).format("YYYY-MM-DD HH:mm:ss") : '--' }}
        </template>
        <template #action="slotProps">
          <j-permission-button
              type="link"
              :tooltip="{ title: $t('User.index.667995-5') }"
              :pop-confirm="{
              title: $t('User.index.667995-6'),
              onConfirm: () => table.unbind([slotProps.id]),
            }"
          >
            <AIcon type="DisconnectOutlined" />
          </j-permission-button>
        </template>
      </j-pro-table>
    </div>
  </div>
  <AddUserDialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :role-id="roleId"
      @refresh="table.refresh"
  />
</template>

<script setup lang="ts" name="RoleUser">
import AddUserDialog from '../components/AddUserDialog.vue'
import { getUserByRole_api, unbindUser_api } from '@/api/system/role'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';
import dayjs from "dayjs";

const { t: $t } = useI18n();
const roleId = useRoute().params.id as string

const columns = [
  {
    title: $t('User.index.667995-7'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('User.index.667995-8'),
    dataIndex: 'username',
    key: 'username',
    ellipsis: true,
    search: {
      type: 'string',
    },
  },
  {
    title: $t('User.index.667995-9'),
    dataIndex: 'createTime',
    key: 'createTime',
    search: {
      type: 'date',
    },
    scopedSlots: true,
  },
  {
    title: $t('User.index.667995-10'),
    dataIndex: 'status',
    key: 'status',
    search: {
      type: 'select',
      options: [
        {
          label: $t('User.index.667995-3'),
          value: 1,
        },
        {
          label: $t('User.index.667995-4'),
          value: 0,
        },
      ],
    },
    scopedSlots: true,
  },
  {
    title: $t('User.index.667995-11'),
    dataIndex: 'action',
    key: 'action',
    width: '200px',
    scopedSlots: true,
  },
]
const queryParams = ref({})

const tableRef = ref<Record<string, any>>({})
const selectedRowKeys = ref<string[]>([])
const table = {
  getList: (oParams: any) => {
    const params = {
      ...oParams,
      terms: [
        {
          terms: [
            {
              column: 'id$in-dimension$role',
              value: roleId,
            },
          ],
        },
        ...oParams.terms,
      ],
    }
    return getUserByRole_api(params)
  },
  // 批量解绑
  unbind: (ids?: string[]) => {
    const data = ids ? ids : selectedRowKeys.value
    if (!data.length) {
      onlyMessage($t('User.index.667995-12'), 'warning')
      return
    }
    unbindUser_api(roleId, data).then((resp) => {
      if (resp.status === 200) {
        onlyMessage($t('User.index.667995-13'))
        table.refresh()
      }
    })
  },
  // 刷新表格
  refresh: () => {
    tableRef.value.reload()
    selectedRowKeys.value = []
  },
}

// 弹窗相关
const dialogVisible = ref(false)

const cancelSelect = () => {
  selectedRowKeys.value = [];
};

const onSelect = (record: any, selected: boolean) => {
  const _set = new Set([...selectedRowKeys.value])
  if (selected) {
    _set.add(record.id)
  } else {
    _set.delete(record.id)
  }
  selectedRowKeys.value = [..._set]
};

const onSelectAll = (selected: boolean, _: any, keys: any[]) => {
  const _keys = keys.map(item => item.id) || []
  const _set = new Set([...selectedRowKeys.value])
  _keys.map((i: any) => {
    if (selected) {
      _set.add(i)
    } else {
      _set.delete(i)
    }
  });
  selectedRowKeys.value = [..._set]
};
</script>

<style lang="less" scoped>
.role-user-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
