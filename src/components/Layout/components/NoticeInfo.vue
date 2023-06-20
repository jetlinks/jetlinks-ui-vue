<template>
    <div class="notice-info-container">
        <j-tabs
            v-model:activeKey="activeKey"
            :destroyInactiveTabPane="true"
            @change="onChange"
        >
            <j-tab-pane v-for="item in tab" :key="item.key">
                <template #tab>
                    <NoticeTab :refresh="refreshObj[item.key]" :tab="item?.tab" :type="item.type" />
                </template>
                <j-spin :spinning="loading">
                    <div class="content">
                        <j-scrollbar class="list" max-height="400" v-if="total">
                            <template v-for="i in list" :key="i.id">
                                <NoticeItem
                                    :data="i"
                                    @action="emits('action')"
                                    @refresh="onRefresh(item.key)"
                                />
                            </template>
                        </j-scrollbar>
                        <div class="no-data" v-else>
                            <j-empty />
                        </div>
                        <div class="btns">
                            <span @click="onMore">查看更多</span>
                        </div>
                    </div>
                </j-spin>
            </j-tab-pane>
        </j-tabs>
    </div>
</template>

<script setup lang="ts">
import { getList_api } from '@/api/account/notificationRecord';
import { useMenuStore } from '@/store/menu';
import { cloneDeep } from 'lodash-es';
import NoticeItem from './NoticeItem.vue';
import NoticeTab from './NoticeTab.vue';

const emits = defineEmits(['action']);

type DataType = 'alarm' | 'system-monitor' | 'system-business';

const tab = [
    {
        key: 'alarm',
        tab: '告警',
        type: [
            'alarm-product',
            'alarm-device',
            'alarm-other',
            'alarm-org',
            'alarm',
        ],
    },
    {
        key: 'system-monitor',
        tab: '系统运维',
        type: ['system-event'],
    },
    {
        key: 'system-business',
        tab: '业务监控',
        type: ['device-transparent-codec'],
    },
];

const refreshObj = ref({
    'alarm': true,
    'system-monitor': true,
    'system-business': true
})

const loading = ref(false);
const total = ref(0);
const list = ref<any[]>([]);
const activeKey = ref<DataType>('alarm');
const menuStory = useMenuStore();

const getData = (type: string[]) => {
    loading.value = true;
    const params = {
        sorts: [
            {
                name: 'notifyTime',
                order: 'desc',
            },
        ],
        pageSize: 12,
        terms: [
            {
                terms: [
                    {
                        type: 'or',
                        value: type,
                        termType: 'in',
                        column: 'topicProvider',
                    },
                ],
            },
        ],
    };
    getList_api(params)
        .then((resp: any) => {
            total.value = resp.result.total;
            list.value = resp.result?.data || [];
        })
        .finally(() => (loading.value = false));
};

const onChange = (_key: string) => {
    const type = tab.find((item) => item.key === _key)?.type || [];
    getData(type);
};

onMounted(() => {
    onChange('alarm');
});

const onRefresh = (id: string) => {
    const flag = cloneDeep(refreshObj.value[id])
    refreshObj.value = {
        ...refreshObj.value,
        [id]: !flag
    }
}

const onMore = () => {
    menuStory.routerPush('account/center', {
        tabKey: 'StationMessage',
    });
    emits('action')
};
</script>

<style lang="less" scoped>
.notice-info-container {
    width: 336px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 6px 16px -8px rgb(0 0 0 / 8%), 0 9px 28px 0 rgb(0 0 0 / 5%),
        0 12px 48px 16px rgb(0 0 0 / 3%);

    :deep(.ant-tabs-nav-wrap) {
        display: flex;
        justify-content: center;
    }

    .no-data {
        width: 100%;
        padding: 73px 0 88px;
        color: rgba(0, 0, 0, 0.45);
        text-align: center;

        img {
            height: 76px;
        }
    }

    .content {
        .list {
            max-height: 400px;
            overflow: auto;
            padding: 0;
            margin: 0;
            &::-webkit-scrollbar {
                //隐藏或取消滚动条
                display: none;
            }
        }
        .btns {
            display: flex;
            height: 46px;
            line-height: 46px;
            span {
                display: block;
                width: 100%;
                text-align: center;
                cursor: pointer;

                // &:first-child {
                //     border-right: 1px solid #f0f0f0;
                // }
            }
        }
    }
}
</style>
