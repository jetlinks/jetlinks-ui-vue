<script setup>
import { _queryTemplate } from '@/api/link/resource';
import Search from './Search/Search.vue';
const props = defineProps({
  request: Function,
  title: String,
  gridColumns: {
    type:Array,
    default: () => [4]
  },
  rowSelection: {
    type: [Boolean, Object],
    default: false
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  extra: {
    type: Object,
    default: () => ({})
  },
  dataSource: {
    type: Array,
    default: undefined
  },
  type: {
    type: String,
    default: undefined
  },
  defaultParams: {
    type: Object,
    default: () => ({
      sorts: [{ name: 'createTime', order: 'desc' }]
    })
  }
})

const emit = defineEmits(['itemClick'])

const columns = []

const params = ref()

const onItemClick = (record) => {
  emit('itemClick', record)
}

</script>

<template>
  <div class="resource-table-warp">

    <Search v-if="showSearch" v-model:value="params">
      <template #titleRender>
        <slot name="title">
          <span class="resource-table-search-title">
            {{ title }}
          </span>
        </slot>
      </template>
    </Search>
    <j-pro-table
      ref="tableRef"
      model="CARD"
      style="padding: 0;background: transparent"
      :type="type"
      :gridColumns="gridColumns"
      :request="props.request || _queryTemplate"
      :columns="columns"
      :rowSelection="rowSelection"
      :dataSource="dataSource"
      :params="params"
      :defaultParams="defaultParams"
      v-bind="extra"
    >
      <template #headerTitle>
        <slot name="headerTitle"/>
      </template>
      <template #card="slotProps">
        <slot name="card" :slotProps="slotProps">
          <resource-card-item
            :active="props.rowSelection?.selectedRowKeys?.includes(slotProps.id)"
            :record="slotProps"
            @click="onItemClick(slotProps)"
          />
        </slot>
      </template>
    </j-pro-table>
  </div>
</template>

<style scoped lang="less">
.resource-table-warp {

  :deep(.jtable-card-items) {
    gap: 24px;
  }

  .resource-table-search-title {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
