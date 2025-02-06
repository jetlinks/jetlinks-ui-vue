<template>
  <div class="permission-choose-container">
    <a-input
      v-model:value="searchValue"
      style="width: 300px"
      allowClear
      :placeholder="$t('components.PermissionChoose.947802-0')"
      @input="onSearch"
      :disabled="disabled"
    />

    <div class="permission-table">
      <a-row :gutter="24" class="table-head">
        <a-col :span="firstWidth">{{ $t('components.PermissionChoose.947802-1') }}</a-col
        ><a-col :span="24 - firstWidth">{{ $t('components.PermissionChoose.947802-2') }}</a-col>
      </a-row>
      <div class="table-body" :style="{ 'max-height': maxHeight }">
        <a-row
          :gutter="24"
          class="row"
          v-for="rowItem in list"
          :key="rowItem.id"
        >
          <a-col :span="firstWidth" class="item-name">
            <a-checkbox
              v-model:checked="rowItem.checkAll"
              :indeterminate="rowItem.indeterminate"
              @change="(e) => selectAllOptions(e, rowItem)"
              :disabled="disabled"
            >
              <j-ellipsis>
               {{ rowItem.name }}
              </j-ellipsis>
            </a-checkbox>
          </a-col>
          <a-col :span="24 - firstWidth">
            <a-checkbox-group
              v-model:value="rowItem.checkedList"
              :options="rowItem.options"
              @change="((val:string[])=> selectOption(rowItem, val))"
              :disabled="disabled"
            />
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exportPermission_api } from '@/api/system/permission'

type PermissionType = {
  id: string
  name: string
  checkedList: string[]
  checkAll: boolean
  indeterminate: boolean
  options: any[]
}

const props = defineProps({
  key: {
    type: String,
    default: '',
  },
  value: {
    type: Array,
    default: () => [],
  },
  firstWidth: {
    type: Number,
    default: 3,
  },
  maxHeight: {
    type: String,
    default: '350px',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emits = defineEmits(['update:value'])

const searchValue = ref<string>('')
const list = ref<PermissionType[]>([])
const sourceList = ref<any[]>([])
const searchTimer = ref<null | NodeJS.Timeout>(null)

const onSearch = () => {
  if (searchTimer.value) {
    clearTimeout(searchTimer.value)
  }
  searchTimer.value = setTimeout(() => {
    handleSearch()
    searchTimer.value = null
  }, 1000)
}

// 全选/取消全选
const selectAllOptions = (e: any, _row: PermissionType) => {
  const newValue = props.value.filter(
    (item: any) => item.permission !== _row.id,
  )
  if (e.target.checked) {
    newValue.push({
      permission: _row.id,
      actions: _row.options.map((item) => item.value),
    })
  }
  emits('update:value', newValue)
}

const selectOption = (_row: any, newValue: string[]) => {
  const newProp = props.value.filter((item: any) => item.permission !== _row.id)
  if (newValue.length === _row.options.length) {
    newProp.push({
      permission: _row.id,
      actions: newValue,
    })
  } else if (newValue.length > 0) {
    newProp.push({
      permission: _row.id,
      actions: newValue,
    })
  }
  emits('update:value', newProp)
}

const handleData = (_arr: any[], checkedValue: any[]) => {
  return _arr.map((item) => {
    const checked = checkedValue?.find(
      (checkedItem) => checkedItem.permission === item.id,
    )

    const options =
      (item.actions &&
        item.actions.map((actionItem: any) => ({
          label: actionItem.i18nName || actionItem.name,
          value: actionItem.action,
        }))) ||
      []
    return {
      id: item.id,
      name: item.i18nName ||item.name,
      checkedList: (checked && checked.actions) || [],
      checkAll:
        (checked &&
          item.actions &&
          checked.actions.length === item.actions.length) ||
        false,
      indeterminate:
        (checked &&
          item.actions &&
          checked.actions.length < item.actions.length) ||
        false,
      options,
    }
  }) as PermissionType[]
}

const handleSearch = () => {
  const params: any = {
    paging: false,
  }
  if (searchValue.value) {
    params.terms = [{ column: 'name$like', value: `%${searchValue.value}%` }]
  }
  exportPermission_api(params).then((resp) => {
    if (resp.success) {
      sourceList.value = resp.result || []
    }
  })
}

onMounted(() => {
  handleSearch()
})

watch(
  () => [props.value, sourceList.value],
  ([val1, val2]) => {
    list.value = handleData(val2, val1)
  },
  {
    deep: true,
    immediate: true
  }
)
</script>

<style lang="less" scoped>
.permission-choose-container {
  .ant-input-affix-wrapper {
    border-color: #d9d9d9 !important;
  }
  .permission-table {
    margin-top: 12px;
    font-size: 14px;
    border: 1px solid #d9d9d9;
    color: rgba(0, 0, 0, 0.85);
    .table-head {
      padding: 12px;
      background-color: #d9d9d9;
      margin: 0 !important;
    }
    .table-body {
      overflow: auto;
      .row {
        margin: 0 !important;

        border-bottom: 1px solid #d9d9d9;

        > div {
          padding: 8px 12px;
        }
        .item-name {
          display: flex;
          align-items: center;
          border-right: 1px solid #d9d9d9;
        }
      }
    }
  }
}
</style>
