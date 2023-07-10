<template>
    <div class="child-item">
        <div class="child-item-left">
            <div style="color: #333333">
                {{ data?.name }}
            </div>
            <div class="child-item-left-auth" v-if="data?.description">
                <j-tooltip :title="data.description">
                    <AIcon
                        style="font-size: 16px"
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
                            <j-dropdown placement="top" :trigger="['click']">
                                <div
                                    :class="{
                                        disabled: !notifyChannels?.includes(
                                            slotProps?.id,
                                        ),
                                    }"
                                >
                                    <img
                                        :src="
                                            iconMap.get(
                                                slotProps?.channelProvider,
                                            )
                                        "
                                        style="width: 32px"
                                    />
                                </div>
                                <template #overlay>
                                    <j-menu>
                                        <j-menu-item
                                            v-if="
                                                !notifyChannels?.includes(
                                                    slotProps?.id,
                                                )
                                            "
                                        >
                                            <PermissionButton
                                                type="link"
                                                :hasPermission="true"
                                                @click="
                                                    onCheckChange(slotProps)
                                                "
                                            >
                                                订阅
                                            </PermissionButton>
                                        </j-menu-item>
                                        <template v-else>
                                            <j-menu-item>
                                                <PermissionButton
                                                    type="text"
                                                    :hasPermission="true"
                                                    @click="
                                                        onUnSubscribe(slotProps)
                                                    "
                                                >
                                                    取消订阅
                                                </PermissionButton>
                                            </j-menu-item>
                                            <j-menu-item
                                                v-if="
                                                    slotProps.channelProvider !==
                                                    'inside-mail'
                                                "
                                            >
                                                <PermissionButton
                                                    type="link"
                                                    :hasPermission="true"
                                                    @click="onDetail(slotProps)"
                                                >
                                                    查看详情
                                                </PermissionButton>
                                            </j-menu-item>
                                        </template>
                                    </j-menu>
                                </template>
                            </j-dropdown>
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
    <Detail @unsubscribe="onUnSubscribe" @save="onSave" @close="_visible = false" v-if="_visible" :current="current" :data="props.data" />
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
import MCarousel from '@/components/MCarousel/index.vue';
import Unsubscribe from './Unsubscribe.vue';
import Detail from './Detail.vue';
import {
    getIsBindThird,
    save_api,
} from '@/api/account/notificationSubscription';
import { useUserInfo } from '@/store/userInfo';

const iconMap = new Map();
iconMap.set('notifier-dingTalk', getImage('/notice-rule/dingtalk.png'));
iconMap.set('notifier-weixin', getImage('/notice-rule/wechat.png'));
iconMap.set('notifier-email', getImage('/notice-rule/email.png'));
iconMap.set('notifier-voice', getImage('/notice-rule/voice.png'));
iconMap.set('notifier-sms', getImage('/notice-rule/sms.png'));
iconMap.set('inside-mail', getImage('/notice-rule/inside-mail.png'));

const current = ref<any>({});
const visible = ref<boolean>(false);
const _visible = ref<boolean>(false);

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
        _visible.value = false
    } else {
        onlyMessage('操作失败', 'error');
    }
};

const onUnSubscribe = async (obj: any) => {
    const _set = new Set(props.subscribe?.notifyChannels || []);
    _set.delete(obj?.id);
    const _obj = {
        subscribeName: obj.name,
        topicProvider: props.data?.provider,
        providerId: obj.providerId,
        ...props.subscribe,
        notifyChannels: [..._set.values()],
    };
    const resp = await save_api(_obj);
    if (resp.status === 200) {
        _visible.value = false
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
            const resp: any = await getIsBindThird();
            if (resp.status === 200) {
                const _item = (resp?.result || []).find((item: any) => {
                    return (
                        _data?.channelConfiguration?.notifierId ===
                        item?.provider
                    );
                });
                if (_item) {
                    _bind = true;
                }
            }
        }
    }
    if (_data?.channelProvider === 'inside-mail' || _bind) {
        onSubscribe(_data);
    } else {
        visible.value = true;
        current.value = _data;
    }
};

const onDetail = (dt: any) => {
    current.value = dt;
    _visible.value = true
};

const onSave = (dt: any) => {
    onSubscribe(dt);
}
</script>

<style lang="less" scoped>
.child-item {
    padding: 5px 20px 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 1px 0px 0px #e2e2e2;

    .child-item-left {
        display: flex;
        align-items: center;

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
                width: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;

                img {
                    z-index: 1;
                    cursor: pointer;
                }

                .disabled {
                    filter: grayscale(100%);
                    // filter: brightness(0);
                    // opacity: 50%;
                }
            }

            .box-item-text {
                width: 100%;
                text-align: center;
                color: #666666;
                font-size: 12px;
            }
        }
    }
}
</style>