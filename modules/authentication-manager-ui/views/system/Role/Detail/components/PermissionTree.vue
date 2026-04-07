<template>
  <div class="permission-tree-container">
    <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :rowKey="'id'"
        :scroll="{ y: '50vh' }"
        ref="treeRef"
    >
      <template #headerCell="{ column }">
        <div v-if="column.key === 'menu'">
          <a-checkbox
              :checked="selectedAll.selectedAll"
              :indeterminate="selectedAll.indeterminate"
              @change="selectAllChange">
            {{ $t('components.PermissionTree.954862-0') }}
          </a-checkbox>
        </div>
        <div v-else-if="column.key === 'action'">
          <span style="">{{ $t('components.PermissionTree.954862-6') }}</span>
          <a-checkbox
              v-model:checked="action.visible"
              style="margin-left: 10px"
              @change="action.data = []"
          >{{ $t('components.PermissionTree.954862-3') }}
          </a-checkbox>
          <a-select
              v-show="action.visible"
              v-model:value="action.data"
              style="width: 200px"
              :options="action.options"
              @change="onActionChange"
              show-search
              :placeholder="$t('components.PermissionTree.954862-4')"
              mode="multiple"
              :max-tag-count="1"
              :filter-option="filterOption"
          />
        </div>
        <div v-else-if="column.key === 'data'">
          <span style="">{{ $t('components.PermissionTree.954862-1') }}</span>
          <a-tooltip>
            <template #title>{{ $t('components.PermissionTree.954862-2') }}</template>
            <AIcon type="QuestionCircleOutlined"/>
          </a-tooltip>
          <a-checkbox
              v-model:checked="dataPermission.visible"
              @change="dataPermission.data = undefined"
              style="margin-left: 10px"
          >
            {{ $t('components.PermissionTree.954862-3') }}
          </a-checkbox>
          <a-select
              v-show="dataPermission.visible"
              v-model:value="dataPermission.data"
              style="width: 200px"
              :options="dataPermission.options"
              @change="bulkChange"
              :placeholder="$t('components.PermissionTree.954862-4')"
          />
        </div>
        <div v-else>
          <span>{{ column.title }}</span>
        </div>
      </template>
      <!-- 表格内容 -->
      <template #bodyCell="{ column, record }">
        <div :id="record.id"></div>
        <div v-if="column.key === 'menu'">
          <MenuCheckbox
              :data="flatTableData[record.id]"
              @change="(e) => menuChange(flatTableData[record.id], e)"
          />
        </div>
        <div v-else-if="column.key === 'action'">
          <div v-if="flatTableData[record.id].buttons && flatTableData[record.id].buttons.length > 0">
            <a-checkbox
                v-for="button in flatTableData[record.id].buttons"
                v-model:checked="button.granted"
                :disabled='flatTableData[record.id].code === USER_CENTER_MENU_CODE && button.id === "view"'
                :key="button.id"
                @change="actionChange(record.id, true)"
            >{{ button.i18nName || button.name }}
            </a-checkbox>
          </div>
        </div>
        <div v-else-if="column.key === 'data'">
          <span v-if="flatTableData[record.id].accessSupport === undefined">
              {{ $t('components.PermissionTree.954862-5') }}
          </span>
          <div v-else-if="flatTableData[record.id].accessSupport.value === 'support'">
            <a-radio-group
                v-model:value="flatTableData[record.id].selectAccesses"
                @change="resetBulk"
            >
              <a-radio
                  :value="asset.supportId"
                  v-for="asset in flatTableData[record.id]?.assetAccesses || []"
                  :key="asset.name"
              >{{ asset.i18nName || asset.name }}
              </a-radio>
            </a-radio-group>
          </div>
          <span
              v-else-if="
                  record.accessSupport.value === 'indirect' ||
                  record.accessSupport.value === 'unsupported'
              "
          >{{ record.accessDescription }}</span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script setup name="RolePermissionTree">
import {USER_CENTER_MENU_CODE} from '@jetlinks-web-core/utils/consts'
import {useI18n} from 'vue-i18n';
import MenuCheckbox from './MenuCheckbox.vue'
import {isNoCommunity} from '@jetlinks-web-core/utils/utils'
import {getPermissionTree_api} from "@authentication-manager-ui/api/system/role";
import {paramsEncodeQuery} from "@jetlinks-web-core/utils";
import {NotificationSubscriptionCode} from "@jetlinks-web-core/router/menu";
import {cloneDeep, omit, uniqBy} from "lodash-es";
import {isIotPlatform} from "@jetlinks-web-core/hooks";

