<template>
  <div class="role-user-container">
    <pro-search
      :columns="columns"
      target="system-position-user"
      :style="{
        padding: 0,
      }"
      @search="(params)=>queryParams = {...params}"
    />

    <div class="table-content">
      <j-pro-table
          ref="tableRef"
          mode="TABLE"
          style="padding: 0"
          :columns="columns"
          :request="table.getList"
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
        <span v-time-format="'YYYY-MM-DD HH:mm:ss'">
          {{ slotProps.createTime }}
        </span>
        </template>

        <template #action="slotProps">
          <a-space :size="16">
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
          </a-space>
        </template>
      </j-pro-table>
    </div>
  </div>
  <AddUserDialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :orgId="props.orgId"
      :positionId="positionId"
      @refresh="table.refresh"
  />
</template>

<script setup lang="ts" name="PositionsUser">
import { getUser, unbindUser } from '@/api/system/positions'
import AddUserDialog from './AddUserDialog.vue'
import { onlyMessage } from '@jetlinks-web/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const props = defineProps({
  orgId: {
    type: String
  }
})

const positionId = useRoute().params.id as string

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

// 弹窗相关
const dialogVisible = ref(false)
const table = {
  getList: (oParams: any) => {
    const params = {
      ...oParams,
      terms: [
        {
          terms: [
            {
              column: 'id$in-dimension$position',
              value: positionId,
            },
          ],
        },
      ],
    }
    if (oParams.terms[0])
      params.terms.unshift({
        terms: oParams.terms[0].terms,
      })
    return getUser(params)
  },
  // 批量解绑
  unbind: (ids?: string[]) => {
    const data = ids ? ids : selectedRowKeys.value
    if (!data.length) {
      onlyMessage($t('User.index.667995-12'), 'warning')
      return
    }
    unbindUser(props.orgId!, positionId, data).then((resp) => {
      if (resp.success) {
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

  .table-content {
    flex: 1;
    min-height: 0;
  }
}
</style>
