<template>
  <div class="terms-params-item">
    <div v-if="!isFirst" class="term-type-warp">
      <DropdownButton
        :options="[
          { label: $t('ListItem.FilterCondition.9667711-0'), value: 'and' },
          { label: $t('ListItem.FilterCondition.9667711-1'), value: 'or' },
        ]"
        type="type"
        v-model:value="paramsValue.type"
        @select="typeChange"
      />
    </div>
    <div class="params-item_button" @mouseover="mouseover" @mouseout="mouseout">
      <DropdownButton
        :options="columnOptions"
        :column-options-map="columnOptionsMap"
        icon="icon-zhihangdongzuoxie-1"
        type="column"
        value-name="id"
        label-name="fullName"
        :placeholder="$t('ListItem.FilterCondition.9667711-2')"
        v-model:value="paramsValue.column"
        component="treeSelect"
        @select="columnSelect"
      />
<!--      <DropdownButton-->
<!--        v-if="showAlarm"-->
<!--        :options="alarmOptions"-->
<!--        type="alarm"-->
<!--        :placeholder="$t('ListItem.FilterCondition.9667711-3')"-->
<!--        v-model:value="paramsValue.alarm"-->
<!--        @select="alarmSelect"-->
<!--      />-->
      <DropdownButton
        :options="showAlarmLevel ? enumParamsKey : termTypeOptions"
        type="termType"
        value-name="id"
        label-name="name"
        :placeholder="$t('ListItem.FilterCondition.9667711-4')"
        v-model:value="paramsValue.termType"
        @select="termsTypeSelect"
      />
      <template v-if="!['notnull', 'isnull'].includes(paramsValue.termType)">
        <DoubleParamsDropdown
          v-if="showDouble"
          icon="icon-canshu"
          :placeholder="$t('ListItem.FilterCondition.9667711-5')"
          value-name="id"
          label-name="name"
          :options="showAlarmSelect ? alarmOptions : showAlarmLevel ? levelOptions : valueOptions"
          :metricOptions="valueColumnOptions"
          :tabsOptions="tabsOptions"
          v-model:value="paramsValue.value.value"
          v-model:source="paramsValue.value.source"
          @select="valueSelect"
        />
        <ArrayParamsDropdown
          v-else-if="showArray"
          icon="icon-canshu"
          :placeholder="$t('Terms.ParamsItem.9093430-4')"
          :options="showAlarmSelect ? alarmOptions : showAlarmLevel ? levelOptions : valueOptions"
          :metricOptions="valueColumnOptions"
          :tabsOptions="tabsOptions"
          v-model:value="paramsValue.value.value"
          v-model:source="paramsValue.value.source"
          @select="valueSelect"
        />
        <FulfillParamsDropdown
          v-else-if="showFulfill"
          icon="icon-canshu"
          :column="paramsValue.column"
          v-model:value="paramsValue.value.value"
          @select="valueSelect"
        />
        <ParamsDropdown
          v-else
          icon="icon-canshu"
          :placeholder="$t('ListItem.FilterCondition.9667711-5')"
          value-name="id"
          :value-params-name="valueParamsKey"
          label-name="fullName"
          :options="showAlarmSelect ? alarmOptions : showAlarmLevel ? levelOptions : valueOptions"
          :metricOptions="valueColumnOptions"
          :tabsOptions="tabsOptions"
          :multiple="['in', 'nin'].includes(paramsValue.termType)"
          v-model:value="paramsValue.value.value"
          v-model:valueBackups="paramsValue.value.valueBackups"
          v-model:source="paramsValue.value.source"
          @select="valueSelect"
        />
      </template>

      <ConfirmModal
        :title="$t('ListItem.FilterCondition.9667711-6')"
        :onConfirm="onDelete"
        :show="showDelete"
        className="button-delete"
      >
        <AIcon type="CloseOutlined" />
      </ConfirmModal>
    </div>
    <div class="term-add" @click.stop="termAdd" v-if="isLast">
      <div class="terms-content">
        <AIcon type="PlusOutlined" style="font-size: 12px" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="FilterCondition">
