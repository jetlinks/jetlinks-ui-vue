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
          @click="openDialog($t('ButtonMange.index.544049-0'), {})"
        >
          <AIcon type="PlusOutlined" />{{ $t('ButtonMange.index.544049-0') }}
        </j-permission-button>
      </template>
      <template #name="slotProps">
        {{ slotProps?.i18nName || slotProps?.name}}
      </template>
      <template #action="slotProps">
        <a-space :size="16">
          <j-permission-button
            type="link"
            :hasPermission="`${permission}:update`"
            :tooltip="{ title: $t('ButtonMange.index.544049-1') }"
            style="padding: 0"
            @click="openDialog($t('ButtonMange.index.544049-1'), slotProps)"
          >
            <AIcon type="EditOutlined" />
          </j-permission-button>
          <j-permission-button
            type="link"
            :hasPermission="`${permission}:view`"
            :tooltip="{ title: $t('ButtonMange.index.544049-2') }"
            style="padding: 0"
            @click="openDialog($t('ButtonMange.index.544049-2'), slotProps)"
          >
            <AIcon type="SearchOutlined" />
          </j-permission-button>
          <j-permission-button
            type="link"
            :tooltip="{ title: $t('ButtonMange.index.544049-3') }"
            style="padding: 0"
            danger
            :popConfirm="{
              title: $t('ButtonMange.index.544049-4'),
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const columns = [
  {
    title: $t('ButtonMange.index.544049-5'),
    dataIndex: 'id',
    key: 'id',
    ellipsis: true
  },
  {
    title: $t('ButtonMange.index.544049-6'),
    dataIndex: 'name',
    key: 'name',
    scopedSlots: true,
    ellipsis: true
  },
  {
    title: $t('ButtonMange.index.544049-7'),
    dataIndex: 'description',
    key: 'description',
    ellipsis: true
  },
  {
    title: $t('ButtonMange.index.544049-8'),
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
const dialogTitle = ref($t('ButtonMange.index.544049-0'))

const openDialog = (mode: any, row: object) => {
  if (!props.value.id) {
    return onlyMessage($t('ButtonMange.index.544049-9'), 'warning')
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
    onlyMessage($t('ButtonMange.index.544049-10'))
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
