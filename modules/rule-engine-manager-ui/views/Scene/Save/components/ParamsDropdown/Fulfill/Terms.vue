<script setup name="FulfillTerms">
import DropdownButton from "../../../components/DropdownButton";
import {useMouseEvent, useAggOptions, useColumnOptions, useFulfillData} from "./hooks";
import {useI18n} from "vue-i18n";
import {
  defaultTermsValue
} from "./util";
import ParamsDropdown, {ArrayParamsDropdown, DoubleParamsDropdown} from "../../../components/ParamsDropdown/index";
import {isArray, isObject} from "lodash-es";
import {Form} from "ant-design-vue";
import {arrayParamsKey, doubleParamsKey} from "../../../components/Terms/util";
import {watch} from "vue";
import {getOption} from "../../../components/DropdownButton/util";
import { storeToRefs } from "pinia";
import { useSceneStore } from "@rule-engine-manager-ui/store/scene";

const props = defineProps({
  isLast: {
    type: Boolean,
    default: true,
  },
  isFirst: {
    type: Boolean,
    default: true,
  },
  value: {
    type: Object,
    default: () => ({}),
  },
  termIndex: {
    type: Number,
    default: 0
  },
  showDeleteBtn: {
    type: Boolean,
    default: true,
  },
  showAggregationOption: {
    type: Boolean,
    default: false,
  },
  showBuildIn: {
    type: Boolean,
    default: false
  },
  builtInOptions: {
    type: Array
  },
  whenIndex: {
    type: Number
  },
  index: {
    type: Number
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
    default: 9
  }
})

const _defaultValue = defaultTermsValue()
const sceneStore = useSceneStore();
const { data: formModel } = storeToRefs(sceneStore);
const emit = defineEmits(['update:value', 'add', 'delete'])
const formItemContext = Form.useInjectFormItemContext();
const {show, mouseover, mouseout} = useMouseEvent(toRefs(props).showDeleteBtn)
const { t: $t} = useI18n()
const columnOptions = useColumnOptions()
const aggregationOption = useAggOptions()
const numberOptions = ['int', 'long', 'double', 'float', 'short', 'byte']
const notNumberAggregationOption = ['LAST', 'FIRST', 'COUNT', 'DISTINCT_COUNT']
const numberTermTypeOptions = [
  { id: 'eq', name: $t('Terms.ParamsItem.9093430-11') },
  { id: 'neq', name: $t('Terms.ParamsItem.9093430-12') },
  { id: 'notnull', name: $t('Terms.ParamsItem.9093430-13') },
  { id: 'isnull', name: $t('Terms.ParamsItem.9093430-14') },
  { id: 'gt', name: $t('Terms.ParamsItem.9093430-15') },
  { id: 'gte', name: $t('Terms.ParamsItem.9093430-16') },
  { id: 'lt', name: $t('Terms.ParamsItem.9093430-17') },
  { id: 'lte', name: $t('Terms.ParamsItem.9093430-18') },
  { id: 'btw', name: $t('Terms.ParamsItem.9093430-19') },
  { id: 'nbtw', name: $t('Terms.ParamsItem.9093430-20') },
  { id: 'in', name: $t('Terms.ParamsItem.9093430-21') },
  { id: 'nin', name: $t('Terms.ParamsItem.9093430-22') },
]

const aggregationOptionFilter = computed(() => {
  return aggregationOption.value.filter(item => {
    const columnOption = columnOptions.value?.find(i => i.column === paramsValue.column)
    if(!numberOptions.includes(columnOption?.dataType)) {
      return notNumberAggregationOption.includes(item.id)
    } else {
      return true
    }
  })
})
const fulFillData = useFulfillData()
const columnType = ref();
const termTypeOptions = ref([])
const valueOptions = ref([])
const tabsOptions = computed(() => {
  let arr = [{ label: $t('Terms.ParamsItem.9093430-7'), key: "fixed", component: ['COUNT', 'DISTINCT_COUNT'].includes(paramsValue.function) ? 'int' : columnOptions.value?.find(i => i.column === paramsValue.column)?.dataType }]
  if (props.showBuildIn) {
    arr = arr.filter(item => item.key !== 'upper')
    arr.push({
      label: $t('variableItem.BuildIn.910899-1'),
      key: 'upper',
      component: 'tree'
    })
  }
  return arr;
});

const _columnOptions = computed(() => {
  return columnOptions.value?.map(item => ({
    ...item,
    children: item.column !== 'array' ? [] : item.children
  }))
})

const paramsValue = reactive({
  column: props.value?.column,
  type: props.value?.type,
  termType: props.value?.termType,
  value: props.value?.value || _defaultValue.value,
  function: props.value.function,
  key: props.value.key || _defaultValue.key
})