import type { PropType } from "vue";
import type { TermsType } from "../../../typings";
import DropdownButton from "../../components/DropdownButton";
import { getOption } from "../../components/DropdownButton/util";
import ParamsDropdown, {
  DoubleParamsDropdown,
  FulfillParamsDropdown,
  ArrayParamsDropdown
} from "../../components/ParamsDropdown";
import { inject } from "vue";
import { useSceneStore } from "../../../../../store/scene";
import { storeToRefs } from "pinia";
import {
  cloneDeep,
  flattenDeep,
  isArray,
  isObject,
  omit,
  set,
} from "lodash-es";
import { Form } from "ant-design-vue";
import { treeFilter } from "../../../../../utils/comm";
import { timeTypeKeys } from "../../components/Terms/util";
import { EventEmitter } from "../../util";
import { queryAlarmList } from "../../../../../api/scene";
import { analysisFilterTerms , handleFilterTerms , useCheckFilter } from "./util";
import { useI18n } from 'vue-i18n'
import { queryLevel } from "@rule-engine-manager-ui/api/config";
import { useRequest } from "@jetlinks-web/hooks";

const { t: $t } = useI18n()
const sceneStore = useSceneStore();
const { data: formModel } = storeToRefs(sceneStore);

type Emit = {
  (e: "update:value", data: TermsType): void;
};

type TabsOption = {
  label: string;
  key: string;
  component: string;
};

const props = defineProps({
  isFirst: {
    type: Boolean,
    default: true,
  },
  isLast: {
    type: Boolean,
    default: true,
  },
  showDeleteBtn: {
    type: Boolean,
    default: true,
  },
  name: {
    type: Number,
    default: 0,
  },
  termsName: {
    type: Number,
    default: 0,
  },
  actionName: {
    type: Number,
    default: 0,
  },
  thenName: {
    type: Number,
    default: 0,
  },
  branchName: {
    type: Number,
    default: 0,
  },
  value: {
    type: Object as PropType<TermsType>,
    default: () => ({
      column: "",
      type: "and",
      termType: "eq",
      value: {
        source: "fixed",
        value: undefined,
      },
    }),
  },
});

const emit = defineEmits<Emit>();

const paramsValue = reactive<TermsType>({
  column: props.value.column,
  type: props.value.type,
  termType: props.value.termType,
  value: props.value.value,
  alarm: undefined,
});
const formItemContext = Form.useInjectFormItemContext();
const showDelete = ref(false);
const columnOptions: any = inject("filter-params"); //
const columnOptionsMap: any = inject("filter-params-map", new Map()); //
const columnType = ref<string>();
const termTypeOptions = ref<Array<{ id: string; name: string }>>([]); // 条件值
const valueOptions = ref<any[]>([]); // 默认手动输入下拉
const arrayParamsKey = [
  "nbtw",
  "btw",
  "contains_all",
  "contains_any",
  "not_contains",
];
const valueColumnOptions = ref<any[]>([]);

const showAlarmKey = ["lastAlarmTime", "firstAlarm", "alarmTime", "level"];
const showAlarmSelectKey = ["alarmConfigId", "alarmName"];
const valueParamsKey = ref('id');
const enumParamsKey = computed(() => {
  const arr = ['eq', 'neq', 'notnull', 'isnull', 'in', 'nin'];
  return termTypeOptions.value.filter((item) => {
    return arr.includes(item.id)
  })
});

const tabsOptions = ref<Array<TabsOption>>([
  { label: $t('ListItem.FilterCondition.9667711-7'), key: "fixed", component: "string" },
  { label: $t('ListItem.FilterCondition.9667711-8'), key: "upper", component: "tree" },
]);

const alarmOptions = ref([]);

const checkFilter = useCheckFilter();

const handleRangeFn = (array: Array<string| undefined>) => {
  return array.includes(paramsValue.termType) && ['int', 'float','short', 'double', 'long', 'string', 'enum'].includes(tabsOptions.value[0].component);
}

const showDouble = computed(() => {
  return paramsValue.termType
    ? arrayParamsKey.includes(paramsValue.termType) && ['int', 'float', 'short', 'double', 'long', 'date'].includes(tabsOptions.value[0].component)
    : false;
});

const showArray = computed(() => handleRangeFn(['nin', 'in']));

const showAlarm = computed(() => {
  return showAlarmKey.includes(paramsValue.column?.split(".")?.[1]);
});

const showAlarmSelect = computed(() => {
  return showAlarmSelectKey.includes(paramsValue.column?.split(".")?.[1]);
});

const showAlarmLevel = computed(() => {
  return paramsValue.column?.split(".")?.[1] === 'level';
});

const showFulfill = computed(() => {
  return paramsValue.termType === "complex_exists";
})

const {data: levelOptions, run: runQueryLevel} = useRequest(queryLevel, {
  immediate: false,
  onSuccess: (res) => {
    return res?.result?.levels?.filter((item) => {
      return item.title
    })?.map((item) => {
      return {
        id: item.level,
        name: item.title,
        fullName: item.title,
        value: item.level,
        ...item
      }
    })
  }
})

