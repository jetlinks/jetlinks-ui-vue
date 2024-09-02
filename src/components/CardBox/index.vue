<template>
  <div class="card a-table-card-box">
    <div
        class="card-warp"
        :class="{ active: active ? 'active' : '', 'disabled': disabled }"
        @click="handleClick"
    >
      <div class="card-type" v-if="slots.type">
        <div class="card-type-text">
          <slot name="type"></slot>
        </div>
      </div>
      <div
          class="card-content"
          :class="{'card-content-top-line': !slots.type}"
          :style="{ paddingTop: slots.type ? '40px' : '30px' }"
      >
        <div
            class="card-content-bg1"
            :style="{
                        background: getBackgroundColor(statusNames[status]),
                    }"
        ></div>
        <div
            class="card-content-bg2"
            :style="{
                        background: getBackgroundColor(statusNames[status]),
                    }"
        ></div>
        <div style="display: flex">
          <!-- 图片 -->
          <div class="card-item-avatar">
            <slot name="img"></slot>
          </div>

          <!-- 内容 -->
          <div class="card-item-body">
            <slot name="content"></slot>
          </div>
        </div>
        <!-- 勾选 -->
        <div v-if="active" class="checked-icon">
          <div>
            <AIcon type="CheckOutlined"/>
          </div>
        </div>
        <!-- 状态 -->
        <div
            v-if="showStatus"
            class="card-state"
            :style="{
                        backgroundColor: getHexColor(statusNames[status]),
                    }"
        >
          <div class="card-state-content">
            <j-badge-status
                :status="status"
                :text="statusText"
                :statusNames="statusNames"
            ></j-badge-status>
          </div>
        </div>
      </div>
      <div class="card-mask" v-if="props.hasMark">
        <div class="mask-content">
          <slot name="mark"/>
        </div>
      </div>
    </div>

    <!-- 按钮 -->
    <slot name="bottom-tool">
      <div
          v-if="showTool && actions && actions.length"
          class="card-tools"
      >
        <div
            v-for="item in actions"
            :key="item.key"
            class="card-button"
            :class="{
                        delete: item.key === 'delete',
                    }"
        >
          <slot name="actions" v-bind="item"></slot>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts" name='CardBox'>
import color, { getHexColor } from '@jetlinks-web/components/es/BadgeStatus/color';
import { PropType } from 'vue';

type EmitProps = {
  // (e: 'update:modelValue', data: Record<string, any>): void;
  (e: 'click', data: Record<string, any>): void;
};

type TableActionsType = any;

const emit = defineEmits<EmitProps>();
const slots = useSlots();

const props = defineProps({
  value: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  showStatus: {
    type: Boolean,
    default: true,
  },
  showTool: {
    type: Boolean,
    default: true,
  },
  statusText: {
    type: String,
    default: '正常',
  },
  status: {
    type: [String, Number] as PropType<string | number>,
    default: 'default',
  },
  statusNames: {
    type: Object as PropType<Record<any, any>>,
    default: () => ({'default': 'default'})
  },
  actions: {
    type: Array as PropType<TableActionsType[]>,
    default: () => [],
  },
  active: {
    type: Boolean,
    default: false,
  },
  hasMark: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  }
});

const getBackgroundColor = (code: string | number) => {
  const _color = color[code] || color.default;
  return `linear-gradient(
                188.4deg,
                rgba(${_color}, 0.03) 30%,
                rgba(${_color}, 0) 80%
            )`;
};

const handleClick = () => {
  emit('click', props.value);
};
</script>