const showDouble = computed(() => {
  return paramsValue.termType
    ? doubleParamsKey.includes(paramsValue.termType)
    : false;
});

const showArray = computed(() => {
  return paramsValue.termType
    ? arrayParamsKey.includes(paramsValue.termType)
    : false;
});

const filterTermTypeOptions = computed(() => {
  if(['COUNT', 'DISTINCT_COUNT'].includes(paramsValue.function)) {
    return numberTermTypeOptions
  } else {
    return termTypeOptions.value
  }
})
const handOptionByColumn = (option) => {
  if (option) {
    termTypeOptions.value = option.termTypes || [];
    columnType.value = option.dataType;

    if (option.dataType === "boolean") {
      // 处理_options为Object时
      const _options = option.options || option.others;
      if (isObject(_options)) {
        const bool = _options.bool;
        valueOptions.value = [
          { label: bool.falseText, value: String(bool.falseValue) },
          { label: bool.trueText, value: String(bool.trueValue) },
        ];
      } else {
        valueOptions.value = option.options?.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        })) || [
          { label: $t('Terms.ParamsItem.9093430-9'), value: "true" },
          { label: $t('Terms.ParamsItem.9093430-10'), value: "false" },
        ];
      }
    } else if (option.dataType === "enum") {
      valueOptions.value =
        option.options?.map((item) => ({
          ...item,
          label: item.name,
          value: item.id,
        })) || [];
    } else {
      valueOptions.value = (option.options || []).map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
      }));
    }
  } else {
    termTypeOptions.value = [];
    valueOptions.value = [];
  }
}

const typeSelect = () => {
  valueSelect()
}

const termAdd = () => {
  emit('add')
}

const columnSelect = (option) => {
  const dataType = option.dataType;
  const hasTypeChange = dataType !== tabsOptions.value[0].component;
  let termTypeChange = false;
  // 如果参数类型未发生变化，则不修改操作符以及值
  const termTypes = option.termTypes;
  paramsValue.function = undefined;
  if (
    !termTypes.some((item) => paramsValue.termType === item.id)
  ) {
    // 修改操作符
    termTypeChange = true;
    paramsValue.termType = termTypes?.length ? termTypes[0].id : "eq";
  }
  if (
    hasTypeChange ||
    !tabsOptions.value.every((a) => a.key === paramsValue.value.source)
  ) {
    // 类型发生变化
    paramsValue.termType = termTypes?.length ? termTypes[0].id : "eq";
    paramsValue.value = {
      source: tabsOptions.value[0].key,
      value: undefined,
    };
  } else if (termTypeChange) {
    const _source = paramsValue.value?.source || tabsOptions.value[0].key;
    const oldValue = isArray(paramsValue.value.value)
      ? paramsValue.value.value[0]
  : paramsValue.value.value;
    const value = arrayParamsKey.includes(paramsValue.termType)
      ? [oldValue, undefined]
      : oldValue;
    paramsValue.value = {
      source: _source,
      value: value,
    };
  }

  handOptionByColumn(option);

  valueSelect()
}

const termsTypeSelect = (e) => {
  const oldValue = isArray(paramsValue.value.value) ? paramsValue.value.value[0] : paramsValue.value.value;
  let value = arrayParamsKey.includes(e.key) ? [oldValue, undefined] : oldValue;


  const _source = paramsValue.value?.source || tabsOptions.value[0].key;
  const newValue = {
    source: _source,
    value: value,
  };
  if (["isnull", "notnull"].includes(e.key)) {
    newValue.value = 1;
    newValue.source = tabsOptions.value[0].key;
  }
  paramsValue.value = newValue;
  valueSelect()
}

const findTreeNode = (tree, id) => {
  for (let i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      return tree[i];
    } else if (tree[i].children) {
      const node = findTreeNode(tree[i].children, id);
      if (node) {
        return node;
      }
    }
  }
}
const valueSelect = (e) => {
  if(props.showAggregationOption) {
    fulFillData.value.aggregation = [{...paramsValue}]
    const arr = [];
    formModel.value.branches[props.branchName]?.when.forEach((item) => {
      item.terms.forEach((term, index) => {
        const _value = term?.value?.value?.aggregation?.[0]?.value?.value;
        if(_value && index !== props.termsName) {
          arr.push(findTreeNode(props.builtInOptions, _value)?.column)
        }
      })
    })
    formModel.value.branches[props.branchName].options = {
      columns: [...new Set([...arr, e?.column])]
    }
  } else {
    fulFillData.value.filter[props.whenIndex].terms[props.index] = {...paramsValue}
  }
  nextTick(() => {
    formItemContext.onFieldChange();
  })
}

