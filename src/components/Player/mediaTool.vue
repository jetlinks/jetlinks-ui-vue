<!-- 视频播放工具栏 -->
<template>
  <div class="live-player-tools" :class="{'disabled': disabled}">
    <div class="direction">
      <div
          class="direction-item up"
          @mousedown="onMouseDown('UP')"
          @mouseup="onMouseUp('UP')"
      >
        <a-tooltip :title="disabled ? '请选择支持云台控制的通道' : ''">
          <div class="direction-icon">
            <AIcon type="CaretUpOutlined" class="icon"/>
          </div>
        </a-tooltip>
      </div>
      <div
          class="direction-item right"
          @mousedown="onMouseDown('RIGHT')"
          @mouseup="onMouseUp('RIGHT')"
      >
        <a-tooltip :title="disabled ? '请选择支持云台控制的通道' : ''">
          <div class="direction-icon">
            <AIcon type="CaretRightOutlined"/>
          </div>
        </a-tooltip>
      </div>
      <div
          class="direction-item left"
          @mousedown="onMouseDown('LEFT')"
          @mouseup="onMouseUp('LEFT')"
      >
        <a-tooltip :title="disabled ? '请选择支持云台控制的通道' : ''">
          <div class="direction-icon">
            <AIcon type="CaretLeftOutlined" class="icon"/>
          </div>
        </a-tooltip>
      </div>
      <div
          class="direction-item down"
          @mousedown="onMouseDown('DOWN')"
          @mouseup="onMouseUp('DOWN')"
      >
        <a-tooltip :title="disabled ? '请选择支持云台控制的通道' : ''">
          <div class="direction-icon">
            <AIcon type="CaretDownOutlined" class="icon"/>
          </div>
        </a-tooltip>
      </div>
      <div class="direction-audio">
        <slot name="center">
          <a-tooltip :title="disabled ? '请选择支持语音控制的通道' : ''">
            <div class="direction-audio-outside">
              <div class="direction-audio-inside">
                <AIcon type="AudioFilled" class="icon"/>
              </div>
            </div>
          </a-tooltip>
        </slot>
      </div>
    </div>
    <div class="zoom">
      <a-tooltip :title="disabled? '请选择支持画面缩放的通道' : ''">
        <div
            class="zoom-item zoom-in"
            @mousedown="onMouseDown('ZOOM_IN')"
            @mouseup="onMouseUp('ZOOM_IN')"
        >
          <AIcon type="PlusOutlined" class="icon"/>
        </div>
      </a-tooltip>
      <a-tooltip :title="disabled? '请选择支持画面缩放的通道' : ''">
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
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
type Emits = {
  (e: 'onMouseDown', type: string): void;
  (e: 'onMouseUp', type: string): void;
};
const emit = defineEmits<Emits>();

const onMouseDown = (type: string) => {
  if(props.disabled) return;
  emit('onMouseDown', type);
}

const onMouseUp = (type: string) => {
  if(props.disabled) return;
  emit('onMouseUp', type);
}
</script>

<style lang="less" scoped>
@import './mediaTool.less';
</style>