<style lang="less" scoped>
.card {
  width: 100%;
  background-color: #fff;

  .checked-icon {
    position: absolute;
    right: -22px;
    bottom: -22px;
    z-index: 2;
    width: 44px;
    height: 44px;
    color: #fff;
    background-color: @primary-color;
    transform: rotate(-45deg);

    > div {
      position: relative;
      height: 100%;
      transform: rotate(45deg);

      > span {
        position: absolute;
        top: 6px;
        left: 6px;
        font-size: 12px;
      }
    }
  }

  .card-warp {
    position: relative;
    border: 1px solid #e6e6e6;
    overflow: hidden;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 24px rgba(#000, 0.1);

      .card-mask {
        visibility: visible;
      }
    }

    &.disabled {
      filter: grayscale(100%);
      cursor: not-allowed;
    }

    &.active {
      position: relative;
      border: 1px solid @primary-color;
    }

    .card-type {
      position: absolute;
      top: 0;
      left: -15px;
      height: 32px;
      padding: 0 30px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 32px;
      background-color: rgba(0, 0, 0, 0.06);
      transform: skewX(-45deg);

      .card-type-text {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: skewX(45deg);
      }
    }

    .card-content {
      position: relative;
      padding: 30px 12px 30px 30px;
      overflow: hidden;

      .card-item-avatar {
        margin-right: 16px;
        display: flex;
        align-items: center;
      }

      .card-item-body {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: 0;

        .ant-row {
          margin-top: 19px;
        }
      }

      .card-state {
        position: absolute;
        top: 30px;
        right: -12px;
        display: flex;
        justify-content: center;
        width: 100px;
        padding: 2px 0;
        background-color: rgba(#5995f5, 0.15);
        transform: skewX(45deg);

        &.success {
          background-color: @success-color-deprecated-bg;
        }

        &.warning {
          background-color: rgba(#ff9000, 0.1);
        }

        &.error {
          background-color: rgba(#e50012, 0.1);
        }

        .card-state-content {
          transform: skewX(-45deg);
        }
      }

      :deep(.card-item-content-title) {
        cursor: pointer;
        font-size: 16px;
        font-weight: 700;
        color: @primary-color;
        width: calc(100% - 100px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      :deep(.card-item-heard-name) {
        font-weight: 700;
        font-size: 16px;
        margin-bottom: 12px;
      }

      :deep(.card-item-content-text) {
        color: rgba(0, 0, 0, 0.7);
        font-size: 12px;
      }
    }

    .card-content-top-line {
      &::before {
        position: absolute;
        top: 0;
        left: 30px + 10px;
        display: block;
        width: 15%;
        min-width: 64px;
        height: 2px;
        background-image: url('/images/rectangle.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        content: ' ';
      }
    }

    .card-content-bg1 {
      position: absolute;
      right: -5%;
      height: 100%;
      width: 44.65%;
      top: 0;
      background: linear-gradient(188.4deg,
      rgba(229, 0, 18, 0.03) 22.94%,
      rgba(229, 0, 18, 0) 94.62%);
      transform: skewX(-15deg);
    }

    .card-content-bg2 {
      position: absolute;
      right: -5%;
      height: 100%;
      width: calc(44.65% + 34px);
      top: 0;
      background: linear-gradient(188.4deg,
      rgba(229, 0, 18, 0.03) 22.94%,
      rgba(229, 0, 18, 0) 94.62%);
      transform: skewX(-15deg);
    }

    .card-mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: #fff;
      background-color: rgba(#000, 0.5);
      visibility: hidden;
      cursor: pointer;
      transition: all 0.3s;

      .mask-content {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0 !important;
      }
    }
  }

  &.item-active {
    position: relative;
    color: @primary-color;

    .checked-icon {
      display: block;
    }

    .card-warp {
      border: 1px solid @primary-color;
    }
  }

  .card-tools {
    display: flex;
    margin-top: 8px;

    .card-button {
      display: flex;
      flex-grow: 1;

      & > :deep(span, button) {
        width: 100%;
        border-radius: 0;
      }

      :deep(button) {
        width: 100%;
        border-radius: 0;
        background: #f6f6f6;
        border: 1px solid #e6e6e6;
        color: @primary-color;

        &:hover {
          background-color: @primary-color-hover;
          border-color: @primary-color-hover;

          span {
            color: #fff !important;
          }
        }

        &:active {
          background-color: @primary-color-active;
          border-color: @primary-color-active;

          span {
            color: #fff !important;
          }
        }
      }

      &:not(:last-child) {
        margin-right: 8px;
      }

      &.delete {
        flex-basis: 60px;
        flex-grow: 0;

        :deep(button) {
          background: @error-color-deprecated-bg;
          border: 1px solid @error-color-outline;

          span {
            color: @error-color !important;
          }

          &:hover {
            background-color: @error-color-hover;

            span {
              color: #fff !important;
            }
          }

          &:active {
            background-color: @error-color-active;

            span {
              color: #fff !important;
            }
          }
        }
      }

      :deep(button[disabled]) {
        background: @disabled-bg;
        border-color: @disabled-color;

        span {
          color: @disabled-color !important;
        }

        &:hover {
          background-color: @disabled-active-bg;
        }

        &:active {
          background-color: @disabled-active-bg;
        }
      }

      // :deep(.ant-tooltip-disabled-compatible-wrapper) {
      //     width: 100%;
      // }
    }
  }
}
</style>
