<template>
  <div :class='classNames'>
    <div
      v-for='item in options'
      :key='item.value'
      :class='[
        "trigger-way-item",
        value === item.value ? "active" : "",
        labelBottom ? "label-bottom" : ""
        ]'
      @click='() => click(item.value)'
    >
      <div class='way-item-title'>
        <span class='label'>{{ item.label }}</span>
        <a-popover v-if='item.tip' :content='item.tip'>
          <AIcon type='QuestionCircleOutlined' class='icon' />
        </a-popover>
      </div>
      <div class='way-item-image'>
        <img
          width='48'
          v-bind='item.imgProps'
          :src='item.img'
        />
      </div>
    </div>
  </div>
</template>

<script setup lang='ts' name='TopCard'>

import type { PropType } from 'vue'

type optionsType = {
  label: string
  value: string
  img?: string
  tip?: string
  imgProps: Record<string, any>
}

type Emit = {
  (e: 'update:value', data: string): void
  (e: 'select', data: string): void
}

const props = defineProps({
  options: {
    type: Array as PropType<optionsType[]>,
    default: () => ([])
  },
  value: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  labelBottom: {
    type: Boolean,
    default: false
  }
})

const classNames = computed(() => {
  return [
    props.class,
    'trigger-way-warp',
    props.disabled ? 'disabled' : ''
  ]
})

const emit = defineEmits<Emit>()

const click = (value: string) => {
  emit('update:value', value)
  emit('select', value)
}

</script>

<style scoped lang='less'>
.trigger-way-warp {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  width: 100%;

  .trigger-way-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 237px;
    //width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e4e8;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s;

    .way-item-title {
      span {
        font-size: 16px;
      }
      .label {
        padding-right: 6px;
        color: rgba(#000, 0.64);
      }

      .icon {
        color: rgba(#000, 0.5);
      }
    }

    .way-item-image {
      margin: 0 !important;
      opacity: 0.6;
    }

    &:hover {
      //color: @primary-color-hover;
      .way-item-image {
        opacity: 0.8;
      }
    }

    &.active {
      border-color: @primary-color-active;
      .way-item-image {
        opacity: 1;
      }
    }

    &.label-bottom {
      flex-direction: column-reverse;
      grid-gap: 16px;
      gap: 0;
      align-items: center;
      width: auto;
      padding: 8px 16px;
      p {
        margin: 0;
      }
    }
  }

  &.disabled {
    .trigger-way-item {
      cursor: not-allowed;

      &:hover {
        color: initial;
        opacity: 0.6;
      }

      &.active {
        opacity: 1;
      }
    }
  }
}
</style>