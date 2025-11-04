<script setup name="PositionList">
import {filterSelectNode} from "@/utils";
import {useI18n} from 'vue-i18n';
import {useRequest} from '@jetlinks-web/hooks'
import {queryPageNoPage} from "@/api/system/positions";
import {map} from "lodash-es";
import { useTabSaveSuccess } from '@/hooks'

const {t: $t} = useI18n();
const emit = defineEmits(['update:value', 'change'])

const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  extraProps: {
    type: Object,
    default: () => ({})
  },
  extraData: { // 为了修改没有权限，但是要展示名称的数据
    type: Array,
    default: []
  },
  disabledData: {
    type: Array,
    default: []
  },
  showAdd: {
    type: Boolean,
    default: true
  }
})

const {data: treeData, reload} = useRequest(queryPageNoPage, {
  defaultParams: {
    paging: false,
    sorts: [{name: 'createTime', order: 'desc'}]
  },
  defaultValue: [],
  immediate: false
})

const myValue = ref()
const { onOpen } = useTabSaveSuccess('system/Positions', {
  onSuccess(value) {
    if (props.extraProps?.multiple) {
      let oldValue = myValue.value || []
      myValue.value = [...oldValue, value]
    } else {
      myValue.value = value
    }
    emit('update:value', myValue.value);
    reload()
  }
})

const dataMap = ref(new Map())
const handleData = (arr) => {
  return arr.map(i => {
    dataMap.value.set(i.id, i)
    if(i.children?.length){
      i.children = handleData(i.children)
    }
    if(props.disabledData?.includes(i.id)){
      i.disabled = true
    } else {
      i.disabled = false
    }
    return i
  })
}

const _treeData = computed(() => {
  // 查询组织树
  const arr = handleData(treeData.value || [])?.map(i => ({
    ...i,
    name: `${i.orgName}/${i.name}/`
  })) || []
  const _arr = props.extraData.filter(i => {
    return !dataMap.value.get(i.id)
  }).map(item => {
    return {
      ...item,
      name: `${item.orgName}/${item.name}`,
      disabled: true
    }
  })
  return [...arr, ..._arr]
})

const _extraData = computed(() => {
  const _data = map(treeData?.value || [], 'id')
  return props.extraData.filter(i => {
    return !_data.includes(i.id)
  }).map(i => i.id)
})

const onChange = (value, label, extra) => {
  emit('update:value', myValue.value)
  emit('change', value, label, extra)
}

watch(() => props.value, () => {
  myValue.value = props.value
}, {immediate: true})

onMounted(() => {
  reload()
  dataMap.value = new Map()
})
</script>

<template>
  <div class="position-list-warp">
    <div style="flex: 1; min-width: 0">
      <a-tree-select
          :treeDefaultExpandedKeys="props?.value || []"
          v-model:value="myValue"
          show-search
          multiple
          :placeholder="$t('components.EditUserDialog.939453-32')"
          :tree-data="_treeData"
          :fieldNames="{ label: 'name', value: 'id' }"
          :filterTreeNode="(v, node) => filterSelectNode(v, node, 'name')"
          :height="233"
          v-bind="props.extraProps"
          @change="onChange"
      >
        <template #title="record">
          <a-tooltip :title="$t('components.EditUserDialog.939453-34')" v-if="_extraData.includes(record.id)">
            <span class="j-ellipsis j-ellipsis-line-clamp" style="-webkit-line-clamp: 1;">{{ record.name }}</span>
          </a-tooltip>
          <a-tooltip :title="$t('components.EditUserDialog.939453-35')"  v-else-if="disabledData.includes(record.id)">
            <span class="j-ellipsis j-ellipsis-line-clamp" style="-webkit-line-clamp: 1;">{{ record.name }}</span>
          </a-tooltip>
          <div v-else>
            <j-ellipsis>{{ record.name }}</j-ellipsis>
          </div>
        </template>
        <template #tagRender="{value, label, closable, onClose }">
          <div :class="{ 'ant-select-selection-item': true, 'tag-blue': disabledData.includes(value) }">
            <div  class="ant-select-selection-item-content" >
              {{ label }}
            </div>
            <div v-if="!disabledData.includes(value) && !_extraData.includes(value)" @click.stop="onClose" class="ant-select-selection-item-remove">
              <AIcon type="CloseOutlined" />
            </div>
          </div>
        </template>
      </a-tree-select>
    </div>
    <j-permission-button
        hasPermission="system/Department:bind-position"
        @click="onOpen({save: true})"
        v-if="!extraProps?.disabled && showAdd"
    >
      <template #icon>
        <AIcon type="PlusOutlined"/>
      </template>
    </j-permission-button>
  </div>
</template>

<style scoped lang="less">
.position-list-warp {
  width: 100%;
  display: flex;
  gap: 8px;
  .tag-blue {
    background: #e6f7ff;
    border-color: #91d5ff;
    color: #096dd9;
  }

  :deep(.ant-select-selection-overflow-item){
    & > span {
      width: 100%;
    }
  }
}
</style>
