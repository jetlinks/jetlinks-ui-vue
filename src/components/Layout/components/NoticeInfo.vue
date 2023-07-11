<template>
    <div class="notice-info-container">
        <j-tabs
            v-model:activeKey="activeKey"
            :destroyInactiveTabPane="true"
            @change="onChange"
            v-if="tabs.length"
        >
            <j-tab-pane v-for="item in tabs" :key="item.key">
                <template #tab>
                    <NoticeTab
                        :refresh="refreshObj[item.key]"
                        :tab="item?.tab"
                        :type="item.type"
                    />
                </template>
                <j-spin :spinning="loading">
                    <div class="content">
                        <j-scrollbar class="list" :max-height="450" v-if="total">
                            <template v-for="i in list" :key="i.id">
                                <NoticeItem
                                    :data="i"
                                    @action="emits('action')"
                                    @refresh="onRefresh(item.key)"
                                />
                            </template>
                            <div
                                v-if="list.length < 12"
                                style="
                                    color: #666666;
                                    text-align: center;
                                    padding: 8px;
                                "
                            >
                                这是最后一条数据了
                            </div>
                        </j-scrollbar>
                        <div class="no-data" v-else>
                            <j-empty />
                        </div>
                        <div class="btns">
                            <j-button type="link" @click="onMore(item.key)"
                                >查看更多</j-button
                            >
                        </div>
                    </div>
                </j-spin>
            </j-tab-pane>
        </j-tabs>
        <div class="no-data" v-else>
            <j-empty />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getList_api } from '@/api/account/notificationRecord';
import { useMenuStore } from '@/store/menu';
import { useUserInfo } from '@/store/userInfo';
import { cloneDeep } from 'lodash-es';
import NoticeItem from './NoticeItem.vue';
import NoticeTab from './NoticeTab.vue';

const emits = defineEmits(['action']);

type DataType = 'alarm' | 'system-monitor' | 'system-business';

const refreshObj = ref({
    alarm: true,
    'system-monitor': true,
    'system-business': true,
});

const loading = ref(false);
const total = ref(0);
const list = ref<any[]>([]);
const activeKey = ref<DataType>('alarm');
const menuStory = useMenuStore();
const route = useRoute();

const userInfo = useUserInfo();

const props = defineProps({
    tabs: {
        type: Array,
        default: () => []
    }
})

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
    const type = props.tabs.find((item: any) => item.key === _key)?.type || [];
    getData(type);
};

onMounted(async () => {
    onChange('alarm');
});

const onRefresh = (id: string) => {
    const flag = cloneDeep(refreshObj.value[id]);
    refreshObj.value = {
        ...refreshObj.value,
        [id]: !flag,
    };
};

const onMore = (key: string) => {
    // 判断当前是否为/account/center
    if (route.path === '/account/center') {
        userInfo.tabKey = 'StationMessage';
        userInfo.other.tabKey = key;
    } else {
        menuStory.routerPush('account/center', {
            tabKey: 'StationMessage',
            other: {
                tabKey: key,
            },
        });
    }

    emits('action');
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
            max-height: 450px;
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
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
