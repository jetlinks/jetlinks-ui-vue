<template>
    <page-container>
        <div class="menu-detail-container">
            <j-tabs v-model:activeKey="activeKey">
                <j-tab-pane key="basic" :tab="$t('Detail.index.159183-0')">
                    <BasicInfo />
                </j-tab-pane>
                <j-tab-pane key="button" :tab="$t('Detail.index.159183-1')">
                    <ButtonMange />
                </j-tab-pane>
            </j-tabs>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import BasicInfo from './BasicInfo.vue';
import ButtonMange from './ButtonMange.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
