<template>
    <div>
        <pro-search
            :columns="columns"
            style="margin-bottom: 0"
            target="AutoVideoPlanLog"
            @search="handleSearch"
        ></pro-search>
        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :params="params"
            model="table"
            :request="e=>queryLogs(route.params.id,e)"
        >
            <template #createTime="slotProps">
                {{ dayjs(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #state="slotProps">
                {{ slotProps.state?.text }}
            </template>
            <template #action="slotProps">
                <j-space :size="16">
                    <template
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                    >
                        <PermissionButton
                            :disabled="i.disabled"
                            :popConfirm="i.popConfirm"
                            type="link"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            @click="i.onClick"
                        >
                            <AIcon :type="i.icon" />
                        </PermissionButton> </template
                ></j-space> </template
        ></j-pro-table>
        <logView v-if="logsVisible" :data="logData" @close="logsVisible  = false"/>
    </div>
</template>

<script setup name="Log">
import { queryLogs } from '@/api/media/auto';
import dayjs from 'dayjs';
import logView from './logView.vue';
import { useRouteQuery } from '@vueuse/router';
import { onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute();
const params = ref();
const tableRef = ref();
const logsVisible = ref(false);
const logData = ref({})

const q = useRouteQuery('q')
const searchTarget = useRouteQuery('target')

const columns = [
    {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '通道ID',
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '通道名称',
        dataIndex: 'channelName',
        key: 'channelName',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '设备ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '设备名称',
        dataIndex: 'deviceName',
        ellipsis: true,
        key: 'deviceName',
        search: {
            type: 'string',
        },
    },
    {
        title: '执行状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [],
        },
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];

const videoTags = inject('video-tags')

/**
 * 搜索
 * @param params
 */
const handleSearch = (e) => {
    params.value = e;
};

const getActions = (data) => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                logsVisible.value = true;
                logData.value = data;
            },
        },
    ];
    return actions;
};

onMounted(() => {
  searchTarget.value = 'AutoVideoPlanLog'
  q.value = encodeURI(JSON.stringify({terms: videoTags.terms }));
})

onBeforeUnmount(() => {
  videoTags.terms = []
})

</script>

<style lang="less"></style>
