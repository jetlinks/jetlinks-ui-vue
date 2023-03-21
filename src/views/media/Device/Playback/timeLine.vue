<!-- 播放器时间刻度 -->
<template>
    <div class="time-line-warp">
        <div class="time-line-clock">
            <div
                v-for="item in Array.from(Array(25), (v, k) => k)"
                :key="item"
                style="width: 12px"
            >
                {{ item }}
            </div>
        </div>
        <div class="time-line-content" ref="LineContent">
            <div class="time-line-progress">
                <div
                    v-for="(item, index) in list"
                    :key="`time_${index}`"
                    @click="handleProgress($event, item)"
                    :style="
                        getLineItemStyle(
                            item.startTime || item.mediaStartTime,
                            item.endTime || item.mediaEndTime,
                        )
                    "
                ></div>
            </div>
            <div id="btn" class="time-line-btn"></div>
            <div id="time" class="time-line">
                {{ dayjs(playTime || 0).format('HH:mm:ss') }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { message } from 'jetlinks-ui-components';
import type { recordsItemType } from './typings';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useElementSize } from '@vueuse/core';

export type TimeChangeType = {
    endTime: Dayjs;
    startTime: Dayjs;
    deviceId: string;
    channelId: string;
};

interface Props {
    onChange: (times: TimeChangeType | undefined) => void;
    data: recordsItemType[];
    dateTime?: Dayjs;
    type: string;
    playStatus: number;
    playTime: number;
    server?: any;
    localToServer?: {
        endTime: number;
        startTime: number;
    };
    getPlayList?: (data: any) => void;
}

const props = defineProps<Props>();

// 获取选中当天开始时间戳
const startT = ref<number>(
    new Date(
        dayjs(props.dateTime).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ).getTime(),
);
// 获取选中当天结束时间戳
const endT = ref<number>(
    new Date(
        dayjs(props.dateTime).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    ).getTime(),
);
const list = ref<any[]>([]);
const playTime = ref<number>(0);
const LineContent = ref<HTMLDivElement>();
const LineContentSize = useElementSize(LineContent);

const setTimeAndPosition = (ob: number) => {
    const oBtn = document.getElementById('btn');
    const oTime = document.getElementById('time');

    if (oBtn && oTime && LineContentSize.width) {
        oBtn.style.visibility = 'visible';
        oBtn.style.left = `${ob * LineContentSize.width.value}px`;
        oTime.style.visibility = 'visible';
        oTime.style.left = `${ob * LineContentSize.width.value - 15}px`;
    }
};

watch(
    () => props.dateTime,
    (val: any) => {
        startT.value = new Date(
            dayjs(val).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        ).getTime();
    },
);

const onChange = (
    startTime: number,
    endTime: number,
    deviceId: string,
    channelId: string,
) => {
    playTime.value = startTime;
    props.onChange({
        startTime: dayjs(startTime),
        endTime: dayjs(endTime),
        deviceId,
        channelId,
    });
};

const playByStartTime = (time: any) => {
    const playNow = props.data.find((item) => {
        const startTime = item.startTime || item.mediaStartTime;
        return startTime === time;
    });

    if (playNow) {
        const startTime = playNow.startTime || playNow.mediaStartTime;
        const endTime = playNow.endTime || playNow.mediaEndTime;
        const deviceId = props.type === 'local' ? playNow.deviceId : playNow.id;
        onChange(startTime, endTime, deviceId, playNow.channelId);
    }
};
playByStartTime(0);

const onNextPlay = () => {
    if (playTime.value) {
        // 查找下一个视频
        const nowIndex = props.data.findIndex((item) => {
            const startTime = item.startTime || item.mediaStartTime;
            return startTime === playTime.value;
        });
        // 是否为最后一个
        if (nowIndex !== props.data.length - 1) {
            const nextPlay = props.data[nowIndex + 1];
            const startTime = nextPlay.startTime || nextPlay.mediaStartTime;
            const endTime = nextPlay.endTime || nextPlay.mediaEndTime;
            const deviceId =
                props.type === 'local' ? nextPlay.deviceId : nextPlay.id;
            onChange(startTime, endTime, deviceId, nextPlay.channelId);
        }
    }
};
onNextPlay();

watch(
    () => props.data,
    (val: any) => {
        const { data, localToServer, type } = props;
        if (data && Array.isArray(data) && data.length > 0) {
            list.value = [...data];
            if (type === 'local') {
                // 播放第一个
                onChange(
                    data[0].startTime,
                    data[0].endTime,
                    data[0].deviceId,
                    data[0].channelId,
                );
            } else if (type === 'cloud') {
                // 是否从本地跳转到云端播放
                if (localToServer && Object.keys(localToServer).length > 0) {
                    // 获取跳转播放段
                    const playItem = data.find((item) => {
                        return (
                            item.mediaEndTime <= localToServer.endTime &&
                            item.mediaStartTime >= localToServer.startTime
                        );
                    });
                    if (playItem) {
                        //播放片段
                        onChange(
                            playItem.mediaStartTime,
                            playItem.mediaEndTime,
                            playItem.id,
                            playItem.channelId,
                        );
                    } else {
                        props.onChange(undefined);
                        message.error('没有可播放的视频资源');
                    }
                } else {
                    onChange(
                        data[0].mediaStartTime,
                        data[0].mediaEndTime,
                        data[0].id,
                        data[0].channelId,
                    );
                }
            }
        } else if (localToServer && localToServer.startTime) {
            // 本地跳转云端但是无资源
            props.onChange(undefined);
            message.error('没有可播放的视频资源');
            list.value = [];
        } else {
            // 啥都没有
            list.value = [];
            props.onChange(undefined);
        }
    },
);

const getLineItemStyle = (
    startTime: number,
    endTime: number,
): { left: string; width: string } => {
    const start = startTime - startT.value > 0 ? startTime - startT.value : 0;
    const _width = LineContentSize.width.value!;
    const itemWidth = ((endTime - startTime) / (24 * 3600000)) * _width;
    return {
        left: `${(start / (24 * 3600000)) * _width}px`,
        width: `${itemWidth < 1 ? 1 : itemWidth}px`,
    };
};

const playTimeChange = () => {
    if (
        props.playTime &&
        props.playTime >= startT.value &&
        props.playTime <= endT.value &&
        props.data &&
        props.data.length
    ) {
        setTimeAndPosition((props.playTime - startT.value) / 3600000 / 24);
    }
};
watch(
    () => props.playTime,
    () => {
        playTimeChange();
    },
);
watch(
    () => startT.value,
    () => {
        playTimeChange();
    },
);

const handleProgress = (event: any, item: any) => {
    const pos = LineContent.value?.getBoundingClientRect();
    if (pos && item.endTime) {
        const dt = event.clientX - pos.x;
        const start = (dt / pos.width) * 24 * 3600000 + startT.value;
        const _start = start < item.startTime ? item.startTime : start;
        onChange(_start, item.endTime, item.deviceId, item.channelId);
    }
};

defineExpose({ playByStartTime, onNextPlay });
</script>

<style lang="less" scoped>
@import './index.less';
</style>
