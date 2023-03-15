<template>
    <div class="actions-item-warp">
        <div class="actions-item">
            <div class="item-options-warp">
                <div class="item-options-type" @click="onAdd">
                    <img
                        style="width: 18px"
                        :src="
                            iconMap.get(
                                data?.executor === 'alarm'
                                    ? data?.alarm?.mode
                                    : data?.executor,
                            )
                        "
                    />
                </div>
                <div
                    class="item-options-content"
                    v-if="data?.executor === 'alarm'"
                >
                    <template v-if="data?.alarm?.mode === 'trigger'">
                        满足条件后将触发<j-button style="padding: 0;"
                            type="link"
                            @click.stop="triggerVisible = true"
                            >关联此场景的告警</j-button
                        >
                    </template>
                    <template v-else>
                        满足条件后将解除<j-button style="padding: 0;"
                            type="link"
                            @click.stop="triggerVisible = true"
                            >关联此场景的告警</j-button
                        >
                    </template>
                </div>
                <div
                    class="item-options-content"
                    v-else-if="data?.executor === 'notify'"
                    @click="onType('notify')"
                >
                    <template v-if="data?.notify?.notifyType === 'dingTalk'">
                        <template
                            v-if="options?.provider === 'dingTalkRobotWebHook'"
                        >
                            <div>
                                通过<span class="notify-text-highlight"
                                    >群机器人消息</span
                                >
                                发送
                                <span class="notify-text-highlight">
                                    {{
                                        options?.templateName ||
                                        data?.notify?.templateId
                                    }}
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <div>
                                通过
                                <span class="notify-text-highlight">
                                    <img
                                        style="width: 18px"
                                        :src="
                                            itemNotifyIconMap.get(
                                                data?.notify?.notifyType,
                                            )
                                        "
                                    />
                                    钉钉
                                </span>
                                向<span class="notify-text-highlight">{{
                                    options?.orgName || ''
                                }}</span>
                                <span class="notify-text-highlight">{{
                                    options?.sendTo || ''
                                }}</span>
                                发送
                                <span class="notify-text-highlight">
                                    {{
                                        options?.templateName ||
                                        data?.notify?.templateId
                                    }}
                                </span>
                            </div>
                        </template>
                    </template>
                    <template v-else-if="data?.notify?.notifyType === 'weixin'">
                        <div>
                            通过
                            <span class="notify-text-highlight">
                                <img
                                    style="width: 18px"
                                    :src="
                                        itemNotifyIconMap.get(
                                            data?.notify?.notifyType,
                                        )
                                    "
                                />
                                微信
                            </span>
                            向<span class="notify-text-highlight">{{
                                options?.orgName || ''
                            }}</span>
                            <span class="notify-text-highlight">{{
                                options?.sendTo || ''
                            }}</span>
                            <span class="notify-text-highlight">{{
                                options?.tagName || ''
                            }}</span>
                            发送
                            <span class="notify-text-highlight">
                                {{
                                    options?.templateName ||
                                    data?.notify?.templateId
                                }}
                            </span>
                        </div>
                    </template>
                    <template v-else-if="data?.notify?.notifyType === 'email'">
                        <div>
                            通过
                            <span class="notify-text-highlight">
                                <img
                                    style="width: 18px"
                                    :src="
                                        itemNotifyIconMap.get(
                                            data?.notify?.notifyType,
                                        )
                                    "
                                />
                                邮件
                            </span>
                            向<span class="notify-text-highlight">{{
                                options?.sendTo || ''
                            }}</span>
                            发送
                            <span class="notify-text-highlight">
                                {{
                                    options?.templateName ||
                                    data?.notify?.templateId
                                }}
                            </span>
                        </div>
                    </template>
                    <template v-else-if="data?.notify?.notifyType === 'voice'">
                        <div>
                            通过
                            <span class="notify-text-highlight">
                                <img
                                    style="width: 18px"
                                    :src="
                                        itemNotifyIconMap.get(
                                            data?.notify?.notifyType,
                                        )
                                    "
                                />
                                语音
                            </span>
                            向<span class="notify-text-highlight">{{
                                options?.sendTo || ''
                            }}</span>
                            发送
                            <span class="notify-text-highlight">
                                {{
                                    options?.templateName ||
                                    data?.notify?.templateId
                                }}
                            </span>
                        </div>
                    </template>
                    <template v-else-if="data?.notify?.notifyType === 'sms'">
                        <div>
                            通过
                            <span class="notify-text-highlight">
                                <img
                                    style="width: 18px"
                                    :src="
                                        itemNotifyIconMap.get(
                                            data?.notify?.notifyType,
                                        )
                                    "
                                />
                                短信
                            </span>
                            向<span class="notify-text-highlight">{{
                                options?.sendTo || ''
                            }}</span>
                            发送
                            <span class="notify-text-highlight">
                                {{
                                    options?.templateName ||
                                    data?.notify?.templateId
                                }}
                            </span>
                        </div>
                    </template>
                    <template
                        v-else-if="data?.notify?.notifyType === 'webhook'"
                    >
                        <div>
                            通过
                            <span class="notify-text-highlight">
                                <img
                                    style="width: 18px"
                                    :src="
                                        itemNotifyIconMap.get(
                                            data?.notify?.notifyType,
                                        )
                                    "
                                />
                                webhook
                            </span>
                            发送
                            <span>{{
                                options?.templateName ||
                                data?.notify?.templateId
                            }}</span>
                        </div>
                    </template>
                </div>
                <div
                    class="item-options-content"
                    v-else-if="data?.executor === 'delay'"
                    @click="onType('delay')"
                >
                    {{ options?.name }}
                </div>
                <div
                    class="item-options-content"
                    v-else-if="data?.executor === 'device'"
                    @click="onType('device')"
                >
                    <template v-if="data?.device?.selector === 'fixed'">
                        <div>
                            <AIcon
                                :type="
                                    typeIconMap[
                                        data?.device?.message?.messageType ||
                                            'INVOKE_FUNCTION'
                                    ]
                                "
                            />
                            <span style="padding-left: 4px">{{
                                data?.options?.type
                            }}</span>
                            <AIcon
                                type="icon-mubiao"
                                style="padding-right: 2px"
                            />
                            {{
                                `${data?.options?.name} ${
                                    data?.options?.properties
                                } 
                                ${
                                    (
                                        isBoolean(
                                            data?.options?.propertiesValue,
                                        )
                                            ? true
                                            : data?.options?.propertiesValue
                                    )
                                        ? `为 ${data?.options?.propertiesValue}`
                                        : ''
                                }`
                            }}
                        </div>
                    </template>
                    <template v-else-if="data?.device?.selector === 'tag'">
                        <div>
                            <AIcon
                                :type="
                                    typeIconMap[
                                        data?.device?.message?.messageType ||
                                            'INVOKE_FUNCTION'
                                    ]
                                "
                            />
                            {{ data?.options?.type }}
                            <span
                                v-for="i in data?.options?.taglist || []"
                                :key="i.value"
                            >
                                {{ i.type }}
                                {{ i.name }}为{{ i.value }}
                            </span>
                            的{{ data?.options?.productName }}
                            {{ data?.options?.properties }}
                        </div>
                    </template>
                    <template v-else-if="data?.device?.selector === 'relation'">
                        <div>
                            <AIcon
                                :type="
                                    typeIconMap[
                                        data?.device?.message?.messageType ||
                                            'INVOKE_FUNCTION'
                                    ]
                                "
                            />
                            {{ data?.options?.type }}与<span>{{
                                data?.options?.triggerName
                            }}</span
                            >具有相同 {{ data?.options?.relationName }}的{{
                                data?.options?.productName
                            }}设备的
                            {{ data?.options?.properties }}
                        </div>
                    </template>
                </div>
                <j-button v-else @click="onAdd">点击配置执行动作</j-button>
            </div>
            <div class="item-number">{{ name + 1 }}</div>
            <j-popconfirm title="确认删除？" @confirm="onDelete">
                <div class="item-delete">
                    <AIcon type="DeleteOutlined" />
                </div>
            </j-popconfirm>
        </div>
        <template v-if="!isLast && type === 'serial'">
            <div class="actions-item-filter-warp">
                <!-- filter-border -->
                满足此条件后执行后续动作
            </div>
        </template>
        <!-- 编辑 -->
        <template v-if="visible">
            <Modal
                :name="name"
                :branchGroup="branchGroup"
                :branchesName="branchesName"
                :data="data"
                @cancel="onClose"
                @save="onSave"
            />
        </template>
        <template>
            <ActionTypeComponent
                v-bind="props"
                v-if="!!actionType"
                :actionType="actionType"
                @save="onPropsOk"
                @cancel="onPropsCancel"
            />
        </template>
        <TriggerAlarm
            :id="_data.id"
            v-if="triggerVisible"
            @close="triggerVisible = false"
        />
    </div>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import { isBoolean } from 'lodash-es';
