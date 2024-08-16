<template>
  <DragModal
    :width="800"
    :height="modalHeight"
    :title="false"
    :dragRang="[600, 200]"
    :bodyStyle="{
      overflow: 'hidden'
    }"
    @heightChange="heightChange"
  >
    <div class="table-search">
      <div class="table-search-header">
        <div>
          <a-space>
            <span>{{ $t('Search.search.4348671-0') }}</span>
            <a-input v-model:value="searchValue" :maxlength="64" :placeholder="$t('Search.search.4348671-1')" />
            <a-button type="primary" ghost @click="() => search('all')">{{ $t('Search.search.4348671-2') }}</a-button>
            <a-button type="primary" ghost @click="() => search('prev')">{{ $t('Search.search.4348671-3') }}</a-button>
            <a-button type="primary" ghost @click="() => search('next')">{{ $t('Search.search.4348671-4') }}</a-button>
          </a-space>
        </div>
        <div>
          <a-button type="primary" @click.stop="onClose">{{ $t('Search.search.4348671-5') }}</a-button>
        </div>
      </div>
      <div v-if="visible" style="margin: 12px 0">
        <Table
          ref="tableRef"
          :data-source="filterArray"
          :columns="columns"
          :height="tableHeight"
          :disableMenu="false"
          :cellHeight="36"
          :rowSelection="{
            onSelect: onSelect,
            selectedRowKeys: selectedRowKeys
          }"
          :serial="{
            width: openGroup ? 150 : 66,
            title: $t('Search.search.4348671-6')
          }"
        >
          <template #serial="{ record }">
            <span v-if="openGroup">
              <Ellipsis>
                {{ record.expands.groupName }} {{ $t('Search.search.4348671-7') }} {{ record.__oldSerial }} {{ $t('Search.search.4348671-8') }}
              </Ellipsis>
            </span>
            <span v-else>
              {{ record.__serial }}
            </span>
          </template>
          <template #id="{ record }">
            <Ellipsis>
              {{ record.id }}
            </Ellipsis>
          </template>
          <template #name="{ record }">
            <Ellipsis>
              {{ record.name }}
            </Ellipsis>
          </template>
        </Table>
      </div>
      <div v-if="visible">
        {{ $t('Search.search.4348671-9') }} <span class="table-search-result-total">{{filterArray.length}}</span> {{ $t('Search.search.4348671-10') }}
      </div>
    </div>
  </DragModal>
</template>

<script setup name="MetadataTableSearch">
import { DragModal } from '@/components/Modal'
import Table from '../../Table.vue'
import {useTableDataSource, useTableOpenGroup, useTableTool, useGroupOptions} from "@/components/Metadata/Table/context";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  searchKey: {
    type: String,
    default: 'id'
  }
})

const emit = defineEmits(['close'])


const dataSource = useTableDataSource()
const openGroup = useTableOpenGroup()
const tableTool = useTableTool()
const groupOptions = useGroupOptions()

const searchValue = ref()
const filterArray = ref([])
const visible = ref(false)
const searchIndex = ref(-1)
const modalHeight = ref(100)
const tableHeight = ref(230)
const selectedRowKeys = ref([])
const tableRef = ref()

const columns = [
  {
    title: $t('Search.search.4348671-11'),
    dataIndex: 'id',
  },
  {
    title: $t('Search.search.4348671-12'),
    dataIndex: 'name',
  }
]

const selectedTableRow = (record) => {
  tableTool.scrollTo({
    ...record,
    __serial: record.__serial - 1
  })
  tableTool.selected([record.id])
}

const handleFilterArray = () => {
  const cloneDataSource = JSON.parse(JSON.stringify(dataSource.value || '[]')).map(item => Object.assign(item, { __oldSerial: item.__serial}))
  const _filterArray = cloneDataSource.filter(item => {
    if (item[props.searchKey]) {
      return item[props.searchKey].includes(searchValue.value)
    }
    return false
  })

  if (openGroup) {
    const handleGroup = []

    groupOptions.value.forEach(group => {
      handleGroup.push(..._filterArray.filter(item => item.expands.groupId === group.value))
    })

    return handleGroup
  }

  return _filterArray
}

const search = (key) => {
  filterArray.value = handleFilterArray()

  if (key === 'all') {
    visible.value = true
    modalHeight.value = 400
    searchIndex.value = 0
  } else if (key === 'next') {
    searchIndex.value += 1
  } else {
    searchIndex.value -= 1
  }

  if (searchIndex.value < 0) {
    searchIndex.value = filterArray.value.length - 1
  } else if (searchIndex.value > filterArray.value.length - 1){
    searchIndex.value = 0
  }

  const searchItem = filterArray.value[searchIndex.value]

  if (key !== 'all' && visible.value) {
    tableRef.value?.scrollToByIndex(searchIndex.value - 1)
  }

  if (filterArray.value.length > 1) {
    selectedRowKeys.value = [searchItem.id]
    selectedTableRow(searchItem)
  } else {
    selectedRowKeys.value = []
    tableTool.selected([])
  }
}

const heightChange = (h) => {
  if (h > 340) {
    tableHeight.value = h - 160
  }
}

const onClose = () => {
  console.log('close')
  emit('close')
}

const onSelect = (record) => {
  searchIndex.value = filterArray.value.findIndex(item => item.id === record.id)
  selectedRowKeys.value = [record.id]
  selectedTableRow(record)
}

</script>

<style scoped lang="less">
.table-search-header {
  display: flex;
  justify-content: space-between;
}

.table-search-result-total {
  color: @primary-color;
}
</style>
