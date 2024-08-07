<template>
    <page-container>
        <div class="details-container">
            <j-tabs v-model:activeKey="activeKey">
                <j-tab-pane key="1" :tab="$t('Detail.index.529971-0')"><Permiss /></j-tab-pane>
                <j-tab-pane key="2" :tab="$t('Detail.index.529971-1')"><User /></j-tab-pane>
            </j-tabs>
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Detail">
import Permiss from './Permiss/index.vue';
import User from './User/index.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const activeKey = ref('1');
</script>

<style lang="less" scoped>
.details-container {
    :deep(.ant-tabs-nav-wrap) {
        background-color: #fff;
        padding-left: 24px;
    }
}
</style>
