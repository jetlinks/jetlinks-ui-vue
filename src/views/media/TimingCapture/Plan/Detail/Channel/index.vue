<template>
    <div>
        <a-spin :spinning="spinning">
            <div class="channelControl">
                <div class="bind">已绑定通道数：{{ bindCount }}</div>
                <a-space v-if="editType">
                    <a-button @click="clearBind">清空通道</a-button>
                    <a-button @click="showBind">绑定通道</a-button>
                </a-space>
                <div v-else>
                    <PermissionButton
                        type="link"
                        hasPermission="device/Instance:action"
                        @click="editType = true"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>
                </div>
            </div>
            <div class="bound">
                <div class="bound_device">
                    <div v-if="showBody">选择设备及目录查看已绑定的通道：</div>
                    <ChannelTree
                        ref="treeRef"
                        :height="700"
                        :id="route.params.id"
                        v-model:deviceId="deviceId"
                        v-model:channelId="channelId"
                        @select="treeSelect"
                        @load="onLoad"
                    />
                </div>
                <div v-if="showBody" class="bound_channel">
                    <div style="padding: 12px 24px 0">
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
                        target="capture-plan-channel"
                        style="padding-bottom: 0; margin-bottom: 0"
                    ></pro-search>
                    <j-pro-table
                        style="min-height: calc(100% - 60px)"
                        ref="tableRef"
                        model="table"
                        rowKey="channelId"
                        :columns="columns"
                        :request="query"
                        :params="params"
                    >
                        <template #status="slotProps">
                            <BadgeStatus
                                :text="slotProps.status.text"
                                :status="slotProps.status.value"
                                :statusNames="{
                                    online: 'success',
                                    offline: 'error',
                                }"
                            />
                        </template>
                        <template #channelId="slotProps">
                            <Ellipsis>{{ slotProps.channelId }}</Ellipsis>
                        </template>
                        <template #action="slotProps">
                            <j-space :size="16">
                                <template v-if="editType">
                                    <PermissionButton
                                        type="link"
                                        style="padding: 0px"
                                        :tooltip="{ title: '播放' }"
                                        @click="
                                            () => {
                                                onPlay(slotProps);
                                            }
                                        "
                                    >
                                        <AIcon type="VideoCameraOutlined" />
                                    </PermissionButton>

                                    <PermissionButton
                                        type="link"
                                        style="padding: 0px"
                                        :tooltip="{ title: '解绑' }"
                                        :popConfirm="{
                                            title: '确认解绑吗？',
                                            okText: '确定',
                                            cancelText: '取消',
                                            onConfirm: () => {
                                                unBind(slotProps);
                                            },
                                        }"
                                    >
                                        <AIcon type="DisconnectOutlined" />
                                    </PermissionButton>
                                </template>
                                <template v-else>
                                    <PermissionButton
                                        type="link"
                                        style="padding: 0px"
                                        :tooltip="{ title: '抓拍' }"
                                        @click="
                                            () => {
                                                onPicture(slotProps);
                                            }
                                        "
                                    >
                                        <AIcon type="PictureOutlined" />
                                    </PermissionButton>
                                    <PermissionButton
                                        type="link"
                                        style="padding: 0px"
                                        :tooltip="{ title: '日志' }"
                                        @click="
                                            () => {
                                                onLogs(slotProps);
                                            }
                                        "
                                    >
                                        <AIcon type="ExceptionOutlined" />
                                    </PermissionButton>
                                </template>
                            </j-space>
                        </template>
                    </j-pro-table>
                </div>
            </div>
            <div v-if="showBody">
                <a-button
                    type="primary"
                    :loading="saveLoading"
                    @click="saveChannel"
                    >保存</a-button
                >
            </div>
            <div v-if="!showBody" class="video-unbind-tip">请先绑定通道</div>
        </a-spin>

        <Bind
            v-if="bindVisible"
            :cacheDeviceIds="cacheDeviceIds"
            @closeBind="bindVisible = false"
            @submit="submit"
        />
        <RecordPicture v-if="pictureVisible" @close="pictureVisible = false" />
        <Live
            v-model:visible="playerVis"
            :data="playData"
            @refresh="tableRef.reload()"
        />
        <!-- <Logs v-if="logsVisible" @close="logsVisible = false" /> -->
    </div>
</template>

<script setup name="Channel">
import Bind from './Bind.vue';
import ChannelTree from '@/views/media/AutoVideo/components/ChannelTree/index.vue';
import RecordPicture from '@/views/media/TimingCapture/components/RecordPicture/index.vue';
import Live from '@/views/media/Device/Channel/Live/index.vue';
import { useRequest } from '@/hook';
import {
    bindChannel,
    queryBoundChannel,
    unbindChannel,
    unbindChannelAll,
} from '@/api/media/auto';
import { Modal } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { onlyMessage } from '@/utils/comm';
import BadgeStatus from '@/components/BadgeStatus/index.vue';

// import Logs from '@/views/media/AutoVideo/components/Logs/index.vue';
const bindCount = ref(0);
const tableRef = ref();
const treeRef = ref();
const bindVisible = ref(false);
const pictureVisible = ref(false);
const logsVisible = ref(false);
const pictureData = ref();
const route = useRoute();
const params = ref();
const editType = ref(false);
const playData = ref();
const playerVis = ref(false);
const pathsName = ref();
const deviceId = ref();
const channelId = ref();
const cacheDeviceIds = ref({});
const unBindChannelIds = ref({});
const currentDeviceId = ref();

const showBody = ref(false);
const saveLoading = ref(false);

const videoTags = inject('video-tags');

