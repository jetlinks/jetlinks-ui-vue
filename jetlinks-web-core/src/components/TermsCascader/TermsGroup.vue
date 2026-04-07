<script setup lang="ts" name="TermsCascaderGroup">
import TermsGroupItem from './TermsGroupItem.vue'
import { ValueProps } from './Value/utils'
import { randomString } from '@jetlinks-web/utils'
import { typeOptions } from './utils'
import DropdownMenu from './DropdownMenu.vue'
import { omit } from 'lodash-es'

interface TermItem {
  column?: string
  type: string
  termType?: string
  value?: {
    source: string
    value: any
  }
  options?: any[]
  terms?: TermItem[]
  key: string
  error?: boolean
}

const emit = defineEmits(['change', 'update:value'])
const props = defineProps({
  value: {
    type: Array as PropType<TermItem[]>,
    default: () => []
  },
  minItems: {
    type: Number,
    default: 1
  },
  ...ValueProps()
})

const termsList = ref<TermItem[]>([])

// 生成唯一 key
const generateKey = () => {
  return `params_${randomString()}`
}

// 创建默认条件项
const createDefaultTerm = (): TermItem => ({
  type: 'and',
  terms: [
    {
      column: undefined,
      type: 'and',
      termType: undefined,
      value: props.showValueType ? {
        source: 'fixed',
        value: undefined
      } : undefined,
      key: randomString()
    }
  ],
  key: generateKey()
})

// 添加条件项
const handleAdd = () => {
  termsList.value.push(createDefaultTerm())
  emitChange()
}

// 删除条件项
const handleDelete = (index: number) => {
  if (termsList.value.length > props.minItems) {
    termsList.value.splice(index, 1)
    emitChange()
  }
}

// 条件项变更
const handleTermChange = (index: number, newValue: any) => {
  termsList.value[index] = {
    ...termsList.value[index],
    ...newValue
  }
  emitChange()
}

// 触发变更事件
const emitChange = () => {
  emit('update:value', termsList.value)
  emit('change', termsList.value)
}

// 判断是否可删除
const canDelete = computed(() => termsList.value.length > props.minItems)

// 初始化
watch(() => props.value, (newValue) => {
  if (newValue && newValue.length > 0) {
    termsList.value = newValue.map(item => ({
      ...item,
      key: item.key || generateKey()
    }))
  } else {
    termsList.value = [createDefaultTerm()]
  }
}, { immediate: true, deep: true })
</script>

<template>
  <div class="terms-group-container">
    <div class="term-item-box terms-scroll-area">
      <template v-for="(item, index) in termsList" :key="item.key">
        <!-- 连接符 -->
        <span v-if="index > 0" class="connect-text">
          <DropdownMenu :options="typeOptions" v-model:value="item.type" />
        </span>

        <!-- 条件项 -->
        <div
          class="term-item"
          :class="{ 'can-delete': canDelete }"
        >
          <TermsGroupItem
            v-model:value="item.terms"
            v-bind="omit(props, ['value', 'minItems'])"
            @change="emitChange"
          />

          <!-- 删除按钮 -->
          <div
            v-if="canDelete"
            class="term-delete-btn"
            @click.stop="handleDelete(index)"
          >
            <AIcon type="CloseOutlined" />
          </div>
        </div>
      </template>

      <!-- 添加按钮 -->
      <div class="term-add-btn" @click="handleAdd" />
    </div>
  </div>
</template>

<style scoped lang="less">
@import './style/group.less';
</style>
