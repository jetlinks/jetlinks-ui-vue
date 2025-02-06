<script setup name="Positions">
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';
import { useColumns } from './data';
import {useMenuStore} from "@/store";

const { t: $t } = useI18n();
const params = ref({});
const permission = 'system/Positions';
const columns = useColumns(permission);
const menuStore = useMenuStore()

const onAdd = () => {
  menuStore.jumpPage('system/Positions/Detail', {})
}
</script>

<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="system-user"
      v-model:value="params"
    />
    <full-page>
      <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :params="params"
        :columns="columns"
        :defaultParams="{
            sorts: [
                { name: 'createTime', order: 'desc' },
            ],
        }"
        :scroll="{ y: 'calc(100% - 60px)' }"
      >
        <template #headerLeftRender>
          <j-permission-button
            :hasPermission="`${permission}:add`"
            type="primary"
            @click="onAdd"
          >
            <AIcon type="PlusOutlined" />{{ $t('User.index.673867-0') }}
          </j-permission-button>
        </template>
      </j-pro-table>
    </full-page>
  </j-page-container>
</template>

<style scoped lang="less">

</style>
