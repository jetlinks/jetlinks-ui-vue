<template>
  <div class='JSearch-warp' ref='searchRef'>
    <!--  高级模式  -->
    <div v-if='props.type === "advanced"' :class='["JSearch-content senior", expand ? "senior-expand" : "", screenSize ? "big" : "small"]'>
      <div :class='["JSearch-items", expand ? "items-expand" : "", layout]'>
        <div class='left'>
          <SearchItem :expand='expand' :index='1' :columns='searchItems' />
          <SearchItem v-if='expand' :expand='expand' :index='2' :columns='searchItems' />
          <SearchItem v-if='expand' :expand='expand' :index='3' :columns='searchItems' />
        </div>
        <div class='center' v-if='expand'>
          <a-select
            v-model:value='termType'
            class='center-select'
            :options='typeOptions'
          />
        </div>
        <div class='right' v-if='expand'>
          <SearchItem :expand='expand' :index='4' :columns='searchItems' />
          <SearchItem :expand='expand' :index='5' :columns='searchItems' />
          <SearchItem :expand='expand' :index='6' :columns='searchItems' />
        </div>
      </div>
      <div :class='["JSearch-footer", expand ? "expand" : ""]'>
        <div class='JSearch-footer--btns'>
          <a-dropdown-button type="primary">
            搜索
            <template #overlay>
              <a-menu v-if='!!historyList.length'>
                <a-menu-item>

                </a-menu-item>
              </a-menu>
              <a-empty v-else />
            </template>
            <template #icon><SearchOutlined /></template>
          </a-dropdown-button>
          <a-button>
            <template #icon><PoweroffOutlined /></template>
            保存
          </a-button>
          <a-button>
            <template #icon><PoweroffOutlined /></template>
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
          <SearchItem :expand='false' :index='1' />
        </div>
      </div>
      <div class='JSearch-footer'>
        <div class='JSearch-footer--btns'>
          <a-button type="primary">
            <template #icon><SearchOutlined /></template>
            搜索
          </a-button>
          <a-button>
            <template #icon><PoweroffOutlined /></template>
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
import { useElementSize } from '@vueuse/core'
import { omit } from 'lodash-es'
import { SearchOutlined, DownOutlined } from '@ant-design/icons-vue';
import type { SearchItemProps } from './types'
import { PropType } from 'vue'
import { JColumnsProps } from 'components/Table/types'

const props = defineProps({
  defaultParams: {
    type: Object,
    default: () => ({})
  },
  columns: {
    type: Array as PropType<JColumnsProps[]>,
    default: () => [],
    required: true
  },
  type: {
    type: String,
    default: 'advanced'
  },
  key: {
    type: String,
    default: '',
    required: true
  }
})

const searchRef = ref(null)
const { width } = useElementSize(searchRef)

// 是否展开更多筛选
const expand = ref(false)

// 第一组，第二组的关系
const termType = ref('or')
// 搜索历史记录
const historyList = ref([])

// 组件方向
const layout = ref('horizontal')
// 当前组件宽度 true 大于1000
const screenSize = ref(true)

const searchItems = ref<SearchItemProps[]>([])

const expandChange = () => {
  expand.value = !expand.value
}

const searchParams = reactive({
  data: {}
})

const handleItems = () => {
  searchItems.value = []
  props.columns!.forEach((item, index) => {
    if (item.search && Object.keys(item.search).length) {
      searchItems.value.push({
        ...omit(item.search, ['rename']),
        sortIndex: item.search.first ? 0 : index + 1,
        title: item.title,
        column: item.dataIndex,
      })
    }
  })
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