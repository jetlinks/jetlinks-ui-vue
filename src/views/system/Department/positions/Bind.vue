<script setup name="PositionsBind">
import { useRequest } from '@jetlinks-web/hooks';
import { useI18n } from "vue-i18n";
import { bindUserColumns } from '../util'
import { getUser, bindUser } from '@/api/system/positions';
import {onlyMessage} from "@jetlinks-web/utils";

const { t: $t } = useI18n();

const props = defineProps({
  positionId: {
    type: String,
    default: '',
  },
  orgId: {
    type: String,
    default: '',
  }
})
const emits = defineEmits(['close', 'save'])

const queryParams = ref({})
const _selectedRowKeys = ref([])
const { loading, run } = useRequest(bindUser, {
  immediate: false,
  onSuccess() {
    onlyMessage($t('components.NoticeItem.265390-5'))
    emits('save')
  }
})

//取消选择
const cancelSelect = () => {
  _selectedRowKeys.value = []
}

// 选择
const onSelect = (record, selected) => {
  const rowSet = new Set([..._selectedRowKeys.value])

  if (selected) {
    rowSet.add(record.id)
  } else {
    rowSet.delete(record.id)
  }

  _selectedRowKeys.value = [...rowSet.values()]
}

// 全选
const onSelectAll = (selected, _, changeRows) => {
  const rowSet = new Set([..._selectedRowKeys.value])

  changeRows.forEach((item) => {
    if (selected) {
      rowSet.add(item.id)
    } else {
      rowSet.delete(item.id)
    }
  })

  _selectedRowKeys.value = [...rowSet.values()]
}

// 搜索
const onSearch = (e) => {
  queryParams.value = e
}

const onConfirm = () => {
  if (_selectedRowKeys.value.length < 1) {
    onlyMessage($t('components.AddUserDialog.659587-3'), 'error');
  } else {
    run(props.orgId, props.positionId, _selectedRowKeys.value)
  }
}

</script>

<template>
  <a-modal
    :title="$t('components.AddBindUserDialog.811389-0')"
    :width="900"
    visible
    :confirmLoading="loading"
    @ok="onConfirm"
    @cancel="emits('close')"
  >
    <pro-search type="simple" :columns="bindUserColumns" target="category" @search="onSearch" />
    <div class="table">
      <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :columns="bindUserColumns"
        :request="getUser"
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
          terms: [
            {
              column: 'id$in-dimension$position$not',
              value: positionId,
            },
             {
              column: 'username',
              value: 'admin',
              termType: 'not',
              type: 'and'
            }
          ]
        }"
        :scroll="{ y: 500 }"
      />
    </div>
  </a-modal>
</template>

<style scoped lang="less">

</style>
