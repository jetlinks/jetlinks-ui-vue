<template>
    <j-page-container>
        <FullPage>
          <div class="details-container">
            <a-tabs v-model:activeKey="activeKey" type="card">
              <a-tab-pane key="1" :tab="$t('Detail.index.386725-0')" />
              <a-tab-pane key="2" :tab="$t('Detail.index.386725-1')" />
            </a-tabs>
            <div class="content">
              <User v-if="activeKey === '2'" />
              <Permission v-else  />
            </div>
          </div>
        </FullPage>
    </j-page-container>
</template>

<script setup lang="ts" name="RoleDetail">
import Permission from './Permission/index.vue';
import User from './User/index.vue';
import FullPage from "@/layout/FullPage.vue";
import {useI18n} from "vue-i18n";

const { t: $t } = useI18n();
const activeKey = ref('1');
</script>

<style lang="less" scoped>
.details-container {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .content {
    min-height: 0;
    flex: 1;
  }
}
</style>