const functionSelect = () => {
  if(!filterTermTypeOptions.value.find((item) => item.id === paramsValue.termType)) {
    paramsValue.termType = filterTermTypeOptions.value?.[0]?.id;
  }
  if(showDouble.value || showArray.value) {
    paramsValue.value.value = [undefined, undefined];
  } else {
    paramsValue.value.value = undefined;
  }
}

const onDelete = () => {
  emit('delete')
}

watch(
  () => JSON.stringify(columnOptions.value),
  () => {

    if (paramsValue.column && columnOptions.value) {
      const option = getOption(
        columnOptions.value,
        paramsValue.column,
        "column"
      );
      const copyValue = props.value;
      if (option && Object.keys(option).length) {
        handOptionByColumn(option);
        if (copyValue.error) {
          copyValue.error = false;
          emit("update:value", copyValue);
          formItemContext.onFieldChange();
        }
      } else {
        copyValue.error = true;
        emit("update:value", copyValue);
        formItemContext.onFieldChange();
      }
    }
  },
  { immediate: true }
);

watch(() => JSON.stringify(paramsValue), () => {
  if(props.showAggregationOption) {
    emit('update:value', toRaw(paramsValue))
  }
})
</script>

<template>
  <div class="terms-params-item">
    <div v-if="!isFirst" class="term-type-warp">
      <DropdownButton
        :options="[
          { label: $t('Terms.ParamsItem.9093430-0'), value: 'and' },
          { label: $t('Terms.ParamsItem.9093430-1'), value: 'or' },
        ]"
        type="type"
        v-model:value="paramsValue.type"
        @select="typeSelect"
      />
    </div>
    <div class="params-item_button" @mouseover="mouseover" @mouseout="mouseout">
      <ConfirmModal
        :title="$t('Terms.WhenItem.9093425-2')"
        :onConfirm="onDelete"
        :show="show"
        className="terms-params-delete"
      >
        <AIcon type="CloseOutlined" />
      </ConfirmModal>
      <DropdownButton
        :options="_columnOptions"
        icon="icon-zhihangdongzuoxie-1"
        type="column"
        value-name="column"
        label-name="fullName"
        :placeholder="$t('Terms.ParamsItem.9093430-2')"
        v-model:value="paramsValue.column"
        component="treeSelect"
        @select="columnSelect"
      >
        <template #title="{data}">
          <a-space>
            <span>{{data.column.split('.')[data.column.split('.').length - 1]}}</span>
            <span>({{data.name || data.fullName}})</span>
          </a-space>
        </template>
      </DropdownButton>
      <DropdownButton
        v-if="showAggregationOption"
        :options="aggregationOptionFilter"
        type="termType"
        value-name="id"
        label-name="name"
        :placeholder="$t('FulFill.Terms-4029416-0')"
        v-model:value="paramsValue.function"
        @select="functionSelect"
      />
      <DropdownButton
        :options="filterTermTypeOptions"
        type="termType"
        value-name="id"
        label-name="name"
        :placeholder="$t('FulFill.Terms-4029416-1')"
        v-model:value="paramsValue.termType"
        @select="termsTypeSelect"
      />
      <div
        v-if="!['notnull', 'isnull'].includes(paramsValue.termType)"
        style="display: flex"
      >
        <DoubleParamsDropdown
          v-if="showDouble"
          icon="icon-canshu"
          :placeholder="$t('Terms.ParamsItem.9093430-4')"
          :options="valueOptions"
          :tabsOptions="tabsOptions"
          :metricOptions="builtInOptions"
          v-model:value="paramsValue.value.value"
          v-model:source="paramsValue.value.source"
          @select="valueSelect"
        />
        <ArrayParamsDropdown
          v-else-if="showArray"
          icon="icon-canshu"
          :placeholder="$t('Terms.ParamsItem.9093430-4')"
          :options="valueOptions"
          :tabsOptions="tabsOptions"
          :metricOptions="builtInOptions"
          v-model:value="paramsValue.value.value"
          v-model:source="paramsValue.value.source"
          @select="valueSelect"
        />
        <ParamsDropdown
          v-else
          icon="icon-canshu"
          :placeholder="$t('Terms.ParamsItem.9093430-4')"
          :options="valueOptions.map(item => ({...item, id: item.value, fullName: item.label}))"
          :tabsOptions="tabsOptions"
          :metricOptions="builtInOptions"
          valueName="id"
          label-name="fullName"
          v-model:value="paramsValue.value.value"
          v-model:source="paramsValue.value.source"
          @select="valueSelect"
        />
      </div>
    </div>
    <div class="term-add" @click.stop="termAdd" v-if="isLast">
      <div class="terms-content">
        <AIcon type="PlusOutlined" style="font-size: 12px" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
