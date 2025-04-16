<template>
    <page-container>
        <div class="menu-detail-container">
            <j-tabs v-model:activeKey="activeKey">
                <j-tab-pane key="basic" tab="基本信息">
                    <BasicInfo :value="data" @refresh="onRefresh"/>
                </j-tab-pane>
                <j-tab-pane key="button" tab="按钮管理">
                    <ButtonMange :value="data" @refresh="onRefresh"/>
                </j-tab-pane>
            </j-tabs>
        </div>
    </page-container>
</template>

<script setup lang="ts">
import BasicInfo from './BasicInfo.vue';
import ButtonMange from './ButtonMange.vue';
import { getMenuInfo_api } from '@/api/system/menu';
import { useRequest } from '@/hook'

const route = useRoute()
const activeKey = ref('basic');

const {data, run} = useRequest(getMenuInfo_api, {
  immediate: false,
})
const onRefresh = (id: string) => {
  run(id || route.params.id);
}

watch(
  () => route.params.id,
  (newValue) => {
    if (newValue && newValue !== ':id') {
      run(newValue as string)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
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
