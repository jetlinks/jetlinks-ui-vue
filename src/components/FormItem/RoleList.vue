<script setup>
import {filterSelectNode} from "@/utils";
import {useI18n} from "vue-i18n";
import { useRequest } from '@jetlinks-web/hooks'
import {getRoleList} from "@/api/system/user";

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
  },
  disabled: {
    type: Boolean,
    default: false
  },
  disabledData: {
    type: Array,
    default: []
  },
  extraData: { // 为了修改没有权限，但是要展示名称的数据
    type: Array,
    default: []
  }
})
const dataMap = new Map()

const _treeData = computed(() => {
  const arr = (treeData?.value || []).map((item)=>{
    return {
      name: item.groupName,
      id: item.groupId,
      disabled: true,
      children: item.roles?.map((i)=>{
        dataMap.set(i.id, i);
        return {
          name:i.name,
          id:i.id,
          disabled: props.disabledData.includes(i.id)
        }
      }) || []
    }
  })
  const _arr = props.extraData.filter(i => {
    return !dataMap.get(i.id)
  }).map(item => {
    return {
      ...item,
      disabled: true
    }
  })
  return [...arr, ..._arr]
})

const { data: treeData, run } = useRequest(getRoleList, {
  defaultParams: {
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }]
  },
  defaultValue: []
})
const myValue = ref()
const _extraData = computed(() => {
  return props.extraData.filter(i => {
    return !dataMap.get(i.id)
  }).map(i => i.id)
})
const clickAddItem = () => {
  const tab = window.open(`${origin}/#/system/Role?save=true`);
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

const onChange = (value, label,  extra) => {
  emit('update:value', myValue.value)
  emit('change', value, label,  extra)
}

watch(() => props.value, () => {
  myValue.value = props.value
}, { immediate: true })

onMounted(() => {
  run()
})
</script>

<template>
  <div class="role-list-warp">
    <div style="flex: 1; min-width: 0">
      <a-tree-select
          :treeDefaultExpandedKeys="props?.value || []"
          v-model:value="myValue"
          multiple
          show-search
          :placeholder="$t('components.EditUserDialog.939453-13')"
          :tree-data="_treeData"
          :fieldNames="{ label: 'name', value: 'id', children:'children' }"
          :disabled="disabled"
          :filterTreeNode="(v, node) => filterSelectNode(v, node, 'name')"
          @change="onChange"
      >
        <template #title="record">
          <div style="width: calc(100% - 10px) ">
            <a-tooltip :title="$t('components.EditUserDialog.939453-34')"  v-if="_extraData.includes(record.id)">
              <span class="j-ellipsis j-ellipsis-line-clamp" style="-webkit-line-clamp: 1;">{{ record.name }}</span>
            </a-tooltip>
            <a-tooltip :title="$t('components.EditUserDialog.939453-35')"   v-else-if="disabledData.includes(record.id)">
              <span class="j-ellipsis j-ellipsis-line-clamp" style="-webkit-line-clamp: 1;">{{ record.name }}</span>
            </a-tooltip>
            <j-ellipsis v-else>{{ record.name }}</j-ellipsis>
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
      hasPermission="system/Role:add"
      @click="clickAddItem('roleIdList', 'Role')"
      v-if="!disabled"
    >
      <template #icon>
        <AIcon type="PlusOutlined" />
      </template>
    </j-permission-button>
  </div>
</template>

<style scoped lang="less">
.role-list-warp {
  width: 100%;
  display: flex;
  gap: 8px;

  .tag-blue {
    background: #e6f7ff;
    border-color: #91d5ff;
    color: #096dd9;
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
