<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="system-permission"
      @search="handleSearch"
    />
    <FullPage>
      <j-pro-table
        ref="tableRef"
        :columns="columns"
        :request="getPermission_api"
        mode="TABLE"
        :params="params"
        :scroll="{ y: 'calc(100% - 60px)' }"
        :defaultParams="{
          sorts: [{ name: 'id', order: 'asc' }],
        }"
      >
        <template #headerTitle>
          <a-space>
            <j-permission-button
              type="primary"
              :hasPermission="`${permission}:add`"
              @click="openDialog()"
            >
              <AIcon type="PlusOutlined" />新增
            </j-permission-button>
            <j-dropdown trigger="hover">
              <a-button>批量操作</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-upload
                      name="file"
                      action="#"
                      accept=".json"
                      :showUploadList="false"
                      :before-upload="clickImport"
                      :disabled="!hasPerm"
                    >
                      <j-permission-button :hasPermission="`${permission}:import`">
                        导入
                      </j-permission-button>
                    </a-upload>
                  </a-menu-item>
                  <a-menu-item>
                    <j-permission-button
                      :hasPermission="`${permission}:export`"
                      :popConfirm="{
                        title: `确认导出？`,
                        onConfirm: () => clickExport(),
                      }"
                    >
                      导出
                    </j-permission-button>
                  </a-menu-item>
                </a-menu>
              </template>
            </j-dropdown>
          </a-space>
        </template>
        <template #status="slotProps">
          <j-badge-status
            :status="slotProps.status"
            :text="slotProps.status ? '启用' : '禁用'"
            :statusNames="{
              1: 'success',
              0: 'error',
            }"
          ></j-badge-status>
        </template>
        <template #action="slotProps">
          <a-space :size="16">
            <j-permission-button
              :hasPermission="`${permission}:update`"
              type="link"
              :tooltip="{
                title: '编辑',
              }"
              style="padding: 0"
              @click="openDialog(slotProps)"
            >
              <AIcon type="EditOutlined" />
            </j-permission-button>

            <j-permission-button
              :hasPermission="`${permission}:action`"
              type="link"
              :popConfirm="{
                title: `确定要${!!slotProps.status ? '禁用' : '启用'}吗？`,
                onConfirm: () => changeStatus(slotProps),
              }"
              style="padding: 0"
              :tooltip="{
                title: slotProps.status ? '禁用' : '启用',
              }"
            >
              <AIcon
                :type="slotProps.status ? 'StopOutlined' : 'PlayCircleOutlined'"
              />
            </j-permission-button>
            <j-permission-button
              :hasPermission="`${permission}:delete`"
              type="link"
              :tooltip="{
                title: !!slotProps.status ? '请先禁用，再删除' : '删除',
              }"
              danger
              :popConfirm="{
                title: `确认删除`,
                onConfirm: () => clickDel(slotProps),
              }"
              style="padding: 0"
              :disabled="!!slotProps.status"
            >
              <AIcon type="DeleteOutlined" />
            </j-permission-button>
          </a-space>
        </template>
      </j-pro-table>
    </FullPage>
    <!-- 编辑和新增 -->
    <EditDialog v-if="visible" :data="current" @close="visible = false" @save="onSave" />
  </j-page-container>
</template>

<script setup lang="ts" name="Permission">
import EditDialog from './components/EditDialog.vue'
import {
  getPermission_api,
  editPermission_api,
  delPermission_api,
  exportPermission_api,
} from '@/api/system/permission'
import { usePermission } from '@jetlinks-web/hooks'
import { PermissionItem } from './typings'
import { onlyMessage } from '@jetlinks-web/utils'
import { downloadJson } from '@/utils/comm'
import { columns } from './util'

const permission = 'system/Permission'
const { hasPerm } = usePermission(`${permission}:import`)

const params = ref<any>({})
const visible = ref<boolean>(false)
const current = ref<Partial<PermissionItem>>({})
const tableRef = ref<any>({})  // 表格实例

// 搜索
const handleSearch = (e: any) => {
  params.value = e
}

// 打开编辑弹窗
const openDialog = (row?: PermissionItem) => {
  current.value = { ...row }
  visible.value = true
}

// 导入数据
const clickImport = (file: File) => {
  if (file.type === 'application/json') {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = (result: any) => {
      try {
        const data = JSON.parse(result.target.result)
        editPermission_api(data).then((resp) => {
          if (resp.status === 200) {
            onlyMessage('导入成功')
            tableRef.value?.reload()
          }
        })
      } catch (error) {
        onlyMessage('导入失败，请重试！', 'error')
      }
    }
  } else onlyMessage('请上传json格式', 'error')
  return false
}

// 导出数据
const clickExport = () => {
  const _params = {
    paging: false,
    ...params.value,
  }
  exportPermission_api(_params).then((resp) => {
    if (resp.status === 200) {
      downloadJson(resp.result as any, '权限数据')
      onlyMessage('导出成功')
    } else {
      onlyMessage('导出错误', 'error')
    }
  })
}

// 修改状态
const changeStatus = (row: PermissionItem) => {
  const _params = {
    ...row,
    status: row.status ? 0 : 1,
  }
  editPermission_api(_params).then(() => {
    onlyMessage('操作成功')
    tableRef.value.reload()
  })
}

// 删除
const clickDel = (row: PermissionItem) => {
  if(!row.id) return;
  delPermission_api(row.id).then((resp: any) => {
    if (resp.status === 200) {
      tableRef.value?.reload()
      onlyMessage('操作成功!')
    }
  })
}

// 关闭并刷新弹窗
const onSave = () => {
  visible.value = false
  tableRef.value?.reload()
}
</script>
