<template>
    <div style="width: 95%; margin: 0 auto">
        <div class="media-live-tool">
            <j-radio-group
                v-model:value="mediaType"
                button-style="solid"
                @change="mediaStart"
            >
                <j-radio-button value="mp4">MP4</j-radio-button>
                <j-radio-button value="flv">FLV</j-radio-button>
                <j-radio-button value="m3u8">HLS</j-radio-button>
            </j-radio-group>
            <div class="media-live-share" v-if="type !== 'share'">
                <j-button type="link" @click="onShare">
                    <AIcon type="ShareAltOutlined" />
                    {{ $t('Live.shareLive.1174519-0') }}
                </j-button>
            </div>
        </div>
        <div class="media-live">
            <div class="media-live-video">
                <div
                    :class="mediaToolClass"
                    @mouseleave="mouseleave"
                    @mouseenter="showTool = true"
                >
                    <div class="tool-item" v-if="type !== 'share'">
                        <template v-if="isRecord === 0">
                            <j-dropdown
                                trigger="click"
                                @visibleChange="visibleChange"
                                @click="showToolLock = true"
                            >
                                <div>{{ $t('Live.shareLive.1174519-1') }}</div>
                                <template #overlay>
                                    <j-menu @click="recordStart">
                                        <j-menu-item key="true" v-if="_type">
                                            <span style="padding-right: 12px"
                                                >{{ $t('Live.shareLive.1174519-2') }}</span
                                            >
                                            <j-tooltip :title="$t('Live.shareLive.1174519-3')">
                                                <a-icon
                                                    type="QuestionCircleOutlined"
                                                />
                                            </j-tooltip>
                                        </j-menu-item>
                                        <j-menu-item key="false">
                                            <span style="padding-right: 12px"
                                                >{{ $t('Live.shareLive.1174519-4') }}</span
                                            >
                                            <j-tooltip :title="$t('Live.shareLive.1174519-5')">
                                                <a-icon
                                                    type="QuestionCircleOutlined"
                                                />
                                            </j-tooltip>
                                        </j-menu-item>
                                    </j-menu>
                                </template>
                            </j-dropdown>
                        </template>
                        <div v-else-if="isRecord === 1">{{ $t('Live.shareLive.1174519-6') }}</div>
                        <div
                            v-else-if="isRecord === 2"
                            @click.stop="recordStop"
                        >
                            {{ $t('Live.shareLive.1174519-7') }}
                        </div>
                    </div>

                    <div class="tool-item" @click.stop="handleRefresh">
                        {{ $t('Live.shareLive.1174519-8') }}
                    </div>
                    <ConfirmModal
                        :title="$t('Live.shareLive.1174519-9')"
                        :onConfirm="handleReset"
                    >
                        <div class="tool-item">{{ $t('Live.shareLive.1174519-10') }}</div></ConfirmModal
                    >
                </div>
                <LivePlayer
                    ref="player"
                    :live="true"
                    :url="url"
                    :protocol="mediaType"
                    autoplay
                />
            </div>
            <div class="media-live-actions" v-if="_type">
                <div class="actions-tool">
                    <MediaTool
                        @onMouseDown="handleMouseDown"
                        @onMouseUp="handleMouseUp"
                    >
                        <template #center>
                            <div class="center">
                                <div>{{ $t('Live.shareLive.1174519-11') }}</div>
                                <j-dropdown>
                                    <span
                                        >{{ _speed }}<AIcon type="DownOutlined"
                                    /></span>
                                    <template #overlay>
                                        <j-menu @click="onMenuChange">
                                            <j-menu-item
                                                :key="item.value"
                                                v-for="item in speedList"
                                            >
                                                {{ item.label }}
                                            </j-menu-item>
                                        </j-menu>
                                    </template>
                                </j-dropdown>
                            </div>
                        </template>
                    </MediaTool>
                </div>
                <div class="media-preset">
                    <Preset :data="data" @refresh="onRefresh" :share="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';
