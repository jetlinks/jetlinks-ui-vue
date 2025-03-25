<script setup name="PositionList">
import {filterSelectNode} from "@/utils";
import {useI18n} from 'vue-i18n';
import {useRequest} from '@jetlinks-web/hooks'
import {queryPageNoPage} from "@/api/system/positions";
import {map} from "lodash-es";

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
  }
})

const {data: treeData, run} = useRequest(queryPageNoPage, {
  defaultParams: {
    paging: false,
    sorts: [{name: 'sortIndex', order: 'asc'}]
  },
  defaultValue: []
})

const myValue = ref()

const _treeData = computed(() => {
  const _data = map(treeData?.value || [], 'id')
  const _arr = props.extraData.filter(i => {
    return !_data.includes(i.id)
  }).map(item => {
    return {
      ...item,
      disabled: true
    }
  })
  return [...treeData?.value || [], ..._arr]
})

const clickAddItem = () => {
  const tab = window.open(`${origin}/#/system/positions?save=true`);
  tab.onTabSaveSuccess = (value) => {
    if (props.extraProps?.multiple) {
      let oldValue = myValue.value || []
      myValue.value = [...oldValue, value]
    } else {
      myValue.value = value
    }
    emit('update:value', myValue.value);
    run()
  };
}

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
  run()
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
          v-bind="props.extraProps"
          @change="onChange"
      >
        <template #title="record">
          <a-tooltip :title="$t('components.EditUserDialog.939453-34')"  v-if="_extraData.includes(record.id)">
            <span class="j-ellipsis j-ellipsis-line-clamp" style="-webkit-line-clamp: 1;">{{ record.name }}</span>
          </a-tooltip>
          <j-ellipsis v-else>{{ record.name }}</j-ellipsis>
        </template>
      </a-tree-select>
    </div>
    <j-permission-button
        hasPermission="system/Positions:add"
        @click="clickAddItem"
        v-if="!props.extraProps?.disabled"
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
}
</style>
