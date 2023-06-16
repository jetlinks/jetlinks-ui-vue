<template>
    <div class="child-item">
        <div class="child-item-left">
            <div style="font-weight: 600">
                {{ data?.name }}
            </div>
            <div class="child-item-left-auth" v-if="data?.description">
                <j-tooltip :title="data.description">
                    <AIcon
                        style="font-size: 20px"
                        type="ExclamationCircleOutlined"
                    />
                </j-tooltip>
            </div>
        </div>
        <div class="child-item-right">
            <MCarousel :data="data?.channels">
                <template #card="slotProps">
                    <div class="box-item">
                        <div class="box-item-img">
                            <j-popover
                                trigger="click"
                                :visible="show?.[slotProps?.id]"
                                @visibleChange="onVisibleChange(slotProps)"
                            >
                                <img
                                    :src="
                                        getImage(
                                            `/notice/${noticeType.get(
                                                slotProps?.channelProvider,
                                            )}.png`,
                                        )
                                    "
                                />
                                <template
                                    #content
                                    v-if="
                                        notifyChannels?.includes(
                                            slotProps?.id,
                                        ) &&
                                        slotProps?.channelProvider !==
                                            'inside-mail'
                                    "
                                >
                                    <div>
                                        <PermissionButton
                                            type="link"
                                            :hasPermission="true"
                                            @click="onUnSubscribe(slotProps)"
                                        >
                                            取消订阅
                                        </PermissionButton>
                                    </div>
                                    <div>
                                        <PermissionButton
                                            type="link"
                                            :hasPermission="true"
                                        >
                                            更换接收账号
                                        </PermissionButton>
                                    </div>
                                </template>
                            </j-popover>
                            <div class="box-item-checked">
                                <j-checkbox
                                    :checked="
                                        notifyChannels?.includes(slotProps?.id)
                                    "
                                ></j-checkbox>
                            </div>
                            <div
                                :class="{
                                    disabled: !notifyChannels?.includes(
                                        slotProps?.id,
                                    ),
                                }"
                            ></div>
                        </div>
                        <div class="box-item-text">
                            {{ slotProps?.name }}
                        </div>
                    </div>
                </template>
            </MCarousel>
        </div>
    </div>
    <Unsubscribe
        @save="onSubscribe"
        v-if="visible"
        :data="props.data"
        :current="current"
        @close="visible = false"
    />
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import MCarousel from '@/components/MCarousel/index.vue';
import Unsubscribe from './Unsubscribe.vue';
import { remove_api, save_api } from '@/api/account/notificationSubscription';
import { useUserInfo } from '@/store/userInfo';

const noticeType = new Map();
noticeType.set('notifier-dingTalk', 'dingtalk');
noticeType.set('notifier-weixin', 'wechat');
noticeType.set('notifier-email', 'email');
noticeType.set('notifier-voice', 'voice');
noticeType.set('notifier-sms', 'sms');
noticeType.set('inside-mail', 'inside-mail');

const current = ref<any>({});
const visible = ref<boolean>(false);
const show = ref<any>()

const user = useUserInfo();

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    subscribe: {
        type: Object,
        default: () => {},
    },
});

const emits = defineEmits(['refresh']);

const notifyChannels = computed(() => {
    return props.subscribe?.notifyChannels || [];
});

const onSubscribe = async (obj: any) => {
    const _obj = {
        subscribeName: obj.name,
        topicProvider: props.data?.provider,
        providerId: obj.providerId,
        ...props.subscribe,
        notifyChannels: [...(props.subscribe?.notifyChannels || []), obj?.id],
    };
    const resp = await save_api(_obj);
    if (resp.status === 200) {
        onlyMessage('操作成功');
        emits('refresh');
    } else {
        onlyMessage('操作失败', 'error');
    }
};

const onUnSubscribe = async (obj: any) => {
    // const resp = await remove_api(id);
    // if (resp.status === 200) {
    //     onlyMessage('操作成功');
    //     emits('refresh');
    // }
    const _set = new Set(props.subscribe?.notifyChannels || [])
    _set.delete(obj?.id)
    const _obj = {
        subscribeName: obj.name,
        topicProvider: props.data?.provider,
        providerId: obj.providerId,
        ...props.subscribe,
        notifyChannels: [..._set.values()],
    };
    const resp = await save_api(_obj);
    if (resp.status === 200) {
        onlyMessage('操作成功');
        emits('refresh');
    } else {
        onlyMessage('操作失败', 'error');
    }
};

const onCheckChange = async (_data: any) => {
    let _bind: boolean = false;
    if (_data?.channelProvider !== 'inside-mail') {
        // 判断是否绑定
        if (
            ['notifier-voice', 'notifier-sms'].includes(_data?.channelProvider)
        ) {
            if (user.userInfos?.telephone) {
                _bind = true;
            }
        } else if (_data?.channelProvider === 'notifier-email') {
            if (user.userInfos?.email) {
                _bind = true;
            }
        } else {
            // 钉钉和微信
        }
    }
    if (_data?.channelProvider === 'inside-mail' || _bind) {
        onSubscribe(_data);
    } else {
        visible.value = true;
        current.value = _data;
    }
};

const onVisibleChange = (_data: any) => {
    show.value = {}
    if (notifyChannels.value?.includes(_data?.id)) {
        if (_data?.channelProvider === 'inside-mail') {
            onUnSubscribe(_data);
        } else {
            show.value[_data.id] = true
        }
    } else {
        onCheckChange(_data)
    }
};
</script>

<style lang="less" scoped>
.child-item {
    padding: 10px 20px;
    margin: 5px;
    background: #f7f7f7;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .child-item-left {
        display: flex;
        align-items: center;
        height: 80px;

        div {
            display: flex;
            margin-right: 30px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .child-item-left-auth {
            cursor: pointer;
        }
    }

    .child-item-right {
        display: flex;

        .box-item {
            margin-left: 10px;
            .box-item-img {
                width: 48px;
                height: 48px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;

                img {
                    width: 100%;
                    z-index: 1;
                }

                .box-item-checked {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    z-index: 3;
                }

                .disabled {
                    background-color: rgba(#000, 0.38);
                    position: absolute;
                    width: 48px;
                    height: 48px;
                    z-index: 2;
                    top: 0;
                    left: 0;
                }
            }

            .box-item-text {
                width: 100%;
                text-align: center;
                height: 20px;
            }
        }
    }
}
</style>