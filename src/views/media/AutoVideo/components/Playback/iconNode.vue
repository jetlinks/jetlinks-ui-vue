<!-- 视频图标组件 -->
<template>
    <j-tooltip
        key="download"
        :title="
            type !== 'local'
                ? '下载录像文件'
                : item.isServer || status === 2
                ? '查看'
                : '下载到云端'
        "
    >
        <a @click="handleClick">
            <AIcon :type="iconType" />
        </a>
    </j-tooltip>
</template>

<script setup lang="ts">
import type { recordsItemType } from './typings';
import playBackApi from '@/api/media/playback';
import { onlyMessage } from '@/utils/comm';

interface Props {
    type: string;
    item: recordsItemType;
    onCloudView: (startTime: number, endTime: number) => void;
    onDownLoad: () => void;
}
const props = defineProps<Props>();

// type 为local时有效，0：未下载； 1：下载中：2：已下载
const status = ref(props.item?.isServer ? 2 : 0);

const getLocalIcon = (s: number) => {
    if (s === 0) {
        return 'CloudDownloadOutlined';
    } else if (s === 2) {
        return 'EyeOutlined';
    } else {
        return 'LoadingOutlined';
    }
};

const iconType = computed(() =>
    props.type === 'local' ? getLocalIcon(status.value) : 'DownloadOutlined',
);

const downLoadCloud = (item: recordsItemType) => {
    status.value = 1;
    playBackApi
        .downloadRecord(item.deviceId, item.channelId, {
            local: false,
            downloadSpeed: 4,
            startTime: item.startTime,
            endTime: item.endTime,
        })
        .then((res) => {
            if (res.status === 200) {
                onlyMessage(
                    '操作成功。上传云端需要一定时间，请稍后查看云端数据',
                );
            }
            status.value = res.status === 200 ? 2 : 0;
        })
        .catch(() => {
            status.value = 0;
        });
};

const handleClick = () => {
    if (props.type === 'local') {
        if (status.value === 2) {
            // 已下载，进行跳转
            props.onCloudView(props.item.startTime, props.item.endTime);
        } else if (status.value === 0) {
            // 未下载 进行下载
            downLoadCloud(props.item);
        }
    } else {
        props.onDownLoad();
    }
};

watch(()=>props.item,()=>{
    status.value = props.item?.isServer ? 2 : 0
})
</script>
