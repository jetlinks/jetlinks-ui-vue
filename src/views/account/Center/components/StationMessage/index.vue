<template>
    <div style="margin-top: 24px">
        <j-tabs
            tab-position="left"
            v-if="tabs.length"
            :destroyInactiveTabPane="true"
        >
            <j-tab-pane v-for="item in tabs" :key="item.provider" :tab="item.name">
                <NotificationRecord :type="item.provider" />
            </j-tab-pane>
        </j-tabs>
        <j-empty v-else style="margin: 200px 0" />
    </div>
</template>

<script lang="ts" setup>
import NotificationRecord from './components/NotificationRecord/index.vue';
import { initData } from '../data';
import { getAllNotice } from '@/api/account/center';

const tabs = ref<any[]>([]);

const queryTypeList = () => {
    getAllNotice().then((resp: any) => {
        if (resp.status === 200) {
            const arr = initData
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
            tabs.value = arr
        }
    });
};

onMounted(() => {
    queryTypeList();
});
</script>