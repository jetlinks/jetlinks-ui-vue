<template>
    <j-modal :width="'900px'" visible @cancel="emit('close')">
        <template v-if="getType === 'notifier-dingTalk'">
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
                    <!-- sandbox="allow-forms allow-scripts allow-same-origin allow-popups" -->
                </div>
            </j-spin>
        </template>
        <template #footer>
            <j-button @click="emit('close')">关闭</j-button>
            <!-- <j-button type="primary" @click="emit('close')">确定</j-button> -->
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import {
    bindThirdParty,
    getDingTalkOAuth2,
    getUserBind,
    getWechatOAuth2,
} from '@/api/account/notificationSubscription';

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

const url = ref<string>('');
const loading = ref<boolean>(false);

const getType = computed(() => {
    return props.current?.channelProvider;
});

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