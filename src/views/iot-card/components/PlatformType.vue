<!-- 平台类型 -->
<template>
    <div :class="['radio-card-items', className, disabled ? 'disabled' : '']">
        <div
            v-for="item in options"
            :key="item.value"
            :style="itemStyle"
            :class="[
                'radio-card-item',
                keys.includes(item.value) ? 'checked' : '',
            ]"
            @click="toggleOption(item.value)"
        >
            <div class="card-list">
                <div>
                    <img
                        :style="`width: ${item.imgSize?.[0]}; height: ${item.imgSize?.[1]}`"
                        v-if="item.imgUrl"
                        :src="item.imgUrl"
                        alt=""
                    />
                </div>
                <div>{{ item.label }}</div>
            </div>
            <div class="checked-icon">
                <div><AIcon type="CheckOutlined" /></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['update:value', 'change'], );

const props = defineProps({
    options: {
        type: Array,
        default: () => [],
        required: true,
    },
    model: {
        validator: function (value) {
            return ['multiple', 'singular'].includes(value);
        },
        default: () => 'singular',
    },
    value: {
        type: String,
        default: () => '',
    },
    disabled: {
        type: Boolean,
        default: () => true,
    },
    className: {
        type: String,
    },
    itemStyle: {
        type: Object,
        default: () => {},
    },
});

const keys = ref(
    !(props.model && props.model === 'singular') ? props.value : [props.value],
);

const toggleOption = (key) => {
    if (props.disabled) {
        return;
    } else {
        const optionIndex = keys.value.includes(key);
        const newKeys = [...keys.value];
        const singular = props.model && props.model === 'singular';
        if (!optionIndex) {
            if (!(props.model && props.model === 'singular')) {
                newKeys.push(key);
            } else {
                newKeys[0] = key;
            }
        } else {
            newKeys.splice(optionIndex, 1);
        }
        emit('update:value', singular ? newKeys[0] : newKeys);
        emit('change', singular ? newKeys[0] : newKeys);
    }
};

watch(
    () => props.value,
    (newVal) => {
        keys.value = !(props.model && props.model === 'singular')
            ? newVal
            : [newVal];
    },
);
</script>

<style lang="less" scoped>
@border: 1px solid @border-color-base;

.radio-card-items {
    display: flex;

    .radio-card-item {
        display: flex;
        align-items: center;
        min-width: 180px;
        padding: 22px 28px;
        overflow: hidden;
        font-size: 14px;
        border: @border;
        border-radius: @border-radius-base;

        .card-list {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            div {
                text-align: center;
            }
        }

        > img {
            width: 32px;
            height: 32px;
            margin-right: 24px;
        }

        > span {
            cursor: default;
        }

        &:not(:last-child) {
            margin-right: 24px;
        }

        &:hover,
        &:focus {
            color: @primary-color-hover;
            border-color: @primary-color-hover;
        }

        .checked-icon {
            position: absolute;
            right: -22px;
            bottom: -22px;
            z-index: 2;
            display: none;
            width: 44px;
            height: 44px;
            color: #fff;
            background-color: @primary-color-active;
            transform: rotate(-45deg);

            > div {
                position: relative;
                height: 100%;
                transform: rotate(45deg);

                > span {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    font-size: 12px;
                }
            }
        }

        &.checked {
            position: relative;
            color: @primary-color-active;
            border-color: @primary-color-active;

            > .checked-icon {
                display: block;
            }
        }
    }

    &.disabled {
        .radio-card-item {
            color: @disabled-color;
            border-color: @disabled-bg;
            cursor: not-allowed;

            .checked-icon {
                background-color: @disabled-active-bg;
            }

            &:hover,
            &:focus {
                color: @disabled-color;
                border-color: @disabled-active-bg;
            }

            &.checked {
                color: @disabled-color;
                border-color: @disabled-active-bg;
            }
        }
    }
}
</style>
