<template>
    <page-container>
        <FullPage>
            <div class="bound">
                <div class="bound_device">
                    <div>选择设备及目录查看通道：</div>
                    <ChannelTree
                        :height="700"
                        type="unbind"
                        v-model:deviceId="deviceId"
                        v-model:channelId="channelId"
                        @select="treeSelect"
                    />
                </div>
                <div class="bound_channel">
                    <div style="padding: 12px 24px 0;display: flex">
                        <div class="catalogue">当前目录：</div>
                        <a-breadcrumb>
                            <a-breadcrumb-item v-for="name in pathsName">{{
                                name
                            }}</a-breadcrumb-item>
                        </a-breadcrumb>
                    </div>
                    <pro-search
                        :columns="columns"
                        @search="handleSearch"
                        :params="params"
                        target="timing-capture-record"
                        style="padding-bottom: 0; margin-bottom: 0"
                    ></pro-search>
                    <FullPage>
                        <j-pro-table
                            style="min-height: calc(100% - 60px)"
                            ref="tableRef"
                            :columns="columns"
                            model="table"
                            :params="params"
                            :request="query"
                        >
                        <template #fileSize="slotProps">
                            {{slotProps.fileSize ? (slotProps.fileSize / 1024 / 1024).toFixed(2):0 }}M
                        </template>
                            <template #action="slotProps">
                                <j-space :size="16">
                                    <template
                                        v-for="i in getActions(
                                            slotProps,
                                            'table',
                                        )"
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
                    </FullPage>
                </div>
            </div>
            <RecordPicture
                v-if="pictureVisible"
                :data="pictureData"
                @close="pictureVisible = false"
            />
        </FullPage>
    </page-container>
</template>

<script setup>
import { cloneDeep } from 'lodash-es';
import ChannelTree from '@/views/media/AutoVideo/components/ChannelTree/index.vue';
import RecordPicture from '@/views/media/TimingCapture/components/RecordPicture/index.vue';
import { queryRecord } from '@/api/media/auto';

const pictureData = ref();
const pictureVisible = ref(false);
const params = ref();
const deviceId = ref();
const channelId = ref();
const tableRef = ref();
const pathsName = ref();
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
        title: '已拍数量',
        dataIndex:'fileCount',
    },
    {
        title: '存储空间',
        scopedSlots: true,
        key:'fileSize',
        dataIndex:'fileSize',
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
            key: 'picture',
            text: '抓拍',
            tooltip: {
                title: '抓拍',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                pictureData.value = cloneDeep(data);
                pictureData.value.pathsName = pathsName.value
                pictureVisible.value = true;
            },
        },
    ];
    return actions;
};

const query = (params) => {
    const _params = params;
    const defaultParams = {
        terms:[]
    };

    if (deviceId.value) {
        defaultParams.terms?.push({
            column: 'deviceId',
            value: deviceId.value,
            type: 'and',
        });
    }

    if (channelId.value) {
        defaultParams.terms?.push({
            column: 'channelId',
            //   termType: 'in',
            value: channelId.value,
            type: 'or',
        });
    }

    _params.terms = [...defaultParams.terms, ..._params.terms];

    return queryRecord( 'screenshot',_params);
};

const treeSelect = ({ node }) => {
    const {  channelCatalog } = node;
    pathsName.value = channelCatalog;
};

watch(() => [deviceId.value, channelId.value], () => {
  tableRef.value.reload()
}, { deep: true })

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
        .catalogue{
            color:#1A1A1A
        }
        :deep(.ant-breadcrumb-link){
            color:#777777
        }
    }
}
</style>
