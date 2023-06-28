<template>
  <div class="table-header">
    <div>
      <j-input-search
          placeholder="请输入名称"
          @search="handleSearch"
          allowClear
      />
    </div>
    <div>
      <PermissionButton
          type="primary"
          :hasPermission="`${permission}:update`"
          key="add"
          @click="handleAddClick"
          :disabled="hasOperate('add', type)"
          :tooltip="{
            title: hasOperate('add', type) ? '当前的存储方式不支持新增' : '新增',
          }"
      >
        <template #icon>
          <AIcon type="PlusOutlined" />
        </template>
        保存
      </PermissionButton>
    </div>
  </div>
    <j-data-table  :data-source="dataSource" :columns="columns" row-key="id" serial>
      <!-- <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'id'">
          <div style="width: 100px"><j-ellipsis>{{ record.id || '-' }}</j-ellipsis></div>
        </template>
        <template v-if="column.dataIndex === 'name'">
          <div style="width: 200px"><j-ellipsis>{{ record.name || '-' }}</j-ellipsis></div>
        </template>
        <template v-if="column.dataIndex === 'description'">
          <div style="width: 200px"><j-ellipsis>{{ record.description || '-' }}</j-ellipsis></div>
        </template>
        <template v-if="column.dataIndex === 'level'">
          {{ levelMap[record.expands?.level] || '-' }}
        </template>
        <template v-if="column.dataIndex === 'async'">
          {{ record.async ? '是' : '否' }}
        </template>

        <template v-if="column.dataIndex === 'source'">
          {{ sourceMap[record.expands?.source] }}
          <Rule v-if="record.expands?.source==='rule'" v-model:value="record.expands" />
          <Source v-else v-model:value="record.expands" />
        </template>
        <template v-if="column.dataIndex === 'type'">
          <j-tag v-for="item in (record.expands?.type || [])" :key="item">
            {{ expandsType[item] }}
          </j-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
        </template>
      </template> -->
      <template #valueType="{ data }">
        {{ data.record.valueType.type }}
      </template>
      <template #inputs="{ data }">
        {{ data.record.inputs.map(item => item.name).join(',') }}
      </template>
      <template #output="{ data }">
        {{ data.record.output.type }}
      </template>
      <template #async="{ data }">
        {{ data.record.async ? '是' : '否' }}
      </template>
    </j-data-table>
</template>

<script setup lang="ts" name="BaseMetadata">
import type {MetadataItem, MetadataType} from "@/views/device/Product/typings";
import type {PropType} from "vue";
import { useMetadata, useOperateLimits } from './hooks'
import MetadataMapping from './columns'
import { levelMap, sourceMap, expandsType } from './utils'
import Rule from '@/components/Metadata/Rule'
import { Source } from './components'

const props = defineProps({
  target: {
    type: String as PropType<'device' | 'product'>,
    default: 'product'
  },
  type: {
    type: String as PropType<MetadataType>,
    default: undefined
  },
  permission: {
    type: [String, Array] as PropType<string | string[]>,
    default: undefined
  }
})

const { data: metadata } = useMetadata(props.target, props.type)
const { hasOperate } = useOperateLimits(props.target)

const dataSource = ref<MetadataItem[]>(metadata.value)
const columns = computed(() => MetadataMapping.get(props.type!))

const handleSearch = (searchValue: string) => {
  dataSource.value = searchValue ?
      metadata.value.filter(item=> item.name!.indexOf(searchValue) > -1)
          .sort((a, b) => b?.sortsIndex - a?.sortsIndex) : metadata.value
}


const handleAddClick = () => {

}

</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
}
</style>