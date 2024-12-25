<script setup name="Metadata">
import { getMetadataColumns,DataTypeList, EventLevel, sourceType,arrayToObj } from './utils'
import { EditTable} from '@/components/Metadata/Table'

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

onMounted(() => {
  nextTick(() => {
    visible.value = true
  })
})

</script>

<template>
  <a-tabs>
    <a-tab-pane key="properties" tab="属性定义">
      <EditTable
        v-if="visible"
        :dataSource="metadata.properties"
        :columns="getMetadataColumns('properties')"
      >
        <template #valueType='{ record }'>
          {{ dataTypeTableMap[record.valueType.type] }}
        </template>
        <template #expands='{ record }'>
          {{ getSourceStr(record.expands.type)}}
        </template>
        <template #other="{ record }">
          查看
        </template>
      </EditTable>
    </a-tab-pane>
    <a-tab-pane key="functions" tab="功能定义">
      <EditTable
        :dataSource="metadata.functions"
        :columns="getMetadataColumns('functions')"
      >
        <template #async='{ record }'>
          {{ record.async ? '是' : '否' }}
        </template>
        <template #inputs='{ record }'>
          查看
        </template>
        <template #output='{ record }'>
          查看
        </template>
        <template #other='{ record }'>
          查看
        </template>
      </EditTable>
    </a-tab-pane>
    <a-tab-pane key="events" tab="事件定义">
      <EditTable
        :dataSource="metadata.events"
        :columns="getMetadataColumns('events')"
      >
        <template #expands='{ record }'>
          {{ eventLevelMap[record.expands.level] }}
        </template>
        <template #valueType="{ record }">
          查看
        </template>
        <template #other="{ record }">
          查看
        </template>
      </EditTable>
    </a-tab-pane>
    <a-tab-pane key="tags" tab="标签定义">
      <EditTable
        :dataSource="metadata.tags"
        :columns="getMetadataColumns('tags')"
      >
        <template #valueType='{ record }'>
          {{ dataTypeTableMap[record.valueType.type] }}
        </template>
        <template #other="{ record }">
          查看
        </template>
      </EditTable>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped lang="less">

</style>