const valueChangeAfter = () => {
  checkFilter.onFieldChange();
};

const handOptionByColumn = (option: any) => {
  if (option) {
    termTypeOptions.value = option.termTypes || [];
    const _showAlarmSelect = showAlarmSelectKey.includes(
      option.column?.split(".")?.[1]
    );

    valueParamsKey.value = option.options?.parameter || 'id'

    const _type = _showAlarmSelect || showAlarmLevel.value ? "enum" : option.type;
    tabsOptions.value[0].component = _type;
    columnType.value = option.type;
    const _options = option.options;
    if (_type === "boolean") {
      // 处理_options为Object时
      if (isObject(_options)) {
        const bool = (_options as any)?.bool;
        valueOptions.value = [
          {
            label: bool.falseText,
            name: bool.falseText,
            fullName: bool.falseText,
            value: bool.falseValue,
            id: bool.falseValue,
          },
          {
            label: bool.trueText,
            name: bool.trueText,
            fullName: bool.trueText,
            value: bool.trueValue,
            id: bool.trueValue,
          },
        ];
      } else {
        valueOptions.value = _options?.map((item: any) => ({
          ...item,
          label: item.name,
          value: item.id,
        })) || [
          {
            label: $t('ListItem.FilterCondition.9667711-9'),
            fullName: $t('ListItem.FilterCondition.9667711-9'),
            name: $t('ListItem.FilterCondition.9667711-9'),
            value: "true",
            id: "true"
          },
          {
            label: $t('ListItem.FilterCondition.9667711-10'),
            fullName: $t('ListItem.FilterCondition.9667711-10'),
            name: $t('ListItem.FilterCondition.9667711-10'),
            value: "false",
            id: "false"
          },
        ];
      }
    } else if (_type === "enum") {
      valueOptions.value =
        _options?.elements?.map((item: any) => ({
          ...item,
          fullName: item.text,
          name: item.text,
          id: item.value,
        })) || [];
    } else {
      valueOptions.value =
        (isObject(_options) ? [] : _options)?.map((item: any) => ({
          ...item,
          fullName: item.name,
          label: item.name,
          value: item.id,
        })) || [];
    }

    valueColumnOptions.value = treeFilter(
      cloneDeep(columnOptions.value),
      _type,
      "type"
    );
  } else {
    // termTypeOptions.value = [];
    valueOptions.value = [];
    valueColumnOptions.value = [];
  }
  if (paramsValue.termType) {
    if (columnType.value === "date") {
      if (timeTypeKeys.includes(paramsValue.termType)) {
        if (tabsOptions.value[0].component !== "int") {
        }
        tabsOptions.value[0].component = "int";
      } else if (
        !timeTypeKeys.includes(paramsValue.termType) &&
        tabsOptions.value[0].component == "int"
      ) {
        tabsOptions.value[0].component = "date";
      }
    }
  }
};

const mouseover = () => {
  if (props.showDeleteBtn) {
    showDelete.value = true;
  }
};

const mouseout = () => {
  if (props.showDeleteBtn) {
    showDelete.value = false;
  }
};

const handleOptionsColumnsValue = (termsColumns: any[], _options: any) => {
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].options!.termsColumns = termsColumns;
  const flatten = new Set(flattenDeep(termsColumns));
  let newColumns = [...flatten.values()];
  if (_options?.otherColumns) {
    newColumns = [..._options?.otherColumns, ...newColumns];
  }
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].options!.columns = newColumns;
};