const { loading: spinning, run } = useRequest(unbindChannelAll, {
    immediate: false,
    onSuccess: async () => {
        await treeRef.value.getDeviceList();
        showBody.value = false;
        queryBoundChannel(defaultParams).then((resp) => {
            if (resp.success) {
                bindCount.value = resp.result.total;
            }
        });
    },
});

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
        title: '名称',
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
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: '已连接', value: 'online' },
                { label: '未连接', value: 'offline' },
            ],
        },
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];

const onPlay = (record) => {
    playData.value = cloneDeep(record);
    playerVis.value = true;
};

const unBind = (record) => {
    const cacheDevice = cacheDeviceIds.value[deviceId.value];

    const cacheChannelIds = cacheDevice?.channelIds; // 获取当前树节点下缓存
    if (cacheDevice && cacheChannelIds.includes(record.channelId)) {
        // 清除缓存中的通道id
        cacheDeviceIds.value[deviceId.value].channelIds =
            cacheChannelIds.filter((id) => id !== record.channelId);
    } else {
        // 记录后端已绑定的id，保存时统一处理解除
        unBindChannelIds.value[record.channelId] = currentDeviceId.value;
    }
    tableRef.value.reload();
};

const onPicture = (record) => {
    pictureData.value = cloneDeep(record);
    pictureVisible.value = true;
};

const onLogs = (record) => {
    videoTags.terms = [
        {
            column: 'channelId',
            termType: 'eq',
            value: record.channelId,
        },
    ];
    videoTags.tag.value = 'Log';
};
const showBind = () => {
    bindVisible.value = true;
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e) => {
    params.value = e;
};
const clearBind = () => {
    Modal.confirm({
        title: '清空操作不可撤销，确认清空所有通道？',
        onOk() {
            run(route.params.id);
        },
    });
};

const submit = (data) => {
    cacheDeviceIds.value = { ...data };
    treeRef.value.getDeviceList({ ...data });
    bindVisible.value = false;
    tableRef.value?.reload();
};

const query = (params) => {
    const _params = params;
    const defaultParams = {
        terms: [
            {
                terms: [
                    {
                        column: 'channelId$media-record-schedule-bind-channel',
                        value: [
                            {
                                column: 'scheduleId',
                                termType: 'eq',
                                value: route.params.id,
                            },
                        ],
                    },
                    {
                        column: 'deviceId$media-record-schedule-bind-device',
                        value: [
                            {
                                column: 'scheduleId',
                                termType: 'eq',
                                value: route.params.id,
                            },
                        ],
                    },
                ],
            },
        ],
    };

    if (deviceId.value) {
        defaultParams.terms.push({
            column: 'deviceId',
            value: deviceId.value,
            type: 'and',
        });
    }

    if (cacheDeviceIds.value[deviceId.value]) {
        defaultParams.terms.push({
            column: 'channelId',
            termType: 'in',
            value: cacheDeviceIds.value[deviceId.value].channelIds.toString(),
            type: 'or',
        });
    }

    const keys = Object.keys(unBindChannelIds.value);
    if (keys.length) {
        defaultParams.terms.push({
            column: 'channelId',
            termType: 'nin',
            value: keys.toString(),
            type: 'and',
        });
    }

    _params.terms = [...defaultParams.terms, ..._params.terms];

    return queryBoundChannel(_params);
};

const saveChannel = () => {
    const terms = [];
    Object.values(cacheDeviceIds.value).forEach(
        ({ channelIds, channelCatalog, paths }) => {
            const [deviceId] = paths;
            terms.push(
                ...channelIds.map((id) => ({
                    deviceId: deviceId,
                    channelId: id,
                    others: {
                        channelCatalog: channelCatalog.join('\/'),
                    },
                })),
            );
        },
    );

    saveLoading.value = true;
    bindChannel(route.params.id, terms)
        .then((resp) => {
            if (resp.success) {
                cacheDeviceIds.value = {};
                treeRef.value.getDeviceList();
                onlyMessage('操作成功');
                editType.value = false;
                getBindTotal();
            }
        })
        .finally(() => {
            saveLoading.value = false;
        });

    const keys = Object.keys(unBindChannelIds.value);

    if (keys.length) {
        const unBindTerms = keys.map((channelId) => ({
            deviceId: unBindChannelIds.value[channelId],
            channelId,
        }));
        unbindChannel(route.params.id, unBindTerms);
    }
};

const treeSelect = ({ node }) => {
    const { paths, channelCatalog } = node;

    currentDeviceId.value = paths[0];
    pathsName.value = channelCatalog;

    tableRef.value.reload();
};

const getBindTotal = () => {
    const defaultParams = {
        terms: [
            {
                terms: [
                    {
                        column: 'channelId$media-record-schedule-bind-channel',
                        value: [
                            {
                                column: 'scheduleId',
                                termType: 'eq',
                                value: route.params.id,
                            },
                        ],
                    },
                    {
                        column: 'deviceId$media-record-schedule-bind-device',
                        value: [
                            {
                                column: 'scheduleId',
                                termType: 'eq',
                                value: route.params.id,
                            },
                        ],
                    },
                ],
            },
        ],
    };
    queryBoundChannel(defaultParams).then((resp) => {
        if (resp.success) {
            bindCount.value = resp.result.total;
        }
    });
};

const onLoad = (data) => {
    showBody.value = data.length;
};

getBindTotal();
</script>

<style lang="less">
.channelControl {
    display: flex;
    align-items: center;
    .bind {
        margin-right: 20px;
    }
}
.bound {
    margin-top: 20px;
    display: flex;
    .bound_device {
        flex: 1;
    }
    .bound_channel {
        flex: 3;
    }
}
.video-unbind-tip {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 100px;
}
</style>
