<template>
    <j-modal width="900px" visible @cancel="emit('close')">
        <template v-if="getType === 'notifier-dingTalk'">
            <!-- <div class="tip">请先绑定钉钉账号</div> -->
            <j-spin :spinning="loading">
                <div class="code" style="height: 600px;">
                    <iframe
                        id="notifier_iframe"
                        class="code-item"
                        width="100%"
                        height="100%"
                        :src="url"
                        v-if="!loading"
                    ></iframe>
                </div>
            </j-spin>
        </template>
        <template v-else-if="getType === 'notifier-weixin'">
            <!-- <div class="tip">请先绑定企业微信账号</div> -->
            <j-spin :spinning="loading">
                <div class="code" style="height: 450px">
                    <iframe
                        id="notifier_iframe"
                        class="code-item"
                        width="100%"
                        height="100%"
                        :src="url"
                        v-if="!loading"
                    ></iframe>
                </div>
            </j-spin>
        </template>
        <template v-else-if="getType === 'notifier-email'">
            <div class="tip">请先绑定邮箱</div>
        </template>
        <template v-else>
            <div class="tip">请先绑定手机号</div>
        </template>
        <template #footer>
            <j-button @click="emit('close')">取消</j-button>
            <j-button
                @click="onBind"
                type="primary"
                v-if="
                    [
                        'notifier-email',
                        'notifier-voice',
                        'notifier-sms',
                    ].includes(getType)
                "
                >立即绑定</j-button
            >
            <j-button v-else @click="emit('close')">确定</j-button>
        </template>
        <EditInfo
            v-if="editInfoVisible"
            :data="user.userInfos"
            @close="editInfoVisible = false"
            @save="onSave"
        />
    </j-modal>
</template>

<script lang="ts" setup>
import {
    bindThirdParty,
    getDingTalkOAuth2,
    getUserBind,
    getWechatOAuth2,
} from '@/api/account/notificationSubscription';
import { useUserInfo } from '@/store/userInfo';
import EditInfo from '../../EditInfo/index.vue';

const user = useUserInfo();
const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        // 外层数据
        type: Object,
        default: () => {},
    },
    current: {
        // 当前的通道
        type: Object,
        default: () => {},
    },
});

const editInfoVisible = ref<boolean>(false);
const url = ref<string>('');
const loading = ref<boolean>(false);

const getType = computed(() => {
    return props.current?.channelProvider;
});

const onBind = () => {
    editInfoVisible.value = true;
};

const onSave = () => {
    editInfoVisible.value = false;
    user.getUserInfo();
    emit('save', props.current);
    emit('close');
};

const onBindHandle = (
    type: 'notifier-weixin' | 'notifier-dingTalk',
    code: string,
) => {
    getUserBind(type === 'notifier-dingTalk' ? 'dingtalk' : 'wechat', {
        authCode: code,
        configId: props.current?.channelConfiguration.notifierId,
    })
        .then((resp) => {
            if (resp.status === 200) {
                const _bindCode = (resp?.result || '') as string;
                if (_bindCode) {
                    bindThirdParty(
                        type,
                        props.current?.channelConfiguration.notifierId,
                        _bindCode,
                    )
                        .then((response) => {
                            if (response.status === 200) {
                                // 订阅
                                emit('save', props.current);
                                emit('close');
                            }
                        })
                        .finally(() => {
                            loading.value = false;
                        });
                }
            }
        })
        .catch(() => {
            loading.value = false;
        });
};

const updateIframeStyle = () => {
    const iframe = document.querySelector(
        '#notifier_iframe',
    ) as HTMLIFrameElement;
    iframe.onload = () => {
        const currentUrl = iframe?.contentWindow?.location?.search || '';
        console.log(currentUrl)
        let authCode = '';
        if (currentUrl.startsWith('?')) {
            currentUrl
                .substring(1)
                .split('&')
                .map((item) => {
                    if (
                        props.current?.channelProvider === 'notifier-dingTalk'
                    ) {
                        if (item.split('=')?.[0] === 'authCode') {
                            authCode = item.split('=')?.[1] || '';
                        }
                    } else {
                        if (item.split('=')?.[0] === 'code') {
                            authCode = item.split('=')?.[1] || '';
                        }
                    }
                });
        }

        if (authCode) {
            loading.value = true;
            onBindHandle(props.current?.channelProvider, authCode);
        }
    };
};

const handleSearch = async () => {
    if (props.current?.channelProvider === 'notifier-weixin') {
        loading.value = true;
        const resp = await getWechatOAuth2(
            props.current?.channelConfiguration.notifierId,
            props.current?.channelConfiguration.templateId,
            location.href
        ).finally(() => {
            loading.value = false;
        });
        if (resp.status === 200) {
            url.value = resp.result as string;
            nextTick(() => {
                updateIframeStyle();
            });
        }
    }
    if (props.current?.channelProvider === 'notifier-dingTalk') {
        loading.value = true;
        const resp = await getDingTalkOAuth2(
            props.current?.channelConfiguration.notifierId,
            location.href,
        ).finally(() => {
            loading.value = false;
        });
        if (resp.status === 200) {
            url.value = resp.result as string;
            nextTick(() => {
                updateIframeStyle();
            });
        }
    }
};

watch(
    () => props.current,
    () => {
        handleSearch();
    },
    {
        immediate: true,
        deep: true,
    },
);
</script>

<style lang="less" scoped>
.tip {
    width: 100%;
    margin: 80px 0;
    text-align: center;
    font-size: 14px;
    color: #7f7f7f;
}

.code {
    width: 100%;
    display: flex;
    margin-top: 30px;
    justify-content: center;

    .code-item {
        border: none;
    }
}
</style>