<template>
  <j-page-container>
    <div class="menu-detail-container">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="basic" :tab="$t('Detail.index.765389-0')">
          <BasicInfo :value="initData" @refresh="onRefresh"/>
        </a-tab-pane>
        <a-tab-pane key="button" :tab="$t('Detail.index.765389-1')">
          <ButtonMange :value="initData" @refresh="onRefresh" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </j-page-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import BasicInfo from './BasicInfo/index.vue'
import ButtonMange from './ButtonMange/index.vue'
import { getMenuInfo } from '@/api/system/menu'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const route = useRoute()
const activeKey = ref('basic')
const initData = ref<any>({})

const handleSearch = (id: string) => {
  getMenuInfo(id).then((resp: any) => {
    if (resp.success) {
      initData.value = resp.result
    }
  })
}

watch(
  () => route.params.id,
  (newValue) => {
    if (newValue && newValue !== ':id') {
      handleSearch(newValue as string)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

const onRefresh = () => {
  handleSearch(route.params.id as string)
}
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
