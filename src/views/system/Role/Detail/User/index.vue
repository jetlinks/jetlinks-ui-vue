<template>
  <div class="role-user-container">
    <pro-search
      :columns="columns"
      target="system-role-user"
      @search="(params)=>queryParams = {...params}"
    />

    <j-pro-table
      ref="tableRef"
      :columns="columns"
      :request="table.getList"
      mode="TABLE"
      :params="queryParams"
      :rowSelection="{
                selectedRowKeys: selectedRowKeys,
                onChange: (keys:string[])=>selectedRowKeys = keys,
            }"
      size="small"
    >
      <template #headerLeftRender>
        <a-space>
          <a-button type="primary" @click="dialogVisible = true">
            <AIcon type="PlusOutlined" />新增
          </a-button>
          <j-permission-button
            :popConfirm="{
              title: `是否批量解除绑定`,
              onConfirm: () => table.unbind(),
            }"
          >
            <AIcon type="DisconnectOutlined" />批量解绑
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
      <template #createTime="slotProps">
        <span V-time-format="'YYYY-MM-DD HH:mm:ss'">
          {{ slotProps.createTime }}
        </span>
      </template>

      <template #action="slotProps">
        <a-space :size="16">
          <j-permission-button
            type="link"
            :tooltip="{ title: '解绑' }"
            :pop-confirm="{
              title: `确认解绑`,
              onConfirm: () => table.unbind([slotProps.id]),
            }"
          >
            <AIcon type="DisconnectOutlined" />
          </j-permission-button>
        </a-space>
      </template>
    </j-pro-table>

    <AddUserDialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :role-id="roleId"
      @refresh="table.refresh"
    />
  </div>
</template>

<script setup lang="ts" name="RoleUser">
import AddUserDialog from '../components/AddUserDialog.vue'
import { getUserByRole_api, unbindUser_api } from '@/api/system/role'
import { onlyMessage } from '@jetlinks-web/utils'

const roleId = useRoute().params.id as string

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'string',
    },
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    search: {
      type: 'string',
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    search: {
      type: 'date',
    },
    scopedSlots: true,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    search: {
      type: 'select',
      options: [
        {
          label: '正常',
          value: 1,
        },
        {
          label: '禁用',
          value: 0,
        },
      ],
    },
    scopedSlots: true,
  },
  {
    title: '操作',
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
      ],
    }
    if (oParams.terms[0])
      params.terms.unshift({
        terms: oParams.terms[0].terms,
      })
    return getUserByRole_api(params)
  },
  // 批量解绑
  unbind: (ids?: string[]) => {
    const data = ids ? ids : selectedRowKeys.value
    if (!data.length) {
      onlyMessage('请勾选数据', 'warning')
      return
    }
    unbindUser_api(roleId, data).then((resp) => {
      if (resp.status === 200) {
        onlyMessage('操作成功')
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
</script>

<style lang="less" scoped>
.role-user-container {
  background-color: #fff;

  :deep(.ant-table-tbody) {
    .ant-table-cell {
      .ant-space-item {
        .ant-btn-link {
          padding: 0;
        }
      }
    }
  }
}
</style>
