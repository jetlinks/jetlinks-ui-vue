<template>
    <a-spin :spinning="loading">
        <div class="notify-type-warp">
            <div
                :key="item.id"
                v-for="item in options"
                class="notify-type-item"
                :class="{ active: notifyType === item.value }"
                @click="onSelect(item.value, item.label)"
            >
                <div class="notify-type-item-image">
                    <img :width="64" :src="item.iconUrl" />
                </div>
                <div class="notify-type-item-title">{{item.label}}</div>
            </div>
        </div>
    </a-spin>
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
            if(!props.value){
                emit('update:value', options.value?.[0]?.value);
                emit('update:name', options.value?.[0]?.label);
                emit('change', {label: options.value?.[0]?.label, value: options.value?.[0]?.value});
            }else{
                options.value.find((item:any)=>{
                    if(item.value === props.value){
                        emit('update:name',item.label)
                        return true
                    }
                })
            }
        }
        loading.value = false;
    });
});
</script>

<style lang="less" scoped>
.notify-type-warp {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 50px 200px;
  gap: 16px 24px;

  .notify-type-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    width: 96px;
    padding: 8px 16px;

    .notify-type-item-title {
      font-size: 14px;
      color: #333333;
      width: 100%;
      text-align: center;
    }

    .notify-type-item-image {
      width: 100%;
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
    }

    // &:hover {
    //   background-color: #F2F4F7;
    // }

    &.active {
      border: 1px solid #2F54EB;
    }
  }
}

</style>