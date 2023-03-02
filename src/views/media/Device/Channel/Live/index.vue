<!-- 视频设备 - 播放 -->
<template>
    <a-modal
        v-model:visible="_vis"
        title="播放"
        cancelText="取消"
        okText="确定"
        width="800px"
        :maskClosable="false"
        @ok="_vis = false"
        @cancel="_vis = false"
    >
        <div class="media-live">
            <div class="media-live-video">
                <div class="media-tool">
                    <div class="tool-item" @click.stop="handleRecord">
                        {{
                            isRecord === 0
                                ? '开始录像'
                                : isRecord === 1
                                ? '请求录像中'
                                : '停止录像'
                        }}
                    </div>
                    <div class="tool-item">刷新</div>
                    <div class="tool-item" @click.stop="handleReset">重置</div>
                </div>
                <LivePlayer :src="src" :type="mediaType" />
            </div>
            <MediaTool
                @onMouseDown="handleMouseDown"
                @onMouseUp="handleMouseUp"
            />
        </div>
        <div class="media-live-tool">
            <a-radio-group
                v-model:value="mediaType"
                button-style="solid"
                @change="mediaStart"
            >
                <a-radio-button value="mp4">MP4</a-radio-button>
                <a-radio-button value="flv">FLV</a-radio-button>
                <a-radio-button value="m3u8">HLS</a-radio-button>
            </a-radio-group>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import LivePlayer from '@/components/Player/index.vue';
import MediaTool from '@/components/Player/mediaTool.vue';
import channelApi from '@/api/media/channel';

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

// 视频地址
const src = ref('');
// 视频类型
const mediaType = ref('mp4');
/**
 * 媒体开始播放
 */
const mediaStart = () => {
    src.value = channelApi.ptzStart(
        props.data.deviceId,
        props.data.channelId,
        mediaType.value,
    );
};

// 录像状态
const isRecord = ref(0); // 0：停止录像； 1：请求录像中； 2：开始录像
/**
 * 查询录像状态
 */
const getIsRecord = async () => {
    const { result } = await channelApi.ptzIsRecord(
        props.data.deviceId,
        props.data.channelId,
    );
    isRecord.value = result ? 2 : 0;
};

/**
 * 点击录像/停止录像
 */
const handleRecord = async () => {
    if (isRecord.value === 0) {
        isRecord.value = 1;
        const res = await channelApi.recordStart(
            props.data.deviceId,
            props.data.channelId,
            { local: false },
        );
        if (res.success) {
            isRecord.value = 2;
        } else {
            isRecord.value = 0;
        }
    } else if (isRecord.value === 2) {
        const res = await channelApi.recordStop(
            props.data.deviceId,
            props.data.channelId,
            { local: false },
        );
        if (res.success) {
            isRecord.value = 0;
        }
    }
};

/**
 * 重置
 */
const handleReset = async () => {
    channelApi.mediaStop(props.data.deviceId, props.data.channelId);
};

/**
 * 点击控制按钮
 * @param type 控制类型
 */
const handleMouseDown = (type: string) => {
    channelApi.ptzTool(props.data.deviceId, props.data.channelId, type);
};
const handleMouseUp = () => {
    channelApi.ptzStop(props.data.deviceId, props.data.channelId);
};

watch(
    () => _vis.value,
    (val: boolean) => {
        if (val) {
            mediaStart();
            getIsRecord();
        }
    },
);
</script>
<style lang="less" scoped>
@import './index.less';
</style>
