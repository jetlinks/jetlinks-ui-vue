<template>
    <div class="trigger-way-warp" :class="{ disabled: disabled }">
        <div
            v-for="item in typeList"
            :key="item.value"
            class="trigger-way-item"
            :class="{
                active: _value === item.value,
                labelBottom: labelBottom,
            }"
            @click="onSelect(item.value)"
        >
            <div class="'way-item-title">
                <span class="way-item-label">{{ item.label }}</span>
              <j-tooltip v-if="item.tip" :title="item.tip">
                <AIcon
                  type="QuestionCircleOutlined"
                  class="way-item-icon"
                  style="padding-left: 8px;"
                />
              </j-tooltip>
            </div>
            <div class="way-item-image">
                <img :width="48" :src="item.image" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="DeviceTopCard">
import { PropType } from 'vue';

const props = defineProps({
    typeList: {
        type: Array as PropType<any>,
        default: () => [],
    },
    value: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    labelBottom: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['update:value', 'change']);
const _value = ref(props?.value || '');

watch(
    () => props.value,
    (newValue) => {
        _value.value = newValue || '';
    },
    { immediate: true, deep: true },
);

const onSelect = (_type: string) => {
    if (!props.disabled) {
        _value.value = _type;
        emits('update:value', _type);
        emits('change', _type);
    }
};
</script>

<style lang="less" scoped>
.trigger-way-warp {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    width: 100%;

    .trigger-way-item {
        flex: 1 1 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 0;
        //width: 237px;
        padding: 12px 16px;
        border: 1px solid #e0e4e8;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.3s;

        .way-item-title {
            span {
                font-size: 16px;
            }
            .way-item-label {
                padding-right: 6px;
                color: rgba(#000, 0.64);
            }

            .way-item-icon {
                color: rgba(#000, 0.5);
                padding-left: 8px;
            }
        }

        .way-item-image {
            margin: 0 !important;
            opacity: 0.6;
        }

        &:hover {
            .way-item-image {
                opacity: 0.8;
            }
        }

        &.active {
            border-color: @primary-color-active;
            .way-item-image {
                opacity: 1;
            }
        }

        &.labelBottom {
            flex-direction: column-reverse;
            grid-gap: 16px;
            gap: 0;
            align-items: center;
            width: auto;
            padding: 8px 16px;
            p {
                margin: 0;
            }
        }
    }

    &.disabled {
        .trigger-way-item {
            cursor: not-allowed;

            &:hover {
                color: initial;
                opacity: 0.6;
            }

            &.active {
                opacity: 1;
            }
        }
    }
}
</style>
