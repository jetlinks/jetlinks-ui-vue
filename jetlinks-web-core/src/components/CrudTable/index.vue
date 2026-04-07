<template>
  <pro-search
      :columns="columns"
      :target="target"
      @search="handleSearch"
  />
  <full-page>
    <j-pro-table
        ref="tableRef"
        :columns="columns"
        :request="request"
        :defaultParams="defaultParams"
        :params="params"
        :modeValue="modeValue"
        :mode="mode"
        :gridColumns="gridColumns"
    >
      <template v-for="(_, key) in _slots" :key="key" #[key]="slotProps">
        <slot :name="key" v-bind="slotProps"></slot>
      </template>
      <template #headerLeftRender>
        <j-permission-button
            type="primary"
            @click="handleAdd({})"
            v-if="showAdd"
            :hasPermission="`${permission}:add`"
        >
          <template #icon>
            <AIcon type="PlusOutlined"/>
          </template>
          {{ $t('CrudTable.index.150716-1') }}
        </j-permission-button>
        <slot name="headerLeftRender"></slot>
      </template>
      <template #card="slotProps">
        <slot name="card" v-bind="slotProps">
          <CardBox
              :value="slotProps"
              @click="handleView"
              :status="handleFuncValue(status, slotProps)"
              :statusText="handleFuncValue(statusText, slotProps)"
              :statusNames="statusNames"
              :imgUrl="handleFuncValue(imgUrl, slotProps)"
              :contentList="contentList(slotProps)"
              :actions="_actions.filter(i => i.key !== 'view')"
              :active="selectedRowKeys?.includes?.(slotProps[props.rowKey])"
          />
        </slot>
      </template>
      <template #actions="slotProps">
        <a-space>
          <template
              v-for="i in _actions.filter((item) => handleFuncValue(item.show === undefined ? true : item.show, slotProps))"
              :key="i.key"
          >
            <j-permission-button
                :disabled="handleFuncValue(i.disabled, slotProps)"
                :popConfirm="i.popConfirm ? {
                  title: handleFuncValue(i.popConfirm.title, slotProps),
                  onConfirm: (e) => {
                    i.popConfirm.onConfirm?.(slotProps, e)
                  }
                }: null"
                :tooltip="i.tooltip ? {
                  title: handleFuncValue(i.tooltip.title, slotProps)
                } : null"
                @click="(e) => i.onClick?.(slotProps, e)"
                type="link"
                style="padding: 0 5px"
                :danger="i.key === 'delete'"
                :hasPermission="i.hasPermission"
            >
              <template #icon>
                <AIcon :type="handleFuncValue(i.icon, slotProps)"/>
              </template>
            </j-permission-button>
          </template>
        </a-space>
      </template>
    </j-pro-table>
  </full-page>
  <EditDialog
      v-if="current.visible"
      :data="current.data"
      @save="onSave"
      @close="current.visible = false"
      :title="current.data.id ? `${$t('CrudTable.index.150716-1')}` : `${$t('CrudTable.index.150716-2')}`"
      :schema="schema"
      :request="updateRequest"
      :handleRequestData="handleRequestData"
  />
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {crudTableProps, handleFuncValue} from "./utils";
import {omit} from "lodash-es";
import {useTableSelection} from '@jetlinks-web/components/es/ProTable/hooks'

const props = defineProps({...crudTableProps})

const emits = defineEmits(['itemClick'])

const {t: $t} = useI18n();
const params = ref({})
const tableRef = ref()

const slots = useSlots()

const current = reactive({
  visible: false,
  data: {}
})

const isCheck = computed(() => {
  return props.showSelect
})

const _slots = computed(() => {
  return shallowReactive(omit(slots, ['headerLeftRender', 'card', 'actions']))
})

const _actions = computed(() => {
  const arr = []
  if (props.showView) {
    arr.push({
      key: 'view',
      text: $t('CrudTable.index.150716-0'),
      tooltip: {
        title: $t('CrudTable.index.150716-0'),
      },
      icon: 'EyeOutlined',
      hasPermission: true,
      onClick: (data) => {
        handleView(data);
      },
    })
  }
  if (props.showEdit) {
    arr.push({
      key: 'update',
      text: $t('CrudTable.index.150716-2'),
      tooltip: {
        title: $t('CrudTable.index.150716-2'),
      },
      hasPermission: `${props.permission}:update`,
      icon: 'EditOutlined',
      onClick: (data) => {
        handleAdd(data)
      },
    })
  }
  arr.push(...props.actions)
  if (props.showDelete) {
    arr.push({
      key: 'delete',
      text: $t('CrudTable.index.150716-3'),
      tooltip: {
        title: $t('CrudTable.index.150716-3'),
      },
      hasPermission: `${props.permission}:delete`,
      popConfirm: {
        title: $t('CrudTable.index.150716-4'),
        onConfirm: async (data) => {
          if (props.deleteRequest) {
            const res = await props.deleteRequest(data.id);
            if (res.success) {
              tableRef.value.reload?.()
            }
          }
        }
      },
      icon: 'DeleteOutlined',
    })
  }
  return arr
})

const {selectedRowKeys, selectedRows} = useTableSelection({isCheck: isCheck})

const handleSearch = (e) => {
  params.value = e;
}

const handleAdd = (data) => {
  current.visible = true;
  current.data = data;
}

const onSave = () => {
  current.visible = false;
  tableRef.value.reload?.()
}

const handleView = (data) => {
  emits('itemClick', data)
}

const reload = () => {
  tableRef.value.reload?.();
}

defineExpose({
  reload,
  selectedRowKeys: selectedRowKeys || [],
  selectedRows: selectedRows || []
})
</script>