const {t: $t} = useI18n();
const emits = defineEmits(['update:selectItems']);
const route = useRoute();
const treeRef = ref();
const tableData = ref([]);
const flatTableData = reactive({});
const action = reactive({
  visible: false,
  options: [],
  data: []
});
const isIot = isIotPlatform()

const dataPermission = reactive({
  visible: false,
  options: [],
  data: undefined
})

const columns = computed(() => {
  const arr = [
    {
      title: $t('components.PermissionTree.954862-0'),
      dataIndex: 'menu',
      key: 'menu',
      width: '25%',
    },
    {
      title: $t('components.PermissionTree.954862-6'),
      dataIndex: 'action',
      key: 'action',
      width: '35%',
    },
  ];
  if (isNoCommunity && isIot) {
    arr.push({
      title: '数据权限',
      dataIndex: 'data',
      key: 'data',
      width: '40%',
    })
  }
  return arr
})

const selectedAll = computed(() => {
  const arr = Object.values(flatTableData)
  const selectList = arr.filter((item) => item._granted); // 第一列选中的项
  // 判断是全选/半全选
  if (selectList.length === arr.length) {
    return {
      selectedAll: true,
      indeterminate: false
    }
  } else if (selectList.length > 0) {
    return {
      selectedAll: false,
      indeterminate: true
    }
  }
  return {
    selectedAll: false,
    indeterminate: false
  }
})
const selectAllChange = (e) => {
  const checked = e.target.checked
  Object.keys(flatTableData).forEach(key => {
    const item = flatTableData[key];
    const flag = item.code === USER_CENTER_MENU_CODE
    // 改变菜单
    if (flag) {
      item._granted = checked;
      item.indeterminate = !checked;
      item.granted = true  // 个人中心始终有权限
    } else {
      item._granted = checked;
      item.indeterminate = false;
      item.granted = checked
    }
    // 改变按钮
    item.buttons?.forEach((button) => {
      if (!(flag && button?.id === 'view')) {
        button.granted = checked;
      }
    });
    if (checked) {
      // 全选
      item.selectAccesses = item.selectAccesses || 'creator';
    } else {
      // 取消全选
      item.selectAccesses = undefined;
    }
  });
}

const bulkChange = () => {
  if (!dataPermission.visible) return;
  Object.keys(flatTableData).forEach(key => {
    const item = flatTableData[key];
    if ((item.granted || item._granted) && item.accessSupport && item.accessSupport.value === 'support') {
      item.selectAccesses = dataPermission.data;
    }
  });
  // 批量修改数据权限后，重新计算所有节点状态
  Object.keys(flatTableData).forEach(key => {
    getGrantedData(key);
  });
}

const onActionChange = () => {
  if (!action.visible) return;
  Object.keys(flatTableData).forEach(key => {
    const item = flatTableData[key];
    if (item.buttons && item.buttons.length > 0) {
      item.buttons?.forEach((i) => {
        i.granted = action.data.includes(i.id)
      });
      // 重新计算节点状态并更新祖先节点
      getGrantedData(key)
      if (item.parentId) {
        updateAllAncestors(item.parentId)
      }
    }
  });
}

const resetBulk = () => {
  action.data = [];
  action.visible = false;
  dataPermission.data = undefined;
  dataPermission.visible = false;
}

