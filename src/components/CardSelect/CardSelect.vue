<template>
    <div :class="{ 'j-card-panel': true, 'no-column': noColumn }">
        <a-row v-if="!noColumn" :gutter="[16, 16]">
            <a-col
                v-for="item in itemOptions"
                :key="item.value"
                :span="24 / column"
            >
                <div
                    :class="{
                        'j-card-item': true,
                        active: activeKeys.includes(item.value),
                        disabled: disabled || item.disabled,
                        horizontal: type === 'horizontal',
                        vertical: type === 'vertical',
                        right: float === 'right',
                        left: float === 'left',
                    }"
                    @click="() => handleSelect(item.value, item)"
                >
                    <div class="j-card-title-warp">
                        <div class="title">
                            <slot
                                name="title"
                                :title="item.label"
                                :option="item"
                            >
                                <j-ellipsis>
                                    {{ item.label }}
                                </j-ellipsis>
                            </slot>
                        </div>
                        <div
                            v-if="item.subLabel && showSubLabel"
                            class="sub-title"
                        >
                            <slot
                                name="subLabel"
                                :sub-label="item.subLabel"
                                :option="item"
                            >
                                {{ item.subLabel }}
                            </slot>
                        </div>
                    </div>
                    <div v-if="showImage" class="j-card-image">
                        <slot name="image" :image="item.iconUrl" :option="item">
                            <a-avatar
                                class="icon box-shadow"
                                :src="item.iconUrl"
                            />
                        </slot>
                    </div>
                </div>
            </a-col>
        </a-row>
        <template v-else>
            <div
                v-for="item in itemOptions"
                :key="item.value"
                :class="{
                    'j-card-item': true,
                    active: activeKeys.includes(item.value),
                    disabled: disabled || item.disabled,
                    horizontal: type === 'horizontal',
                    vertical: type === 'vertical',
                    right: float === 'right',
                    left: float === 'left',
                }"
                @click="() => handleSelect(item.value, item)"
            >
                <div class="j-card-title-warp">
                    <div class="title">
                        <slot name="title" :title="item.label" :option="item">
                            <j-ellipsis>
                                {{ item.label }}
                            </j-ellipsis>
                        </slot>
                    </div>
                    <div v-if="item.subLabel && showSubLabel" class="sub-title">
                        <slot
                            name="subLabel"
                            :sub-label="item.subLabel"
                            :option="item"
                        >
                            {{ item.subLabel }}
                        </slot>
                    </div>
                </div>
                <div v-if="showImage" class="j-card-image">
                    <slot name="image" :image="item.iconUrl" :option="item">
                        <j-avatar class="icon box-shadow" :src="item.iconUrl" />
                    </slot>
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref, toRefs, watch } from 'vue';

interface CardOption {
    value: string | number;
    label: string;
    subLabel?: string;
    iconUrl: string;
    disabled?: boolean;
}

const props = defineProps({
    type: {
        type: String as PropType<'vertical' | 'horizontal'>,
        default: 'horizontal',
    },
    float: {
        type: String as PropType<'left' | 'right'>,
        default: 'left',
    },
    options: {
        type: Array as PropType<Array<CardOption>>,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    column: {
        type: Number,
        default: 3,
    },
    noColumn: {
        type: Boolean,
        default: false,
    },
    showImage: {
        type: Boolean,
        default: true,
    },
    showSubLabel: {
        type: Boolean,
        default: true,
    },
    value: {
        type: [String, Array],
        default: undefined,
    },
    allowClear: {
        type: Boolean,
        default: false,
    },
});
const { multiple, type, disabled, float } = toRefs(props);

const emits = defineEmits(['update:value', 'change', 'select']);
const activeKeys = ref<Array<string | number>>([]);
const itemOptions = computed(() => props.options);
const isAllowClear = computed(() => {
    return props.allowClear !== false;
});
const getOptions = (keys: Array<string | number>): CardOption[] => {
    return itemOptions.value.filter((item) => {
        return keys.includes(item.value);
    });
};

const handleSelect = (key: string | number, item: CardOption) => {
    if (disabled.value || item.disabled) return;
    let cloneActiveKeys = new Set(activeKeys.value);

    const isActive = cloneActiveKeys.has(key);

    // 已选中，并且单选，allowClear为false，则return
    if (isActive && !multiple.value && isAllowClear.value === false) return;

    if (isActive) {
        // 选中
        cloneActiveKeys.delete(key);
    } else {
        // 添加
        multiple.value
            ? cloneActiveKeys.add(key)
            : (cloneActiveKeys = new Set([key]));
    }

    activeKeys.value = [...cloneActiveKeys.keys()];
    const options = multiple.value ? getOptions(activeKeys.value) : item;

    const values = props.multiple ? activeKeys.value : activeKeys.value[0]

    emits('update:value', values);
    emits('change', values, options);
    emits('select', values, key, !isActive)
};

watch(
    () => props.value,
    () => {
        activeKeys.value = Array.isArray(props.value)
            ? props.value
            : [props.value];
    },
    { immediate: true },
);
</script>

<style lang="less" scoped>
@card-border: #e6e6e6;
.j-card-panel {
  .j-card-item {
    border: 1px solid @card-border;
    border-radius: 4px;
    cursor: pointer;
    color: @black;
    display: flex;
    width: 100%;
    gap: 12px;

    .j-card-title-warp {
      flex: 1 1 auto;
      max-width: 100%;

      .title {
        word-break: keep-all;
        width: 100%;
      }
    }

    &.vertical {
      flex-direction: column-reverse;
      padding: 22px 4px;
      align-items: center;

      .j-card-image {
        margin-bottom: 4px;
      }
    }

    &.horizontal {
      padding: 20px;
    }

    .sub-title {
      color: rgba(0, 0, 0, 0.24);
    }

    &.right {
      flex-direction: row-reverse;
    }
  }

  &.no-column {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .j-card-item {
      min-width: 36px;
      width: unset;

      &.vertical {
        padding: 14px 16px;
      }
    }
  }

  .active {
    border: 1px solid var(--ant-primary-color) !important;
  }

  .disabled {
    cursor: not-allowed;
    opacity: 0.75;
  }
}


</style>
