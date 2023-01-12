<template>
    <div class="card">
        <div
            class="card-warp"
            :class="{ active: active ? 'active' : ''}"
            @click="handleClick"
        >
            <div class="card-content">
                <a-row>
                    <a-col :span="6">
                        <!-- 图片 -->
                        <div class="card-item-avatar">
                            <slot name="img"> </slot>
                        </div>
                    </a-col>
                    <a-col :span="18">
                        <!-- 内容 -->
                        <slot name="content"></slot>
                    </a-col>
                </a-row>

                <!-- 勾选 -->
                <div v-if="active" class="checked-icon">
                    <div>
                        <CheckOutlined />
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
            <div v-if="showTool && actions && actions.length" class="card-tools">
                <div
                    v-for="item in actions"
                    :key="item.key"
                    class="card-button"
                    :class="{
                        delete: item.key === 'delete',
                    }"
                >
                <!-- <slot name="actions" v-bind="item"></slot> -->
                <a-popconfirm  v-if="item.popConfirm" v-bind="item.popConfirm">
                    <a-button :disabled="item.disabled">
                        <DeleteOutlined v-if="item.key === 'delete'" />
                        <template v-else>
                            <AIcon :type="item.icon" />
                            <span>{{ item.text }}</span>
                        </template>
                    </a-button>
                </a-popconfirm>
                <template v-else>
                    <a-button :disabled="item.disabled">
                        <DeleteOutlined v-if="item.key === 'delete'" />
                        <template v-else>
                            <AIcon :type="item.icon" />
                            <span>{{ item.text }}</span>
                        </template>
                    </a-button>
                </template>
                </div>
            </div>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { SearchOutlined, CheckOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { StatusColorEnum } from '@/utils/consts.ts';
import type { ActionsType } from '@/components/Table/index.vue'
import { PropType } from 'vue';

type EmitProps = {
    // (e: 'update:modelValue', data: Record<string, any>): void;
    (e: 'click', data: Record<string, any>): void;
};

type TableActionsType  = Partial<ActionsType>

const emit = defineEmits<EmitProps>();

const props = defineProps({
    value: {
        type: Object as PropType<Record<string, any>>,
        default: () => {}
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
        default: false
    }
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

        &.hover {
            cursor: pointer;
            box-shadow: 0 0 24px rgba(#000, 0.1);
        }

        &.active {
            position: relative;
            border: 1px solid #2f54eb;
        }

        .card-content {
            position: relative;
            padding: 30px 12px 16px 30px;
            overflow: hidden;

            &::before {
                position: absolute;
                top: 0;
                left: 30px + 10px;
                display: block;
                width: 15%;
                min-width: 64px;
                height: 2px;
                background-image: url('/images/rectangle.png');
                background-repeat: no-repeat;
                background-size: 100% 100%;
                content: ' ';
            }

            .card-item-avatar {
                margin-right: 16px;
            }

            .card-state {
                position: absolute;
                top: 30px;
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
        }

        .card-mask {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: #fff;
            background-color: rgba(#000, 0);
            visibility: hidden;
            cursor: pointer;
            transition: all 0.3s;

            > div {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                padding: 0 !important;
            }

            &.show {
                background-color: rgba(#000, 0.5);
                visibility: visible;
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

            & > span,
            button {
                width: 100% !important;
                border-radius: 0 !important;
            }

            button {
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

                button {
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

            button[disabled] {
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

            // :deep(.ant-tooltip-disabled-compatible-wrapper) {
            //     width: 100%;
            // }
        }
    }
}
</style>
