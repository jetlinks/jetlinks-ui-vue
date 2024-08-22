<!-- 回放 -->
<template>
    <a-modal title="录像回放" visible   style="top: 40px" :width="1400" @cancel="emits('close')" >
        <div class="playback-warp">
            <!-- 播放器/进度条 -->
            <div class="playback-left">
                <LivePlayer
                    ref="player"
                    autoplay
                    :url="url"
                    className="playback-media"
                    :live="type === 'local'"
                    :on-play="
                        () => {
                            isEnded = false;
                            playStatus = 1;
                        }
                    "
                    :on-pause="
                        () => {
                            playStatus = 2;
                        }
                    "
                    :on-ended="onEnded"
                    :on-error="
                        () => {
                            playStatus = 0;
                        }
                    "
                    :on-time-update="
                        (e) => {
                            playTime = e.currentTime;
                        }
                    "
                />
                <TimeLine
                    ref="playTimeNode"
                    :type="type"
                    :data="historyList"
                    :date-time="time"
                    :on-change="handleTimeLineChange"
                    :play-status="playStatus"
                    :play-time="playNowTime + playTime * 1000"
                    :local-to-server="cloudTime"
                />
            </div>
            <div class="playback-right">
                <a-spin :spinning="loading">
                    <a-tooltip placement="topLeft">
                        <template #title>
                            <div>云端：存储在服务器中</div>
                            <div>本地：存储在设备本地</div>
                        </template>
                        <div>类型: <AIcon type="QuestionCircleOutlined" /></div>
                    </a-tooltip>
                    <RadioCard
                        layout="horizontal"
                        :options="
                            deviceType !== 'onvif'
                                ? [
                                      {
                                          label: '云端',
                                          value: 'cloud',
                                          logo: getImage('/media/cloud.png'),
                                      },
                                      {
                                          label: '本地',
                                          value: 'local',
                                          logo: getImage('/local.png'),
                                          disabled:
                                              deviceType === 'fixed-media',
                                      },
                                  ]
                                : [
                                      {
                                          label: '云端',
                                          value: 'cloud',
                                          logo: getImage('/media/cloud.png'),
                                      },
                                  ]
                        "
                        :checkStyle="true"
                        v-model="type"
                    />
                    <div class="playback-calendar">
                        <a-calendar
                            v-model:value="time"
                            :fullscreen="false"
                            :disabledDate="
                                    (currentDate: Dayjs) => currentDate > dayjs(new Date())
                                "
                            @change="handlePanelChange"
                        />
                    </div>
                    <div
                        class="playback-list"
                        :class="{ 'no-list': !historyList.length }"
                    >
                        <a-empty
                            v-if="!historyList.length"
                            description="暂无数据"
                        />
                        <a-list
                            v-else
                            class="playback-list-items"
                            itemLayout="horizontal"
                            :dataSource="historyList"
                        >
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    <template #actions>
                                        <a-tooltip
                                            key="play-btn"
                                            :title="
                                                (item.startTime ||
                                                    item.mediaStartTime) ===
                                                    playNowTime &&
                                                playStatus === 1
                                                    ? '暂停'
                                                    : '播放'
                                            "
                                        >
                                            <a
                                                @click="
                                                    handlePlay(
                                                        item.startTime ||
                                                            item.mediaStartTime,
                                                    )
                                                "
                                            >
                                                <AIcon
                                                    :type="
                                                        (item.startTime ||
                                                            item.mediaStartTime) ===
                                                            playNowTime &&
                                                        playStatus === 1
                                                            ? 'PauseCircleOutlined'
                                                            : 'PlayCircleOutlined'
                                                    "
                                                />
                                            </a>
                                        </a-tooltip>
                                        <IconNode
                                            :type="type"
                                            :item="item"
                                            :on-cloud-view="cloudView"
                                            :on-down-load="
                                                () => downloadClick(item)
                                            "
                                        />
                                    </template>

                                    <div>
                                        {{
                                            dayjs(
                                                item.startTime ||
                                                    item.mediaStartTime,
                                            ).format('HH:mm:ss')
                                        }}
                                        ~
                                        {{
                                            dayjs(
                                                item.endTime ||
                                                    item.mediaEndTime,
                                            ).format('HH:mm:ss')
                                        }}
                                    </div>
                                </a-list-item>
                            </template>
                        </a-list>
                    </div>
                </a-spin>
            </div>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
import playBackApi from '@/api/media/playback';
import TimeLine from './timeLine.vue';
import IconNode from './iconNode.vue';
import type { recordsItemType } from './typings';
import LivePlayer from '@/components/Player/index.vue';
import { getImage } from '@/utils/comm';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
const props = defineProps({
    data:{
        type:Object,
        default:{}
    }
})
const emits = defineEmits(['close'])
const url = ref('');
const type = ref('local');
const historyList = ref<recordsItemType[]>([]);
const time = ref<Dayjs | undefined>(undefined);
const loading = ref(false);
const cloudTime = ref<any>();
const player = ref<any>();
const playStatus = ref(0); // 播放状态, 0 停止， 1 播放， 2 暂停, 3 播放完成
const playTime = ref(0);

