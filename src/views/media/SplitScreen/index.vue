<template>
    <page-container>
        <a-card class="splitScreen">
            <div class="split-screen">
                <LeftTree @onSelect="mediaStart" />
                <div class="right-content">
                    <ScreenPlayer
                        ref="player"
                        :id="deviceId"
                        :channelId="channelId"
                        :onMouseUp="(id, cId) => channelApi.ptzStop(id, cId)"
                        :onMouseDown="
                            (id, cId, type) => channelApi.ptzTool(id, cId, type)
                        "
                        :historyHandle="(dId, cId) => getMediaUrl(dId, cId)"
                        showScreen
                    />
                </div>
            </div>
        </a-card>
    </page-container>
</template>

<script setup lang="ts">
import LeftTree from './tree.vue';
import channelApi from '@/api/media/channel';
import ScreenPlayer from '@/components/Player/ScreenPlayer.vue';

const deviceId = ref('');
const channelId = ref('');
const player = ref();

const getMediaUrl = (dId: string, cId: string): string => {
    return channelApi.ptzStart(dId, cId, 'mp4');
};

const mediaStart = (e: { cId: string; dId: string }) => {
    channelId.value = e.cId;
    deviceId.value = e.dId;
    player.value?.replaceVideo(e.dId, e.cId, getMediaUrl(e.dId, e.cId));
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
