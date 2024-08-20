<template>
    <page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="mediaStore.tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>
            <div style="display: flex; align-items: center">
              
                <div v-if="!isEdit">{{  mediaStore.detail?.name || '----' }}</div>
                <a-input v-else :value="mediaStore.detail?.name" />

                <PermissionButton 
                    type="link"
                    hasPermission="device/Instance:action"
                    @click="onSave(true)"
                >
                    <AIcon type="EditOutlined"  />
                </PermissionButton>
            </div>
            
        </template>
        <template #content>
            <a-descriptions size="small" :column="4">
                <a-descriptions-item label="计划ID">{{111}}</a-descriptions-item>
                <a-descriptions-item label="创建人">{{ '创建人' }}</a-descriptions-item>
                <a-descriptions-item label="创建时间"> {{
                        mediaStore.detail?.createTime
                            ? dayjs(mediaStore.detail.createTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}</a-descriptions-item>
            </a-descriptions>
        </template>
        <FullPage>
            <div style="padding: 24px; height: 100%">
                <component
                    :is="tabs[mediaStore.tabActiveKey]"
                    @onJump="onTabChange"
                />
            </div>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts" name="Detail">
import {useMediaStore} from '@/store/media';
import Rule from './Rule/index.vue';
import Channel from './Channel/index.vue';
import Log from './Log/index.vue';
import dayjs from 'dayjs';
import { ref } from 'vue';

const mediaStore = useMediaStore();
const isEdit = ref(false)

const list = [
    {
        key: 'Rule',
        tab: '录制规则',
    },
    {
        key: 'Channel',
        tab: '关联通道',
    },
    {
        key: 'Log',
        tab: '执行日志',
    },
];

const tabs = {
    Rule,
    Channel,
    Log,
};

const onTabChange = (e: string) => {
    mediaStore.tabActiveKey = e;
};

const onSave = (val:boolean)=>{
    isEdit.value = val
}

</script>

<style lang="less" scoped></style>
