<template>
  <div :class="['j-check-button', props.class]" :style="styles">
    <div
      v-for="item in _options"
      :key="item.value"
      :class="{
        'j-check-button-item': true,
        'selected': myValue.includes(item.value),
        'disabled': item.disabled
      }"
      @click="
                () => {
                    selected(item.value, item.disabled);
                }
            "
    >
      <slot name="label">
        {{ item.label }}
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, CSSProperties, PropType, ref, watch } from 'vue';
import { isArray } from 'lodash-es';
import { Form } from 'ant-design-vue'

defineOptions({
  name: 'CheckButton'
})

const props = defineProps({
  value: {
    type: [String, Array],
    default: undefined,
  },
  options: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: undefined,
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => ({}),
  },
  columns: {
    type: Number,
    default: 3
  },
  beforeChange: {
    type: Function
  }
});
const emit = defineEmits(['update:value', 'change', 'select']);

const formItemContext = Form.useInjectFormItemContext();
const myValue = ref();
const optionsMap = ref(new Map());

const styles = computed(() => {
  return {
    'grid-template-columns': `repeat(${props.columns}, 1fr)`,
    ...props.style
  }
})

const _options = computed(() => {
  props.options.forEach((item: any) => {
    if (props.disabled) {
      item.disabled = props.disabled
    }
    optionsMap.value.set(item.value, item);
  });
  return props.options;
});

const selected = async (key: string | number, disabeld: boolean) => {
  if (disabeld || props.disabled) return;

  const pending = await props.beforeChange?.(key)

  if (pending === false) {
    return
  }

  const values = new Set(myValue.value);

  if (values.has(key)) {
    if (props.multiple) {
      values.delete(key);
    }
  } else {
    if (!props.multiple) {
      values.clear();
    }
    values.add(key);
  }

  myValue.value = [...values.values()];

  const optionsItems = myValue.value.map((_key) => {
    return optionsMap.value.get(_key);
  });

  const _value = props.multiple ? myValue.value : myValue.value[0];

  emit('update:value', _value);
  emit('change', _value, props.multiple ? optionsItems : optionsItems[0]);
  emit('select', _value, props.multiple ? optionsItems : optionsItems[0]);
  formItemContext.onFieldChange()
};

watch(
  () => props.value,
  () => {
    if (props.value) {
      myValue.value = isArray(props.value) ? props.value : [props.value];
    } else {
      myValue.value = [];
    }
  },
  { immediate: true, deep: true },
);

</script>

<style scoped lang="less">
.j-check-button {
  display: grid;
  gap: 12px 8px;
  width: 100%;

  .j-check-button-item {
    flex: 1;
    min-width: 0;
    padding: 8px;
    border-radius: 20px;
    background-color: #F8F9FA;
    transition: all 0.3s;
    color: #333;
    text-align: center;
    cursor: pointer;
    border: 1px solid #F8F9FA;

    &:hover {
      background-color: #F1F7FF;
      color: @primary-color;
      opacity: 0.85;
    }

    &.selected {
      background-color: #F1F7FF;
      border-color: @primary-color;
      color: @primary-color;
    }

    &.disabled {
      cursor: not-allowed;
      color: #00000040;
      background-color: #e6e6e6;
      opacity: 1
    }
  }
}

</style>
