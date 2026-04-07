<template>
  <j-page-container>
    <FullPage :fixed="false">
      <div class="container">
        <ResourceTable ref="tableRef" @itemClick="toDetail">
          <template #title>
            <a-space>
              <span>{{ $t('Resource.index.304912-0') }}</span>
              <a-button @click="showInstallModal = true"
              >{{ $t('Resource.index.304912-1') }}
              </a-button
              >
              <!-- <a-button @click="toDetail">详情</a-button> -->
            </a-space>
          </template>
        </ResourceTable>
        <Install
            v-if="showInstallModal"
            @close="closeInstall"
        />
      </div>
    </FullPage>
  </j-page-container>
</template>

<script setup>
import Install from './Install/index.vue';
import {ResourceTable} from '@device-manager-ui/components/ResourceTable/index.ts'
import {useMenuStore} from "@jetlinks-web-core/store";

const menuStory = useMenuStore();
const showInstallModal = ref(false);

const tableRef = ref(null);

const toDetail = (record) => {
  menuStory.jumpPage('resource/Resource/Detail', {
    params: {id: record.id},
  });
};

const closeInstall = () => {
  showInstallModal.value = false;
  tableRef.value?.refresh();
}
</script>
<style lang="less" scoped>
.container {
  padding: 20px;
  height: 100%;
}
</style>
