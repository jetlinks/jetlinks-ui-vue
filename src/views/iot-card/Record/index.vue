<!-- 操作记录 -->
<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="record-search"
            @search="handleSearch"
        />
        <FullPage>
          <j-pro-table
              ref="RecordRef"
              :columns="columns"
              :request="queryList"
              :defaultParams="{
                      sorts: [{ name: 'time', order: 'desc' }],
                  }"
              :params="params"
              :model="'TABLE'"
          >
              <template #time="slotProps">
                  {{
                      slotProps.time
                          ? moment(slotProps.time).format('YYYY-MM-DD HH:mm:ss')
                          : ''
                  }}
              </template>
          </j-pro-table>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { queryList } from '@/api/iot-card/record';
import moment from 'moment';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const params = ref<Record<string, any>>({});

const columns = [
    {
        title: $t('Record.index.745799-0'),
        dataIndex: 'cardId',
        key: 'cardId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Record.index.745799-1'),
        dataIndex: 'type',
        key: 'type',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Record.index.745799-2'),
        dataIndex: 'time',
        key: 'time',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Record.index.745799-3'),
        dataIndex: 'operator',
        key: 'operator',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

const handleSearch = (e: any) => {
    params.value = e;
};
</script>

<style scoped lang="less"></style>