import { PropType } from 'vue';
import { ActionsType, ParallelType } from '../../../typings';
import Modal from '../Modal/index.vue';
import ActionTypeComponent from '../Modal/ActionTypeComponent.vue';
import TriggerAlarm from '../TriggerAlarm/index.vue';
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';

const sceneStore = useSceneStore();
const { data: _data } = storeToRefs(sceneStore);

const props = defineProps({
    branchesName: {
        type: Number,
        default: 0,
    },
    branchGroup: {
        type: Number,
        default: 0,
    },
    name: {
        type: Number,
        default: 0,
    },
    data: {
        type: Object as PropType<ActionsType>,
    },
    type: {
        type: Object as PropType<ParallelType>,
    },
    parallel: {
        type: Boolean,
    },
    options: {
        type: Object,
    },
    isLast: {
        type: Boolean,
    },
});

const emit = defineEmits(['delete', 'update']);

const iconMap = new Map();
iconMap.set('trigger', getImage('/scene/action-bind-icon.png'));
iconMap.set('notify', getImage('/scene/action-notify-icon.png'));
iconMap.set('device', getImage('/scene/action-device-icon.png'));
iconMap.set('relieve', getImage('/scene/action-unbind-icon.png'));
iconMap.set('delay', getImage('/scene/action-delay-icon.png'));

