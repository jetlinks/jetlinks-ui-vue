<template>
  <div class="metadata-edit-table-header-container" :style="style">
    <div class="metadata-edit-table-header-cell" v-for="(item, index) in columns" :id="item.dataIndex" :style="{width: `${item.width}px`, left: `${item.left}px`}">
      <div :class="{ 'metadata-edit-table-header-cell-box': true, 'header-cell-box-tool': !!(item.sort || item.filter) }">
          <div class="table-header-cell-title">
            <span>{{ item.title }}</span>
            <span v-if="item.form?.required" class="header-cell-required">*</span>
          </div>
          <div v-if="!!(item.sort || item.filter)" class="table-header-cell-trigger">
            <AIcon
              v-if="item.filter"
              type="SearchOutlined"
              style="color: rgba(0,0,0, 0.25)"
              @click="() => {showFilter(item.filter.key || item.dataIndex)}"
            />
            <Sort
              v-if="item.sort"
              v-bind="item.sort"
              :key="item.dataIndex"
              :active="tableTool.sortData.dataIndex === item.dataIndex"
              :selectedRowKeys="tableTool.sortData.dataIndex === item.dataIndex ? tableTool.sortData.orderKeys : []"
              :dataIndex="item.dataIndex"
              @click="sortClick"
            />
          </div>

      </div>
    </div>
    <SearchModal
      v-if="searchData.visible"
      :searchKey="searchData.key"
      @close="searchData.visible = false"
    />
  </div>
</template>

<script setup name="MetadataBaseTableHeader">
import { SearchModal, Sort } from './components/Search'
import {useTableTool} from "@/components/Metadata/Table/context";

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  serial: {
    type: Boolean,
    default: false
  },
  style: {
    type: Object,
    default: undefined
  }
})

const tableTool = useTableTool()

const searchData = reactive({
  visible: false,
  key: undefined
})

const showFilter = (key) => {
  searchData.visible = true
  searchData.key = key
}

const sortClick = () => {
  searchData.visible = false
}

</script>

<style scoped lang="less">
.metadata-edit-table-header-container {
  height: 100%;
  position: relative;
  .metadata-edit-table-header-cell {
    height: 100%;
    display: inline-flex;
    align-items: center;
    float: left;
    overflow: visible;
    position: absolute;
    top: 0;

    .metadata-edit-table-header-cell-box {
      padding: 0 12px;
      width: 100%;

      &.header-cell-box-tool {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .table-header-cell-title {
        flex: 1;
        display: flex;
        align-items: center;
        font-weight: 600;
      }

      .header-cell-required {
        color: @error-color;
        padding-left: 8px;
        transform: translateY(3px);
        font-weight: 500;
      }

      &::before {
        position: absolute;
        top: 50%;
        right: 1px;
        width: 1px;
        height: 1.6em;
        pointer-events: none;
        background-color: rgba(0,0,0,.06);
        transform: translateY(-50%);
        transition: background-color .3s;
        content: "";
      }

      &:not(:last-child) {
        &::before {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
