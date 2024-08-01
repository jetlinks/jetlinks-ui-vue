<template>
    <div class="scene-trigger-way-warp" >
        <template v-for="item in options" :key="item.value">
            <div
                class="trigger-way-item"
                :class="{
                  active: item?.value === value,
                  disabled: item.disabled || disabled
                }"
                @click="onSelect(item)"
            >
                <div class="way-item-image">
<!--                  <img :src="item.iconUrl" :width="imageSize" />-->
                  <AIcon :type="item.iconUrl" />
                </div>
                <div class="way-item-title">
                    <p>{{ item.label }}</p>
                    <div>{{ item.subLabel }}</div>
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
});

const emit = defineEmits(['update:value'])

const onSelect = (record: any) => {
    if (!props.disabled && !record.disabled) {
      emit('update:value', record.value)
    }
}

</script>

<style lang="less" scoped>
.scene-trigger-way-warp {
    display: grid;
    gap: 24px;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;

    .trigger-way-item {
        display: flex;
        justify-content: space-between;
        padding: 16px;
        border: 1px solid transparent;
        border-radius: 2px;
        cursor: pointer;
        transition: all 0.3s;
        background-color: #F5F5F5;
        gap: 16px;
        align-items: center;

        .way-item-title {
          flex: 1 1 0;
          min-width: 0;
            p {
                margin-bottom: 8px;
                font-weight: bold;
                font-size: 14px;
            }

            div {
                color: #777;
                font-size: 12px;
            }
        }

        .way-item-image {

          display: flex;
          width: 40px;
          height: 40px;
          font-size: 24px;
          color: #fff;
          background-color: @primary-color;
          border-radius: 2px;
          align-items: center;
          justify-content: center;
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

        &.disabled {
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
