<template>
    <j-spin :spinning="loading">
        <div style="margin-top: 24px">
            <div class="alert">
                <AIcon type="InfoCircleOutlined" />
                你可以在该页面选择需要订阅的主题及接收通知的方式。
            </div>
            <div style="margin-top: 20px">
                <template v-if="dataSource.length">
                    <j-collapse :bordered="false" v-model:activeKey="activeKey">
                        <template #expandIcon="{ isActive }">
                            <AIcon
                                type="CaretRightOutlined"
                                :style="{
                                    transform: `rotate(${
                                        isActive ? 90 : 0
                                    }deg)`,
                                }"
                            />
                        </template>
                        <j-collapse-panel
                            v-for="item in dataSource"
                            :key="item.provider"
                            class="custom"
                        >
                            <template #header
                                ><h3>{{ item.name }}</h3></template
                            >
                            <div class="child">
                                <template
                                    v-for="child in item.children"
                                    :key="child.id"
                                >
                                    <Item
                                        @refresh="handleSearch"
                                        :data="child"
                                        :subscribe="
                                            subscribe.find(
                                                (i) =>
                                                    i?.topicProvider ===
                                                    child?.provider,
                                            )
                                        "
                                    />
                                </template>
                            </div>
                        </j-collapse-panel>
                    </j-collapse>
                </template>
                <j-empty style="margin: 200px 0" v-else />
            </div>
        </div>
    </j-spin>
</template>

<script lang="ts" setup>
import { getAllNotice } from '@/api/account/center';
import { getNoticeList_api } from '@/api/account/notificationSubscription';
import Item from './components/Item.vue';

const initData = [
    {
        provider: 'alarm',
        name: '告警',
        children: [
            {
                provider: 'alarm-product',
                name: '产品告警',
                description:
                    '当产品类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
            {
                provider: 'alarm-device',
                name: '设备告警',
                description:
                    '当设备类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
            {
                provider: 'alarm-org',
                name: '部门告警',
                description:
                    '当部门类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
            {
                provider: 'alarm-other',
                name: '其他告警',
                description:
                    '当其他类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
        ],
    },
    {
        provider: 'system-monitor',
        name: '系统监控',
        children: [
            {
                provider: 'system-event',
                name: '系统运行异常',
            },
        ],
    },
    {
        provider: 'system-business',
        name: '业务监控',
        children: [
            {
                provider: 'device-transparent-codec',
                name: '透传消息解析异常',
            },
        ],
    },
];
const subscribe = ref<any[]>([]);
const dataSource = ref<any[]>([]);
const activeKey = ref<string[]>(['alarm', 'system-monitor', 'system-business']);
const loading = ref<boolean>(false)

const handleSearch = () => {
    loading.value = true
    getAllNotice().then((resp: any) => {
        if (resp.status === 200) {
            const arr = initData
                .map((item) => {
                    const _child = item.children.map((i) => {
                        const _item = (resp.result || []).find(
                            (t: any) => t?.provider === i?.provider,
                        );
                        return {
                            ...i,
                            ..._item,
                        };
                    });
                    return {
                        ...item,
                        children: _child,
                    };
                })
                .filter((it: any) => {
                    return it.children.filter((lt: any) => lt?.id)?.length;
                })
                .map((item) => {
                    return {
                        ...item,
                        children: item.children.filter((lt: any) => lt?.id),
                    };
                });
            dataSource.value = arr;
        }
    });
    getNoticeList_api().then((resp: any) => {
        if (resp.status === 200) {
            subscribe.value = resp?.result?.data || [];
        }
    }).finally(() => {
        loading.value = false
    })
};

onMounted(() => {
    handleSearch();
});
</script>

<style lang="less" scoped>
.alert {
    height: 40px;
    padding-left: 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
.custom {
    background: #f7f7f7;
    border-radius: 4px;
    border: 0;
    overflow: hidden;
}
.child {
    background-color: white;
    padding: 10px;
}
</style>