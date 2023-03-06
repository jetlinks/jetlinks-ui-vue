<!-- 回放 -->
<template>
    <page-container>
        <div class="playback-warp">
            <div class="playback-left">
                <LivePlayer :src="url" />
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
                    <a-tooltip title="">

                    </a-tooltip>
                </a-spin>
            </div>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import playBackApi from '@/api/media/playback';
import type { Moment } from 'moment';
import moment from 'moment';
import TimeLine from './timeLine.vue';
import IconNode from './iconNode.vue';
import type { recordsItemType } from './typings';
import LivePlayer from '@/components/Player/index.vue';

const route = useRoute();

const url = ref('');
const type = ref('local');
const historyList = ref<recordsItemType[]>([]);
const time = ref<Moment | undefined>(undefined);
const loading = ref(false);
const cloudTime = ref<any>();
const location = ref({ search: '' });
const player = ref<any>();
const playStatus = ref(0); // 播放状态, 0 停止， 1 播放， 2 暂停, 3 播放完成
const playTime = ref(0);

const playNowTime = ref(0); // 当前播放视频标识
const playTimeNode = ref<any>(null);
const isEnded = ref(false); // 是否结束播放
const param = new URLSearchParams(location.value.search);
const deviceId = computed(() => route.params.id as string);
const channelId = computed(() => route.params.channelId as string);

const deviceType = ref('');

const queryLocalRecords = async (date: Moment) => {
    playStatus.value = 0;
    url.value = '';
    if (deviceId.value && channelId.value && date) {
        loading.value = true;
        const params = {
            startTime: date.format('YYYY-MM-DD 00:00:00'),
            endTime: date.format('YYYY-MM-DD 23:59:59'),
        };
        const localResp = await playBackApi.queryRecordLocal(
            deviceId.value,
            channelId.value,
            params,
        );
        if (localResp.status === 200 && localResp.result.length) {
            const serviceResp = await playBackApi.recordsInServer(
                deviceId.value,
                channelId.value,
                {
                    ...params,
                    includeFiles: false,
                },
            );
            loading.value = false;
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
const queryServiceRecords = async (date: Moment) => {
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
    queryServiceRecords(time.value!);
};

const downloadClick = async (item: recordsItemType) => {
    const downloadUrl = playBackApi.downLoadFile(item.id);
    const downNode = document.createElement('a');
    downNode.href = downloadUrl;
    downNode.download = `${channelId}-${moment(item.startTime).format(
        'YYYY-MM-DD-HH-mm-ss',
    )}.mp4`;
    downNode.style.display = 'none';
    document.body.appendChild(downNode);
    downNode.click();
    document.body.removeChild(downNode);
};

watch(
    () => location.value,
    (val: any) => {
        const _param = new URLSearchParams(val?.search);
        const _type = _param.get('type');

        if (_type) {
            deviceType.value = _type;
            const _timeStr = moment(new Date());
            time.value = _timeStr;
            if (_type === 'fixed-media') {
                type.value = 'cloud';
                queryServiceRecords(_timeStr);
            } else {
                queryLocalRecords(_timeStr);
                type.value = 'local';
            }
        }
    },
);

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
                      moment(times.startTime).format('YYYY-MM-DD HH:mm:ss'),
                      moment(times.endTime).format('YYYY-MM-DD HH:mm:ss'),
                  )
                : playBackApi.playbackStart(times.deviceId);
    } else {
        url.value = '';
    }
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
