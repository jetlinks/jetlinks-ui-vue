<!-- 视频设备 - 播放 -->
<template>
    <j-modal
        v-model:visible="_vis"
        title="播放"
        :width="type === 'share' ? '100%' : _type ? 1200 : 900"
        :class="{ share: type === 'share' }"
        :maskClosable="false"
        @ok="_vis = false"
        :destroyOnClose="true"
    >
        <template #closeIcon>
            <j-button :disabled="type === 'share'" type="text"
                ><AIcon type="CloseOutlined"
            /></j-button>
        </template>

        <div class="media-live">
            <div
                class="media-live-video"
                @mouseenter="visibleChange"
                @mouseleave="mouseleave"
            >
                <div :class="mediaToolClass" @mouseenter="showTool = true">
                    <div
                        class="tool-item"
                        v-if="type !== 'share' && showRecord"
                    >
                        <template v-if="isRecord === 0">
                            <j-dropdown
                                trigger="click"
                                @click="showToolLock = true"
                            >
                                <div>开始录像</div>
                                <template #overlay>
                                    <j-menu @click="recordStart">
                                        <j-menu-item key="true" v-if="_type && route.query.type !== 'onvif'">
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
                    <ConfirmModal title="重置将断开直播, 可能会影响其他播放者" :onConfirm="handleReset">
                        <div class="tool-item">
                            重置
                        </div></ConfirmModal
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
            <div class="media-live-actions" v-if="_type && showActions">
              <div class="title">
                预置点位
              </div>
              <div class="media-preset">
                <Preset
                  v-if="(data.ptzType.value === 0 || data.ptzType.value === 1) && route.query.type !== 'onvif'"
                  :data="data"
                  @refresh="onRefresh"
                />
              </div>
              <div class="title">
                视频格式
              </div>
              <div class="media-live-tool">
<!--                <j-radio-group-->
<!--                  v-model:value="mediaType"-->
<!--                  button-style="solid"-->
<!--                  @change="mediaStart"-->
<!--                >-->
<!--                  <j-radio-button value="mp4">MP4</j-radio-button>-->
<!--                  <j-radio-button value="flv">FLV</j-radio-button>-->
<!--                  <j-radio-button value="m3u8">HLS</j-radio-button>-->
<!--                  &lt;!&ndash; <j-radio-button value='rtc'>RTC</j-radio-button> &ndash;&gt;-->
<!--                </j-radio-group>-->
                <RadioButton
                  v-model:value="mediaType"
                  :options="[
                    { label: 'MP4', value: 'mp4'},
                    { label: 'FLV', value: 'flv'},
                    { label: 'HLS', value: 'm3u8'},
                  ]"
                  @select="mediaStart"
                />

              </div>
              <div class="title">
                转速控制
              </div>
              <div class="media-live-tool">
                <RadioButton
                  v-model:value="speed"
                  :options="speedList"
                  @select="onMenuChange"
                />
              </div>
                <div class="actions-tool">
                    <MediaTool
                        @onMouseDown="handleMouseDown"
                        @onMouseUp="handleMouseUp"
                    >
                        <template #center>
                            <div
                              :class="{ 'center': true, 'center-active': showAudio}"
                              @click="openWebrtc"
                            >
                              <div class="center-volume" :style="{ height: `${volume}%`}"> </div>
                              <AIcon :type=" showAudio ? 'AudioOutlined' : 'AudioMutedOutlined' "/>
<!--                                <div>转速控制</div>-->
<!--                                <j-dropdown>-->
<!--                                    <span-->
<!--                                        >{{ _speed }}<AIcon type="DownOutlined"-->
<!--                                    /></span>-->
<!--                                    <template #overlay>-->
<!--                                        <j-menu @click="onMenuChange">-->
<!--                                            <j-menu-item-->
<!--                                                :key="item.value"-->
<!--                                                v-for="item in speedList"-->
<!--                                            >-->
<!--                                                {{ item.label }}-->
<!--                                            </j-menu-item>-->
<!--                                        </j-menu>-->
<!--                                    </template>-->
<!--                                </j-dropdown>-->
                            </div>
                        </template>
                    </MediaTool>
                </div>

            </div>
        </div>
        <template #footer>
            <j-space v-if="type !== 'share'">
                <j-button @click="_vis = false">取消</j-button>
                <j-button @click="_vis = false" type="primary">确定</j-button>
            </j-space>
        </template>
    </j-modal>
    <Share v-if="visible" :data="data" @close="visible = false" />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';
import RadioButton from '@/components/CardSelect/RadioButton.vue'
import channelApi from '@/api/media/channel';
import Share from './Share.vue';
import Preset from './Preset.vue';
import { useSystem } from '@/store/system';
import { mediaConfigMap } from '../data';
import { onlyMessage } from '@/utils/comm';
import {closeAudio, openAudio} from "@/views/media/Device/Channel/Live/audio";

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
const system = useSystem();
const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

// 播放器
const player = ref();
// 视频地址
const url = ref('');
const showAudio = ref(false);
// 视频类型
const mediaType = ref<'mp4' | 'flv' | 'hls' | 'rtc'>('mp4');
const showTool = ref(false);
const showToolLock = ref(false);

const visible = ref(false);
const volume = ref(0)

const _type = computed(() => {
    return route.query.type !== 'fixed-media';
});

const showRecord = computed(() => {
    const key = mediaConfigMap.get(route.query.type + '-record');
    return system.configInfo?.media?.[key] != 'false';
});

const showActions = computed(() => {
    const key = mediaConfigMap.get(route.query.type + '-ptz');

    const status = system.configInfo?.media?.[key] != 'false';

    return status
});

const speedList = [
    { label: '高', value: 180 },
    { label: '中', value: 90 },
    { label: '低', value: 45 },
];
const speed = ref(90);
const local = ref();
const _speed = computed(() => {
    return speedList.find((item) => item.value === speed.value)?.label;
});

const openWebrtc = () => {
  if (showAudio.value === false) {
    openAudio(
      props.data.deviceId,
      props.data.channelId,
      {
        volume(v) {
          volume.value = v
        }
      }
    )
    showAudio.value = true
  } else {
    closeAudio(
      props.data.deviceId,
      props.data.channelId,
    )
    volume.value = 0
    showAudio.value = false
  }
}

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
    local.value = key === 'true';
    const res = await channelApi
        .recordStart(props.data.deviceId, props.data.channelId, {
            local: local.value,
        })
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
        { local: local.value },
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
    const resp = channelApi.mediaStop(props.data.deviceId, props.data.channelId);
    resp.then((res)=>{
        if(res.success){
            onlyMessage('操作成功！')
        }
    })
    return resp
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

const voiceMouseDown = () => {

}

const voiceMouseUp = () => {

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
    align-items: center;
    justify-content: center;
    font-size: 32px;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    transition: background .15s;
    position: relative;
    overflow: hidden;

    &.center-active {
      color: @primary-color;
    }

  .center-volume {
    height: 100%;
    width: 100%;
    bottom: 0;
    position: absolute;
    background-color: rgba(24, 144, 255, 0.2);
  }
}

.media-live-actions {
  .title {
    margin-bottom: 4px;
  }
}

.media-preset {
  margin-bottom: 12px;
}

.media-live-tool {
  justify-content: center;

  :deep(.radio-button) {
    width: 100%;
  }
}
</style>
