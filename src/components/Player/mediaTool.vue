<!-- 视频播放工具栏 -->
<template>
  <div class="live-player-tools" >
    <div class="direction">
      <div
          class="direction-item up"
          @mousedown="onMouseDown('UP')"
          @mouseup="onMouseUp('UP')"
          :class="{'disabled': !directions}"
      >
        <a-tooltip :title="!directions ? $t('Player.MediaTool.563480-1') : ''">
          <div class="direction-icon">
            <AIcon type="CaretUpOutlined" class="icon"/>
          </div>
        </a-tooltip>
      </div>
      <div
          class="direction-item right"
          @mousedown="onMouseDown('RIGHT')"
          @mouseup="onMouseUp('RIGHT')"
          :class="{'disabled': !directions}"
      >
        <a-tooltip :title="!directions ? $t('Player.MediaTool.563480-1')  : ''">
          <div class="direction-icon">
            <AIcon type="CaretRightOutlined" class="icon"/>
          </div>
        </a-tooltip>
      </div>
      <div
          class="direction-item left"
          @mousedown="onMouseDown('LEFT')"
          @mouseup="onMouseUp('LEFT')"
          :class="{'disabled': !directions}"
      >
        <a-tooltip :title="!directions ? $t('Player.MediaTool.563480-1')  : ''">
          <div class="direction-icon">
            <AIcon type="CaretLeftOutlined" class="icon"/>
          </div>
        </a-tooltip>
      </div>
      <div
          class="direction-item down"
          @mousedown="onMouseDown('DOWN')"
          @mouseup="onMouseUp('DOWN')"
          :class="{'disabled': !directions}"
      >
        <a-tooltip :title="!directions ? $t('Player.MediaTool.563480-1')  : ''">
          <div class="direction-icon">
            <AIcon type="CaretDownOutlined" class="icon"/>
          </div>
        </a-tooltip>
      </div>
      <div class="direction-audio" :class="{'disabled': !voice}">
        <slot name="center">
          <a-tooltip :title="!voice ? $t('Player.MediaTool.563480-2')  : ''">
            <div class="direction-audio-outside">
              <div
                  class="direction-audio-inside"
                  @click="onVoiceClick"
              >
                <AIcon type="AudioFilled" class="icon"/>
              </div>
            </div>
          </a-tooltip>
        </slot>
      </div>
    </div>
    <div class="zoom" :class="{'disabled': !zoom}">
      <a-tooltip :title="!zoom ? $t('Player.MediaTool.563480-3')  : ''">
        <div
            class="zoom-item zoom-in"
            @mousedown="onMouseDown('ZOOM_IN')"
            @mouseup="onMouseUp('ZOOM_IN')"
        >
          <AIcon type="PlusOutlined" class="icon"/>
        </div>
      </a-tooltip>
      <a-tooltip :title="!zoom ? $t('Player.MediaTool.563480-3')  : ''">
        <div
            class="zoom-item zoom-out"
            @mousedown="onMouseDown('ZOOM_OUT')"
            @mouseup="onMouseUp('ZOOM_OUT')"
        >
          <AIcon type="MinusOutlined" class="icon"/>
        </div>
      </a-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";

const props = defineProps({
  directions: {
    type: Boolean,
    default: false
  },
  voice: {
    type: Boolean,
    default: false
  },
  zoom: {
    type: Boolean,
    default: false
  }
})
type Emits = {
  (e: 'onMouseDown', type: string): void;
  (e: 'onMouseUp', type: string): void;
  (e: 'onVoicePlay'): void;
};
const emit = defineEmits<Emits>();

const {t: $t} = useI18n();
const onMouseDown = (type: string) => {
  if(['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(type) && !props.directions) return
  if(['ZOOM_IN', 'ZOOM_OUT'].includes(type) && !props.zoom) return
  emit('onMouseDown', type);
}

const onMouseUp = (type: string) => {
  if(['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(type) && !props.directions) return
  if(['ZOOM_IN', 'ZOOM_OUT'].includes(type) && !props.zoom) return
  emit('onMouseUp', type);
}

const onVoiceClick = () => {
  if(!props.voice) return
  emit('onVoicePlay');
}
</script>

<style lang="less" scoped>
@import './mediaTool.less';
</style>
