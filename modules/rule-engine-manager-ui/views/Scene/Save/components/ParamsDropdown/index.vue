<template>
  <a-dropdown
    class="scene-select-value"
    trigger="click"
    v-model:open="visible"
    @openChange="visibleChange"
  >
    <div @click.prevent="visible = true">
      <slot :label="label">
        <div class="dropdown-button value">
          <AIcon v-if="!!icon" :type="icon" />
          <j-ellipsis style="max-width: 220px">
            {{ label }}
          </j-ellipsis>
        </div>
      </slot>
    </div>
    <template #overlay>
      <div class="scene-select-content">
        <a-tabs v-model:activeKey="mySource" @change="tabsChange">
          <a-tab-pane
            v-for="item in tabsOptions"
            :tab="item.label"
            :key="item.key"
          >
            <div class="select-box-content">
              <DropdownTimePicker
                v-if="['time', 'date'].includes(item.component)"
                type="time"
                v-model:value="myValue"
                @change="timeChange"
              />
              <template
                v-else-if="
                  ['select', 'enum', 'boolean'].includes(item.component)
                "
              >
                <j-value-item
                  v-if="multiple"
                  v-model:modelValue="myValue"
                  :itemType="item.component === 'file' ? 'string' : item.component"
                  mode="multiple"
                  :options="item.key === 'upper' ? metricOptions : options"
                  :extra="props"
                  :extraProps="{
                    fieldNames: {label: 'name', value: 'id'}
                  }"
                  @change="multipleChange"
                  style="width: 100%"
                />
                <DropdownMenus
                  v-else-if="
                    (['metric', 'upper'].includes(item.key)
                      ? metricOptions
                      : options
                    ).length
                  "
                  :options="
                    ['metric', 'upper'].includes(item.key)
                      ? metricOptions
                      : options
                  "
                  :value="myValue"
                  :valueName="props.source === 'metric' ? 'id' : valueName"
                  @click="onSelect"
                />
                <div class="scene-select-empty" v-else>
                  <a-empty />
                </div>
              </template>
              <template v-else-if="item.component === 'tree'">
                <div
                  style="padding: 0 10px"
                  v-if="(item.key === 'upper' ? metricOptions : options).length"
                >
<!--                  <j-scrollbar height="200">-->
                    <a-tree
                      v-model:expandedKeys="treeOpenKeys"
                      :selectedKeys="myValue ? [myValue] : []"
                      :treeData="item.key === 'upper' ? metricOptions : options"
                      :virtual="true"
                      :fieldNames="{ key: treeKey }"
                      style="width: auto;height: 350px;overflow: auto"
                      @select="treeSelect"
                    >
                      <template #title="{ name, description }">
                        <a-space>
                          <div class="no-warp">{{ name }}</div>
                          <div
                            v-if="description"
                            class="tree-title-description no-warp"
                          >
                            {{ description }}
                          </div>
                        </a-space>
                      </template>
                    </a-tree>
<!--                  </j-scrollbar>-->
                </div>
                <div class="scene-select-empty" v-else>
                  <a-empty />
                </div>
              </template>

              <j-value-item
                v-else-if="item.component === 'array'"
                v-model:modelValue="myValue"
                :itemType="item.component"
                :options="item.key === 'upper' ? metricOptions : options"
                :extra="props"
                @change="valueItemChange"
                style="width: 100%"
              />
              <j-value-item
                v-else
                v-model:modelValue="myValue"
                :itemType="itemType(item.component)"
                :options="item.key === 'upper' ? metricOptions : options"
                :extraProps="props"
                @change="valueItemChange"
                style="width: 100%"
              />
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup name="ParamsDropdown">
import type { ValueType } from "./typings";
import { defaultSetting } from "./typings";
import { DropdownMenus, DropdownTimePicker } from "../DropdownButton";
import { getOption } from "../DropdownButton/util";
import { openKeysByTree } from "../../../../../utils/comm";

type Emit = {
  (e: "update:value", data: ValueType): void;
  (e: "valueBackups:value", data: ValueType): void;
  (e: "update:source", data: string): void;
  (
    e: "select",
    data: any,
    label?: string,
    labelObj?: Record<number, any>,
    option?: any
  ): void;
  (e: "tabChange", data: any): void;
};

