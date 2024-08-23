<template>
    <div>
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
                <div>选择设备及目录查看已绑定的通道：</div>
                <ChannelTree :bind="700"/>
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
                    :dataSource="[
                        {
                            channelId: '123',
                        },
                    ]"
                    model="table"
                >
                    <template #action="slotProps">
                        <j-space :size="16">
                            <template v-for="i in actions" :key="i.key">
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
        <Bind v-if="bindVisible" @closeBind="bindVisible = false"></Bind>
        <RecordPicture v-if="pictureVisible" @close="pictureVisible = false" />
        <Live
            v-model:visible="playerVis"
            :data="playData"
            @refresh="tableRef.reload()"
        />
        <Logs v-if="logsVisible" @close="logsVisible = false" />
    </div>
</template>

<script setup name="Channel">
import Bind from './Bind.vue';
import ChannelTree from '@/views/media/AutoVideo/components/ChannelTree/index.vue';
import RecordPicture from '@/views/media/TimingCapture/components/RecordPicture/index.vue';
import Live from '@/views/media/Device/Channel/Live/index.vue';
import Logs from '@/views/media/AutoVideo/components/Logs/index.vue';
const bindCount = ref(0);
const tableRef = ref();
const bindVisible = ref(false);
const pictureVisible = ref(false);
const logsVisible = ref(false);
const pictureData = ref();
const route = useRoute();
const params = ref();
const editType = ref(route.query?.type !== 'edit');
const playData = ref();
const playerVis = ref(false);

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

const actions = computed(() => {
    return editType.value
        ? [
              {
                  key: 'play',
                  text: '播放',
                  tooltip: {
                      title: '播放',
                  },
                  icon: 'PlayCircleOutlined',
                  onClick: () => {
                      playData.value = cloneDeep(data);
                      playerVis.value = true;
                  },
              },
              {
                  key: 'unbind',
                  text: '解绑',
                  tooltip: {
                      title: '解绑',
                  },
                  icon: 'DisconnectOutlined',
                  popConfirm: {
                      title: '确认解绑吗？',
                      okText: '确定',
                      cancelText: '取消',
                      onConfirm: async () => {},
                  },
              },
          ]
        : [
              {
                  key: 'picture',
                  text: '抓拍',
                  tooltip: {
                      title: '抓拍',
                  },
                  icon: 'PictureOutlined',
                  onClick: () => {
                      pictureData.value = cloneDeep(data);
                      pictureVisible.value = true;
                  },
              },
              {
                  key: 'logs',
                  text: '日志',
                  tooltip: {
                      title: '日志',
                  },
                  icon: 'ExceptionOutlined',
                  onClick: () => {
                      logsVisible.value = true;
                  },
              },
          ];
});
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
const clearBind = () => {};
</script>

<style lang="less">
.channelControl {
    display: flex;
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
</style>
