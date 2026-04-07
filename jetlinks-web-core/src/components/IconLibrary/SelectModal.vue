<template>
  <a-modal
    open
    title="选择图标"
    width="900px"
    centered
    @cancel="emits('close')"
    @ok="confirm"
  >
    <div class="icon-selector">
      <!-- 搜索和主题选择 -->
      <div class="toolbar">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索图标名称..."
          style="width: 300px"
          allow-clear
        />
        <div v-if="selected">
          <span>当前选中：</span>
          <a-tag color="blue">
            <AIcon :type="selected" />
            {{ selected }}
          </a-tag>
        </div>
      </div>

      <!-- 分类标签 -->
      <a-tabs
        v-model:active-key="activeCategory"
        class="category-tabs"
      >
        <a-tab-pane
          key="all"
          tab="全部"
        >
          <div class="icon-grid">
            <div
              v-for="icon in filteredIcons"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon)"
            >
              <AIcon :type="getIconName(icon)" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="direction"
          tab="方向"
        >
          <div class="icon-grid">
            <div
              v-for="icon in getFilteredCategory('direction')"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon)"
            >
              <AIcon :type="getIconName(icon)" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="suggestion"
          tab="提示"
        >
          <div class="icon-grid">
            <div
              v-for="icon in getFilteredCategory('suggestion')"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon)"
            >
              <AIcon :type="getIconName(icon)" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="editor"
          tab="编辑"
        >
          <div class="icon-grid">
            <div
              v-for="icon in getFilteredCategory('editor')"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon)"
            >
              <AIcon :type="getIconName(icon)" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="data"
          tab="数据"
        >
          <div class="icon-grid">
            <div
              v-for="icon in getFilteredCategory('data')"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon)"
            >
              <AIcon :type="getIconName(icon)" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="logo"
          tab="品牌"
        >
          <div class="icon-grid">
            <div
              v-for="icon in getFilteredCategory('logo')"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon)"
            >
              <AIcon :type="getIconName(icon)" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="other"
          tab="其他"
        >
          <div class="icon-grid">
            <div
              v-for="icon in getFilteredCategory('other')"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon)"
            >
              <AIcon :type="getIconName(icon)" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="iconfont"
          tab="iconfont"
        >
          <div class="icon-grid">
            <div
              v-for="icon in getFilteredCategory('iconfont')"
              :key="icon"
              :class="['icon-item', { active: selected === getIconName(icon) }]"
              @click="selectIcon(icon, 'iconfont')"
            >
              <AIcon :type="getIconName(icon, 'iconfont')" />
              <div class="icon-name">{{ icon }}</div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { categories } from './fields'
import { message } from 'ant-design-vue'

const emits = defineEmits(['save', 'close'])

const activeCategory = ref<string>('all')
const theme = ref<'Outlined' | 'Filled' | 'TwoTone'>('Outlined')
const searchText = ref<string>('')
const selected = ref<string>('')

// 获取所有图标
const allIcons = computed(() => {
  const icons: string[] = []
  Object.values(categories).forEach((category) => {
    icons.push(...category)
  })
  return [...new Set(icons)]
})

// 根据搜索和主题过滤图标
const filteredIcons = computed(() => {
  let icons = allIcons.value
  if (searchText.value) {
    icons = icons.filter((icon) => icon.toLowerCase().includes(searchText.value.toLowerCase()))
  }
  return icons
})

// 获取带主题的图标名称
const getIconName = (icon: string, type?: string) => {
  if (type === 'iconfont') {
    return icon
  }
  return `${icon}${theme.value}`
}

// 选择图标
const selectIcon = (icon: string, type?: string) => {
  console.log('icon', icon)
  const iconName = getIconName(icon, type)
  selected.value = iconName

  // 复制图标名称到剪贴板
  copyToClipboard(iconName)
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // message.success(`已复制: ${text}`)
  } catch (err) {
    // 降级方案：使用传统方法
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
    } catch (e) {
      console.error('复制失败:', e)
    }
    document.body.removeChild(textarea)
  }
}

// 获取过滤后的分类图标
const getFilteredCategory = (category: keyof typeof categories) => {
  let icons = categories[category]
  if (searchText.value) {
    icons = icons.filter((icon) => icon.toLowerCase().includes(searchText.value.toLowerCase()))
  }
  return icons
}

// 确认选择
const confirm = () => {
  if (selected.value) {
    emits('save', selected.value)
  }
}
</script>

<style lang="less" scoped>
.icon-selector {
  height: 80vh;
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .category-tabs {
    :deep(.ant-tabs-content) {
      height: 450px;
      overflow-y: auto;
    }
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 12px;
    padding: 8px 0;

    .icon-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px 8px;
      border: 2px solid #f0f0f0;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;

      .anticon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .icon-name {
        font-size: 12px;
        color: #666;
        text-align: center;
        word-break: break-word;
        line-height: 1.2;
      }

      &:hover {
        border-color: #415ed1;
        background-color: #f5f7ff;
      }

      &.active {
        color: #415ed1;
        border-color: #415ed1;
        background-color: #f5f7ff;

        .icon-name {
          color: #415ed1;
          font-weight: 500;
        }
      }
    }
  }

  .selected-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;

    .ant-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 14px;
      padding: 4px 12px;
    }
  }
}
</style>
