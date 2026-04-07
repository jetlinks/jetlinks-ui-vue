<template>
  <div class="left-tree-contain">
    <a-input
      v-model:value="searchValue"
      @change="onSearch"
      :placeholder="$t('components.LeftTree.755653-0')"
      allowClear
    >
      <template #suffix>
        <AIcon type="SearchOutlined" />
      </template>
    </a-input>
    <a-row>
      <a-col flex="1">
        <j-permission-button
          type="primary"
          :hasPermission="`${permission}:add`"
          @click="openDialog()"
          style="width: 100%; margin: 12px 0"
        >
          {{ $t('components.LeftTree.755653-1') }}
        </j-permission-button>
      </a-col>
      <a-col flex="50px">
        <j-permission-button
          type="link"
          style="width: 100%; margin: 12px 0"
          @click="batchImportVisible = true"
        >
          <AIcon type="ImportOutlined"/>
        </j-permission-button>
      </a-col>
    </a-row>
    <div class="tree" ref="treeContainer">
      <a-spin :spinning="loading">
        <a-tree
          v-if="treeData.length > 0"
          :tree-data="treeData"
          :selected-keys="selectedKeys"
          v-model:expandedKeys="expandedKeys"
          :show-line="{showLeafIcon: false}"
          :fieldNames="{ key: 'id' }"
          :virtual="true"
          :height="treeHeight"
          @select="onSelect"
          block-node
        >
          <template #title="{ name, data }">
            <div class="department-tree-item-content">
              <div class="title">
                <j-ellipsis>
                  {{ name }}
                </j-ellipsis>
              </div>
              <a-space>
                <j-permission-button
                  :hasPermission="`${permission}:update`"
                  type="link"
                  :tooltip="{
                    title: $t('components.LeftTree.755653-2'),
                  }"
                  style="padding: 0"
                  @click="openDialog(data)"
                >
                  <AIcon type="EditOutlined" />
                </j-permission-button>
                <j-permission-button
                  :hasPermission="`${permission}:add`"
                  v-if="data.level < 8"
                  type="link"
                  :tooltip="{
                    title: $t('components.LeftTree.755653-3'),
                  }"
                  style="padding: 0"
                  @click="
                    openDialog({
                      ...data,
                      id: '',
                      parentId: data.id,
                    })
                  "
                >
                  <AIcon type="PlusCircleOutlined" />
                </j-permission-button>
                <j-permission-button
                  type="link"
                  :hasPermission="`${permission}:delete`"
                  :tooltip="{ title: $t('components.LeftTree.755653-4') }"
                  style="padding: 0"
                  danger
                  :popConfirm="{
                    title: $t('components.LeftTree.755653-5'),
                    onConfirm: () => delDepartment(data.id),
                  }"
                >
                  <AIcon type="DeleteOutlined" />
                </j-permission-button>
              </a-space>
            </div>
          </template>
        </a-tree>
        <j-empty v-else />
      </a-spin>
    </div>
    <!-- 编辑弹窗 -->
    <Save
      v-if="visible"
      :tree-data="sourceTree"
      :data="current"
      @save="onSave"
      @close="visible = false"
    />
    <BatchImport
      v-if="batchImportVisible"
      :downloadUrlBuilder="downloadImportTemplate_api"
      :request="batchImport_api"
      @close="batchImportVisible = false"
      @save="getTree"
    />
  </div>
</template>

<script setup lang="ts" name="LeftTree">
import { getTreeData_api, delDepartment_api, downloadImportTemplate_api, batchImport_api } from '@authentication-manager-ui/api/system/department'
import { onlyMessage } from '@jetlinks-web/utils'
import { debounce, cloneDeep, omit } from 'lodash-es'
import Save from './Save.vue'
import { useRoute } from 'vue-router'
import { ArrayToTree } from '../util'
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const permission = 'system/Department'
const route = useRoute();

const save = useRoute().query.save

const emits = defineEmits(['change'])
const searchValue = ref('') // 搜索内容
const loading = ref<boolean>(false) // 数据加载状态
const sourceTree = ref<any[]>([]) // 源数据
const treeMap = new Map() // 数据的map版本
const treeData = ref<any[]>([]) // 展示的数据
const selectedKeys = ref<string[]>([<string>route.query.id]) // 当前选中的项
const expandedKeys = ref<string[] | number[]>([])

// 弹窗
const visible = ref<boolean>(false)
//批量导入弹窗
const batchImportVisible = ref(false)
const current = ref<any>({})

const treeContainer = ref<HTMLElement>()
const treeHeight = ref<number>(400)

const { onBack } = useTabSaveSuccessBack()

// 计算树的高度
const calculateTreeHeight = () => {
  if (treeContainer.value) {
    const containerHeight = treeContainer.value.clientHeight
    treeHeight.value = Math.max(200, containerHeight - 10)
  }
}

// 监听窗口大小变化
const resizeObserver = new ResizeObserver(() => {
  calculateTreeHeight()
})

