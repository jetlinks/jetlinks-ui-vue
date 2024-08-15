<template>
  <div :class='classNames'>
    <div
      v-for='item in options'
      :key='item.value'
      :class='["trigger-way-item", modelValue === item.value ? "active" : "" ]'
      @click='handleClick(item.value)'
    >
      <div class='way-item-title'>
        <p>{{ item.label }}</p>
        <span>{{ item.tip}}</span>
      </div>
      <div class='way-item-image'>
        <img width='40' :src='item.image' />
      </div>
    </div>
  </div>
</template>

<script lang='ts' setup name='TriggerWay'>

import { getImage } from '@/utils/comm'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

type Emit = {
  (e: 'update:modelValue', data: string): void
}

const options = [
  { value: 'device', label: $t('components.TriggerWay.5425713-0'), tip: $t('components.TriggerWay.5425713-1'), image: getImage('/device-trigger.png') },
  { value: 'manual', label: $t('components.TriggerWay.5425713-2'), tip: $t('components.TriggerWay.5425713-3'), image: getImage('/manual-trigger.png') },
  { value: 'timer', label: $t('components.TriggerWay.5425713-4'), tip: $t('components.TriggerWay.5425713-5'), image: getImage('/timing-trigger.png') },
]

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<Emit>()

const classNames = computed(() => {
  return {
    [props.className]: true,
    'scene-trigger-way-warp': true,
    disabled: props.disabled
  }
})

const handleClick = (type: string) => {
  if (!props.disabled) {
    emit('update:modelValue', type)
  }
}

</script>

<style scoped lang='less'>

.scene-trigger-way-warp {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  width: 100%;

  .trigger-way-item {
    display: flex;
    justify-content: space-between;
    padding: 16px;
    border: 1px solid #e0e4e8;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s;
    width: 204px;

    .way-item-title {
      p {
        margin-bottom: 8px;
        font-weight: bold;
        font-size: 16px;
      }

      span {
        color: rgba(#000, 0.35);
        font-size: 12px;
      }
    }

    .way-item-image {
      display: flex;
      align-items: center;
      height: 100%;
      margin: 0 !important;
      opacity: 0.6;
    }

    &:hover {
      color: @primary-color-hover;
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
  }

  &.disabled {
    color: rgba(#000, .8);
    .way-item-image {
      opacity: 0.6;
    }

    .trigger-way-item {
      cursor: not-allowed;
    }
  }
}
</style>