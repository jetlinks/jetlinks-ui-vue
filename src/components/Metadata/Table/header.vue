<template>
  <div class="metadata-edit-table-header-container" :style="style">
    <div class="metadata-edit-table-header-cell" v-for="(item, index) in columns" :id="item.dataIndex" :style="{width: `${item.width}px`, left: `${item.left}px`}">
      <span class="metadata-edit-table-header-cell-box">
        {{ String.fromCharCode(65 + index)}} {{ item.title }}
      </span>
    </div>
  </div>
</template>

<script setup name="MetadataBaseTableHeader">

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
