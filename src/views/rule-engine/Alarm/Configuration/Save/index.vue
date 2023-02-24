<template>
        <page-container>
            <a-card>
                <a-tabs v-model:activeKey="activeKey">
                    <a-tab-pane key="1" tab="基础配置">
                        <Base/>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="关联场景联动">
                        <Scene></Scene>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="告警记录"></a-tab-pane>
                </a-tabs>
            </a-card>
        </page-container>
</template>

<script lang="ts" setup>
import Base from './Base/index.vue';
import Scene from './Scene/index.vue'
const activeKey = ref('2');
</script>
<style lang="less" scoped>
</style>