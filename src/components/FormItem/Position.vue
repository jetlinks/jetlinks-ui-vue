<script setup name="PositionList">
import { filterSelectNode } from "@/utils";
import { useI18n } from 'vue-i18n';
import { useRequest } from '@jetlinks-web/hooks'
import { queryPageNoPage } from "@/api/system/positions";

const { t: $t } = useI18n();
const emit = defineEmits(['update:value', 'change'])

const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  extraProps: {
    type: Object,
    default: () => ({})
  }
})

const { data: treeData, reload } = useRequest(queryPageNoPage, {
  defaultParams: {
    paging: false,
    sorts: [{ name: 'sortIndex', order: 'asc' }]
  },
  defaultValue: []
})

const myValue = ref()

const clickAddItem = () => {
  const tab = window.open(`${origin}/#/system/position?save=true`);
  tab.onTabSaveSuccess = (value) => {
    myValue.value = props.extraProps?.multiple ? [...myValue.value, value] : value;
    emit('update:value', myValue.value);
    reload()
  };
}

const onChange = (value, label,  extra) => {
  emit('update:value', myValue.value)
  emit('change', value, label,  extra)
}

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true })

</script>

<template>
  <div class="org-list-warp">
    <a-tree-select
      v-model:value="myValue"
      show-search
      multiple
      :placeholder="$t('components.EditUserDialog.939453-32')"
      :tree-data="treeData"
      :fieldNames="{ label: 'name', value: 'id' }"
      :filterTreeNode="(v, node) => filterSelectNode(v, node, 'name')"
      v-bind="props.extraProps"
      @change="onChange"
    >
      <template #title="{ name }">
        {{ name }}
      </template>
    </a-tree-select>
    <j-permission-button
      hasPermission="system/Positions:add"
      @click="clickAddItem"
    >
      <template #icon>
        <AIcon type="PlusOutlined" />
      </template>
    </j-permission-button>
  </div>
</template>

<style scoped lang="less">
.org-list-warp {
  width: 100%;
  display: flex;
  gap: 8px;
}
</style>
