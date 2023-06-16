<template>
    <j-spin :spinning="loading">
        <div class="notify-type-warp" :class="{ disabled: disabled }">
            <div
                :key="item.id"
                v-for="item in options"
                class="notify-type-item"
                :class="{ active: notifyType === item.value }"
                @click="onSelect(item.value, item.label)"
            >
                <div class="notify-type-item-image">
                    <img :width="106" :src="item.iconUrl" />
                </div>
                <div class="notify-type-item-title">{{item.label}}</div>
            </div>
        </div>
    </j-spin>
</template>

<script lang="ts" setup>
import { queryChannelProviders } from '@/api/system/noticeRule';
import { iconMap } from '../../../data';

const props = defineProps({
    value: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:value', 'change', 'update:name']);

const loading = ref<boolean>(false);
const notifyType = ref('');
const options = ref<any[]>([]);

watch(
    () => props.value,
    (newVal) => {
        notifyType.value = newVal;
    },
    { deep: true, immediate: true },
);

const onSelect = (val: string, name: string) => {
    if (!props.disabled) {
        emit('update:value', val);
        emit('update:name', name);
        emit('change', {label: name, value: val});
    }
};

onMounted(() => {
    loading.value = true;
    queryChannelProviders().then((resp) => {
        if (resp.status === 200) {
            options.value = (resp.result as any[]).filter(i => i.id !== 'inside-mail').map((item) => {
                return {
                    label: item.name,
                    value: item.id,
                    iconUrl: iconMap.get(item.id),
                };
            });
        }
        loading.value = false;
    });
    notifyType.value = props.value;
});
</script>

<style lang="less" scoped>
.notify-type-warp {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  width: 100%;

  .notify-type-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 172px;
    border: 1px solid #e0e4e8;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s;

    .notify-type-item-title {
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 14px;
    }

    .notify-type-item-image {
      width: 106px;
      margin: 16px 33px;
    }

    &:hover {
      color: @primary-color-hover;
      opacity: 0.8;
    }

    &.active {
      border-color: @primary-color-active;
      opacity: 1;
    }
  }

  &.disabled {
    .notify-type-item {
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