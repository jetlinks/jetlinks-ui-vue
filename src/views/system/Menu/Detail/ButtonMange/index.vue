<template>
  <div>
    <j-pro-table
      ref="tableRef"
      mode="TABLE"
      noPagination
      :columns="columns"
      :dataSource="tableData"
    >
      <template #headerLeftRender>
        <j-permission-button
          type="primary"
          :hasPermission="`${permission}:update`"
          @click="openDialog('新增', {})"
        >
          <AIcon type="PlusOutlined" />新增
        </j-permission-button>
      </template>
      <template #action="slotProps">
        <a-space :size="16">
          <j-permission-button
            type="link"
            :hasPermission="`${permission}:update`"
            :tooltip="{ title: '编辑' }"
            style="padding: 0"
            @click="openDialog('编辑', slotProps)"
          >
            <AIcon type="EditOutlined" />
          </j-permission-button>
          <j-permission-button
            type="link"
            :hasPermission="`${permission}:view`"
            :tooltip="{ title: '查看' }"
            style="padding: 0"
            @click="openDialog('查看', slotProps)"
          >
            <AIcon type="SearchOutlined" />
          </j-permission-button>
          <j-permission-button
            type="link"
            :tooltip="{ title: '删除' }"
            style="padding: 0"
            danger
            :popConfirm="{
              title: `确认删除`,
              onConfirm: () => clickDel(slotProps),
            }"
          >
            <AIcon type="DeleteOutlined" />
          </j-permission-button>
        </a-space>
      </template>
    </j-pro-table>

    <ButtonAddDialog
      v-if="dialogVisible"
      :menu-info="value"
      :mode="dialogTitle"
      :data="selectItem"
      @save="onSave"
      @close="dialogVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { updateMenu } from '@/api/system/menu'
import { onlyMessage } from '@jetlinks-web/utils'
import ButtonAddDialog from '../../components/ButtonAddDialog.vue'

const columns = [
  {
    title: '编码',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true
  },
  {
    title: '说明',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: true,
    width: 200,
  },
]
const permission = 'system/Menu'

const props = defineProps({
  value: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['refresh'])

const tableData = ref<any[]>([])
const selectItem = ref<any>({})
const dialogVisible = ref(false)
const dialogTitle = ref<'查看' | '新增' | '编辑'>('新增')

const openDialog = (mode: '查看' | '新增' | '编辑', row: object) => {
  if (!props.value.id) {
    return onlyMessage('请先新增菜单基本信息', 'warning')
  }
  selectItem.value = { ...row }
  dialogTitle.value = mode
  dialogVisible.value = true
}

const clickDel = (row: any) => {
  const buttons = props.value.buttons.filter(
    (item: any) => item.id !== row.id,
  )
  const params = {
    ...props.value,
    buttons,
  }
  updateMenu(params).then(() => {
    onlyMessage('操作成功')
    emits('refresh')
  })
}

const onSave = () => {
    dialogVisible.value = false
    emits('refresh')
}

watchEffect(() => {
  tableData.value = props.value?.buttons || []
})
</script>
