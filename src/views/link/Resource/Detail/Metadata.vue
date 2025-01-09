<script setup name="Metadata">
import { getMetadataColumns,DataTypeList, EventLevel, sourceType,arrayToObj } from './utils'
import { EditTable} from '@/components/Metadata/Table'
import VirtualScroll from '@/components/VirtualScroll/index.vue'

const props = defineProps({
  metadata: {
    type: Object,
    default: () => ({})
  }
})

const visible = ref(false)

const eventLevelMap = arrayToObj(EventLevel, { key: 'value', value: 'label'})
const dataTypeTableMap = arrayToObj(DataTypeList, { key: 'value', value: 'label'})

const getSourceStr = (types) => {
  return sourceType.filter(item => !types?.includes(item.value) || false ).map(item => item.label).join(',')
}

const activeKey = ref('properties')

const tabs = [
  {
    key: 'properties',
    tab: '属性定义'
  },
  {
    key: 'functions',
    tab: '功能定义'
  },
  {
    key: 'events',
    tab: '事件定义'
  },
  {
    key: 'tags',
    tab: '标签定义'
  }
]
const searchValue = ref()
const _searchValue = ref()

const _metadata = computed(() => {
  return (props.metadata[activeKey.value] || []).filter(i => {
    return !_searchValue.value || i.id.includes(_searchValue.value) || i.name.includes(_searchValue.value)
  })
})

const onSearch = (val) => {
  _searchValue.value = val
}

onMounted(() => {
  nextTick(() => {
    visible.value = true
  })
})

</script>

<template>
 <div class='metadata-content'>
    <div class='tabs'>
      <div class='tabs-content'>
        <div @click='activeKey = item.key' :class='{"active": activeKey === item.key}' v-for='item in tabs'
             :key='item.key'>{{ item.tab }}
        </div>
      </div>
      <div>
        <a-input-search allowClear placeholder='请输入关键词' v-model:value='searchValue' @search='onSearch' />
      </div>
    </div>
    <div class='wrap'>
      <template v-if='_metadata.length'>
        <VirtualScroll :data='_metadata'>
          <template #item='record'>
            <div class='wrap-item'>
              <div class='name'>
                <j-ellipsis>
                  {{ record.name }}
                </j-ellipsis>
              </div>
              <div class='text'>
                <j-ellipsis>
                  标识: {{ record.id }}
                </j-ellipsis>
              </div>
              <template v-if='activeKey !== "events" && activeKey !== "functions"'>
                <div class='text' style='width: 260px'>
                  数据类型：{{ dataTypeTableMap[record?.valueType?.type] }}
                </div>
              </template>
              <template v-if='activeKey === "properties"'>
                <div class='text'>属性来源 ：{{ getSourceStr(record.expands?.source) }}</div>
              </template>
              <template v-if='activeKey === "functions"'>
                <div class='text'>是否异步 ：{{ record.async ? '是' : '否' }}</div>
              </template>
              <template v-if='activeKey === "events"'>
                <div class='text'>事件级别 ：{{ eventLevelMap[record.expands?.level] }}</div>
              </template>
            </div>
          </template>
        </VirtualScroll>
      </template>
      <j-empty v-else style='margin-top: 100px'  />
    </div>
  </div>
</template>

<style scoped lang="less">
.metadata-content {
  background-color: @font-gray-50;
  padding: 24px;

  .tabs {
    display: flex;
    border-bottom: 1px solid @font-gray-300;
    padding-bottom: 4px;
    justify-content: space-between;
    align-items: center;

    .tabs-content {
      display: flex;
      gap: 6px;
      align-items: center;

      div {
        background-color: @font-gray-200;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;

        &.active {
          background-color: #E7F1FF;
          color: @primary-color;
        }
      }
    }
  }

  .wrap {
    height: 300px;
    margin-top: 16px;

    .wrap-item {
      background-color: #FFFFFF;
      border-radius: 6px;
      border: 1px solid @font-gray-200;
      padding: 12px 16px;
      display: flex;
      gap: 24px;

      .name {
        color: @font-gray-900;
        width: 100px;
      }

      .text {
        color: @font-gray-600;
        width: 200px;
      }
    }
  }
}
</style>
