<template>
    <j-page-container>
        <FullPage>
            <div class="content">
                <div style="margin-bottom: 15px;">
                    <div class="alert">
                        <AIcon type="InfoCircleOutlined" />
                        启用通知类型后，你可以为每种通知类型配置不同的通知方式、通知模板、接收人。
                    </div>
                </div>
                <div class="content-collapse">
                    <a-collapse :bordered="false" v-model:activeKey="activeKey" expand-icon-position="right">
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
                        <a-collapse-panel
                            v-for="item in tabs"
                            :key="item.provider"
                        >
                            <template #header>
                                <div>
                                    {{ item.name }}
                                    <span style="margin-left: 10px;" class="alert" v-if="item.provider === 'alarm'">注意：接收人需要有告警配置页面查询权限，才能收到告警类通知</span>
                                </div>
                            </template>
                            <div>
                                <template
                                    v-for="(child, index) in item.children"
                                    :key="child.provider"
                                >
                                    <Item
                                        :data="child"
                                        @refresh="onRefresh"
                                        :isLast="index === item.children?.length"
                                        :provider="item.provider"
                                    />
                                </template>
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </div>
        </FullPage>
    </j-page-container>
</template>

<script lang="ts" setup>
import { queryChannelConfig } from '@/api/system/noticeRule';
import Item from './components/Item/index.vue';
import { useMenuStore } from '@/store/menu'
const menuStore = useMenuStore();
let dataSource:any[] =[]
const systemNotice = [
    {
        provider: 'alarm',
        name: '告警',
        children: [
            {
                provider: 'alarm-product',
                name: '产品告警',
            },
            {
                provider: 'alarm-device',
                name: '设备告警',
            },
            {
                provider: 'alarm-org',
                name: '部门告警',
            },
            {
                provider: 'alarm-other',
                name: '其他告警',
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
const lowCodeNotice = [
    {
        provider: 'workflow-notification',
        name: '工作流通知',
        children: [
            {
                provider: 'workflow-task-todo',
                name: '待办通知',
            },
            {
                provider: 'workflow-task-reject',
                name: '驳回通知',
            },
            {
                provider: 'workflow-task-cc',
                name: '抄送通知',
            },
            {
                provider: 'workflow-process-finish',
                name: '办结通知',
            },
            {
                provider: 'workflow-process-repealed',
                name: '关闭通知',
            },
            {
                provider: 'workflow-task-transfer-todo',
                name: '转办通知'
            }
        ],
    },
]

const activeKey = ref<string[]>();

const dataMap = new Map();

const data = ref<any[]>([]);

const tabs = ref<any[]>([])
const handleSearch = () => {
    queryChannelConfig().then((resp) => {
        if (resp.status === 200) {
            // (resp?.result || []).map((item: any) => {
            //     dataMap.set(item.provider, item);
            // });
            // data.value = Array.from(dataMap).map((item) => {
            //     return item?.[1];
            // });
            const arr = dataSource
                .map((item: any) => {
                    const _child = item.children.map((i: any) => {
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
                tabs.value  = arr
        }
    });
};

const onRefresh = () => {
    handleSearch()
}

onMounted(() => {
    // dataMap.clear();
    // dataSource.forEach((item) => {
    //     item.children.map((i) => {
    //         dataMap.set(i.provider, i);
    //     });
    // });
    // data.value = Array.from(dataMap).map((item) => {
    //     return item?.[1];
    // });
    if(menuStore.hasMenu('process')){
        dataSource = [...systemNotice,...lowCodeNotice]
        activeKey.value = ['alarm', 'system-monitor', 'system-business','workflow-notification']
    }else{
        dataSource = [...systemNotice]
        activeKey.value = ['alarm', 'system-monitor', 'system-business']
    }
    handleSearch();
});
</script>

<style lang="less" scoped>
.content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    justify-content: space-between;
    height: 100%;

    .btn {
        padding: 24px 0;
        width: 100%;
        background-color: #fff;
    }
}
.alert {
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
}

.content-collapse {
    overflow-y: auto;
    flex: 1 1 0;
    min-height: 0;

    :deep(.ant-collapse) {
        border-color: #EBEEF3;
        background-color: #fff;

        .ant-collapse-item {
            border: 1px solid #EBEEF3;
            margin-bottom: 24px;
        }

        .ant-collapse-header {
            background-color: #F7F8FA;
            height: 42px;
        }
        .ant-collapse-content {
            padding: 17px 21px 7px 21px;
        }

        .ant-collapse-content-box {
            padding: 0;
        }
    }
}
</style>
