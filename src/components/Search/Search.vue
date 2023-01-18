<template>
  <div class='JSearch-warp' ref='searchRef'>
    <!--  高级模式  -->
    <div v-if='props.type === "advanced"' :class='["JSearch-content senior", expand ? "senior-expand" : "", screenSize ? "big" : "small"]'>
      <div :class='["JSearch-items", expand ? "items-expand" : "", layout]'>
        <div class='left'>
          <SearchItem :expand='expand' :index='1' :columns='searchItems' @change='(v) => itemValueChange(v, 1)' :termsItem='terms'/>
          <SearchItem v-if='expand' :expand='expand' :index='2' :columns='searchItems' @change='(v) => itemValueChange(v, 2)' :termsItem='terms'/>
          <SearchItem v-if='expand' :expand='expand' :index='3' :columns='searchItems' @change='(v) => itemValueChange(v, 3)' :termsItem='terms'/>
        </div>
        <div class='center' v-if='expand'>
          <a-select
            v-model:value='termType'
            class='center-select'
            :options='typeOptions'
          />
        </div>
        <div class='right' v-if='expand'>
          <SearchItem :expand='expand' :index='4' :columns='searchItems' @change='(v) => itemValueChange(v, 4)' :termsItem='terms'/>
          <SearchItem :expand='expand' :index='5' :columns='searchItems' @change='(v) => itemValueChange(v, 5)' :termsItem='terms'/>
          <SearchItem :expand='expand' :index='6' :columns='searchItems' @change='(v) => itemValueChange(v, 6)' :termsItem='terms'/>
        </div>
      </div>
      <div :class='["JSearch-footer", expand ? "expand" : ""]'>
        <div class='JSearch-footer--btns'>
          <History :target='target' @click='searchSubmit' @itemClick='historyItemClick' />
          <SaveHistory :terms='terms' :target='target'/>
          <a-button @click='reset'>
            <template #icon><RedoOutlined /></template>
            重置
          </a-button>
        </div>
        <a-button type='link' class='more-btn' @click='expandChange'>
          更多筛选
          <DownOutlined :class='["more-icon",expand ? "more-up" : "more-down"]' />
        </a-button>
      </div>
    </div>
    <!--  简单模式  -->
    <div v-else class='JSearch-content simple big'>
      <div class='JSearch-items'>
        <div class='left'>
          <SearchItem :expand='false' :index='1' :columns='searchItems' @change='(v) => itemValueChange(v, 1)' :termsItem='terms'/>
        </div>
      </div>
      <div class='JSearch-footer'>
        <div class='JSearch-footer--btns'>
          <a-button type="primary" @click='searchSubmit'>
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button @click='reset'>
            <template #icon><RedoOutlined /></template>
            重置
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template> 

<script setup lang='ts' name='Search'>
import SearchItem from './Item.vue'
import { typeOptions } from './util'
import { useElementSize, useUrlSearchParams } from '@vueuse/core'
import { cloneDeep, isFunction, isString, set } from 'lodash-es'
import { SearchOutlined, DownOutlined, RedoOutlined } from '@ant-design/icons-vue';
import { PropType } from 'vue'
import { JColumnsProps } from 'components/Table/types'
import SaveHistory from './SaveHistory.vue'
import History from './History.vue'
import type { SearchItemData, SearchProps, Terms } from './types'

type UrlParam = {
  q: string | null
  target: string | null
}

interface Emit {
  (e: 'search', data: Terms): void
}

const props = defineProps({
  columns: {
    type: Array as PropType<JColumnsProps[]>,
    default: () => [],
    required: true
  },
  type: {
    type: String,
    default: 'advanced'
  },
  target: {
    type: String,
    default: '',
    required: true
  }
})

const searchRef = ref(null)
const { width } = useElementSize(searchRef)

const urlParams = useUrlSearchParams<UrlParam>('hash')

// 是否展开更多筛选
const expand = ref(false)

// 第一组，第二组的关系
const termType = ref('and')
// 搜索历史记录
const historyList = ref([])

// 组件方向
const layout = ref('horizontal')
// 当前组件宽度 true 大于1000
const screenSize = ref(true)

const searchItems = ref<SearchProps[]>([])
// 当前查询条件
const terms = reactive<Terms>({ terms: [] })

const columnOptionMap = new Map()

const emit = defineEmits<Emit>()

const expandChange = () => {
  expand.value = !expand.value
}

const searchParams = reactive({
  data: {}
})

const handleItems = () => {
  searchItems.value = []
  columnOptionMap.clear()
  props.columns!.forEach((item, index) => {
    if (item.search && Object.keys(item.search).length) {
      columnOptionMap.set(item.dataIndex, item.search)
      searchItems.value.push({
        ...item.search,
        sortIndex: item.search.first ? 0 : index + 1,
        title: item.title,
        column: item.dataIndex,
      })
    }
  })
}

