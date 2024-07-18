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
            <span>查找</span>
            <a-input v-model:value="searchValue" placeholder="请输入查找内容" />
            <a-button @click="() => search('all')">查抄全部</a-button>
            <a-button @click="() => search('prev')">上一个</a-button>
            <a-button @click="() => search('next')">下一个</a-button>
          </a-space>
        </div>
        <div>
          <a-button @click.stop="onClose">关闭</a-button>
        </div>
      </div>
      <div v-if="visible" style="margin: 12px 0">
        <Table
          ref="tableRef"
          :data-source="filterArray"
          :columns="columns"
          :height="tableHeight"
          :disableMenu="false"
          :cellHeight="32"
          :rowSelection="{
            onSelect: onSelect,
            selectedRowKeys: selectedRowKeys
          }"
          :serial="{
            width: openGroup ? 150 : 66
          }"
        >
          <template #serial="{ record }">
            <span v-if="openGroup">
              <Ellipsis>
                {{ record.expands.groupName }} 第 {{ record.__serial }} 行
              </Ellipsis>
            </span>
            <span v-else>
              {{ record.__serial }}
            </span>
          </template>
        </Table>
      </div>
      <div v-if="visible">
        查找到 {{filterArray.length}} 条相关属性
      </div>
    </div>
  </DragModal>
</template>

<script setup name="MetadataTableSearch">
import { DragModal } from '@/components/Modal'
import Table from '../../Table.vue'
import {useTableDataSource, useTableOpenGroup, useTableTool, useGroupOptions} from "@/components/Metadata/Table/context";
import { sortBy } from 'lodash-es'

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
    title: '标识',
    dataIndex: 'id',
  },
  {
    title: '名称',
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
  const cloneDataSource = JSON.parse(JSON.stringify(dataSource.value || '[]'))
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

  selectedRowKeys.value = [searchItem.id]
  selectedTableRow(searchItem)
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
</style>
