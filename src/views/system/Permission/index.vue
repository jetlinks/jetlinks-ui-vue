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
        <template #headerLeftRender>
          <a-space>
            <j-permission-button
                type="primary"
                :hasPermission="`${permission}:add`"
                @click="openDialog()"
            >
              <AIcon type="PlusOutlined"/>
              {{ $t('Permission.index.473829-0') }}
            </j-permission-button>
            <a-dropdown trigger="hover">
              <a-button>{{ $t('Permission.index.473829-1') }}</a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a-upload
                        v-show="false"
                        name="file"
                        action="#"
                        accept=".json"
                        :showUploadList="false"
                        :before-upload="clickImport"
                        :disabled="!hasPerm"
                    >
                      <button ref="uploadRef"></button>
                    </a-upload>
                    <j-permission-button style="width: 100%" :hasPermission="`${permission}:import`" @click="triggerUpload">
                      {{ $t('Permission.index.473829-2') }}
                    </j-permission-button>
                  </a-menu-item>
                  <a-menu-item>
                    <j-permission-button
                        style="width: 100%"
                        :hasPermission="`${permission}:export`"
                        :popConfirm="{
                        title: $t('Permission.index.473829-3'),
                        onConfirm: () => clickExport(),
                      }"
                    >
                      {{ $t('Permission.index.473829-4') }}
                    </j-permission-button>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-space>
        </template>
        <template #status="slotProps">
          <j-badge-status
              :status="slotProps.status"
              :text="slotProps.status ? $t('Permission.index.473829-5') : $t('Permission.index.473829-6')"
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
                title: $t('Permission.index.473829-7'),
              }"
                style="padding: 0"
                @click="openDialog(slotProps)"
            >
              <AIcon type="EditOutlined"/>
            </j-permission-button>

            <j-permission-button
                :hasPermission="`${permission}:action`"
                type="link"
                :popConfirm="{
                title: `确定要${!!slotProps.status ? $t('Permission.index.473829-6') : $t('Permission.index.473829-5')}吗？`,
                onConfirm: () => changeStatus(slotProps),
              }"
                style="padding: 0"
                :tooltip="{
                title: slotProps.status ? $t('Permission.index.473829-6') : $t('Permission.index.473829-5'),
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
                title: !!slotProps.status ? $t('Permission.index.473829-9') : $t('Permission.index.473829-10'),
              }"
                danger
                :popConfirm="{
                title: $t('Permission.index.473829-11'),
                onConfirm: () => clickDel(slotProps),
              }"
                style="padding: 0"
                :disabled="!!slotProps.status"
            >
              <AIcon type="DeleteOutlined"/>
            </j-permission-button>
          </a-space>
        </template>
      </j-pro-table>
    </FullPage>
    <!-- 编辑和新增 -->
    <EditDialog v-if="visible" :data="current" @close="visible = false" @save="onSave"/>
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
import {usePermission} from '@jetlinks-web/hooks'
import {PermissionItem} from './typings'
import {onlyMessage} from '@jetlinks-web/utils'
import {downloadJson} from '@/utils/comm'
import {columns} from './util'
import {useI18n} from 'vue-i18n';
import {FullPage} from "@/layout";

const {t: $t} = useI18n();
const permission = 'system/Permission'
const {hasPerm} = usePermission(ref(`${permission}:import`))

const params = ref<any>({})
const visible = ref<boolean>(false)
const current = ref<Partial<PermissionItem>>({})
const tableRef = ref<any>({})  // 表格实例
const uploadRef = ref<any>()
// 搜索
const handleSearch = (e: any) => {
  params.value = e
}

// 打开编辑弹窗
const openDialog = (row?: PermissionItem) => {
  current.value = {...row}
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
            onlyMessage($t('Permission.index.473829-12'))
            tableRef.value?.reload()
          }
        })
      } catch (error) {
        onlyMessage($t('Permission.index.473829-13'), 'error')
      }
    }
  } else onlyMessage($t('Permission.index.473829-14'), 'error')
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
      downloadJson(resp.result as any, $t('Permission.index.473829-15'))
      onlyMessage($t('Permission.index.473829-16'))
    } else {
      onlyMessage($t('Permission.index.473829-17'), 'error')
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
    onlyMessage($t('Permission.index.473829-18'))
    tableRef.value.reload()
  })
}

// 删除
const clickDel = (row: PermissionItem) => {
  if (!row.id) return;
  delPermission_api(row.id).then((resp: any) => {
    if (resp.status === 200) {
      tableRef.value?.reload()
      onlyMessage($t('Permission.index.473829-19'))
    }
  })
}

// 关闭并刷新弹窗
const onSave = () => {
  visible.value = false
  tableRef.value?.reload()
}

const triggerUpload = () =>{
  uploadRef.value.click()
}
</script>
