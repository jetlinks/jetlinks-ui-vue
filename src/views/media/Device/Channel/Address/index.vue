<template>
    <a-modal
        title="分享地址"
        visible
        @cancel="emit('close')"
        :maskClosable="false"
        width="650px"
    >
        <div class="content">
            <!-- <div class="top">
                <a-input-number v-model:value="expires" :min="0">
                    <template #addonBefore>地址有效时间</template>
                    <template #addonAfter>秒</template>
                </a-input-number>
            </div> -->
            <a-spin :spinning="spinning">
                <a-typography v-for="item in types" :key="item">
                    <div style="display: flex">
                        <a-typography-title
                            :level="5"
                            style="
                                min-width: 80px;
                                margin-bottom: 10px;
                                font-size: 14px;
                            "
                        >
                            {{ toUpper(item) }}地址:
                        </a-typography-title>
                        <a-typography-text
                            :ellipsis="{
                                tooltip: url[item],
                            }"
                            style="width: 550px"
                            :content="url[item]"
                            keyboard
                            :copyable="{
                                text: url[item],
                            }"
                        >
                        </a-typography-text>
                    </div>
                </a-typography>
            </a-spin>
        </div>
        <template #footer>
            <a-button type="primary" @click="emit('close')">确定</a-button>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Address">
import DeviceApi from '@/api/media/device';
import { pick, toUpper } from 'lodash-es';

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});
const emit = defineEmits(['close']);
const url = ref<any>({});
const types = ['flv', 'hls', 'mp4', 'rtmp', 'rtsp', 'rtc'];
const spinning = ref(true);
const expires = ref();

const handleResult = async (params?: any) => {
    const res = await DeviceApi.queryShareUrl(
        props.data.deviceId,
        props.data.channelId,
        params ? params : {},
    ).finally(() => {
        spinning.value = false;
    });
    if (res.status === 200) {
        url.value = pick(res.result, types);
        console.log('url.value====', url.value);
    }
};

onMounted(() => {
    handleResult();
});
</script>

<style lang="less" scoped>
.content {
    .top {
        margin-bottom: 10px;
    }
}
</style>
