<template>
  <div class='search-warp' ref='searchRef'>
    <div class='search-flex'>
      <div class='search-title'>
        <slot name='titleRender'>
          <span>{{ title }}</span>
        </slot>
      </div>
      <div class='search-right'>
        <div class='search-content'>
          <div class='search-result-tag'>
            <div class='tag-all'>{{ $t('Search.Search.673421-0') }}</div>
            <div class='tag-text'>
              <j-ellipsis>
                <span v-for='item in text' class='tag-text-item'>{{ item }}</span>
              </j-ellipsis>
            </div>
            <div @click.stop='onShowParams'>
              <AIcon
                  :class="{
                  'search-result-icon': true,
                  'search-result-icon-down': showParams
                }"

                  type='DoubleRightOutlined'
              />
            </div>
          </div>
          <div class='search-input'>
            <a-input :placeholder="$t('Search.Search.673421-1')" v-model:value='searchValue' :maxlength='64' allow-clear
                     @change='onChange'>
              <template #suffix>
                <AIcon type='SearchOutlined' @click='onSearch'/>
              </template>
            </a-input>
          </div>
        </div>
      </div>
    </div>

    <div :class="{'search-params': true, 'slide-in-top': showParams, 'search-params-hidden': hiddenParams }">
      <div class='search-params-top'>
        <!--        <slot name='providerRender' :onParamsChange='onProviderRenderChange'>-->
        <ParamsOptions
            :title="$t('Search.Search.673421-2')"
            :options='providerOptions'
            :fieldNames="{
                label: 'text',
              }"
            :value="_searchParams.type"
            style='margin-bottom: 12px'
            @change='(v, r) => onParamsChange(v, r, 0)'
        />
        <!--        </slot>-->
        <ParamsOptions
            :title="$t('Search.Search.673421-3')"
            :options='classifyTypeOptions'
            :fieldNames="{
              label: 'name',
              value: 'id'
            }"
            :value="_searchParams.classification"
            @change='(v, r) => onParamsChange(v, r, 1)'
        />
      </div>
      <ClassifyOptions
          v-if='classifyOptions?.length && _searchParams.classification !== "all"'
          :options='classifyOptions'
          @change='onClassifyChange'
          :type='oldClassifyType'
          :value="_searchParams.classificationChildren"
      />
    </div>
  </div>
</template>

<script setup name='ProSearch'>
import ParamsOptions from './ParamsOptions.vue'
import ClassifyOptions from './ClassifyOptions.vue'
import {useRequest} from '@jetlinks-web/hooks'
import {ResourceApi} from '@device-manager-ui/api/resource/resource'
import {cloneDeep, map, omit} from 'lodash-es'
import {useI18n} from 'vue-i18n'
import {useRouteQuery} from "@vueuse/router";
import {useRoute} from "vue-router";

const {t: $t} = useI18n()
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
const route = useRoute();
const text = ref([$t('Search.Search.673421-4')])

const showParams = ref(false)
const hiddenParams = ref(true)
const searchRef = ref()
const searchValue = ref()
const _searchParams = reactive({
  type: '',
  classification: '',
  classificationChildren: []
})
const valueMap = new Map()
const search = useRouteQuery('q')
const _paramsObj = reactive({
  type: undefined,
  name: '',
  classification: undefined,
  classificationChildren: []
})

let oldClassifyType = 'all'

const searchParams = []

const handleTreeMap = (arr, parentName) => {
  const _name = parentName ? parentName + '/' : ''
  arr.filter(i => i?.id).map((item) => {
    if (!valueMap.get(item.id)) {
      valueMap.set(item.id, {
        ...omit(cloneDeep(item), ['children']),
        fullname: _name + item.name
      })
    }
    if (item.children) {
      handleTreeMap(item.children, _name + item.name)
    }
  })
}

const {data: providerOptions} = useRequest(ResourceApi.queryProvider, {defaultValue: []})
const {data: classifyOptions, run: runClassify} = useRequest(ResourceApi.queryClassify, {
  immediate: false,
  defaultValue: [],
  onSuccess(res) {
    if (res.success) {
      handleTreeMap(res.result, '')
    }
  }
})
const {data: classifyTypeOptions} = useRequest(ResourceApi.queryClassifyType, {
  defaultValue: [],
  defaultParams: {paging: false, sorts: [{name: 'order', order: 'asc'}]},
  onSuccess(resp) {
    if (resp.success) {
      resp.result.forEach(item => {
        if (!valueMap.get(item.id)) {
          valueMap.set(item.id, {
            ...item,
            fullname: item.name
          })
        }
      })
    }
  }
})

/**
 * 提交
 */
const searchSubmit = () => {
  const obj = {};
  Object.keys(_paramsObj).forEach(key => {
    if (key === 'classificationChildren') {
      if (_paramsObj[key]?.length) {
        obj[key] = _paramsObj[key]
      }
    } else if (_paramsObj[key]) {
      obj[key] = _paramsObj[key]
    }
  })
  const len = Object.keys(obj).length;
  search.value = len ? encodeURI(JSON.stringify(obj)) : undefined
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
  _paramsObj.name = searchValue.value
  searchSubmit()
}

// const onProviderRenderChange = (params, v, r, index = 0) => {
//   console.log(params, v, r)
//   // searchParams[index] = params
//   // paramsArray[index] = r
//   // handleData()
//   // searchSubmit()
// }

