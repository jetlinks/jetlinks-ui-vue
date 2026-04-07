<template>
    <j-page-container>
        <pro-search
            :columns="columns"
            target="bind-channel"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                mode="TABLE"
                :columns="columns"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :request="query"
                :params="params"
            >
                <template #handleTime="slotsProps">
                    <span>
                        {{
                            slotsProps?.handleTime
                                ? dayjs(slotsProps.handleTime).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : '--'
                        }}
                    </span>
                </template>
                <template #handleType="slotProps">
                    <span>{{ slotProps.handleType?.text || '--' }}</span>
                </template>
                <template #alarmDuration="slotProps">
                    <j-ellipsis><Duration :data="slotProps" /></j-ellipsis>
                </template>
                <template #state="slotProps">{{
                    slotProps?.state?.text
                }}</template>
                <template #alarmTime="slotProps">
                    <span>
                        {{
                            dayjs(slotProps.alarmTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </span>
                </template>
                <template #description="slotProps">
                    {{ slotProps?.description || '--' }}
                </template>
            </JProTable>
        </FullPage>
    </j-page-container>
</template>

<script lang="ts" setup>
import { queryHandleHistory } from '../../../../api/log';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import Duration from '../components/Duration.vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const route = useRoute();
const id = route.query?.id;
const columns = [
{
        title: $t('Record.index.165150-5'),
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Record.index.165150-1'),
        dataIndex: 'handleTime',
        key: 'handleTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Record.index.165150-6'),
        dataIndex: 'alarmDuration',
        key: 'alarmDuration',
        scopedSlots: true,
    },
    {
        title: $t('Record.index.165150-8'),
        dataIndex: 'state',
        key: 'state',
        width: 100,
        search: {
          type: 'select',
          options: [
            {
              label: $t('components.Record.165159-8'),
              value: 'processed',
            },
            {
              label: $t('components.Record.165159-9'),
              value: 'unprocessed',
            },
          ],
        },
        scopedSlots: true,
    },
    {
        dataIndex: 'handleType',
        title: $t('Record.index.165150-2'),
        key: 'handleType',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                {
                    label: $t('Record.index.165150-3'),
                    value: 'system',
                },
                {
                    label: $t('Record.index.165150-4'),
                    value: 'user',
                },
            ],
        },
    },
    {
        title: $t('Record.index.165150-7'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        scopedSlots:true,
        search: {
            type: 'string',
        },
    },
];
const params = ref();
const query = async(queryParams) =>{
    return queryHandleHistory(id,queryParams);
}
const emit = defineEmits(['closeLog']);
/**
 * 关闭弹窗
 */

const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped></style>