import channelApi from '@/api/media/channel';
import Preset from './Preset.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'refresh'): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
    type: {
        type: String as PropType<'share' | 'normal'>,
        default: 'normal',
    },
    readOnly: {
        type: Boolean,
        default: false,
    },
});

const route = useRoute();

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

// 播放器
const player = ref();
// 视频地址
const url = ref('');
// 视频类型
const mediaType = ref<'mp4' | 'flv' | 'hls' | 'rtc'>('mp4');
const showTool = ref(false);
const showToolLock = ref(false);

const visible = ref(false);

const _type = computed(() => {
    return route.query.type !== 'fixed-media';
});

const speedList = [
    { label: $t('Live.shareLive.1174519-12'), value: 180 },
    { label: $t('Live.shareLive.1174519-13'), value: 90 },
    { label: $t('Live.shareLive.1174519-14'), value: 45 },
];
const speed = ref(90);

const _speed = computed(() => {
    return speedList.find((item) => item.value === speed.value)?.label;
});

const onMenuChange = (val: any) => {
    speed.value = val.key;
};

const mouseleave = () => {
    if (!showToolLock.value) {
        showTool.value = false;
    }
};

const visibleChange = (v: boolean) => {
    showTool.value = v;
};

const getPopupContainer = (trigger: HTMLElement) => {
    return trigger?.parentNode || document.body;
};

const mediaToolClass = computed(() => {
    return {
        'media-tool': true,
        'media-tool-show': showTool.value,
    };
});

/**
 * 媒体开始播放
 */
const mediaStart = () => {
    url.value = channelApi.ptzStart(
        props.data.deviceId,
        props.data.channelId,
        mediaType.value,
    );
};

// 录像状态
const isRecord = ref(0); // 0：停止录像； 1：请求录像中； 2：开始录像
/**
 * 查询录像状态
 */
const getIsRecord = async () => {
    const { result } = await channelApi.ptzIsRecord(
        props.data.deviceId,
        props.data.channelId,
    );
    isRecord.value = result ? 2 : 0;
};

/**
 * 开始录像
 */
const recordStart = async ({ key }: { key: string }) => {
    showToolLock.value = false;
    showTool.value = false;
    isRecord.value = 1;
    const local = key === 'true';
    const res = await channelApi
        .recordStart(props.data.deviceId, props.data.channelId, { local })
        .catch(() => ({ success: false }));
    if (res.success) {
        isRecord.value = 2;
    } else {
        isRecord.value = 0;
    }
};

/**
 * 停止录像
 */
const recordStop = async () => {
    const res = await channelApi.recordStop(
        props.data.deviceId,
        props.data.channelId,
    );
    if (res.success) {
        isRecord.value = 0;
    }
};

/**
 * 刷新
 */
const handleRefresh = () => {
    // player.value.play();
    url.value = '';
    setTimeout(() => {
        mediaStart();
    }, 500);
};

/**
 * 重置
 */
const handleReset =  () => {
    const response = channelApi.mediaStop(props.data.deviceId, props.data.channelId);
    response.then((res)=>{
      onlyMessage($t('Live.shareLive.1174519-15'))
    })
    return response
};

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type: string) => {
    channelApi.ptzTool(
        props.data.deviceId,
        props.data.channelId,
        type,
        speed.value,
    );
};
const handleMouseUp = () => {
    channelApi.ptzStop(props.data.deviceId, props.data.channelId);
};

/**
 * 分享视频
 */
const onShare = () => {
    visible.value = true;
};

const onRefresh = () => {
    emit('refresh');
};

watch(
    () => _vis.value,
    (val: boolean) => {
        if (val) {
            mediaStart();
            getIsRecord();
        } else {
            // url置空, 即销毁播放器
            url.value = '';
        }
    },
    {
        immediate: true,
    },
);
</script>
<style lang="less" scoped>
@import './index.less';

:deep(.live-player-stretch-btn) {
    display: none;
}

:deep(.vjs-icon-spinner) {
    display: none;
}

.center {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.media-preset {
    :deep(.ant-table-header) {
        user-select: none;
    }
}
</style>
