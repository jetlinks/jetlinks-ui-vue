<script setup name="OrgList">
import {filterSelectNode} from "@/utils";
import {useI18n} from 'vue-i18n';
import {useRequest} from '@jetlinks-web/hooks'
import {getDepartmentList_api} from "@/api/system/user";

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
  disabledData: {
    type: Array,
    default: []
  }
})

const handleData = (arr) => {
  return arr.map(i => {
    if(i.children?.length){
      i.children = handleData(i.children)
    }
    if(props.disabledData?.includes(i.id)){
      i.disabled = true
    }
    return i
  })
}

const {data: treeData, reload} = useRequest(getDepartmentList_api, {
  defaultParams: {
    paging: false,
    sorts: [{name: 'sortIndex', order: 'asc'}]
  },
  defaultValue: [],
  onSuccess: (resp) => {
    return handleData(resp.result)
  }
})

const myValue = ref()

const clickAddItem = () => {
  const tab = window.open(`${origin}/#/system/Department?save=true`);
  tab.onTabSaveSuccess = (value) => {
    if (props.extraProps?.multiple) {
      let oldValue = myValue.value || []
      myValue.value = [...oldValue, value]
    } else {
      myValue.value = value
    }
    emit('update:value', myValue.value);
    reload()
  };
}

const onChange = (value, label, extra) => {
  emit('update:value', myValue.value)
  emit('change', value, label, extra)
}

watch(() => props.value, () => {
  myValue.value = props.value
}, {immediate: true})

</script>

<template>
  <div class="org-list-warp">
    <div style="flex: 1; min-width: 0">
      <a-tree-select
          :treeDefaultExpandedKeys="props?.value || []"
          v-model:value="myValue"
          show-search
          multiple
          :placeholder="$t('components.EditUserDialog.939453-15')"
          :tree-data="treeData"
          :fieldNames="{ label: 'name', value: 'id' }"
          :filterTreeNode="(v, node) => filterSelectNode(v, node, 'name')"
          v-bind="props.extraProps"
          @change="onChange"
      >
        <template #title="{ name }">
          <div style="width: calc(100% - 10px) ">
            <j-ellipsis>{{ name }}</j-ellipsis>
          </div>
        </template>
        <template #tagRender="{value, label, closable, onClose }">
          <div :class="{ 'ant-select-selection-item': true, 'tag-blue': disabledData.includes(value) }">
            <div class="ant-select-selection-item-content">
              {{ label }}
            </div>
            <div v-if="!disabledData.includes(value)" @click.stop="onClose" class="ant-select-selection-item-remove">
              <AIcon type="CloseOutlined" />
            </div>
          </div>
        </template>
      </a-tree-select>
    </div>
    <j-permission-button
        hasPermission="system/Department:add"
        @click="clickAddItem('orgIdList', 'Department')"
        v-if="!props.extraProps?.disabled"
    >
      <template #icon>
        <AIcon type="PlusOutlined"/>
      </template>
    </j-permission-button>
  </div>
</template>

<style scoped lang="less">
.org-list-warp {
  width: 100%;
  display: flex;
  gap: 8px;

  .tag-blue {
    background: #e6f7ff;
    border-color: #91d5ff;
    color: #096dd9;
  }
}
</style>
