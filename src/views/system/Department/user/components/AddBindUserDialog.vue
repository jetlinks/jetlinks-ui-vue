<template>
  <a-modal
    :title="$t('components.AddBindUserDialog.811389-0')"
    :width="900"
    visible
    :confirmLoading="loading"
    @ok="confirm"
    @cancel="emits('close')"
  >
    <pro-search style="padding: 0" type="simple" :columns="bindUserColumns" target="category" @search="onSearch" />
    <div class="table" style="height: 450px">
      <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :columns="bindUserColumns"
        :request="handleSearch"
        :params="queryParams"
        :rowSelection="{
          selectedRowKeys: _selectedRowKeys,
          onSelect: onSelect,
          onSelectAll: onSelectAll,
          onSelectNone: cancelSelect,
        }"
        :bodyStyle="{ padding: '0 24px' }"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }],
        }"
        style="padding: 0"
      />
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { bindUser_api } from '@/api/system/department'
import { useRequest } from '@jetlinks-web/hooks'
import { onlyMessage } from '@jetlinks-web/utils'
import { bindUserColumns, requestFun } from '../../util'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emits = defineEmits(['save', 'close'])

const props = defineProps({
  parentId: {
    type: String,
    default: '',
  },
})

const queryParams = ref({ terms: [] })
const _selectedRowKeys = ref<string[]>([])

// 保存数据
const { loading, run } = useRequest(bindUser_api, {
  immediate: false,
  onSuccess(res) {
    if (res.success) {
      onlyMessage($t('components.AddBindUserDialog.811389-1'))
      _selectedRowKeys.value = []
      emits('save')
    }
  },
})

const confirm = () => {
  if (_selectedRowKeys.value.length && props.parentId) {
    run(props.parentId, _selectedRowKeys.value)
  } else {
    onlyMessage($t('components.AddBindUserDialog.811389-2'), 'warning')
  }
}

const cancelSelect = () => {
  _selectedRowKeys.value = []
}
const onSelect = (record: any, selected: boolean) => {
  const arr = [..._selectedRowKeys.value]
  const _index = arr.findIndex((item) => item === record?.id)
  if (selected) {
    if (!(_index > -1)) {
      _selectedRowKeys.value.push(record.id)
    }
  } else {
    if (_index > -1) {
      // 去掉数据
      _selectedRowKeys.value.splice(_index, 1)
    }
  }
}
const onSelectAll = (selected: boolean, _: any[], changeRows: any) => {
  if (selected) {
    changeRows.map((i: any) => {
      if (!_selectedRowKeys.value.includes(i.id)) {
        _selectedRowKeys.value.push(i.id)
      }
    })
  } else {
    const arr = changeRows.map((item: any) => item.id)
    const _ids: string[] = [];
    [..._selectedRowKeys.value].map((i: any) => {
      if (!arr.includes(i)) {
        _ids.push(i)
      }
    })
    _selectedRowKeys.value = _ids
  }
}

// 请求数据
const handleSearch = (oParams: any) =>
    requestFun(props.parentId, oParams, [
      {
        terms: [
          {
            column: 'id$in-dimension$org$not',
            value: props.parentId,
          },
        ],
      },
    ])

//
const onSearch = (e: any) => {
  queryParams.value = e
}
</script>
