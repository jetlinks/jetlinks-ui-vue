<template>
    <div class="notice-container">
        <j-dropdown
            v-model:visible="visible"
            :trigger="['click']"
            :destroyPopupOnHide="true"
            @visible-change="visibleChange"
        >
            <j-badge :count="total" :offset="[3, -3]">
                <AIcon type="BellOutlined" style="font-size: 16px" />
            </j-badge>
            <template #overlay>
                <div>
                    <NoticeInfo :tabs="tabs" @action="handleRead" />
                </div>
            </template>
        </j-dropdown>
    </div>
</template>

<script setup lang="tsx">
import { getList_api } from '@/api/account/notificationRecord';
import NoticeInfo from './NoticeInfo.vue';
import { getWebSocket } from '@/utils/websocket';
import { notification, Button } from 'jetlinks-ui-components';
import { changeStatus_api } from '@/api/account/notificationRecord';
import { useUserInfo } from '@/store/userInfo';

import { useMenuStore } from '@/store/menu';
import { getAllNotice } from '@/api/account/center';
import { flatten } from 'lodash-es';

const updateCount = computed(() => useUserInfo().alarmUpdateCount);
const menuStory = useMenuStore();

const total = ref(0);
// const list = ref<any[]>([]);
const loading = ref(false);
const visible = ref(false);

const subscribeNotice = () => {
    getWebSocket('notification', '/notifications', {})
        ?.pipe()
        .subscribe((resp: any) => {
            total.value += 1;
            notification.open({
                message: resp?.payload?.topicName,
                description: () =>
                  h(
                    'div',
                    {
                      class: "ellipsis",
                      style: {
                        cursor: 'pointer'
                      },
                      onClick: () => {
                        read('', resp);
                      }
                    },
                    {
                      default: () => resp?.payload?.message
                    }
                  )
                ,
                onClick: () => {
                    read('', resp);
                },
                key: resp.payload.id,
                btn: () =>
                  h(
                    Button,
                    {
                      type: "primary",
                      size: "small",
                      onClick: (e: Event) => {
                        e.stopPropagation();
                        read('_read', resp);
                      }
                    },
                    {
                      default: () => "标记已读"
                    }
                  ),
            });
        });
};

const read = (type: string, data: any) => {
    changeStatus_api('_read', [data.payload.id]).then((resp: any) => {
        if (resp.status !== 200) return;

        notification.close(data.payload.id);
        getList();
        if (type !== '_read') {
            menuStory.routerPush('account/center', {
                tabKey: 'StationMessage',
                row: data.payload.detail,
            });
        }
    });
};

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
        tab: '系统监控',
        type: ['system-event'],
    },
    {
        key: 'system-business',
        tab: '业务监控',
        type: ['device-transparent-codec'],
    },
];

// 查询未读数量
const getList = () => {
    if(tabs.value.length <= 0) return;
    loading.value = true; 
    const params = {
        sorts: [{
          name: 'notifyTime',
          order: 'desc'
        }],
        terms: [
            {
                terms: [
                    {
                        type: 'and',
                        value: 'unread',
                        termType: 'eq',
                        column: 'state',
                    },
                ],
            },
            {
                terms: [
                    {
                        type: 'and',
                        value: flatten(tabs.value.map((i: any) => i?.type)),
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
        })
        .finally(() => (loading.value = false));
};

const visibleChange = (bool: boolean) => {
    bool && getList();
};

const handleRead = () => {
    visible.value = false;
    getList();
};

watch(updateCount, () => getList());

const tabs = ref<any>([]);

const queryTypeList = async () => {
    const resp: any = await getAllNotice();
    if (resp.status === 200) {
        const provider = resp.result.map((i: any) => i.provider) || [];
        const arr = tab.filter((item: any) => {
            return item.type.some((i: any) => provider.includes(i))
        });
        tabs.value = arr;
        if(arr.length > 0) {
            subscribeNotice();
            getList();
        }
    }
};

onMounted(() => {
    queryTypeList()
})
</script>

<style lang="less" scoped>
.notice-container {
    .icon-content {
        height: 48px;
        display: flex;
        align-items: center;
        position: relative;

        .unread {
            position: absolute;
            top: 0;
            right: -12px;
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            color: #fff;
            font-weight: normal;
            font-size: 12px;
            line-height: 20px;
            white-space: nowrap;
            text-align: center;
            background: #ff4d4f;
            border-radius: 10px;
        }
    }
}
</style>
