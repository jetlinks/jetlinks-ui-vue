<template>
    <div class="scene-trigger-way-warp" :class="{disabled: disabled}">
        <template v-for="item in options" :key="item.value">
            <div
                class="trigger-way-item"
                :class="{ active: item?.value === value }"
                :style="{width: `${cardSize}px`}"
                @click="onSelect(item.value)"
            >
                <div class="way-item-title">
                    <p>{{ item.label }}</p>
                    <span>{{ item.subLabel }}</span>
                </div>
                <div class="way-item-image">
                    <img :src="item.iconUrl" :width="imageSize" />
                </div>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

const props = defineProps({
    value: {
        type: String,
        default: '',
    },
    options: {
        type: Array as PropType<any[]>,
        default: () => [],
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String as PropType<'vertical' | 'horizontal'>,
        default: 'horizontal',
    },
    imageSize: {
        type: Number,
        default: 48
    },
    cardSize: {
        type: Number,
        default: 237
    }
});

const emit = defineEmits(['update:value'])

const onSelect = (_type: string) => {
    if (!props.disabled) {
      emit('update:value', _type)
    }
}
</script>

<style lang="less" scoped>
.scene-trigger-way-warp {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    width: 100%;

    .trigger-way-item {
        display: flex;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid #e0e4e8;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.3s;

        .way-item-title {
            p {
                margin-bottom: 8px;
                font-weight: bold;
                font-size: 16px;
            }

            span {
                color: rgba(#000, 0.35);
                font-size: 12px;
            }
        }

        .way-item-image {
            display: flex;
            align-items: center;
            height: 100%;
            margin: 0 !important;
            opacity: 0.6;
        }

        &:hover {
            color: @primary-color-hover;
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