// 获取数据
const getTree = (cb?: Function) => {
  loading.value = true
  const params = {
    paging: false,
    sorts: [{ name: 'sortIndex', order: 'asc' }, { name: 'createTime', order: 'asc' }],
  } as any
  if (searchValue.value) {
    params.terms = [{ column: 'name$LIKE', value: `%${searchValue.value}%` }]
  }

  getTreeData_api(params)
    .then((resp: any) => {
      selectedKeys.value = selectedKeys.value.length ? selectedKeys.value : resp.result[0] ? [resp.result[0].id] : []
      sourceTree.value = resp.result
      // sourceTree.value = resp.result.sort((a: any, b: any) =>
      //   a.sortIndex === b.sortIndex
      //     ? b.createTime - a.createTime
      //     : a.sortIndex - b.sortIndex,
      // ) // 报存源数据
      handleTreeMap(resp.result) // 将树形结构转换为map结构
      treeData.value = resp.result // 第一次不用进行过滤
      selectedKeys.value = route.query.id ? [route.query.id as string] : treeData.value.map(i => i.id).slice(0, 1)
      // 根据路由query参数展开父级节点
      const targetId = route.query.id as string
      if (targetId && treeMap.has(targetId)) {
        const parentKeys = expandParentNodes(targetId)
        expandedKeys.value = [...new Set([...expandedKeys.value, ...parentKeys])]
      }

      cb && cb()
    })
    .finally(() => {
      loading.value = false
    })
}
// 搜索
const onSearch = debounce(() => {
  const key = searchValue.value
  const treeArray = new Map()
  if (key) {
    const searchTree: string[] = []
    treeMap.forEach((item) => {
      if (item.name.includes(key)) {
        searchTree.push(item.parentId)
        treeArray.set(item.id, item)
      }
    })
    dig(searchTree)
    treeData.value = ArrayToTree(cloneDeep([...treeArray.values()]))
  } else {
    getTree()
    treeData.value = ArrayToTree(cloneDeep([...treeMap.values()]))
    expandedKeys.value = []
  }
  selectedKeys.value = treeData.value.map(i => i.id).slice(0, 1)

  function dig(_data: any[]): any {
    const pIds: string[] = []
    if (!_data.length) return
    _data.forEach((item) => {
      if (treeMap.has(item)) {
        const _item = treeMap.get(item)
        pIds.push(_item.parentId)
        treeArray.set(item, _item)
      }
    })
  }
}, 500)

// 将树形数组转化为map形式，以便筛选时操作
function handleTreeMap(_data: any[]) {
  if (_data) {
    _data.map((item) => {
      treeMap.set(item.id, omit(cloneDeep(item), ['children']))
      if (item.children) {
        handleTreeMap(item.children)
      }
    })
  }
}

// 根据目标节点ID展开其所有父级节点
const expandParentNodes = (targetId: string) => {
  if (!targetId || !treeMap.has(targetId)) {
    return []
  }

  const expandKeys: string[] = []
  let currentNode = treeMap.get(targetId)

  // 向上查找所有父级节点
  while (currentNode && currentNode.parentId) {
    expandKeys.push(currentNode.parentId)
    currentNode = treeMap.get(currentNode.parentId)
  }

  return expandKeys
}
// 删除部门
const delDepartment = (id: string) => {
  delDepartment_api(id).then((resp) => {
    if (resp.success) {
      onlyMessage($t('components.LeftTree.755653-6'))
      getTree(() => {
        if(selectedKeys.value.includes(id)){
          selectedKeys.value = selectedKeys.value.filter(i => i !== id)
        }
      })
    }
  })
}

// 刷新
const onSave = async (id: string) => {
  visible.value = false
  current.value = {}

  const isTabBack = await onBack(id)
  if (!isTabBack) {
    getTree()
  }
}

const openDialog = (row: any = {}) => {
  // 计算默认排序值，为子列表中最大的排序值+1
  let sortIndex = row.sortIndex || 1
  if (!row.id) {
    let children = [] as any[]
    if (row.parentId) {
      children = row.children
    } else children = treeData.value
    const _index =
      children?.length > 0 ? children?.map((item) => item.sortIndex) : [0]
    sortIndex = Math.max(..._index) + 1
  }

  current.value = { ...row, sortIndex }
  visible.value = true
}

const onSelect = (val: string[]) => {
  if(val.length){
    selectedKeys.value = val
  }
}

watch(
  () => selectedKeys.value,
  (n) => {
    emits('change', n?.[0])
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  getTree(save ? openDialog : undefined)

  // 初始化高度计算
  nextTick(() => {
    calculateTreeHeight()
    if (treeContainer.value) {
      resizeObserver.observe(treeContainer.value)
    }
  })
})

onUnmounted(() => {
  if (treeContainer.value) {
    resizeObserver.unobserve(treeContainer.value)
  }
})
</script>

<style lang="less" scoped>
.left-tree-contain {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tree {
    flex: 1;
    min-height: 0; // 重要：确保flex子元素可以收缩
    // overflow: hidden; // 移除overflow-y，让a-tree自己处理滚动
  }
}
.department-tree-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 25px;
  gap: 12px;

  .title {
    flex: 1;
    min-width: 0;
  }
  .func-btn {
    font-size: 14px;
    //width: 80px;
  }
}

:deep(.ant-tree-treenode) {
  width: 100%;
  .ant-tree-node-content-wrapper {
    flex: 1 1 auto;
  }
}
</style>
