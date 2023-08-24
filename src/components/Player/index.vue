<!-- 视频播放 -->
<template>
    <LivePlayer
        ref="player"
        fluent
        :protocol="props.protocol || 'mp4'"
        :class="props.className"
        :loading="props.loading"
        :live="'live' in props ? props.live !== false : true"
        :autoplay="'autoplay' in props ? props.autoplay !== false : true"
        :muted="'muted' in props ? props.muted !== false : true"
        :hide-big-play-button="true"
        :poster="props.poster || ''"
        :timeout="props.timeout || 30"
        :video-url="url || ''"
        @play="props.onPlay"
        @pause="props.onPause"
        @ended="props.onEnded"
        @error="props.onError"
        @timeupdate="props.onTimeUpdate"
    />
</template>

<script setup lang="ts">
import LivePlayer from '@liveqing/liveplayer-v3';

type PlayerProps = {
    url?: string;
    live?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    poster?: string;
    timeout?: number;
    className?: string;
    updateTime?: number;
    key?: string | number;
    loading?: boolean;
    protocol?: 'mp4' | 'flv' | 'hls' | 'rtc';
    onDestroy?: (e?: any) => void;
    onMessage?: (msg: any) => void;
    onError?: (err: any) => void;
    onTimeUpdate?: (time: any) => void;
    onPause?: (e?: any) => void;
    onPlay?: (e?: any) => void;
    onFullscreen?: () => void;
    onSnapOutside?: (base64: any) => void;
    onSnapInside?: (base64: any) => void;
    onCustomButtons?: (name: any) => void;
    onEnded?: (e?: any) => void;
    onClick?: () => void;
};

const props = defineProps<PlayerProps>();

const player = ref<HTMLVideoElement>();
const url = ref(props.url);

watchEffect(() => {
    url.value = props.url;
});

/**
 * 播放
 */
const play = () => {
    player.value?.play();
};

/**
 * 暂停
 */
const pause = () => {
    player.value?.pause();
};

/**
 * 暂停状态
 */
const paused = () => {
    return player.value?.paused;
};

defineExpose({
    play,
    pause,
    paused,
});
</script>
<style lang="less" scoped>
:deep(.live-player-stretch-btn){
  display: none;
}
:deep(.vjs-icon-spinner){
  display: none;
}
</style>
