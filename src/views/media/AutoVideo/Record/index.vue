<template>
    <page-container>
        <FullPage>
            <div class="bound">
                <div class="bound_device">
                    <div>选择设备及目录查看通道：</div>
                    <ChannelTree :height="700"/>
                </div>
                <div class="bound_channel">
                    <pro-search
                        :columns="columns"
                        @search="handleSearch"
                        :params="params"
                        style="padding-bottom: 0; margin-bottom: 0"
                    ></pro-search>
                    <j-pro-table
                        style="min-height: calc(100% - 60px)"
                        ref="tableRef"
                        :columns="columns"
                        model="table"
                    >
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
                                        style="padding: 0px"
                                        :tooltip="{
                                            ...i.tooltip,
                                        }"
                                        @click="i.onClick"
                                    >
                                        <AIcon :type="i.icon" />
                                    </PermissionButton> </template
                            ></j-space> </template
                    ></j-pro-table>
                </div>
            </div>
            <PlayBack v-if="playbackVisible" @close="playbackVisible = false"/>
        </FullPage>
    </page-container>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import ChannelTree from '@/views/media/AutoVideo/components/ChannelTree/index.vue';
import PlayBack from '@/views/media/AutoVideo/components/Playback/index.vue';
const playbackData = ref();
const playbackVisible = ref(false);
const params = ref();
const columns = [
    {
        title: 'ID',
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '通道名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: '安装地址',
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: '已录时长',
        search: {
            type: 'string',
        },
    },
    {
        title: '存储空间',
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e) => {
    params.value = e;
};

const getActions = (data, type) => {
    if (!data) return [];
    const actions = [
        {
            key: 'backPlay',
            text: '回放',
            tooltip: {
                title: '回放',
            },
            icon: 'PlayCircleOutlined',
            onClick: () => {
                playbackData.value = cloneDeep(data);
                playbackVisible.value = true;
            },
        },
    ];
    return actions;
};
</script>

<style lang="less" scoped>
.bound {
    padding: 0 20px;
    margin-top: 20px;
    display: flex;
    .bound_device {
        flex: 1;
    }
    .bound_channel {
        flex: 4;
    }
}
</style>
