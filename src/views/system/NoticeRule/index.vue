<template>
    <j-page-container>
        <FullPage>
            <div class="content">
                <div style="margin-bottom: 15px;">
                    <div class="alert">
                        <AIcon type="InfoCircleOutlined" />
                        {{ $t('NoticeRule.index.804848-0') }}
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
                                    <span style="margin-left: 10px;" class="alert" v-if="item.provider === 'alarm'">{{ $t('NoticeRule.index.804848-1') }}</span>
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const menuStore = useMenuStore();
let dataSource:any[] =[]
const systemNotice = [
    {
        provider: 'alarm',
        name: $t('NoticeRule.index.804848-2'),
        children: [
            {
                provider: 'alarm-product',
                name: $t('NoticeRule.index.804848-3'),
            },
            {
                provider: 'alarm-device',
                name: $t('NoticeRule.index.804848-4'),
            },
            {
                provider: 'alarm-org',
                name: $t('NoticeRule.index.804848-5'),
            },
            {
                provider: 'alarm-other',
                name: $t('NoticeRule.index.804848-6'),
            },
        ],
    },
    {
        provider: 'system-monitor',
        name: $t('NoticeRule.index.804848-7'),
        children: [
            {
                provider: 'system-event',
                name: $t('NoticeRule.index.804848-8'),
            },
        ],
    },
    {
        provider: 'system-business',
        name: $t('NoticeRule.index.804848-9'),
        children: [
            {
                provider: 'device-transparent-codec',
                name: $t('NoticeRule.index.804848-10'),
            },
        ],
    },
];
const lowCodeNotice = [
    {
        provider: 'workflow-notification',
        name: $t('NoticeRule.index.804848-11'),
        children: [
            {
                provider: 'workflow-task-todo',
                name: $t('NoticeRule.index.804848-12'),
            },
            {
                provider: 'workflow-task-reject',
                name: $t('NoticeRule.index.804848-13'),
            },
            {
                provider: 'workflow-task-cc',
                name: $t('NoticeRule.index.804848-14'),
            },
            {
                provider: 'workflow-process-finish',
                name: $t('NoticeRule.index.804848-15'),
            },
            {
                provider: 'workflow-process-repealed',
                name: $t('NoticeRule.index.804848-16'),
            },
            {
                provider: 'workflow-task-transfer-todo',
                name: $t('NoticeRule.index.804848-17')
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
