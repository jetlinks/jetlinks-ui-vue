<template>
  <div class="permission-selector">
    <!-- 初始化权限选择 -->
    <div v-if="!showDetailSelection" class="permission-init">
      <p class="init-description">{{ $t('PersonalToken.PermissionSelector.061384-10') }}</p>

      <div class="init-options">
        <div
            v-for="option in initOptions"
            :key="option.key"
            class="init-option"
            :class="{ active: selectedInitType === option.key }"
            @click="selectInitType(option.key)"
        >
          <div class="option-icon">
            <AIcon :type="option.icon"/>
          </div>
          <div class="option-header">{{ option.title }}</div>
          <div class="option-desc">{{ option.description }}</div>
        </div>
      </div>
    </div>
    <PermissionList
        v-else
        v-model:value="selectedPermissions"
        :disabled="disabled"
        :selected-init-type="selectedInitType"
        @close="showDetailSelection = false"
    />
  </div>
</template>

<script setup>
import PermissionList from "./PermissionList.vue";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value'])

const showDetailSelection = ref(false)
const selectedInitType = ref('')
const expandedMenus = ref([])
const selectedPermissions = ref([])
const menuData = ref([])

const initOptions = [
  {
    key: 'custom',
    title: $t('PersonalToken.PermissionSelector.061384-11'),
    description: $t('PersonalToken.PermissionSelector.061384-12'),
    icon: 'WindowsOutlined'
  },
  {
    key: 'readonly',
    title: $t('PersonalToken.PermissionSelector.061384-13'),
    description: $t('PersonalToken.PermissionSelector.061384-14'),
    icon: 'MailOutlined'
  },
  {
    key: 'readwrite',
    title: $t('PersonalToken.PermissionSelector.061384-15'),
    description: $t('PersonalToken.PermissionSelector.061384-16'),
    icon: 'ReconciliationOutlined'
  },
  {
    key: 'fullaccess',
    title: $t('PersonalToken.PermissionSelector.061384-17'),
    description: $t('PersonalToken.PermissionSelector.061384-17'),
    icon: 'SolutionOutlined'
  }
]

// 模拟菜单权限数据
const mockMenus = []

const selectInitType = (type) => {
  selectedInitType.value = type
  goToDetailSelection()
}

const goToDetailSelection = () => {
  // 根据初始化类型设置默认权限
  initializePermissions(selectedInitType.value)
  showDetailSelection.value = true

  // 展开所有菜单
  const menus = menuData.value.length ? menuData.value : mockMenus
  expandedMenus.value = menus.map(menu => menu.id)
}

const initializePermissions = (type) => {
  selectedPermissions.value = []
  const menus = menuData.value.length ? menuData.value : mockMenus

  switch (type) {
    case 'custom':
      // 自定义：不预选任何权限
      break
    case 'readonly':
      // 只读：选择所有查看权限
      selectedPermissions.value = menus.flatMap(menu =>
          menu.actions.filter(action => action.name === '查看')
      )
      break
    case 'readwrite':
      // 读写：选择查看、编辑、启用/禁用、导入权限
      const readwriteActions = ['查看', '编辑', '启动', '停止', '导入', '导出', '配置']
      selectedPermissions.value = menus.flatMap(menu =>
          menu.actions.filter(action => readwriteActions.includes(action.name))
      )
      break
    case 'fullaccess':
      // 全量：选择所有权限（除了个人中心的查看和保存）
      selectedPermissions.value = menus.flatMap(menu => menu.actions)
      break
  }

  emit('update:value', selectedPermissions.value)
}

const loadMenuPermissions = async () => {
  // try {
  //   const response = await getMenuPermissions()
  //   if (response.status === 200 && response.result) {
  //     menuData.value = response.result || []
  //   }
  // } catch (error) {
  //   console.error('获取菜单权限失败:', error)
  //   // 使用模拟数据作为后备
  // }
}

// 初始化时从 props 设置权限


watch(() => selectedPermissions.value, (newValue) => {
  emit('update:value', newValue)
})

onMounted(() => {
  loadMenuPermissions()
  if (props.value && props.value.length > 0) {
    selectedPermissions.value = [...props.value]
    if (!showDetailSelection.value) {
      showDetailSelection.value = true
      const menus = menuData.value.length ? menuData.value : mockMenus
      expandedMenus.value = menus.map(menu => menu.id)
    }
  }
})
</script>

<style lang="less" scoped>
.permission-selector {

  .permission-init {
    padding: 0 16px;
    .init-description {
      color: #a6a6a6;
    }
    .init-options {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;

      .init-option {
        background-color: #f0f0f0;
        border-radius: 6px;
        padding: 16px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: #f6f9ff;
        }

        .option-icon {
          font-size: 28px;
          color: #a6a6a6;
        }

        .option-header {
          margin: 6px 0;
        }

        .option-desc {
          color: #a6a6a6;
          font-size: 12px;
        }
      }
    }

    .init-actions {
      text-align: right;
    }
  }

  .permission-detail {
    .detail-header {
      margin-bottom: 16px;

      .detail-controls {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;

        .search-input {
          width: 200px;
        }

        .selection-info {
          font-size: 13px;
          color: #666;
        }
      }
    }

    .permission-tree {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #f0f0f0;
      border-radius: 6px;

      .menu-item {
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .menu-header {
          padding: 12px 16px;
          background: #fafafa;
          cursor: pointer;

          &:hover {
            background: #f0f0f0;
          }

          .menu-title {
            display: flex;
            align-items: center;
            gap: 8px;

            .menu-name {
              font-weight: 500;
              flex: 1;
            }

            .expand-icon {
              transition: transform 0.3s;

              &.expanded {
                transform: rotate(90deg);
              }
            }
          }
        }

        .menu-actions {
          padding: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;

          .action-checkbox {
            min-width: 80px;
          }
        }
      }
    }
  }
}
</style>
