<template>
    <div style="padding-right: 20px">
        <j-tabs
            tab-position="left"
            v-if="tabs.length"
            :destroyInactiveTabPane="true"
            v-model:activeKey="user.other.tabKey"
        >
            <j-tab-pane
                v-for="item in tabs"
                :key="item.provider"
                :tab="item.name"
            >
                    <NotificationRecord :type="item.provider" />
            </j-tab-pane>
        </j-tabs>
        <j-empty v-else style="margin: 200px 0" />
    </div>
</template>

<script lang="ts" setup>
import NotificationRecord from './components/NotificationRecord/index.vue';
import { getInitData } from '../data';
import { getAllNotice } from '@/api/account/center';
import { useRouterParams } from '@/utils/hooks/useParams';
import { useUserInfo } from '@/store/userInfo';
import { omit } from 'lodash-es';

const tabs = ref<any[]>([]);
const router = useRouterParams();
const user = useUserInfo();
// let initData:any[]
const queryTypeList = () => {
    getAllNotice().then((resp: any) => {
        if (resp.status === 200) {
            // const arr = initData
            //     .map((item: any) => {
            //         const _child = item.children.map((i: any) => {
            //             const _item = (resp.result || []).find(
            //                 (t: any) => t?.provider === i?.provider,
            //             );
            //             return {
            //                 ...i,
            //                 ..._item,
            //             };
            //         });
            //         return {
            //             ...item,
            //             children: _child,
            //         };
            //     })
            //     .filter((it: any) => {
            //         return it.children.filter((lt: any) => lt?.id)?.length;
            //     })
            //     .map((item) => {
            //         return {
            //             ...item,
            //             children: item.children.filter((lt: any) => lt?.id),
            //         };
            //     });
            const dataMap = new Map()
            resp.result.forEach((i: any) => {
                if (!dataMap.has(i.type.id)) {
                    dataMap.set(i.type.id, {
                        name: i.type.name,
                        provider: i.type.id,
                        children: [
                            {
                                ...omit(i, ['type'])
                            }
                        ]
                    })
                } else {
                    dataMap.get(i.type.id).children.push({
                        ...omit(i, ['type'])
                    })
                }
            })
            tabs.value = [...dataMap.values()];
            if (!user.other.tabKey) {
                user.other.tabKey = tabs.value?.[0]?.provider;
            }
            // tabs.value = arr;
        }
    });
};

watchEffect(() => {
    if (router.params.value?.other?.tabKey) {
        user.other.tabKey = router.params.value?.other?.tabKey
    }
    if(router.params?.value.row){
        if(['device-transparent-codec'].includes(router.params?.value.row.topicProvider)){
            user.other.tabKey = 'system-business'
        }
        if(['system-event'].includes(router.params?.value.row.topicProvider)){
            user.other.tabKey = 'system-monitor'
        }
        if(['workflow-task-cc','workflow-task-todo','workflow-task-reject', 'workflow-process-finish', 'workflow-process-repealed','workflow-task-transfer-todo'].includes(router.params?.value.row.topicProvider)){
            user.other.tabKey =  'workflow-notification'
        }
    }
});

onMounted(() => {
    // initData = getInitData()
    queryTypeList();
});
</script>