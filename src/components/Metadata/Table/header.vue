<template>
  <div class="metadata-edit-table-header-container" :style="style">
    <div class="metadata-edit-table-header-cell" v-for="(item, index) in columns" :id="item.dataIndex" :style="{width: `${item.width}px`, left: `${item.left}px`}">
      <span :class="{ 'metadata-edit-table-header-cell-box': true, 'header-cell-box-tool': !!(item.sort || item.filter) }">
        <template v-if="!!(item.sort || item.filter)">
          <span class="table-header-cell-title">
            {{ String.fromCharCode(65 + index)}} {{ item.title }}
          </span>
          <div class="table-header-cell-trigger">
            <AIcon
              v-if="item.filter"
              type="SearchOutlined"
              style="color: rgba(0,0,0, 0.25)"
              @click="() => {showFilter(item.filter.key || item.dataIndex)}"
            />
            <AIcon
              v-if="item.sort"
              type=""
              style="color: rgba(0,0,0, 0.25)"
            />
          </div>
        </template>
        <template v-else>
          {{ String.fromCharCode(65 + index)}} {{ item.title }}
        </template>

      </span>
    </div>
    <SearchModal
      v-if="searchData.visible"
      :searchKey="searchData.key"
      @close="searchData.visible = false"
    />
  </div>
</template>

<script setup name="MetadataBaseTableHeader">
import { SearchModal } from './components/Search'

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

const searchData = reactive({
  visible: false,
  key: undefined
})

const showFilter = (key) => {
  searchData.visible = true
  searchData.key = key
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
