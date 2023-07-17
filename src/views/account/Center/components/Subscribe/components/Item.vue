<template>
    <div class="child-item">
        <div class="child-item-left">
            <div style="color: #333333">
                {{ data?.name }}
            </div>
            <div class="child-item-left-auth" v-if="data?.description">
                <j-tooltip :title="data.description">
                    <AIcon
                        style="font-size: 16px; color: rgba(0, 0, 0, 0.3)"
                        type="ExclamationCircleOutlined"
                    />
                </j-tooltip>
            </div>
        </div>
        <div class="child-item-right">
            <MCarousel :data="data?.channels">
                <template #card="slotProps">
                    <Card @save="onCheckChange" @unsubscribe="onUnSubscribe" :notifyChannels="notifyChannels" :data="props.data" :current="slotProps" />
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
import { onlyMessage } from '@/utils/comm';
import MCarousel from '@/components/MCarousel/index.vue';
import Unsubscribe from './Unsubscribe.vue';
import Card from './Card.vue';
import {
    getIsBindThird,
    save_api,
} from '@/api/account/notificationSubscription';
import { useUserInfo } from '@/store/userInfo';

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
        _visible.value = false;
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
        _visible.value = false;
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

const onSave = (dt: any) => {
    onSubscribe(dt);
};
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
            margin-right: 8px;
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
    }
}
</style>