const itemValueChange = (value: SearchItemData, index: number) => {
  if (index < 4) { // 第一组数据
    set(terms.terms, [0, 'terms', index - 1], value)
  } else { // 第二组数据
    set(terms.terms, [1, 'terms', index - 4], value)
  }
}

const addUrlParams = () => {
  urlParams.q = JSON.stringify(terms)
  urlParams.target = props.target
}

/**
 * 处理termType为like，nlike的值
 * @param v
 */
const handleLikeValue = (v: string) => {
  if (isString(v)) {
    return v.split('').reduce((pre: string, next: string) => {
      let _next = next
      if (next === '\\') {
        _next = '\\\\'
      } else if (next === '%') {
        _next = '\\%'
      }
      return pre + _next
    }, '')
  }
  return v
}

/**
 * 处理为外部使用
 */
const handleParamsFormat = () => {
  // 过滤掉terms中value无效的item
  const cloneParams = cloneDeep(terms)
  return {
    terms: cloneParams.terms.map(item => {
      if (item.terms) {
        item.terms = item.terms.filter(iItem => iItem && iItem.value)
          .map(iItem => {
          // 处理handleValue和rename
          const _item = columnOptionMap.get(iItem.column)
          if (_item.rename) {
            iItem.column = _item.rename
          }

          if (_item.handleValue && isFunction(_item.handleValue)) {
            iItem.value = _item.handleValue(iItem.value)
          }

          if (['like','nlike'].includes(iItem.termType) && !!iItem.value) {
            iItem.value = `%${handleLikeValue(iItem.value)}%`
          }
          return iItem
        })
      }
      return item
    })
  }
}

/**
 * 提交
 */
const searchSubmit = () => {
  emit('search', handleParamsFormat())
  if (props.type === 'advanced') {
    addUrlParams()
  }
}

/**
 * 重置查询
 */
const reset = () => {
  terms.terms = []
  expand.value = false
  if (props.type === 'advanced') {
    urlParams.q = null
    urlParams.target = null
  }
}

watch(width, (value) => {
  if (value < 1000) {
    layout.value = 'vertical'
    screenSize.value = false
  } else {
    layout.value = 'horizontal'
    screenSize.value = true
  }
})

const historyItemClick = (content: string) => {
  try {
    terms.terms = JSON.parse(content)?.terms || []
    if (terms.terms.length === 2) {
      expand.value = true
    }
    addUrlParams()
  } catch (e) {
    console.warn(`Search组件中handleUrlParams处理JSON时异常：【${e}】`)
  }
}

/**
 * 处理URL中的查询参数
 * @param _params
 */
const handleUrlParams = (_params: UrlParam) => {
  // URL中的target和props的一致，则还原查询参数
  if (_params.target === props.target && _params.q) {
    try {
      terms.terms = JSON.parse(_params.q)?.terms || []
      if (terms.terms.length === 2) {
        expand.value = true
      }
      emit('search', handleParamsFormat())
    } catch (e) {
      console.warn(`Search组件中handleUrlParams处理JSON时异常：【${e}】`)
    }
  }
}

nextTick(() => {
  handleUrlParams(urlParams)
})

handleItems()

</script>

<style scoped lang='less'>
.JSearch-warp {
  padding: 24px;
  background-color: #fff;
  
  .JSearch-content {
    display: flex;
    gap: 12px;
  
    .JSearch-items,& .JSearch-footer {
      flex-grow: 1;
    }
  
    .JSearch-items {
      display: flex;
      gap: 16px;
  
      .left, & .right {
        display: flex;
        gap: 12px;
        flex-direction: column;
        width: 0;
        flex-grow: 1;
        min-width: 0;
      }
  
      .center {
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 80px;
      }
  
      &.vertical {
        flex-direction: column;
        .left,& .right,& .center {
          width: 100%;
        }
        .center {
          flex-direction: row;
        }
        .center-select {
          width: 120px;
        }
      }
    }
    .JSearch-footer {
      display: flex;
      gap: 64px;
      position: relative;
  
      &.expand {
        margin-top: 12px;
        width: 100%;
        justify-content: center;

        .more-btn {
          position: absolute;
          right: 0;
        }
      }
  
      .JSearch-footer--btns {
        display: flex;
        gap: 8px;

      }
    }
  
    &.senior-expand {
      display: block;
    }
  
    .more-up {
      transform: rotate(-180deg);
    }

    &.big {
      gap: 64px;
    }
  
    &.small {
      flex-direction: column;
    }

    &.simple {
      .JSearch-items {
        flex-grow: 4;
      }
      .JSearch-footer {
        flex-grow: 3;
      }
    }
  }
}

</style>