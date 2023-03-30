<template>
    <page-container
        :tabList="list"
        :tabActiveKey="activeKey"
        @tabChange="onTabChange"
    >
        <FullPage>
            <AccessLog v-if="activeKey === '1'" />
            <SystemLog v-else />
        </FullPage>
    </page-container>
</template>
<script lang="ts" setup name="LogPage">
import { defineComponent, ref } from 'vue';
import AccessLog from './Access/index.vue';
import SystemLog from './System/index.vue';
import { useRouterParams } from '@/utils/hooks/useParams';

const routerParams = useRouterParams();
const activeKey = ref('1');

const list = [
    {
        key: '1',
        tab: '访问日志',
    },
    {
        key: '2',
        tab: '系统日志',
    },
];

const onTabChange = (e: string) => {
    activeKey.value = e;
};

onMounted(() => {
    if (routerParams.params.value.tab === 'system') {
        activeKey.value = '2';
    }
});
</script>
