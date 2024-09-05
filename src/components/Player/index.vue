<!-- 视频播放 -->
<template>
  <div class="media-player-container" >
    <div ref="playerElement">
      <span v-if="!props.url">
        No Video
      </span>
    </div>

  </div>
</template>

<script setup lang="ts" name="LivePlayer">
import Player, { Events } from 'xgplayer'
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
      hasStart: false,
      playbackRate: false,
      ignores: ['progress', 'volume', 'time', 'replay'],
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
      props.onPlay?.()
    })
    player.on(Events.PAUSE, (ev) => {
      console.log('-播放暂停-', ev);
      props.onPause?.()
    })
    player.on(Events.ENDED, (ev) => {
      console.log('-播放结束-', ev);
      props.onEnded?.()
    })
    player.on(Events.TIME_UPDATE, (ev) => {
      props.onTimeUpdate?.(ev)
    })
    player.on(Events.CANPLAY, (ev) => {
      console.log('-媒体数据加载好了-', ev);
      if (props.autoplay !== false) {
        play()
      }
    })
    player.on(Events.SEEKED, (ev) => {
      console.log('-跳着播放-', ev);
      if (props.live) {
        init()
      }
    })
    player.on(Events.ERROR, (ev) => {
      console.log('-播放错误-', ev);
      if (props.live) {
        setTimeout(() => {
          init()
        }, 5000)
      }
      props.onError?.(ev)
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
