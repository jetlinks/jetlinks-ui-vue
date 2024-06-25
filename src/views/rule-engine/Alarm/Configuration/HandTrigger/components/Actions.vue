<template>
    <div class="actions-warp">
        <div v-for="item in actions">
            <div v-if="activeKeys.some((active) => active === item.actionId)">
                <div class="actions-item" v-if="item.executor === 'alarm'">
                    <div class="item-options-warp">
                        <div class="item-options-type">
                            <img
                                style="width: 18px"
                                :src="
                                    iconMap.get(
                                        item.executor === 'alarm'
                                            ? item.alarm.mode
                                            : item.executor,
                                    )
                                "
                            />
                        </div>
                        <div class="item-options-content">
                            <template v-if="item.executor === 'alarm'">
                                <span>
                                    满足条件后将{{
                                        item.alarm.mode === 'trigger'
                                            ? '触发'
                                            : '解除'
                                    }}当前告警
                                </span>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="Actions">
import {
    iconMap,
    itemNotifyIconMap,
    typeIconMap,
} from '@/views/rule-engine/Scene/Save/action/ListItem/util';
import { isBoolean } from 'lodash-es';

const props = defineProps({
    actions: {
        type: Array,
        default: () => [],
    },
    activeKeys: {
        // 后端返回已关联的执行动作
        type: Array,
        default: () => [],
    },
});
</script>

<style scoped lang="less">
.actions-item {
    position: relative;
    padding: 8px;
    border: 1px dashed #999;
    border-radius: 2px;
    margin-bottom: 8px;

    .item-options-warp {
        display: inline-flex;
        height: 48px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;

        .item-options-type {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            background-color: #f0f0f0;
            border-radius: 6px 0 0 6px;
            cursor: pointer;
        }

        .item-options-content {
            display: flex;
            align-items: center;
            padding: 0 8px;
            background: #fafafa;
            border-radius: 0 6px 6px 0;
            cursor: pointer;

            div {
                padding: 6px 10px;
                color: #333;
                font-size: 14px;
                line-height: 22px;
                background-color: #fff;
                border-radius: 22px;

                .notify-text-highlight {
                    margin-left: 5px;
                    font-weight: bold;
                }

                .notify-img-highlight {
                    margin: 0 10px;
                    color: rgba(0, 0, 0, 0.8);
                }
            }
        }
    }

    .item-number {
        position: absolute;
        top: 0;
        left: 16px;
        font-weight: 800;
        transform: translateY(-50%);
    }
}

.actions-item-filter-warp {
    position: relative;
    margin-bottom: 12px;
    margin-top: 16px;
    padding: 2px 0;
    border: 1px dashed #999;
    border-radius: 2px;

    &.filter-border {
        padding: 2px 16px;
        border-radius: 2px;
    }

    .actions-item-filter-warp-tip {
        position: absolute;
        top: 0;
        left: 16px;
        z-index: 2;
        color: rgba(0, 0, 0, 0.55);
        font-weight: 800;
        font-size: 14px;
        line-height: 1;
        background-color: #fff;
        transform: translateY(-50%);
    }

    .actions-item-filter-overflow {
        display: flex;
        padding-top: 4px;
        overflow-x: auto;
        overflow-y: visible;
        row-gap: 16px;
    }

    .filter-add-button {
        width: 100%;
        color: rgba(0, 0, 0, 0.3);
        text-align: center;
        cursor: pointer;
    }

    .terms-params {
        // display: inline-block;
        display: flex;
        flex-shrink: 0;

        // &:not(:first-child) {
        //   margin-bottom: 16px;
        // }

        .terms-params-warp {
            display: flex;
            align-items: baseline;
        }

        .term-type-warp {
            // display: inline-block;
            width: 50px;
            margin: 0 16px;

            .term-type {
                padding-top: 4px;
                padding-bottom: 4px;
                border-radius: 2px;
            }
        }
    }
}
</style>
