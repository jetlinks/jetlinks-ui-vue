<!-- 视频播放 -->
<template>
<!--    <LivePlayer-->
<!--        ref="player"-->
<!--        fluent-->
<!--        :protocol="props.protocol || 'mp4'"-->
<!--        :class="props.className"-->
<!--        :loading="props.loading"-->
<!--        :live="'live' in props ? props.live !== false : true"-->
<!--        :autoplay="'autoplay' in props ? props.autoplay !== false : true"-->
<!--        :muted="'muted' in props ? props.muted !== false : true"-->
<!--        :hide-big-play-button="true"-->
<!--        :poster="props.poster || ''"-->
<!--        :timeout="props.timeout || 30"-->
<!--        :video-url="url || ''"-->
<!--        @play="props.onPlay"-->
<!--        @pause="props.onPause"-->
<!--        @ended="props.onEnded"-->
<!--        @error="props.onError"-->
<!--        @timeupdate="props.onTimeUpdate"-->
<!--    />-->
  <div class="media-player-container" >
    <div ref="playerElement">
      <span v-if="!props.url">
        No Video
      </span>
    </div>

  </div>
</template>

<script setup lang="ts" name="LivePlayer">
import Player, { Events, Sniffer } from 'xgplayer'
import { settingEnum } from './utils'

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
    protocol?: 'mp4' | 'flv' | 'm3u8' | 'rtc';
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

const playerElement = ref<HTMLVideoElement>();
let player: any = null

/**
 * 播放
 */
const play = () => {
    player?.play();
};

/**
 * 暂停
 */
const pause = () => {
    player?.pause();
};

/**
 * 暂停状态
 */
const paused = () => {
    return player?.paused;
};

const destroy = () => {
  if (player) {
    player.destroy()
    player = null
  }
}

const init = () => {

  destroy()
  setTimeout(() => {

    console.log(props.protocol)

    player = new Player({
      el: playerElement.value,
      // autoplay: props.autoplay ?? true,
      url: props.url,
      isLive: props.live,
      width: '100%',
      height: '100%',
      playbackRate: false,
      ignores: ['progress', 'volume', 'currentTime'],
      closeVideoClick: true,
      closeVideoDblclick: true,
      closeVideoTouch: true,
      closePlayerBlur: true,
      closeControlsBlur: true,
      closeFocusVideoFocus: true,
      closePlayVideoFocus: true,
      ...settingEnum[props.protocol || 'mp4']
    })

    player.on(Events.PLAY, (ev) => {
      console.log('-播放开始-', ev);
    })
    player.on(Events.PAUSE, (ev) => {
      console.log('-播放结束-', ev);
      player.play(props.url)
    })
    player.on('loadedmetadata', (ev) => {
      console.log('-媒体数据加载好了-', ev);
      if ( props.autoplay) {
        play()
      }
    })
    player.on(Events.SEEKED, (ev) => {
      console.log('-跳着播放-', ev);
    })
  }, 30)
}

watch(() => props.url, () => {
  if (props.url) {
    nextTick(() => {
      init()
    })
  }
}, { immediate: true })

onBeforeUnmount(() => {
  destroy()
})

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
.media-player-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
