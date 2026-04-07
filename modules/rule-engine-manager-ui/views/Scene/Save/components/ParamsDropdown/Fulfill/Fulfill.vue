<script setup name="Fulfill">
import {useI18n} from "vue-i18n";
import { queryAggregation, queryArrayTerms, queryBuiltInParams } from '@rule-engine-manager-ui/api/scene'
import {useRequest} from "@jetlinks-web/hooks";
import WhenItem from './When.vue'
import {useAggContext, useColumnContext, useFulfillDataContext} from "./hooks";
import {
  defaultTermsValue
} from "./util";
import { useSceneStore } from '@rule-engine-manager-ui/store/scene'
import {detail, productDetail} from "@rule-engine-manager-ui/api/instance";
import {cloneDeep, isArray, isNil} from "lodash-es";
import TermItem from './Terms.vue'
import {randomNumber} from "@jetlinks-web/utils";
import {handleParamsData} from "@rule-engine-manager-ui/views/Scene/Save/components/Terms/util";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  column: {
    type: String
  },
  property: {
    type: String,
    default: undefined
  },
  branchParams: {
    type: Object
  },
  branchName: {
    type: Number,
    default: 0
  },
  whenName: {
    type: Number,
    default: 0
  },
  termsName: {
    type: Number,
    default: 0
  }
})
const emit = defineEmits(['select', 'update:value'])

const { t: $t} = useI18n()
const sceneStore = useSceneStore();
const dataCache = ref({
  filter: [],
  aggregation: [{
    column: undefined,
    value: { source: 'fixed', value: undefined },
    termType: undefined,
    function: undefined
  }]
})
const visible = ref(false)
const showPropertyList = ref(false)
const formRef = ref()
const formAggregationRef = ref()
const builtInOptions = ref([])

const { data: aggregationOptions } = useRequest(queryAggregation, {
  onSuccess(resp) {
    return resp.result.map(item => ({ ...item, label: item.name, value: item.id }))
  }
})

const { data: arrayTermsOptions, run } = useRequest(queryArrayTerms, {
  immediate: false,
  onSuccess(resp) {
    return resp.result.map(item => ({ ...item, label: item.name, value: item.column }))
  }
})

useAggContext(aggregationOptions)
useColumnContext(arrayTermsOptions)
useFulfillDataContext(dataCache)

const rules = [
  {
    validator: async (_, v) => {
      if (v !== undefined && !v.error) {
        if (!Object.keys(v).length) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-0')));
        }
        if (!v.column) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-1')));
        }
        if (!v.function) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-2-1')));
        }
        if (!v.termType) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-2')));
        }
        if (isNil(v.value?.value)) {
          if (v.value?.filter?.length) {
            return Promise.resolve();
          }
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-3')));
        }
        if (
          isArray(v.value.value) &&
          v.value.value.some((_v) => _v === undefined)
        ) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-3')));
        }
      } else {
        if (v?.error) { // 数据发生变化
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-0')))
        }
        return Promise.reject(new Error($t('Terms.TermsItem.9093428-1')));
      }
      return Promise.resolve();
    },
  }
]
const onSelect = async () => {
  const result = await Promise.all([formRef.value.validateFields(), formAggregationRef.value && formAggregationRef.value.validateFields()])
  if((formAggregationRef.value && !result[1]) || !result[0]) {
    return
  }
  let obj = cloneDeep(dataCache.value)
  const oldValue = dataCache.value?.aggregation?.[0]?.value.value
  if (oldValue === null || oldValue === undefined) {
    obj.aggregation = [];
  }
  emit('update:value', obj)
  emit('select', obj, '', '条件')
  hideVisible()
}

const showVisible = async () => {
  visible.value = true
  if (sceneStore.data.trigger.type === 'device') {
    const propertyId = props.column.split('.')[1]
    const columnId = props.column.split('.')?.[props.column.split('.').length - 3]
    let resp
    if (sceneStore.data.trigger.device.selectorValues.length === 1 ) {
      resp = await detail(sceneStore.data.trigger.device.selectorValues[0].value)
    } else {
      resp = await productDetail(sceneStore.data.trigger.device.productId)
    }

    if (resp.result.metadata) {
      const _metadata = JSON.parse(resp.result.metadata)
      const property = _metadata.properties?.find(item => item.id === propertyId)
      if(propertyId !== columnId ) {
        run(property.valueType?.properties.find(item => item.id === columnId))
      } else {
        run(property)
      }
    }
  }

  queryBuiltInParams(toRaw(sceneStore.data), props.branchParams).then(resp => {
    if (resp.success) {
      builtInOptions.value = handleParamsData(resp.result, 'id')
    }
  })

  // if (dataCache.value.filter?.length === 0) {
  //   dataCache.value.filter = [
  //     {
  //       type: 'and',
  //       terms: [
  //         defaultTermsValue()
  //       ],
  //       key: randomNumber()
  //     }
  //   ]
  // }
}