const getGrantedData = (id) => {
  const row = flatTableData[id]
  if (!row) return

  // children
  const arr = row?.children || []

  // 按钮状态
  const _buttons = row.buttons || []
  const fullyGrantedButtons = _buttons.filter(i => i.granted)

  // 分离子节点状态：完全选中、半选、未选中
  // 确保子节点存在于 flatTableData 中，避免未定义错误
  const fullyGrantedChildren = arr.filter(i => flatTableData[i.id] && flatTableData[i.id]._granted && !flatTableData[i.id].indeterminate)
  const indeterminateChildren = arr.filter(i => flatTableData[i.id] && flatTableData[i.id].indeterminate)
  const notGrantedChildren = arr.filter(i => !flatTableData[i.id] || (!flatTableData[i.id]._granted && !flatTableData[i.id].indeterminate))

  // 逻辑：只有当所有子节点都完全选中（无半选）且所有按钮都选中时，父节点才是全选
  const allChildrenFullyGranted = arr.length === 0 || (indeterminateChildren.length === 0 && notGrantedChildren.length === 0)
  const allButtonsGranted = _buttons.length === 0 || fullyGrantedButtons.length === _buttons.length
  const hasButtons = _buttons.length > 0
  const hasChildren = arr.length > 0

  if (!hasButtons && !hasChildren) {
    // 既没有子节点也没有按钮的节点，自己管自己
    // 保持原有的 granted 状态作为界面显示状态
    if (row.granted) {
      flatTableData[id]._granted = true
      flatTableData[id].indeterminate = false
    } else {
      flatTableData[id]._granted = false
      flatTableData[id].indeterminate = false
    }
  } else if (allChildrenFullyGranted && allButtonsGranted) {
    // 所有子节点和按钮都完全选中
    flatTableData[id]._granted = true
    flatTableData[id].indeterminate = false
  } else {
    // 部分选中或半选状态（子节点有选中的，或者按钮有选中的）
    const hasAnySelection = fullyGrantedChildren.length > 0 || indeterminateChildren.length > 0 || fullyGrantedButtons.length > 0
    flatTableData[id]._granted = false
    flatTableData[id].indeterminate = hasAnySelection
  }

  // 更新后端的 granted 字段：只要界面显示为选中状态（即使是半选），granted 就为 true
  if (flatTableData[id]._granted || flatTableData[id].indeterminate) {
    flatTableData[id].granted = true
  } else {
    flatTableData[id].granted = false
  }
}

const updateParent = (id) => {
  if (id) {
    getGrantedData(id)
    // 递归更新所有祖先节点，确保多级父节点的状态都能正确更新
    if (flatTableData[id].parentId) {
      updateParent(flatTableData[id].parentId)
    }
  }
}

// 新增方法：递归更新所有祖先节点，确保多级父节点的状态都能正确更新
const updateAllAncestors = (id) => {
  if (id && flatTableData[id]) {
    getGrantedData(id)
    if (flatTableData[id].parentId && flatTableData[flatTableData[id].parentId]) {
      updateAllAncestors(flatTableData[id].parentId)
    }
  }
}

// 更新一个数据需要考虑该条数据的父、子，buttons, selectAccesses
const updateRowData = (row, checked) => {
  row._granted = checked;
  row.indeterminate = false;
  // 根据界面显示状态更新后端 granted 字段
  row.granted = checked

  // 修改buttons
  if (row.buttons && row.buttons.length > 0) {
    row.buttons.forEach((button) => {
      button.granted = checked
    })
  }
  // 修改数据权限
  if (row.assetAccesses && row.assetAccesses.length > 0) {
    row.selectAccesses = checked ? (row.selectAccesses || 'creator') : undefined
  }
  // 修改children的值
  // 注意：对于既没有 buttons 也没有 children 的子节点，它们是"自己管自己"的，不应该被父节点影响
  if (row.children && row.children.length > 0) {
    row.children.forEach((child) => {
      const childRow = flatTableData[child.id];
      if (childRow) {
        const hasButtons = childRow.buttons && childRow.buttons.length > 0;
        const hasChildren = childRow.children && childRow.children.length > 0;
        // 只有当子节点有 buttons 或有 children 时，才递归更新它
        if (hasButtons || hasChildren) {
          updateRowData(childRow, checked)
        }
      }
    })
  }
  // 递归更新所有祖先节点
  if (row.parentId) {
    updateAllAncestors(row.parentId)
  }
}

const menuChange = (row, checked) => {
  // 关闭批量操作
  resetBulk()
  updateRowData(row, checked)
}

/**
 * 修改按钮的权限
 */
const actionChange = (id, flag) => {
  // 关闭批量操作
  if (flag) {
    resetBulk()
  }

  // 重新计算当前节点状态
  getGrantedData(id)

  // 使用新的方法递归更新所有祖先节点，确保多级父节点的状态都能正确更新
  const row = flatTableData[id]
  if (row.parentId) {
    updateAllAncestors(row.parentId)
  }
}

