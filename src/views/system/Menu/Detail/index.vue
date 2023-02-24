<template>
    <page-container>
        <div class="menu-detail-container">
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="basic" tab="基本信息">
                    <BasicInfo />
                </a-tab-pane>
                <a-tab-pane key="button" tab="按钮管理">
                    <ButtonMange />
                </a-tab-pane>
            </a-tabs>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import BasicInfo from './BasicInfo.vue';
import ButtonMange from './ButtonMange.vue';
const activeKey = ref('basic');
</script>

<style lang="less" scoped>
.menu-detail-container {
    :deep(.ant-tabs-nav) {
        background-color: #fff;
        padding-left: 24px;
        margin-bottom: 0;
    }
    .ant-tabs-tabpane {
        background-color: #f0f2f5;
        padding-top: 24px;
    }
}
</style>