const onAdd = () =>{
  dataCache.value.filter.push({
    type: 'and',
    terms: [
      defaultTermsValue()
    ],
    key: randomNumber()
  })
}

const onDelete = (index) => {
  dataCache.value.filter.splice(index, 1)
}

const onSwitch = (e) => {
  if (!e) {
    dataCache.value.aggregation = [{
      column: undefined,
      value: { source: 'fixed', value: undefined },
      termType: undefined,
      function: undefined
    }]
  }
}

const hideVisible = () => {
  visible.value = false
  //  清空数据
  dataCache.value.filter = []
  onSwitch()
}

const tips = computed(() => {
  return !isNil(props.value.aggregation?.[0]?.value.value) || props.value.filter?.length ? $t('Save.utils.021456-40') : $t('ParamsDropdown.FulFill-3147419-3')
})

watch(() => [JSON.stringify(props.value), visible.value], () => {
  if (visible.value) {
    const obj = props.value || {}
    if (Object.keys(obj).length) {
      Object.assign(dataCache.value, Object.keys(obj).length ? cloneDeep(obj) : { filter: []})
    }
    if ((props.value !== null && props.value !== undefined) && props.value.aggregation?.length) {
      showPropertyList.value = true
    }
  }

}, { immediate: true, deep: true})
</script>

<template>
  <div class="fulfill scene-select-value">
    <div class="dropdown-button value" @click="showVisible">
      {{ tips }}
    </div>
    <a-modal
      v-model:open="visible"
      :title="$t('ParamsDropdown.FulFill-3147419-0')"
      width="800px"
      :okText="$t('Save.index.551009-0')"
      :keyboard="false"
      :maskClosable="false"
      @ok="onSelect"
      @cancel="hideVisible"
    >
      <a-form
        ref="formRef"
        :model="dataCache.filter"
        v-if="visible"
      >
        <span v-if="!dataCache.filter.length" class='when-add' @click='onAdd' :style='{ padding: isFirst ? "16px 0" : 0 }'>
          <a-button type="link">
            <AIcon type='PlusCircleOutlined' style='padding: 4px' />
            {{ $t('Terms.Branches.9093534-4') }}
          </a-button>
        </span>
        <div style="display: flex; padding-top: 10px;overflow: auto">
          <WhenItem
            v-for="(item, index) in dataCache.filter"
            :key="item.key"
            :termsName="index"
            :data="item"
            :whenIndex="index"
            :isFirst="index === 0"
            :isLast="index === dataCache.filter.length - 1"
            @add="onAdd"
            @delete="() => onDelete(index)"
          />
        </div>
      </a-form>
      <div class="array-property">
        <div class="tips">
          <div class="left">
            <div class="icon">
              <AIcon type="FunctionOutlined"/>
            </div>
            <div>
              <div style="font-size: 16px">{{$t('ParamsDropdown.FulFill-3147419-1')}}</div>
              <div>{{$t('ParamsDropdown.FulFill-3147419-2')}}</div>
            </div>
          </div>
          <div class="right">
            <a-switch v-model:checked="showPropertyList" @change="onSwitch" />
          </div>
        </div>
        <div v-if="showPropertyList" class="array-property-list">
          <a-form
            ref="formAggregationRef"
            :model="dataCache.aggregation">
            <a-form-item
              :name="[0]"
              :rules="rules"
            >
              <TermItem
                v-if="visible"
                :options="arrayTermsOptions"
                :isLast="false"
                :showDeleteBtn="false"
                :showAggregationOption="true"
                :builtInOptions="builtInOptions"
                :whenIndex="0"
                :branchName="branchName"
                :whenName="whenName"
                :termsName="termsName"
                :index="0"
                v-model:value="dataCache.aggregation[0]"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
@import '../../DropdownButton/index.less';

.array-property {
  .tips {
    padding: 16px;
    border-radius: 6px;
    background-color: @font-gray-200;
    margin: 12px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;

      .icon {
        font-size: 20px;
        margin-right: 8px;
      }
    }
  }
}

.array-property-list {
  display: flex;
  gap: 12px;
}
</style>