const itemNotifyIconMap = new Map();
itemNotifyIconMap.set(
    'dingTalk',
    getImage('/scene/notify-item-img/dingtalk.png'),
);
itemNotifyIconMap.set('weixin', getImage('/scene/notify-item-img/weixin.png'));
itemNotifyIconMap.set('email', getImage('/scene/notify-item-img/email.png'));
itemNotifyIconMap.set('voice', getImage('/scene/notify-item-img/voice.png'));
itemNotifyIconMap.set('sms', getImage('/scene/notify-item-img/sms.png'));
itemNotifyIconMap.set(
    'webhook',
    getImage('/scene/notify-item-img/webhook.png'),
);

const typeIconMap = {
    READ_PROPERTY: 'icon-zhihangdongzuodu',
    INVOKE_FUNCTION: 'icon-zhihangdongzuoxie-1',
    WRITE_PROPERTY: 'icon-zhihangdongzuoxie',
};

const visible = ref<boolean>(false);
const triggerVisible = ref<boolean>(false);
const actionType = ref('');

const onDelete = () => {
    emit('delete');
};

const onClose = () => {
    visible.value = false;
};

const onSave = (data: ActionsType, options?: any) => {
    emit('update', data, options);
    // setTimeout(() => {
    //     getParams();
    // }, 10);
    visible.value = false;
};

const onAdd = () => {
    visible.value = true;
};

const onType = (_type: string) => {
    actionType.value = _type;
};

const onPropsOk = (data: ActionsType, options?: any) => {
    emit('update', data, options);
    // setTimeout(() => {
    //     getParams();
    // }, 10);
    actionType.value = '';
};

const onPropsCancel = () => {
    actionType.value = '';
};
</script>

<style lang="less" scoped>
.deleteBtn() {
    position: absolute;
    top: -10px;
    right: -10px;
    display: none;
    width: 20px;
    height: 20px;
    color: #999;
    line-height: 20px;
    text-align: center;
    background-color: #f1f1f1;
    border-radius: 50%;
    cursor: pointer;

    &.show {
        display: block;
    }

    &:hover {
        background-color: #f3f3f3;
    }
}

.actions-item {
    position: relative;
    margin-bottom: 24px;
    padding: 16px;
    border: 1px dashed #999;
    border-radius: 2px;

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

    .item-delete {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        color: #e50012;
        background-color: rgba(229, 0, 18, 0.1);
        border-radius: 50%;
        transform: translate(50%, -50%);
        cursor: pointer;

        &:hover {
            background-color: rgba(#e50012, 0.2);
        }
    }
}

.actions-item-filter-warp {
    position: relative;
    margin-bottom: 24px;
    padding: 2px 0;
    border: 1px dashed #999;
    border-radius: 30px;

    &.filter-border {
        padding: 2px 16px;
        border-radius: 2px;
    }

    .actions-item-filter-overflow {
        display: flex;
        padding-top: 4px;
        overflow-x: auto;
        overflow-y: visible;
        row-gap: 16px;
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

        .terms-params-content {
            position: relative;
            display: flex;
            background-color: #fafafa;
            border: unset;
            row-gap: 16px;

            .terms-params-item {
                display: flex;
                align-items: center;
            }

            .ant-form-item {
                margin-bottom: 8px;
                &:not(:first-child) {
                    .ant-form-item-explain-error {
                        padding-left: 80px !important;
                    }
                }
            }
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