const onParamsChange = (value, record, index) => {
  const isType = index === 0
  const isValueAll = value === 'all'
  if (index === 1) {
    _paramsObj.classificationChildren = []
    classifyOptions.value = []
  }
  if (isValueAll) {
    _paramsObj[!isType ? 'classification' : 'type'] = undefined
  } else {
    _paramsObj[!isType ? 'classification' : 'type'] = {value, name: record.text || record.name}
  }
  searchSubmit()
}

const onClassifyChange = (keys) => {
  const array = keys.length ? keys : [oldClassifyType]
  const arr = array.map(i => {
    return {
      name: valueMap.get(i)?.fullname,
      value: i
    }
  })

  if (keys.length) {
    _paramsObj.classificationChildren = arr
  } else {
    _paramsObj.classificationChildren = []
  }

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

const onChange = () => {
  if (!searchValue.value) {
    onSearch()
  }
}

// 处理名称搜索
const handleNameSearch = (_name) => {
  if (_name) {
    searchParams[2] = {
      terms: [
        {
          column: 'name',
          value: `%${_name}%`,
          termType: 'like'
        },
        {
          column: 'id',
          value: `%${_name}%`,
          termType: 'like',
          type: 'or'
        }
      ],
      type: 'and'
    }
  } else {
    searchParams.splice(2, 1)
  }
}

const handleTypeSearch = (record) => {
  const isValueAll = record.value === 'all'
  if (isValueAll) {
    searchParams[0] = undefined
  } else {
    searchParams[0] = {
      column: 'type',
      value: record.value
    }
  }
}

const handleClassifyChildrenSearch = (keys) => {
  const array = map(keys, 'value')
  const _value = [
    {
      column: 'key$resources-classification-child',
      termType: 'in',
      value: array
    }
  ]
  searchParams[1] = {
    column: 'id$resource-bind',
    value: _value
  }
}
// 处理分类
const handleClassifySearch = (record, children) => {
  const isValueAll = record.value === 'all'
  if (isValueAll) {
    classifyOptions.value = []
    searchParams[1] = undefined
  } else {
    oldClassifyType = record.value
    if (children?.length) {
      handleClassifyChildrenSearch(children)
    } else {
      searchParams[1] = {
        column: 'id$resource-bind',
        value: [{
          column: 'key$resources-classification',
          value: [
            {
              'column': 'classificationTypeId',
              'value': record.value
            }
          ]
        }]
      }
      if (searchParams.filter(item => item).length > 1) {
        searchParams[0].type = 'or'
      }
    }
    runClassify({
      paging: false,
      sorts: [
        {name: 'sortIndex', order: 'asc'}
      ],
      terms: [{column: 'classificationTypeId', value: record.value}]
    })
  }
}
// 处理数据回显
const handleSearchData = (_params) => {
  console.log(_params, '_params')
  const arr = []
  // 处理name
  handleNameSearch(_params.name)
  // 处理类型
  if (_params.type?.name) {
    arr.push(_params.type.name)
  }
  handleTypeSearch(_params.type?.name ? _params.type : {value: 'all'})
  // 处理分类
  if (_params.classification?.name) {
    if (_params.classificationChildren?.length) {
      arr.push(...map(_params.classificationChildren, 'name'))
    } else {
      arr.push(_params.classification.name)
    }
  }
  handleClassifySearch(_params.classification || {value: 'all'}, _params.classificationChildren)
  text.value = arr.length ? arr : [$t('Search.Search.673421-4')]

  const nameParams = searchParams[2];
  const __params = searchParams.filter((item, index) => item && index !== 2)
  const newParams = {
    terms: [
      {
        terms: nameParams ? [{terms: __params}, nameParams] : __params,
        type: 'and'
      }
    ]
  }

  emit('update:value', newParams)
  emit('search', newParams)
}

watch(
    () => route.query?.q,
    (val) => {
      searchParams.length = 0
      if (val) {
        const _params = JSON.parse(decodeURI(val) || '{}')
        handleSearchData(_params)
        _searchParams.type = _params.type?.value || 'all';
        _searchParams.classification = _params.classification?.value || 'all';
        _searchParams.classificationChildren = map(_params.classificationChildren || [], 'value')
        searchValue.value = _params.name;

        if(!_paramsObj.name && !_paramsObj.classification && !_paramsObj.classificationChildren?.length && !_paramsObj.type){
          _paramsObj.name = _params.name;
          _paramsObj.classification = _params.classification;
          _paramsObj.classificationChildren = _params.classificationChildren || [];
          _paramsObj.type = _params.type;
        }
      } else {
        text.value = [$t('Search.Search.673421-4')]
        emit('update:value', {})
        emit('search', {})
      }
    },
    {
      immediate: true,
      deep: true
    }
)


onMounted(() => {
  document.addEventListener('click', domClick)
})

onUnmounted(() => {
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
    gap: 16px;

    .search-right {
      flex: 1;
      min-width: 0;
      display: flex;
      gap: 16px;
      justify-content: flex-end;
    }
  }
}

.search-params {
  position: absolute;
  top: 20px;
  background-color: #fff;
  width: 100%;
  transition: all 0.5s;
  opacity: 0;
  z-index: 9;
  border-radius: 6px;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.16);

  .search-params-top {
    background-color: #F8F9FA;
    padding: 16px;
  }

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

  :deep(.ant-input-affix-wrapper) {
    border-radius: 24px;
  }
}

.search-content {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: flex-end;

  .search-result-tag {
    display: flex;;
    gap: 8px;
    flex: 1;
    min-width: 0;
    justify-content: flex-end;

    .tag-all {
      color: #646C73;
      white-space: nowrap;
    }

    .tag-text {
      color: #1F2429;

      .tag-text-item {
        &:not(:last-child)::after {
          content: '；';
        }
      }
    }
  }
}

</style>
