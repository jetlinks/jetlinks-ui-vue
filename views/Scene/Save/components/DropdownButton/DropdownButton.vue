<template>
  <a-dropdown
    class="scene-select"
    trigger="click"
    v-model:open="visible"
    @openChange="visibleChange"
  >
    <div @click.prevent="visible = true">
      <slot :label="label">
        <div :class="dropdownButtonClass">
          <AIcon v-if="!!icon" :type="icon" />
          <j-ellipsis style="max-width: 220px">
            {{ label }}
          </j-ellipsis>
        </div>
      </slot>
    </div>
    <template #overlay>
      <div class="scene-select-content">
        <DropdownTimePicker
          v-if="['date', 'time'].includes(component)"
          :type="component"
          @change="timeSelect"
        />
        <template v-else-if="options.length">
          <drop-menus
            v-if="component === 'select'"
            :value="selectValue"
            :options="options"
            :valueName="valueName"
            @click="menuSelect"
          />
          <div style="min-width: 400px" v-else>
            <a-tree
              v-model:expandedKeys="treeOpenKeys"
              :selectedKeys="selectValue ? [selectValue] : []"
              :treeData="options"
              style="width: auto;  height: 350px;overflow: auto;"
              :virtual="true"
              :fieldNames="{ key: valueName }"
              @select="treeSelect"
            >
              <template #title="{ column, name, fullName, description }">
                <template v-if="slots.includes('title')">
                  <slot name="title" :data="{column, name, fullName}"></slot>
                </template>
                <a-space v-else>
                  {{ name || fullName }}
                  <span v-if="description" class="tree-title-description">{{
                    description
                  }}</span>
                </a-space>
              </template>
            </a-tree>
          </div>
        </template>
        <div class="scene-select-empty" v-else>
          <a-empty />
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup name="DropdownButton">
import type { PropType } from "vue";
import DropMenus from "./Menus.vue";
import DropdownTimePicker from "./Time.vue";
import { getOption } from "./util";
import type { DropdownButtonOptions } from "./util";
import { openKeysByTree } from "../../../../../utils/comm";

type LabelType = string | number | boolean | undefined;

type Emit = {
  (e: "update:value", data: string | number): void;
  (e: "select", data: DropdownButtonOptions | string | undefined): void;
};

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: undefined,
  },
  value: {
    type: [String, Number, Boolean],
    default: undefined,
  },
  valueName: {
    type: String,
    default: "value",
  },
  labelName: {
    type: String,
    default: "label",
  },
  options: {
    type: Array as PropType<Array<DropdownButtonOptions>>,
    default: () => [],
  },
  columnOptionsMap: {
    type: Object,
    default: () => new Map()
  },
  type: {
    type: String,
    default: "column", // 'column' | 'termType' | 'value' | 'type'
  },
  component: {
    type: String,
    default: "select", // 'select' | 'treeSelect'
  },
});

const emit = defineEmits<Emit>();
const slots = Object.keys(useSlots());

const label = ref<LabelType>(props.placeholder);
const selectValue = ref(props.value);
const visible = ref(false);
const treeOpenKeys = ref<(string | number)[]>([]);
const visibleChange = (v: boolean) => {
  visible.value = v;
};

const dropdownButtonClass = computed(() => ({
  "dropdown-button": true,
  [props.type]: true,
}));

const treeSelect = (v: any, option: any) => {
  const node = option.node;
  visible.value = false;
  label.value = node.fullName || node.name;
  selectValue.value = v[0];
  emit("update:value", node[props.valueName]);
  emit("select", node);
};

const timeSelect = (v: string) => {
  selectValue.value = v;
  visible.value = false;
  emit("update:value", v);
  emit("select", v);
};

const menuSelect = (v: string, option: any) => {
  selectValue.value = v;
  visible.value = false;
  emit("update:value", v);
  emit("select", option);
};

watchEffect(() => {
  let option

  if (!props.columnOptionsMap?.size) {
    option = getOption(props.options, props.value, props.valueName);
  } else {
    option = props.columnOptionsMap.get(props.value);
  }

  selectValue.value = props.value;
  if (option) {
    // 数据回显
    label.value = option[props.labelName] || option.name;

    if (props.columnOptionsMap) {
      let _id = props.value
      let openKeys = []
      while (_id) {
        if (_id) {
          openKeys.push(_id);
          const _item = props.columnOptionsMap.get(_id);
          _id = _item?.pId
        }
      }
      treeOpenKeys.value = openKeys;
    }
  } else {
    label.value = props.value !== undefined ? props.value : props.placeholder;
  }
});
</script>

<style scoped lang="less">
@import "./index.less";
</style>
