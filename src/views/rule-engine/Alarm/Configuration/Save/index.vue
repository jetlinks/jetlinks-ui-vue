<template>
    <page-container>
        <j-card>
            <j-tabs :activeKey="activeKey" @change="changeTabs">
                <j-tab-pane key="1" tab="基础配置">
                    <Base v-if="activeKey === '1'" />
                </j-tab-pane>
                <j-tab-pane key="2" tab="关联场景联动">
                    <Scene></Scene>
                </j-tab-pane>
                <j-tab-pane key="3" tab="告警记录">
                    <Log v-if="activeKey === '3'" />
                </j-tab-pane>
            </j-tabs>
        </j-card>
    </page-container>
</template>

<script lang="ts" setup>
import Base from './Base/index.vue';
import Scene from './Scene/index.vue';
import Log from './Log/indev.vue';
import { useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
const route = useRoute();
const changeTabs = (e: any) => {
    if (route.query?.id) {
        activeKey.value = e;
    } else {
        message.error('请先保存基础配置');
    }
};
const activeKey = ref('1');
</script>
<style lang="less" scoped>
</style>