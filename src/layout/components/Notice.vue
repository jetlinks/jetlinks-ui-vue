<template>
  <div class="notice-container">
    <a-dropdown
      v-model:visible="visible"
      :trigger="['click']"
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
                      default: () => $t('components.Notice.573407-0')
                    }
                  ),
    });
  }
})

// const visibleChange = (v: boolean) => {
//   v && getList();
// }



const read = (type: string, data: any) => {
    changeStatus_api('_read', [data.payload.id]).then((resp: any) => {
        if (resp.status !== 200) return;
        // notification.close(data.payload.id);
        getList();
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

// 查询未读数量
const getList = () => {
    if(tabs.value.length <= 0) return;
    loading.value = true; 
      const params = {
      paging:false,
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




const tabs = ref<any>([]);

const queryTypeList = async () => {
    const resp: any = await getAllNotice();
    if (resp.status === 200) {
      const typeMap = new Map()
        resp.result.forEach((i: any) => {
            if (!typeMap.has(i.type.id)) {
                typeMap.set(i.type.id, {
                    key: i.type.id,
                    tab: i.type.name,
                    type: [
                        i.provider
                    ]
                })
            } else {
                typeMap.get(i.type.id).type.push(i.provider)
            }
        })
        tabs.value = [...typeMap.values()]
        if (tabs.value.length > 0) {
            send('notification', '/notifications', {});
            getList();
        }
    }
};

watch(updateCount, () => getList());

onMounted(() => {
    queryTypeList()
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
