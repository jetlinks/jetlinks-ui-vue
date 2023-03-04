<template>
    <a-spin :spinning="loading">
        <j-card-select
            v-model:value="notifyType"
            :options="options"
            :icon-size="106"
        />
    </a-spin>
</template>

<script lang="ts" setup>
import { getImage } from '@/utils/comm';
import notice from '@/api/notice/config';

const iconMap = new Map();
iconMap.set('dingTalk', getImage('/notice/dingtalk.png'));
iconMap.set('weixin', getImage('/notice/wechat.png'));
iconMap.set('email', getImage('/notice/email.png'));
iconMap.set('voice', getImage('/notice/voice.png'));
iconMap.set('sms', getImage('/notice/sms.png'));
iconMap.set('webhook', getImage('/notice/webhook.png'));

const props = defineProps({
    value: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:value'])

const loading = ref<boolean>(false);
const notifyType = ref('');
const options = ref<any[]>([]);

watch(
    () => notifyType,
    (newVal) => {
        emit('update:value', newVal)
    },
    { deep: true, immediate: true },
);

onMounted(() => {
    loading.value = true
    notice.queryMessageType().then((resp) => {
        if (resp.status === 200) {
            options.value = (resp.result as any[]).map((item) => {
                return {
                    label: item.name,
                    value: item.id,
                    iconUrl: iconMap.get(item.id),
                };
            });
        }
        loading.value = false
    });
    notifyType.value = props.value
});
</script>

<style lang="less" scoped>
</style>