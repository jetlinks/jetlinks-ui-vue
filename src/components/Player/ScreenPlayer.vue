<!-- 分屏组件 -->
<template>
  <div class="live-player-warp">
    <div class="live-player-content">
      <!-- 工具栏 -->
      <div class="player-screen-tool" v-if="showScreen">
        <a-space>
          <a-radio-group
              :value="_screen"
              button-style="solid"
              @change="handleScreenChange"
          >
            <a-radio-button :value="1">{{ $t('Player.ScreenPlayer.521467-0') }}</a-radio-button>
            <a-radio-button :value="4">{{ $t('Player.ScreenPlayer.521467-1') }}</a-radio-button>
            <a-radio-button :disabled="_disabled" :value="9">{{ $t('Player.ScreenPlayer.521467-2') }}</a-radio-button>
            <a-radio-button :value="0">{{ $t('Player.ScreenPlayer.521467-3') }}</a-radio-button>
          </a-radio-group>
          <a-tooltip v-if="_disabled" :title="$t('Player.ScreenPlayer.521467-14')">
            <AIcon type="QuestionCircleFilled"/>
          </a-tooltip>
        </a-space>
        <div class="screen-tool-save">
          <slot name="extra"></slot>
        </div>
      </div>
      <!-- 播放器 -->
      <div class="player-body">
        <div
            ref="fullscreenRef"
            class="player-screen"
            :class="`screen-${_screen}`"
        >
          <template v-for="(item, index) in _players" :key="item.key">
            <div
                class="player-screen-item"
                :style="{ display: index < _screen ? 'block' : 'none' }"
                :class="{
                    active:
                        showScreen &&
                        playerActive === index &&
                        !isFullscreen,
                    'full-screen': isFullscreen,
                }"
            >
              <div class="player-screen-item-header-action">
                <div class="left" v-if="item.voice || item.directions">
                  <div v-if="item.directions">
                    <a-tooltip :title="$t('Player.ScreenPlayer.521467-15')">
                      <AIcon type="AimOutlined"/>
                    </a-tooltip>
                  </div>
                  <div v-if="item.voice">
                    <a-tooltip :title="$t('Player.ScreenPlayer.521467-16')">
                      <AIcon type="AudioFilled"/>
                    </a-tooltip>
                  </div>
                </div>
                <div v-else></div>
                <div class="btn" @click="onClick(index)">
                  <a-tooltip :title="$t('Player.ScreenPlayer.521467-17')">
                    <AIcon type="VideoCameraOutlined"/>
                  </a-tooltip>
                </div>
              </div>
              <LivePlayer :live="true" :url="item.url" autoplay/>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useFullscreen} from '@vueuse/core';
import {useI18n} from 'vue-i18n';
import LivePlayer from "@/components/Player/index.vue";
import {randomString} from "@jetlinks-web/utils";

const {t: $t} = useI18n();
const _disabled = location.protocol !== 'https:';
const props = defineProps({
  showScreen: {
    type: Boolean,
    default: false,
  },
  players: {
    type: Array,
    default: () => []
  },
  screen: {
    type: Number,
    default: 1,
  },
  activeItem: {
    type: Object,
  }
});
const emits = defineEmits(['select', 'update:screen', 'update:activeItem'])
// 分屏数量 1/4/9/0
const _screen = computed(() => props.screen || 1);
// 视频窗口
const _players = ref(new Array(9).fill({
  name: '',
  deviceId: '',
  channelId: '',
  url: '',
  key: randomString(10),
  voice: false,
  directions: false,
  zoom: false
}));
// 当前选中的窗口
const playerActive = ref(0);

// 全屏元素
const fullscreenRef = ref(null);
const {isFullscreen, toggle} = useFullscreen(fullscreenRef);

const screenChange = (index) => {
  _players.value = _players.value.map((m) => ({
    name: '',
    deviceId: '',
    channelId: '',
    url: '',
    key: m?.key,
    voice: false,
    directions: false,
    zoom: false
  }));
  playerActive.value = 0;
  screen.value = index;
  emits('update:screen', index);
};
/**
 * 改变分屏数量
 * @param e
 */
const handleScreenChange = (e) => {
  if (e.target.value) {
    screenChange(e.target.value);
  } else {
    // 全屏操作
    toggle?.();
  }
};

const onClick = (index) => {
  playerActive.value = index;
  emits('select', index)
}

watch(() => props.players, (val) => {
  _players.value = _players.value.map((m, index) => {
    const obj = val[index]?.deviceId
    return obj ? {
      ...m,
      ...val[index]
    } : m
  })
  emits('update:activeItem', _players.value[playerActive.value])
}, {
  deep: true,
  immediate: true,
})

defineExpose({
  players: _players
})
</script>

<style lang="less" scoped>
@import './index.less';

:deep(.live-player-stretch-btn) {
  display: none;
}

:deep(.vjs-icon-spinner) {
  display: none;
}

.refreshBtn {
  opacity: 0;
}

.refreshBtn:hover {
  opacity: 1;
}
</style>