const handleData = (_dt = []) => {
  return _dt.filter(i => (i.code !== NotificationSubscriptionCode)).map((item) => {
    // 确保 granted 字段存在
    if (item.granted === undefined) {
      item.granted = false
    }

    // 默认选中个人中心相关设置
    if (item.code === USER_CENTER_MENU_CODE) {
      item.buttons = item.buttons.map(buttonItem => {
        if (buttonItem.id === 'view') {
          buttonItem.granted = true
        }
        return buttonItem
      })
    }

    // 数据权限处理
    if (item.accessSupport && item.accessSupport.value === 'support') {
      const select = item.assetAccesses?.find((assetItem) => assetItem.granted) || {};
      item.selectAccesses = select.supportId || undefined;
    }

    // 先将当前节点加入 flatTableData
    flatTableData[item.id] = item;

    // 按钮数据组件内部自己处理
    if (item.children && item.children.length > 0) {
      item.children = handleData(item.children)
    }

    // 对于既没有 buttons 也没有 children 的节点，直接根据 granted 设置显示状态
    if ((!item.buttons || item.buttons.length === 0) && (!item.children || item.children.length === 0)) {
      item._granted = item.granted
      item.indeterminate = false
    } else {
      // 对于有子节点或有按钮的节点，计算状态
      getGrantedData(item.id)
    }

    return item
  });
}

function sortAndDeduplicate(arr) {
  // 统计每个id的出现次数
  const countMap = arr.reduce((acc, cur) => {
    acc[cur.id] = (acc[cur.id] || 0) + 1;
    return acc;
  }, {});

  // 根据id出现次数降序排序，次数相同则保持原顺序（稳定排序）
  const sorted = [...arr].sort((a, b) => {
    return countMap[b.id] - countMap[a.id];
  });

  // 去重，保留每个id的第一个出现项
  const seen = new Set();
  return sorted.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

const getAllPermission = async () => {
  const id = route.params.id;
  if (!id) return;
  // 查询权限树
  const resp = await getPermissionTree_api(id, paramsEncodeQuery({
    terms: [
      {
        value: "%show\":false%",
        termType: "nlike",
        column: "options"
      }
    ]
  }))
  if (resp.success) {
    const _result = resp.result
    let assets = [];
    let _buttons = []
    tableData.value = handleData(_result)
    // 根据所有权限, 取assetAccesses并集数据
    const arr = Object.values(flatTableData)

    arr?.forEach((item) => {
      if (isNoCommunity) {
        assets = [...assets, ...item.assetAccesses];
      }
      _buttons = [..._buttons, ...(item.buttons || [])];
    });
    // 下拉框中显示的数据为所有操作按钮名称（去重显示），按照出现频次从大到小排列
    action.options = sortAndDeduplicate(_buttons).map((m) => ({
      label: `${(m.i18nName || m.name)}(${m.id})`,
      value: m.id,
    }));
    dataPermission.options = uniqBy(assets, 'supportId')?.map((m) => ({
      label: m.i18nName || m.name,
      value: m.supportId,
    }));
  }
}

const filterOption = (input, option) => {
  return option.label.indexOf(input) >= 0;
};

const onSave = () => {
  const arr = Object.values(flatTableData);
  // 深克隆表格数据的扁平版  因为会做一些改动 该改动只用于反馈给父组件，本组件无需变化
  // 只要是选中状态（无论是全选还是半选）都要保存
  const selected = cloneDeep(arr).filter(item => item._granted || item.indeterminate);
  selected.forEach((item) => {
    if (item.accessSupport && item.accessSupport.value === 'support' && item.selectAccesses) {
      item.assetAccesses?.forEach((asset) => {
        if (asset.supportId === item.selectAccesses) {
          asset.granted = true;
        } else {
          asset.granted = false;
        }
      });
      delete item.selectAccesses;
    }
    delete item.indeterminate;
    delete item.children;
    // granted 字段已经在 getGrantedData 函数中正确设置，这里不需要强制设置
  });
  return selected
}

onMounted(() => {
  getAllPermission();
});

defineExpose({onSave})
</script>

<style lang="less" scoped>
.permission-tree-container {
  :deep(.ant-checkbox-wrapper) {
    margin-left: 0;
  }
}
</style>
