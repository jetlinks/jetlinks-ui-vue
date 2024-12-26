<template>
  <div class="search-warp" ref="searchRef">
    <div class="search-flex">
      <div class="search-title">
        <slot name="titleRender">
          <span>{{ title }}</span>
        </slot>
      </div>
      <div class="search-right">
        <div class="search-content">
          <div class="search-result-tag" >
            <span>已选：</span>
            <span>{{ text }}</span>
            <span @click.stop="onShowParams">
              <AIcon
                :class="{
                  'search-result-icon': true,
                  'search-result-icon-down': showParams
                }"

                type="DoubleRightOutlined"
              />
            </span>
          </div>
          <div class="search-input">
            <a-input placeholder="请输入关键词" v-model:value="searchValue" :maxlength="64" >
              <template #suffix>
                <AIcon type="SearchOutlined" @click="onSearch"/>
              </template>
            </a-input>
          </div>
        </div>
      </div>
    </div>

    <div :class="{'search-params': true, 'slide-in-top': showParams, 'search-params-hidden': hiddenParams }">
      <slot name="providerRender" :onParamsChange="onProviderRenderChange">
        <ParamsOptions
          title="类型"
          :options="providerOptions"
          :fieldNames="{
            label: 'text',
          }"
          style="margin-bottom: 12px"
          @change="(v, r) => onParamsChange(v, r, 0)"
        />
      </slot>
      <ParamsOptions
        title="分类"
        :options="classifyTypeOptions"
        :fieldNames="{
          label: 'name',
          value: 'id'
        }"
        @change="(v, r) => onParamsChange(v, r, 1)"
      />
      <ClassifyOptions
        v-if="classifyOptions?.length"
        :options="classifyOptions"
        @change="onClassifyChange"
      />
    </div>
  </div>
</template>

<script setup name='ProSearch'>
import ParamsOptions from './ParamsOptions.vue'
import ClassifyOptions from './ClassifyOptions.vue'
import { useRequest } from '@/hook'
import { ResourceApi } from '@/api/link/resource'

const props = defineProps({
  style: {
    type: Object,
    default: () => ({
      padding: '18px 24px'
    })
  },
  title: {
    type: String,
    default: undefined
  },
  value: {
    type: Array,
    default: undefined
  }
})

const emit = defineEmits(['update:value', 'search'])

const text = ref('全部')

const showParams = ref(false)
const hiddenParams = ref(true)
const searchRef = ref()
const searchValue = ref()

let oldClassifyType = 'all'

const searchParams = []

const { data: providerOptions } = useRequest(ResourceApi.queryProvider, { defaultValue: [] })
const { data: classifyOptions, run: runClassify } = useRequest(ResourceApi.queryClassify, { immediate: false, defaultValue: [] })
const { data: classifyTypeOptions } = useRequest(ResourceApi.queryClassifyType, { defaultValue: [], defaultParams: { paging: false } })

const paramsArray = []

/**
 * 提交
 */
const searchSubmit = () => {
  const nameParams = searchParams[2]
  const _params = searchParams.filter((item, index) => item && index !== 2)
  const newParams = {
    terms: nameParams ? [ { terms: _params}, nameParams ]: _params
  }

  emit('update:value', newParams)
  emit('search', newParams)
}

const onShowParams = () => {

  const oldValue = showParams.value

  if (oldValue) { // 隐藏
    setTimeout(() => {
      hiddenParams.value = true
    }, 500)
  } else {
    hiddenParams.value = false
  }

  setTimeout(() => {
    showParams.value = !oldValue
  }, 100)
}

const onSearch = () => {
  searchParams[2] = {
    column: "name",
    value: `%${searchValue.value}%`,
    termType: 'like',
    type: 'and'
  }
  searchSubmit()
}

const onProviderRenderChange = (params, index = 0) => {
  searchParams[index] = params
  searchSubmit()
}

const onParamsChange = (value, record, index) => {
  paramsArray[index] = record

  const array = paramsArray.filter(item => item.value !== 'all').map(item => item.label)
  const isType = index === 0
  const isValueAll = value === 'all'

  text.value = array.length ? array.join(';') : '全部'

  if (isValueAll) {
    searchParams[index] = undefined
  } else {
    searchParams[index] = {
      column: isType ? 'type' : 'id$resource-bind',
      value: isType ? value : [{
        column: "key$resources-classification-child",
        value
      }]
    }

    if (!isType && searchParams.filter(item => item).length > 1) {
      searchParams[index].type = 'or'
    }
  }

  if (!isType) {
    oldClassifyType = value
    if (isValueAll) {
      classifyOptions.value = []
    } else {
      runClassify({
        sorts: [
          { name: 'sortIndex', order: 'asc' },
        ],
        terms: [{ column: 'classificationTypeId', value }]
      })
    }
  }

  searchSubmit()
}

const onClassifyChange = (keys) => {
  const array = keys.length ? keys : [oldClassifyType]

  searchParams[1].value = array.map(value => ({
    column: "key$resources-classification-child",
    value
  }))

  searchSubmit()
}

const domClick = (e) => {
  if (!searchRef.value || !searchRef.value.contains(e.target)) {
    setTimeout(() => {
      hiddenParams.value = true
    }, 500)

    setTimeout(() => {
      showParams.value = false
    }, 100)
  }
}

onMounted(() =>{
  document.addEventListener('click', domClick)
})

onUnmounted(() =>{
  document.removeEventListener('click', domClick)
})

</script>

<style scoped lang='less'>

  .search-warp {
    width: 100%;
    position: relative;

    .search-flex {
      display: flex;
      justify-content: space-between;
      z-index: 2;
      position: relative;
      background-color: #fff;
    }
  }

  .search-params {
    position: absolute;
    top: 20px;
    background-color: #fff;
    width: 100%;
    padding: 12px 6px;
    transition: all 0.5s;
    opacity: 0;
    z-index: 1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .1);

    &.slide-in-top {
      opacity: 1;
      top: 33px;
    }

    &.search-params-hidden {
      display: none;
    }
  }

  .search-result-icon {
    transform: rotate(90deg);
    transition: all .3s;

    &.search-result-icon-down {
      transform: rotate(-90deg);
    }
  }

  .search-input {
    width: 260px;
  }

  .search-content {
    display: flex;
    align-items: center;
    gap: 8px;

  }

</style>
