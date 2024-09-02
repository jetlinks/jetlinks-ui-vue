<template>
  <div class="notice-container">
    <a-dropdown
      v-model:visible="visible"
      :trigger="['click']"
      @visible-change="visibleChange"
    >
      <a-badge :count="total" :offset="[3, -3]">
        <AIcon type="BellOutlined" style="font-size: 16px" />
      </a-badge>
      <template #overlay>
        <div>
          <NoticeInfo :tabs="tabs" @action="handleRead" />
        </div>
      </template>
    </a-dropdown>
  </div>
</template>

<script setup lang="ts" name="Notice">
import { getList_api , changeStatus_api } from '@/api/account/notificationRecord';
import { ref } from 'vue'
import NoticeInfo from './NoticeInfo.vue';
import { useWebSocket } from '@/hooks'
import { notification, Button } from 'ant-design-vue';
import { useUserStore } from '@/store/user';
import { useMenuStore } from '@/store/menu';
import { getAllNotice } from '@/api/account/center';
import { flatten } from 'lodash-es';
const updateCount = computed(() => useUserStore().alarmUpdateCount);
const menuStory = useMenuStore();

const visible = ref(false)
const total = ref(0)
const loading = ref(false)

const { send } = useWebSocket({
  onMessage(data) {
    // 消息处理
    console.log(data)
    total.value += 1;
    notification.open({
                message: data?.payload?.topicName,
                description: () =>
                  h(
                    'div',
                    {
                      class: "ellipsis",
                      style: {
                        cursor: 'pointer'
                      },
                      onClick: () => {
                        read('', data);
                      }
                    },
                    {
                      default: () => data?.payload?.message
                    }
                  )
                ,
                onClick: () => {
                    read('', data);
                },
                key: data.payload.id,
                btn: () =>
                  h(
                    Button,
                    {
                      type: "primary",
                      size: "small",
                      onClick: (e: Event) => {
                        e.stopPropagation();
                        read('_read', data);
                      }
                    },
                    {
                      default: () => "标记已读"
                    }
                  ),
    });
  }
})

const visibleChange = (v: boolean) => {
  v && getList();
}



const read = (type: string, data: any) => {
    changeStatus_api('_read', [data.payload.id]).then((resp: any) => {
        if (resp.status !== 200) return;
        // notification.close(data.payload.id);
        getList();
        console.log(data,type)
        if (type !== '_read') {
            menuStory.routerPush('account/center', {
               params:{
                tabKey: 'StationMessage',
                row: data.payload,
               }
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


const handleRead = () => {
    visible.value = false;
    getList();
};


watch(updateCount, () => getList());

const tabs = ref<any>([]);

const queryTypeList = async (_tab: any[]) => {
    const resp: any = await getAllNotice();
    if (resp.status === 200) {
        const provider = resp.result.map((i: any) => i.provider) || [];
        const arr = _tab.filter((item: any) => {
            return item.type.some((i: any) => provider.includes(i))
        });
        tabs.value = arr;
        if(arr.length > 0) {
            send('notification','/notifications',{})
            getList();
        }
    }
};

onMounted(() => {
    const _list: any[] = [...tab]
    if(menuStory.hasMenu('process')){
        _list.push({
            key: 'workflow-notification',
            tab: '工作流通知',
            type: ['workflow-task-todo', 'workflow-task-reject', 'workflow-task-cc', 'workflow-process-finish', 'workflow-process-repealed'],
        })
    }
    queryTypeList(_list)
})

</script>

<style scoped lang="less">
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