const columnSelect = (e: any) => {
  const dataType = e.type;
  const hasTypeChange = dataType === 'enum' || dataType !== tabsOptions.value[0].component;
  let termTypeChange = false;

  valueParamsKey.value = e.options?.parameter || 'id'

  if (showAlarmKey.includes(paramsValue.column?.split(".")?.[1])) {
    if (!paramsValue.alarm) {
      paramsValue.alarm = undefined;
    }
  } else {
    delete paramsValue.alarm;
    delete paramsValue.terms;
  }

  // 如果参数类型未发生变化，则不修改操作符以及值
  const termTypes = e.termTypes;
  if (
    !termTypes.some((item: { id: string }) => paramsValue.termType === item.id)
  ) {
    // 修改操作符
    termTypeChange = true;
    paramsValue.termType = termTypes?.length ? termTypes[0].id : "eq";
  }

  if (hasTypeChange) {
    paramsValue.termType = termTypes?.length ? termTypes[0].id : "eq";
    paramsValue.value = {
      source: tabsOptions.value[0].key,
      value: undefined,
      valueBackups: undefined,
    };
  } else if (termTypeChange) {
    const oldValue = isArray(paramsValue.value!.value)
      ? paramsValue.value!.value[0]
      : paramsValue.value!.value;
    const value = arrayParamsKey.includes(e.key)
      ? [oldValue, undefined]
      : oldValue;
    paramsValue.value = {
      source: paramsValue.value?.source || tabsOptions.value[0].key,
      value: value,
      valueBackups: paramsValue.value.valueBackups,
    };
  }
  const columns = e.metadata === true ? [e.column] : [];
  const _options =
    formModel.value.branches![props.branchName].then[props.thenName].actions[
      props.actionName
    ].options;
  const termsColumns = _options?.termsColumns || [];
  set(termsColumns, [props.termsName, props.name], columns);
  handleOptionsColumnsValue(termsColumns, _options);
  emit("update:value", handleFilterTerms({ ...paramsValue }));
  termTypeOptions.value = e.termTypes;
  valueChangeAfter();

  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].options!.terms[props.termsName].terms[props.name][0] = e.fullName || e.name;
};

const termsTypeSelect = (e: { key: string; name: string }) => {
  const oldValue = isArray(paramsValue.value!.value)
    ? paramsValue.value!.value[0]
    : paramsValue.value!.value;
  let value = [...arrayParamsKey, 'in', 'nin'].includes(e.key) ? showDouble.value ? [oldValue, undefined] : oldValue ? [oldValue] : [] : oldValue;
  // 如果上次的值 在 timeTypeKeys中 则不变
  if (columnType.value === "date") {
    if (timeTypeKeys.includes(e.key)) {
      if (tabsOptions.value[0].component !== "int") {
        value = undefined;
      }
      tabsOptions.value[0].component = "int";
    } else if (
      !timeTypeKeys.includes(e.key) &&
      tabsOptions.value[0].component == "int"
    ) {
      value = undefined;
      tabsOptions.value[0].component = "date";
    }
  }

  if(['isnull', 'notnull'].includes(e.key)){
    paramsValue.value = {
      source: tabsOptions.value[0].key,
      value: 1,
      valueBackups: 1
    }
  }else{
    paramsValue.value = {
      source: paramsValue.value?.source || tabsOptions.value[0].key,
      value: value,
      valueBackups: paramsValue.value.valueBackups,
    };
  }

  const updateValue = omit(
    paramsValue,
    !showAlarm.value ? ["alarm", "terms"] : []
  );
  emit("update:value", handleFilterTerms({ ...updateValue }));
  valueChangeAfter();
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].options!.terms[props.termsName].terms[props.name][1] = e.name;
};

const alarmSelect = (e: { key: string; label: string }) => {
  emit("update:value", handleFilterTerms({ ...paramsValue }));
  valueChangeAfter();
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].options!.terms[props.termsName].terms[props.name][4] = e.label;
};
const valueSelect = (_: any, label: string, labelObj: Record<number, any>, options: any) => {

  paramsValue.value.valueBackups = options?.id

  const updateValue = omit(
    paramsValue,
    !showAlarm.value ? ["alarm", "terms"] : []
  );


  emit("update:value", handleFilterTerms(updateValue));
  valueChangeAfter();
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].options!.terms[props.termsName].terms[props.name][2] = labelObj;
};

const typeChange = (e: any) => {
  paramsValue.type = e.value;
  const updateValue = omit(
    paramsValue,
    !showAlarm.value ? ["alarm", "terms"] : []
  );
  emit("update:value", handleFilterTerms({ ...updateValue }));
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].options!.terms[props.termsName].terms[props.name][3] = e.label;
};

const termAdd = () => {
  const terms = {
    column: undefined,
    value: {
      source: "fixed",
      value: undefined,
    },
    termType: undefined,
    type: "and",
    key: `params_${new Date().getTime()}`,
  };
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].terms[props.termsName].terms.push(terms);

  formModel.value.branches?.[props.branchName]?.then?.[
    props.thenName
  ]?.actions?.[props.actionName].options?.terms?.[props.termsName].terms?.push([
    "",
    "eq",
    "",
    "and",
  ]);
};

