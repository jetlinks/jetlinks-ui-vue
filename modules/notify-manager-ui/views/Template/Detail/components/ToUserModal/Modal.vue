<template>
  <a-modal :width="700" title="选择收信人" @ok="onSave" open @cancel="emit('close')">
    <div>收信人： {{ selectedUser.name || selectedUser.id || '--' }}</div>
    <div style="display: grid; gap: 24px; grid-template-columns: 1fr 1fr;height: 400px; margin-top: 16px">
      <div>
        <a-input-search
            v-model:value="treeSearchText"
            placeholder="请输入部门名称"
            style="margin-bottom: 16px"
            @search="onTreeSearch"
        />
        <a-tree
            v-if="filteredTreeData.length > 0"
            v-model:selectedKeys="selectedKeys"
            v-model:expanded-keys="expandedKeys"
            :tree-data="filteredTreeData"
            default-expand-all
            :fieldNames="{children:'children', title:'name', key:'id' }"
            @select="onSelect"
        />
        <div style="margin-top: 100px" v-else>
          <j-empty/>
        </div>
      </div>
      <div style="height: 100%; display: flex; flex-direction: column">
        <a-input-search
            v-model:value="userSearchText"
            placeholder="请输入用户名称"
            style="margin-bottom: 16px"
            @search="onUserSearch"
        />
        <div style="flex: 1; min-height: 40px" v-if="filteredUserList.length">
          <VirtualScroll :data="filteredUserList" :itemHeight="40">
            <template #renderItem="i">
              <div style="display: flex; align-items: center;">
                <a-radio :value="i.id" :checked="_value === i.id" @change="(e) => onChange(e, i)"/>
                <div style="flex: 1; min-width: 0">
                  <j-ellipsis>{{ i.name }}</j-ellipsis>
                </div>
              </div>
            </template>
          </VirtualScroll>
        </div>
        <div style="margin-top: 100px" v-else>
          <j-empty/>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import templateApi from "@notify-manager-ui/api/template";
import {onlyMessage} from "@jetlinks-web/utils";

const {t: $t} = useI18n();

const emit = defineEmits();

const props = defineProps({
  configId: {
    type: String,
    default: undefined,
  },
  value: {
    type: String,
    default: undefined,
  },
  name: {
    type: String,
    default: undefined,
  },
});

const treeData = ref([])
const userList = ref([])
const selectedKeys = ref([])
const expandedKeys = ref([])
const _value = ref()
const treeSearchText = ref('')
const userSearchText = ref('')
const filteredTreeData = ref([])
const filteredUserList = ref([])
const selectedUser = ref({})

const queryUserData = async (toParty) => {
  if (!props.configId) return;
  const resp = await templateApi.getWeixinUser(props.configId, toParty)
  if (resp?.success) {
    userList.value = resp?.result
    // 初始化过滤后的用户列表
    onUserSearch()
  }
};

const onSelect = (dt) => {
  selectedKeys.value = dt
  if (selectedKeys.value.length > 0) {
    queryUserData(selectedKeys.value[0])
  }
}

const queryData = async () => {
  if (!props.configId) return;
  const resp = await templateApi.getWeixinDept(props.configId)
  if (resp.success) {
    treeData.value = resp.result
    // 初始化过滤后的树数据
    onTreeSearch()
    const arr = treeData.value.length > 0 ? [treeData.value[0].id] : []
    selectedKeys.value = arr
    expandedKeys.value = arr
    if (selectedKeys.value.length > 0) {
      await queryUserData(selectedKeys.value[0])
    }
  }
};

const onChange = (e, i) => {
  _value.value = e.target.value
  selectedUser.value = i
}

// 递归过滤树数据
const filterTreeData = (data, searchText) => {
  if (!searchText) return data

  const filtered = []
  for (const item of data) {
    const match = item.name.includes(searchText)
    const children = item.children ? filterTreeData(item.children, searchText) : []

    if (match || children.length > 0) {
      filtered.push({
        ...item,
        children: children.length > 0 ? children : item.children
      })
    }
  }
  return filtered
}

// 树搜索处理
const onTreeSearch = () => {
  filteredTreeData.value = filterTreeData(treeData.value, treeSearchText.value)
  // 展开所有匹配的节点
  if (treeSearchText.value) {
    const expandAll = (data) => {
      const keys = []
      data.forEach(item => {
        keys.push(item.id)
        if (item.children) {
          keys.push(...expandAll(item.children))
        }
      })
      return keys
    }
    expandedKeys.value = expandAll(filteredTreeData.value)
  }
}

// 用户列表搜索处理
const onUserSearch = () => {
  if (!userSearchText.value) {
    filteredUserList.value = userList.value
  } else {
    filteredUserList.value = userList.value.filter(user =>
        user.name.includes(userSearchText.value)
    )
  }
}

const onSave = () => {
  if (!selectedUser.value.id) {
    onlyMessage('请选择收信人', 'error')
    return
  } else {
    emit('save', selectedUser.value)
  }
}

watch(() => [props.value, props.name], () => {
  _value.value = props.value
  selectedUser.value = {
    id: props.value,
    name: props.name
  }
}, {
  immediate: true
})

watch(
    () => props.configId,
    () => {
      queryData();
    },
    {
      immediate: true
    }
);
</script>

<style lang="less" scoped>

</style>
