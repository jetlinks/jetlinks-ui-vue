<!-- 视频设备 - 播放 -->
<template>
    <a-modal
        v-model:visible="_vis"
        title="播放"
        cancelText="取消"
        okText="确定"
        width="800px"
        @ok="_vis = false"
        @cancel="_vis = false"
    >
        <div class="media-live">
            <div class="media-live-video">
                <div class="media-tool">
                    <div class="tool-item">
                        {{
                            isRecord === 0
                                ? '开始录像'
                                : isRecord === 1
                                ? '请求录像中'
                                : '停止录像'
                        }}
                    </div>
                    <div class="tool-item">刷新</div>
                    <div class="tool-item">重置</div>
                </div>
                <LivePlayer :url="url" />
            </div>
            <MediaTool />
        </div>
        <div class="media-live-tool">
            <a-radio-group v-model:value="mediaType" button-style="solid">
                <a-radio-button value="mp4">MP4</a-radio-button>
                <a-radio-button value="flv">FLV</a-radio-button>
                <a-radio-button value="hls">HLS</a-radio-button>
            </a-radio-group>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';

type Emits = {
    (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

watch(
    () => _vis.value,
    (val: boolean) => {},
);

const isRecord = ref(0);
const url = ref('');
const mediaType = ref('mp4');
</script>
<style lang="less" scoped>
@import './index.less';
</style>