const onDelete = () => {
  // const key =
  //     formModel.value.branches?.[props.branchName]?.then?.[props.thenName]
  //         ?.actions?.[props.actionName].terms?.[props.termsName].terms?.[
  //         props.name
  //     ].key;
  formModel.value.branches![props.branchName].then[props.thenName].actions[
    props.actionName
  ].terms[props.termsName].terms?.splice(props.name, 1);
  const _options =
    formModel.value.branches![props.branchName].then[props.thenName].actions[
      props.actionName
    ].options;
  const termsColumns = _options?.termsColumns || [];
  set(termsColumns, [props.termsName, props.name], []);
  handleOptionsColumnsValue(termsColumns, _options);
};

const getAlarmOptions = () => {
  const actionId =
    formModel.value.branches![props.branchName].then[props.thenName].actions[
      props.actionName
    ].actionId;
  const branchId = formModel.value.branches![props.branchName].branchId;
  const _id = formModel.value.id;
  queryAlarmList({
    sorts: [{ name: "createTime", order: "desc" }],
    terms: [
      {
        terms: [
          {
            column: "id$rule-bind-alarm",
            value: `${_id}:${actionId || branchId}`,
          },
          {
            column: "id$rule-bind-alarm",
            value: `${_id}:${-1}`,
            type: "or",
          },
        ],
      },
    ],
  }).then((resp) => {
    if (resp.success) {
      alarmOptions.value =
        resp.result?.map((item) => {
          return {
            ...item,
            label: item.name,
            fullName: item.name,
            value: item.id,
          };
        }) || [];
    }
  });
};
const subscribe = () => {
  const actionId =
    formModel.value.branches![props.branchName].then[props.thenName].actions[
      props.actionName
    ].actionId;
  const _key = actionId || formModel.value.branches![props.branchName].branchId;
  EventEmitter.subscribe([`${_key}_alarm`], () => {
    getAlarmOptions();
  });
};

subscribe();

watch(
  [showAlarm.value, showAlarmSelect.value],
  (val) => {
    if (val && !alarmOptions.value.length) {
      getAlarmOptions();
    }
  },
  { immediate: true }
);

watch(
  () => [columnOptions.value, paramsValue.column, levelOptions.value],
  () => {
    if (paramsValue.column && columnOptions.value.length) {
      // const option = getOption(columnOptions.value, paramsValue.column, "id");
      const option = columnOptionsMap.value.get(paramsValue.column)
      if (option && Object.keys(option).length) {
        handOptionByColumn(option);
        if (props.value.error) {
          emit(
            "update:value",
            handleFilterTerms({
              ...props.value,
              error: false,
            })
          );
          valueChangeAfter();
        } else if(option.type === 'enum' && !['notnull', 'isnull'].includes(props.value?.termType)) {
          if(
            (Array.isArray(props.value?.value?.value) && !props.value?.value?.value?.every(item => option.options?.elements?.find(i => i.value === item)))
            || (!Array.isArray(props.value?.value?.value) && option.options?.elements?.findIndex(i => i.value === props.value?.value?.value) === -1)
          ) {
            emit(
              "update:value",
              handleFilterTerms({
                ...props.value,
                error: true,
              })
            );
            valueChangeAfter();
          }
        } else if(showAlarmLevel.value) {
          const _value = props.value?.terms?.[0]?.value?.value;
          emit(
              "update:value",
              handleFilterTerms({
                ...props.value,
                error: (Array.isArray(_value) && _value.some((i) => levelOptions.value?.findIndex(item => item.id === i) === -1)) || (!Array.isArray(_value) && levelOptions.value?.findIndex(i => i.value === _value) === -1) || !_value
              })
            );
            valueChangeAfter();
        }
      } else {
        emit(
          "update:value",
          handleFilterTerms({
            ...props.value,
            error: true,
          })
        );
        valueChangeAfter();
      }
    }
  },
  { deep: true }
);

watch(
  () => props.value,
  () => {
    const terms = analysisFilterTerms(props.value);
    paramsValue.value = terms.value;
    paramsValue.column = terms.column;
    paramsValue.type = terms.type;
    paramsValue.termType = terms.termType;
    if (terms.hasOwnProperty("alarm")) {
      paramsValue.alarm = terms.alarm;
    }
  },
  { immediate: true, deep: true }
);

watch(
  () => showAlarmLevel.value,
  () => {
    if (showAlarmLevel.value) {
      runQueryLevel();
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (paramsValue.column) {
    // const option = getOption(columnOptions.value, paramsValue.column, "id");
    const option = columnOptionsMap.value.get(paramsValue.column)
    if (option && Object.keys(option).length) {
      handOptionByColumn(option);
    }
  }
});
</script>

<style scoped></style>