const props = defineProps({
  ...defaultSetting,
});

const emit = defineEmits<Emit>();

const myValue = ref<ValueType>(props.valueBackups || props.value);
const mySource = ref<string>(props.source);
const label = ref<any>(props.placeholder);
const treeOpenKeys = ref<(string | number)[]>([]);
const visible = ref(false);

const itemType = (type: string) => {
  if (['short', 'byte', 'word'].includes(type)) {
    return 'int'
  }

  if (type === 'file') {
    return 'string'
  }

  return type
}

nextTick(() => {
  mySource.value = props.source;
  myValue.value = props.source === "metric" ? props.metric : (props.valueBackups || props.value);
});

const nodeLabelName = computed(() => mySource.value === "upper" ? props.metricName : props.labelName)

const tabsChange = (e: string) => {
  mySource.value = e;
  myValue.value = undefined;
  emit("update:source", mySource.value);
  emit("update:value", undefined);
  emit("valueBackups:value", undefined);
  emit("tabChange", e);
  emit("select", {}, "", { 0: undefined });
};

const treeSelect = (v: any, option: any) => {
  const node = option.node;
  visible.value = false;
  label.value = node[nodeLabelName.value] || node.name;
  emit("update:value", node[props.valueName]);
  emit("valueBackups:value", node[props.valueName]);
  emit("select", node, label.value, { 0: label.value });
};

const valueItemChange = (e: string) => {
  label.value = e;
  emit("update:value", e);
  emit("valueBackups:value", e);
  emit("select", e, label.value, { 0: label.value });
};

const multipleChange = (e: {fullName: string, value: any}[]) => {
  label.value = e.map(item => item[nodeLabelName.value]);
  emit("update:value", e.map(item => item.value));
  emit("valueBackups:value", e.map(item => item.value));
  emit("select", e.map(item => item.value), label.value, { 0: label.value });
};

const onSelect = (e: string, option: any) => {
  visible.value = false;
  label.value = option[nodeLabelName.value];
  emit("update:value", option[props.valueParamsName]);
  emit("valueBackups:value", e);
  emit("select", option[props.valueParamsName], label.value, { 0: label.value }, option);
};

const timeChange = (e: any) => {
  label.value = e;
  visible.value = false;
  emit("update:value", e);
  emit("valueBackups:value", e);
  emit("select", e, label.value, { 0: label.value });
};

const visibleChange = (v: boolean) => {
  visible.value = v;
};

watchEffect(() => {
  const _options = ["metric", "upper"].includes(props.source)
    ? props.metricOptions
    : props.options;
  const pValue = props.valueBackups || props.value
  const isMetric = props.source === "metric"; // 是否为指标值
  const _value = isMetric ? props.metric : pValue;
  const _valueName = isMetric ? "id" : props.valueName;
  const option = getOption(_options, _value as string, _valueName); // 回显label值
  myValue.value = isMetric ? props.metric : pValue || [];
  mySource.value = props.source;

  if (option) {
    label.value = option[nodeLabelName.value] || option.name;
    treeOpenKeys.value = openKeysByTree(_options, pValue, props.valueName);
  } else {
    if (isMetric) {
      // 处理指标值回显
      label.value =
        props.metric !== undefined
          ? pValue || props.placeholder
          : props.placeholder;
    } else {
      if(props.multiple && props.source === 'fixed') {
        label.value = props.options?.filter(item => pValue?.includes(item.value)).map(item => item[nodeLabelName.value]);
      } else {
        label.value = pValue!== undefined? pValue : props.placeholder;
      }
    }
  }
});
</script>

<style scoped lang="less">
@import "../DropdownButton/index.less";
.select-box-content {
  overflow: auto;

  .no-warp {
    white-space: nowrap
  }
}
.manual-time-picker {
  position: absolute;
  top: -2px;
  left: 0;
  border: none;
  visibility: hidden;
  :deep(.ant-picker-input) {
    display: none;
  }
}
</style>
