<template>
    <j-modal visible @cancel="emit('close')" :closable="false">
        <div class="content">
            <div style="margin-bottom: 5px;">
                复制下方链接，分享{{ data.name }}视频界面
            </div>
            <j-input-group compact>
                <j-input
                    v-model:value="url"
                    ref="urlRef"
                    style="width: calc(100% - 50px)"
                />
                <j-tooltip title="复制">
                    <j-button @click="onCopy">
                        <template #icon><AIcon type="CopyOutlined" /></template>
                    </j-button>
                </j-tooltip>
            </j-input-group>
        </div>
        <template #footer>
            <j-button type="primary" @click="emit('close')">确定</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { getToken } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { PropType } from 'vue';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});
const token = getToken();
const route = useRoute();
const url = ref('');
const urlRef = ref<HTMLInputElement>()

watchEffect(() => {
    url.value = `${window.location.origin}#/media/device/Share?deviceId=${props.data.deviceId}&channelId=${props.data.channelId}&type=${route.query.type}&id=${props.data.id}&${TOKEN_KEY}=${token}`
})

const onCopy = () => {
    if(urlRef.value) {
        urlRef.value.select()
        document.execCommand('copy')
    }
}
</script>

<style lang="less" scoped>
.content {
    display: flex;
    flex-direction: column;
    margin: 60px 10px 40px 10px;
}
</style>