const playNowTime = ref(0); // 当前播放视频标识
const playTimeNode = ref<any>(null);
const isEnded = ref(false); // 是否结束播放
const deviceId = computed(() => props.data.id as string);
const channelId = computed(() => props.data.channelId as string);

const deviceType = ref('');

/**
 * 查询本地视频
 * @param date
 */
const queryLocalRecords = async (date: Dayjs) => {
    playStatus.value = 0;
    url.value = '';

    if (deviceId.value && channelId.value && date) {
        loading.value = true;
        const params = {
            startTime: date.format('YYYY-MM-DD 00:00:00'),
            endTime: date.format('YYYY-MM-DD 23:59:59'),
        };
        const localResp = await playBackApi
            .queryRecordLocal(deviceId.value, channelId.value, params)
            .finally(() => {
                loading.value = false;
            });
        if (localResp.status === 200 && localResp.result.length) {
            const serviceResp = await playBackApi.recordsInServer(
                deviceId.value,
                channelId.value,
                {
                    ...params,
                    includeFiles: false,
                },
            );
            let newList: recordsItemType[] = serviceResp.result;
            // console.log(newList)
            if (serviceResp.status === 200 && serviceResp.result) {
                // 判断是否已下载云端视频
                newList = localResp.result.map((item: recordsItemType) => {
                    return {
                        ...item,
                        isServer: serviceResp.result.length
                            ? serviceResp.result.some(
                                  (serverFile: any) =>
                                      item.startTime <=
                                          serverFile.streamStartTime &&
                                      serverFile.streamEndTime <= item.endTime,
                              )
                            : false,
                    };
                });

                historyList.value = newList;
            } else {
                historyList.value = newList;
            }
        } else {
            loading.value = false;
            historyList.value = [];
        }
    }
};

/**
 * 查询云端视频
 * @param date
 */
const queryServiceRecords = async (date: Dayjs) => {
    playStatus.value = 0;
    url.value = '';
    if (deviceId.value && channelId.value && date) {
        loading.value = true;
        const params = {
            startTime: date.format('YYYY-MM-DD 00:00:00'),
            endTime: date.format('YYYY-MM-DD 23:59:59'),
            includeFiles: true,
        };

        const resp = await playBackApi.recordsInServerFiles(
            deviceId.value,
            channelId.value,
            params,
        );
        loading.value = false;
        if (resp.status === 200) {
            historyList.value = resp.result;
        }
    }
};

const cloudView = (startTime: number, endTime: number) => {
    type.value = 'cloud';
    cloudTime.value = { startTime, endTime };
};

/**
 * 下载到云端
 * @param item
 */
const downloadClick = async (item: recordsItemType) => {
    const downloadUrl = playBackApi.downLoadFile(item.id);
    const downNode = document.createElement('a');
    downNode.href = downloadUrl;
    downNode.download = `${channelId}-${dayjs(item.startTime).format(
        'YYYY-MM-DD-HH-mm-ss',
    )}.mp4`;
    downNode.style.display = 'none';
    document.body.appendChild(downNode);
    downNode.click();
    document.body.removeChild(downNode);
};

const onEnded = () => {
    playStatus.value = 0;
    if (playTimeNode && !isEnded.value) {
        isEnded.value = true;
        playTimeNode.value.onNextPlay();
    }
};


/**
 * 播放进度条点击
 * @param times
 */
const handleTimeLineChange = (times: any) => {
    if (times) {
        playNowTime.value = Number(times.startTime.valueOf());
        playTime.value = 0;
        url.value =
            type.value === 'local'
                ? playBackApi.playbackLocal(
                      times.deviceId,
                      times.channelId,
                      'mp4',
                      dayjs(times.startTime).format('YYYY-MM-DD HH:mm:ss'),
                      dayjs(times.endTime).format('YYYY-MM-DD HH:mm:ss'),
                  )
                : playBackApi.playbackStart(times.deviceId);
    } else {
        url.value = '';
    }
};

/**
 * 日历操作
 * @param date
 */
 const handlePanelChange = (date: any) => {
    time.value = date;
    if (type.value === 'cloud') {
        queryServiceRecords(date);
    } else {
        queryLocalRecords(date);
    }
};

/**
 * 播放/暂停
 * @param _startTime
 */
const handlePlay = (_startTime: any) => {
    if (playStatus.value === 0 || _startTime !== playNowTime.value) {
        playTimeNode.value?.playByStartTime(_startTime);
    } else if (playStatus.value == 1 && _startTime === playNowTime.value) {
        player.value?.pause();
    } else if (playStatus.value == 2 && _startTime === playNowTime.value) {
        player.value?.play();
    }
};

watch(
    () => type.value,
    (val: string) => {
        if (val === 'cloud') {
            queryServiceRecords(time.value!);
        } else {
            queryLocalRecords(time.value!);
        }
    },
);

onMounted(() => {
    const _type = props.data.type as string;
    if (_type) {
        deviceType.value = _type;
        const _timeStr = dayjs(new Date());
        time.value = _timeStr;
        if (_type === 'fixed-media' || _type === 'onvif') {
            type.value = 'cloud';
            queryServiceRecords(_timeStr);
        } else {
            queryLocalRecords(_timeStr);
            type.value = 'local';
        }
    }
});


</script>

<style lang="less" scoped>
@import './index.less';
</style>
