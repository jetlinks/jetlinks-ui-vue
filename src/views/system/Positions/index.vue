<script setup name="Positions">
import { useI18n } from 'vue-i18n';
import { useColumns } from './data';
import {useMenuStore} from "@/store";
import { queryPage, del } from '@/api/system/positions';
import {useRoute} from "vue-router";
import {onlyMessage} from "@jetlinks-web/utils";

const { t: $t } = useI18n();
const params = ref({});
const permission = 'system/Positions';
const columns = useColumns(permission);
const menuStore = useMenuStore()
const tableRef = ref()

const save = useRoute().query.save

const onAdd = () => {
  menuStore.jumpPage('system/Positions/Detail', {
    params: {
      id: ':id',
    },
  })
}

const onEdit = (record) => {
  menuStore.jumpPage('system/Positions/Detail', {
    params: {
      id: record.id,
    },
  })
}

const onDelete = (id) => {
  del(id).then(() => {
    onlyMessage($t('components.Item.641816-0'))
    tableRef.value.reload()
  })
}

onMounted(() => {
  if (save) {
    setTimeout(() => {
      onAdd()
    })
  }
})

const onSearch = (e) => {
  e?.terms.map(a => {
    return a.terms.map(b => {
      if (b.column === 'roles') {
        b.column = 'id$position-role$position'
        b.termType = undefined
      }
      return b
    })
  })
  params.value = e
}

</script>

<template>
  <j-page-container>
    <pro-search
      :columns="columns"
      target="system-position"
      @search="onSearch"
    />
    <full-page>
      <j-pro-table
        ref="tableRef"
        mode="TABLE"
        :request="queryPage"
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
        <template #roles="record">
          <j-ellipsis>
            {{ record.roles?.map(item => item.name).join(',') || '' }}
          </j-ellipsis>
        </template>
        <template #parentId="record">
          <j-ellipsis>
            {{ record.parentName || '--' }}
          </j-ellipsis>
        </template>
        <template #orgId="record">
          <j-ellipsis>{{ record.orgName || record.orgId }}</j-ellipsis>
        </template>
        <template #action="slotProps">
          <a-space>
            <j-permission-button
              type="link"
              :hasPermission="`${permission}:update`"
              :tooltip="{ title: $t('User.index.673867-3') }"
              @click="onEdit(slotProps)"
            >
              <template #icon>
                <AIcon type="EditOutlined" />
              </template>
            </j-permission-button>
            <j-permission-button
              type="link"
              danger
              :hasPermission="`${permission}:delete`"
              :tooltip="{ title: $t('User.index.673867-8') }"
              :popConfirm="{
                title: $t('User.index.673867-9'),
                onConfirm: () => onDelete(slotProps.id),
              }"
            >
              <template #icon>
                <AIcon type="DeleteOutlined" />
              </template>
            </j-permission-button>
          </a-space>
        </template>
      </j-pro-table>
    </full-page>
  </j-page-container>
</template>

<style scoped lang="less">

</style>
