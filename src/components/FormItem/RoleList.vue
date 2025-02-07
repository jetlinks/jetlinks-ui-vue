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
  }
})

const { data: treeData, reload } = useRequest(getRoleList, {
  defaultParams: {
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }]
  },
  defaultValue: [],
  onSuccess(resp) {
    return resp.result.map((item)=>{
      return {
        name: item.groupName,
        id: item.groupId,
        disabled: true,
        children: item.roles?.map((i)=>{
          return {
            name:i.name,
            id:i.id
          }
        }) || []
      }
    })
  }
})
const myValue = ref()

const clickAddItem = () => {
  const tab = window.open(`${origin}/#/system/Role?save=true`);
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
  <div class="role-list-warp">
    <a-tree-select
      v-model:value="myValue"
      multiple
      show-search
      :placeholder="$t('components.EditUserDialog.939453-13')"
      :tree-data="treeData"
      :fieldNames="{ label: 'name', value: 'id', children:'children' }"
      :disabled="disabled"
      :filterTreeNode="(v, node) => filterSelectNode(v, node, 'name')"
      @change="onChange"
    >
      <template #title="{ name }">
        <div style="width: calc(100% - 10px) ">
          <j-ellipsis>{{ name }}</j-ellipsis>
        </div>
      </template>
    </a-tree-select>
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
}
</style>
