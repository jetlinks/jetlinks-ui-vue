<template>
    <page-container :showBack="true">
        <template #title> </template>
        <FullPage>
            <div class="detail">
                <j-tabs v-model:activeKey="activeKey" class="tabs">
                    <j-tab-pane class="tab_con" key="Basic" tab="基础信息">
                        <Basic></Basic>
                    </j-tab-pane>
                    <j-tab-pane class="tab_con" key="Running" tab="运行状态">
                    </j-tab-pane>
                    <j-tab-pane class="tab_con" key="Sub" tab="子设备">
                        <Sub></Sub>
                    </j-tab-pane>
                    <j-tab-pane class="tab_con" key="Forklift" tab="叉车监控">
                    </j-tab-pane>
                </j-tabs>
            </div>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import Basic from './Basic/index.vue';
import Sub from './Sub/index.vue';
const activeKey = ref('Basic');
</script>

<style lang="less" scoped>
.detail {
    width: 100%;
    height: 100%;
    .tabs {
        margin-left: 30px;
        width: 98%;
        .tab_con {
            margin: 10px;
        }
    }
}
</style>
