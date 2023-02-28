<template>
    <div class="card">
        <div
            class="card-warp"
            :class="{ active: active ? 'active' : '' }"
            @click="handleClick"
        >
            <div class="card-type">
                <div class="card-type-text"><slot name="type"></slot></div>
            </div>
            <div class="card-content">
                <div style="display: flex">
                    <!-- 图片 -->
                    <div class="card-item-avatar">
                        <slot name="img"> </slot>
                    </div>
                    <!-- 内容 -->
                    <div class="card-item-body">
                        <slot name="title"></slot>
                        <span class="subTitle">
                            <slot name="subTitle"></slot>
                        </span>
                    </div>
                </div>

                <!-- 勾选 -->
                <div v-if="active" class="checked-icon">
                    <div>
                        <AIcon type="CheckOutlined" />
                    </div>
                </div>

                <!-- 状态 -->
                <div
                    v-if="showStatus"
                    class="card-state"
                    :class="statusNames ? statusNames[status] : ''"
                >
                    <div class="card-state-content">
                        <BadgeStatus
                            :status="status"
                            :text="statusText"
                            :statusNames="statusNames"
                        ></BadgeStatus>
                    </div>
                </div>
            </div>
        </div>

        <!-- 按钮 -->
        <slot name="bottom-tool">
            <div
                v-if="showTool && actions && actions.length"
                class="card-tools"
            >
                <div
                    v-for="item in actions"
                    :key="item.key"
                    class="card-button"
                    :class="{
                        delete: item.key === 'delete',
                    }"
                >
                    <slot name="actions" v-bind="item"></slot>
                </div>
            </div>
        </slot>
    </div>
</template>

<script setup lang="ts">
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { StatusColorEnum } from '@/utils/consts.ts';
import type { ActionsType } from '@/components/Table/index.vue';
import { PropType } from 'vue';

type EmitProps = {
    (e: 'click', data: Record<string, any>): void;
};

type TableActionsType = Partial<ActionsType>;

const emit = defineEmits<EmitProps>();

const props = defineProps({
    value: {
        type: Object as PropType<Record<string, any>>,
        default: () => {},
    },
    showStatus: {
        type: Boolean,
        default: true,
    },
    showTool: {
        type: Boolean,
        default: true,
    },
    statusText: {
        type: String,
        default: '正常',
    },
    status: {
        type: [String, Number],
        default: 'default',
    },
    statusNames: {
        type: Object,
    },
    actions: {
        type: Array as PropType<TableActionsType[]>,
        default: () => [],
    },
    active: {
        type: Boolean,
        default: false,
    },
});

const handleClick = () => {
    emit('click', props.value);
};
</script>

<style lang="less" scoped>
.card {
    width: 100%;
    background-color: #fff;
    .checked-icon {
        position: absolute;
        right: -22px;
        bottom: -22px;
        z-index: 2;
        width: 44px;
        height: 44px;
        color: #fff;
        background-color: red;
        background-color: #2f54eb;
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

    .card-warp {
        position: relative;
        border: 1px solid #e6e6e6;
        overflow: hidden;

        &:hover {
            cursor: pointer;
            box-shadow: 0 0 24px rgba(#000, 0.1);

            .card-mask {
                visibility: visible;
            }
        }

        &.active {
            position: relative;
            border: 1px solid #2f54eb;
        }

        .card-type {
            position: absolute;
            top: 0;
            left: -14px;
            height: 32px;
            padding: 0 30px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 32px;
            background-color: rgba(0, 0, 0, 0.06);
            transform: skewX(-45deg);
            .card-type-text {
                display: flex;
                align-items: center;
                justify-content: center;
                transform: skewX(45deg);
            }
        }

        .card-content {
            position: relative;
            padding: 43px 12px 19px 30px;
            overflow: hidden;

            .card-item-avatar {
                margin-right: 16px;
            }

            .card-item-body {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                width: 0;

                .subTitle {
                    color: rgba(0, 0, 0, 0.65);
                    font-size: 14px;
                    margin-top: 10px;
                }
            }

            .card-state {
                position: absolute;
                top: 40px;
                right: -12px;
                display: flex;
                justify-content: center;
                width: 100px;
                padding: 2px 0;
                background-color: rgba(#5995f5, 0.15);
                transform: skewX(45deg);

                &.success {
                    background-color: @success-color-deprecated-bg;
                }

                &.warning {
                    background-color: rgba(#ff9000, 0.1);
                }

                &.error {
                    background-color: rgba(#e50012, 0.1);
                }

                .card-state-content {
                    transform: skewX(-45deg);
                }
            }

            :deep(.card-item-content-title) {
                cursor: pointer;
                font-size: 16px;
                font-weight: 700;
                color: @primary-color;
                width: calc(100% - 100px);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            :deep(.card-item-heard-name) {
                font-weight: 700;
                font-size: 16px;
                margin-bottom: 12px;
            }

            :deep(.card-item-content-text) {
                color: rgba(0, 0, 0, 0.75);
                font-size: 12px;
            }
        }
    }

    &.item-active {
        position: relative;
        color: #2f54eb;

        .checked-icon {
            display: block;
        }

        .card-warp {
            border: 1px solid #2f54eb;
        }
    }

    .card-tools {
        display: flex;
        margin-top: 8px;

        .card-button {
            display: flex;
            flex-grow: 1;

            & > :deep(span, button) {
                width: 100%;
                border-radius: 0;
            }

            :deep(button) {
                width: 100%;
                border-radius: 0;
                background: #f6f6f6;
                border: 1px solid #e6e6e6;
                color: #2f54eb;

                &:hover {
                    background-color: @primary-color-hover;
                    border-color: @primary-color-hover;

                    span {
                        color: #fff !important;
                    }
                }

                &:active {
                    background-color: @primary-color-active;
                    border-color: @primary-color-active;

                    span {
                        color: #fff !important;
                    }
                }
            }

            &:not(:last-child) {
                margin-right: 8px;
            }

            &.delete {
                flex-basis: 60px;
                flex-grow: 0;

                :deep(button) {
                    background: @error-color-deprecated-bg;
                    border: 1px solid @error-color-outline;

                    span {
                        color: @error-color !important;
                    }

                    &:hover {
                        background-color: @error-color-hover;

                        span {
                            color: #fff !important;
                        }
                    }

                    &:active {
                        background-color: @error-color-active;

                        span {
                            color: #fff !important;
                        }
                    }
                }
            }

            :deep(button[disabled]) {
                background: @disabled-bg;
                border-color: @disabled-color;

                span {
                    color: @disabled-color !important;
                }

                &:hover {
                    background-color: @disabled-active-bg;
                }

                &:active {
                    background-color: @disabled-active-bg;
                }
            }
        }
    }
}
</style>
