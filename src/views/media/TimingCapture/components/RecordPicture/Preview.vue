<template>
    <div class="closeIcon" @click="emit('closePreview')"><AIcon type="CloseOutlined" style="font-size: 20px;"></AIcon></div>
    <div class="preview">
        <div class="preview-img">
            <img :src="getImage('/bind/jetlinksLogo.png')" alt=""/>
        </div>
        <div class="imgInfo">
            <div class="info-item">
                <div>抓拍时间:</div>
                <div></div>
            </div>
            <div class="info-item">
                <div>通道ID:</div>
                <div></div>
            </div>
            <div class="info-item">
                <div>通道名称:</div>
                <div></div>
            </div>
            <div class="info-item">
                <div>通道目录:</div>
                <div></div>
            </div>
            <div class="info-item">
                <div>安装地址:</div>
                <div></div>
            </div>
            <div class="info-item">
                <div>厂家:</div>
                <div></div>
            </div>
            <div class="info-item">
                <div>设备ID:</div>
                <div></div>
            </div>
            <div class="info-item">
                <div>设备名称:</div>
                <div></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { getImage } from '@/utils/comm';
const emit = defineEmits(['closePreview'])
</script>
<style lang="less" scoped>
.closeIcon{
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
    z-index: 2000;
    .imgInfo{
        width: 20%;
        margin: 10px 20px;
    }
    .info-item {
        margin-top: 20px;
    }
    .preview-img{
        width: 80%;
        background-color: rgba(204, 204, 204);
        img{
            height: 90%;
            width: 90%;
            margin: 5%;
        }
    }
}
</style>
