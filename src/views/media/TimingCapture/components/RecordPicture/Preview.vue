<template>
    <div class="closeIcon" @click="emit('closePreview')">
        <AIcon type="CloseOutlined" style="font-size: 20px"></AIcon>
    </div>
    <div class="preview">
        <div class="preview-img">
            <img :src="record.filePath" />
        </div>
        <div class="imgInfo">
            <div class="info-item">
                <div>抓拍时间:</div>
                <div>
                    {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
                </div>
            </div>
            <div class="info-item">
                <div>通道ID:</div>
                <Ellipsis :getPopupContainer="getPopupContainer">{{ channel.channelId }}</Ellipsis>
            </div>
            <div class="info-item">
                <div>通道名称:</div>
                <div>{{ channel.name || '-' }}</div>
            </div>
            <div class="info-item">
                <div>通道目录:</div>
                <a-breadcrumb>
                    <a-breadcrumb-item v-for="name in channel?.pathsName">{{
                        name
                    }}</a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <div class="info-item">
                <div>安装地址:</div>
                <div>{{ channel.address }}</div>
            </div>
            <div class="info-item">
                <div>厂家:</div>
                <div>{{ channel.manufacturer }}</div>
            </div>
            <div class="info-item">
                <div>设备ID:</div>
                <div>{{ channel.deviceId }}</div>
            </div>
            <div class="info-item">
                <div>设备名称:</div>
                <div>{{ channel.deviceName }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import dayjs from 'dayjs';

const props = defineProps({
    record: {
        type: Object,
        default: () => ({}),
    },
    channel: {
        type: Object,
        default: () => ({}),
    },
});
const getPopupContainer = (node)=>{
    return node
}

const emit = defineEmits(['closePreview']);
</script>
<style lang="less" scoped>
.closeIcon {
    position: fixed;
    top: 7%;
    right: 15%;
    z-index: 2000;
}
.preview {
    position: fixed;
    left: 15%;
    right: 15%;
    top: 10%;
    bottom: 10%;
    background-color: white;
    display: flex;
    justify-content: space-around;
    z-index: 1200;
    .imgInfo {
        width: 20%;
        padding: 12px;
        // margin: 10px 20px;
    }
    .info-item {
        margin-top: 12px;
    }
    .preview-img {
        width: 80%;
        background-color: rgba(204, 204, 204);
        img {
            height: 90%;
            width: 90%;
            margin: 5%;
        }
    }
}
</style>
