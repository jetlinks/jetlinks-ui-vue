<!-- 视频设备 - 播放 -->
<template>
    <j-modal
        v-model:visible="_vis"
        title="播放"
        :width="type === 'share'? '100%' : _type ? 1200 : 900"
        :class="{share: type === 'share'}"
        :maskClosable="false"
        @ok="_vis = false"
        :destroyOnClose="true"
    >
        <template #closeIcon>
          <j-button :disabled="type === 'share'" type="text"><AIcon type="CloseOutlined" /></j-button>
        </template>
        <div class="media-live-tool">
            <j-radio-group
                v-model:value="mediaType"
                button-style="solid"
                @change="mediaStart"
            >
                <j-radio-button value="mp4">MP4</j-radio-button>
                <j-radio-button value="flv">FLV</j-radio-button>
                <j-radio-button value="m3u8">HLS</j-radio-button>
                <!-- <j-radio-button value='rtc'>RTC</j-radio-button> -->
            </j-radio-group>
            <div class="media-live-share" v-if="type !== 'share'">
                <j-button type="link" @click="onShare"
                    ><AIcon type="ShareAltOutlined" />分享视频</j-button
                >
            </div>
        </div>
        <div class="media-live" @mouseenter="visibleChange"  @mouseleave="mouseleave">
            <div class="media-live-video">
                <div
                    :class="mediaToolClass"
                    @mouseenter="showTool = true"
                >
                    <div class="tool-item" v-if="type !== 'share'">
                        <template v-if="isRecord === 0">
                            <j-dropdown
                                trigger="click"
                                @click="showToolLock = true"
                            >
                                <div>开始录像</div>
                                <template #overlay>
                                    <j-menu @click="recordStart">
                                        <j-menu-item
                                            key="true"
                                            v-if="_type"
                                        >
                                            <span style="padding-right: 12px"
                                                >本地存储</span
                                            >
                                            <j-tooltip title="存储在设备本地">
                                                <a-icon
                                                    type="QuestionCircleOutlined"
                                                />
                                            </j-tooltip>
                                        </j-menu-item>
                                        <j-menu-item key="false">
                                            <span style="padding-right: 12px"
                                                >云端存储</span
                                            >
                                            <j-tooltip title="存储在服务器中">
                                                <a-icon
                                                    type="QuestionCircleOutlined"
                                                />
                                            </j-tooltip>
                                        </j-menu-item>
                                    </j-menu>
                                </template>
                            </j-dropdown>
                        </template>
                        <div v-else-if="isRecord === 1">请求录像中</div>
                        <div
                            v-else-if="isRecord === 2"
                            @click.stop="recordStop"
                        >
                            停止录像
                        </div>
                    </div>

                    <div class="tool-item" @click.stop="handleRefresh">
                        刷新
                    </div>
                    <div class="tool-item">
                        <j-popconfirm
                            title="重置将断开直播, 可能会影响其他播放者"
                            @confirm="handleReset"
                        >
                            重置
                        </j-popconfirm>
                    </div>
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
                                <div>转速控制</div>
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
                <Preset  v-if='data.ptzType.value ===0 || data.ptzType.value === 1' :data="data" @refresh="onRefresh" />
            </div>
        </div>
        <template #footer>
          <j-space v-if="type !== 'share'">
            <j-button  @click="_vis = false">取消</j-button>
            <j-button  @click="_vis = false" type="primary">确定</j-button>
          </j-space>
        </template>
    </j-modal>
    <Share v-if="visible" :data="data" @close="visible = false" />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';
import channelApi from '@/api/media/channel';
import Share from './Share.vue';
import Preset from './Preset.vue';

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
  return route.query.type !== 'fixed-media'
})

const speedList = [
    { label: '高', value: 180 },
    { label: '中', value: 90 },
    { label: '低', value: 45 },
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

const visibleChange = () => {
    showTool.value = true;
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
const handleReset = async () => {
    channelApi.mediaStop(props.data.deviceId, props.data.channelId);
};

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type: string) => {
    channelApi.ptzTool(props.data.deviceId, props.data.channelId, type, speed.value);
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
    emit('refresh')
}

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
      immediate: true
    }
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
</style>
