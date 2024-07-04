<template>
    <page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="instanceStore.tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title> </template>
        <FullPage>
            <div style="padding: 24px; height: 100%">
                <component
                    :is="tabs[instanceStore.tabActiveKey]"
                    v-bind="{ type: 'device' }"
                    @onJump="onTabChange"
                />
            </div>
        </FullPage>
        <FloatBackBtn></FloatBackBtn>
    </page-container>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import FloatBackBtn from './components/FloatBackBtn/index.vue';
import Basic from './Basic/index.vue';
import Sub from './Sub/index.vue';
import Running from './Running/index.vue';
import Forklift from './Forklift/index.vue';
import { getWebSocket } from '@/utils/websocket';
const instanceStore = useInstanceStore();
const route = useRoute();

const statusRef = ref();

const initList = [
    {
        key: 'Basic',
        tab: '车辆信息',
    },
    {
        key: 'Running',
        tab: '运行数据',
    },
    {
        key: 'Sub',
        tab: '智能设备',
    },
    {
        key: 'Forklift',
        tab: '实时监控',
    },
    {
        key: 'Configuration',
        tab: '采集配置',
    },
];
const list = ref([...initList]);

const tabs = {
    Basic,
    Sub,
    Running,
    Forklift,
};

const initPage = async (newId: any) => {
    await instanceStore.refresh(String(newId));
    getStatus(String(newId));
    list.value = [...initList];
    //   getDetail();
    instanceStore.tabActiveKey = 'Basic';
};

onBeforeRouteUpdate((to: any) => {
    console.log('instanceStore', instanceStore.current);
    if (
        to.query?.deviceId !== instanceStore.current.id &&
        to.name === 'vehicle/vehicleManagement/vehicelTool/Detail'
    ) {
        initPage(to.query?.deviceId);
    }
});

const getDetailFn = async () => {
    const _id = route.query?.deviceId;
    instanceStore.tabActiveKey = 'Basic';
    if (_id) {
        await instanceStore.refresh(String(_id));
        getStatus(String(_id));
        list.value = [...initList];
        // getDetail();
    }
};

onMounted(() => {
    getDetailFn();
});

const getStatus = (id: string) => {
    statusRef.value = getWebSocket(
        `instance-editor-info-status-${id}`,
        `/dashboard/device/status/change/realTime`,
        {
            deviceId: id,
        },
    ).subscribe((message: any) => {
        if (
            message.payload?.value?.type !== instanceStore.current?.state.value
        ) {
            instanceStore.refresh(id);
        }
    });
};

const onTabChange = (e: string) => {
    instanceStore.tabActiveKey = e;
};

onUnmounted(() => {
    instanceStore.current = {} as any;
    statusRef.value && statusRef.value.unsubscribe();
});
</script>

<style lang="less" scoped>
.detail {
    width: 100%;
    height: 100%;
    .tabs {
        margin-left: 30px;
        width: 98%;
        .tab_con {
            margin: 10px;
        }
    }
}
</style>
