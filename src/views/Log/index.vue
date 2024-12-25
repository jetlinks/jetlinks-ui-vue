<template>
    <j-page-container
        :tabList="list"
        :tabActiveKey="activeKey"
        @tabChange="onTabChange"
    >
        <FullPage>
            <AccessLog v-if="activeKey === '1'" />
            <SystemLog v-else />
        </FullPage>
    </j-page-container>
</template>
<script lang="ts" setup name="LogPage">
import AccessLog from './Access/index.vue';
import SystemLog from './System/index.vue';
import { useRouterParams } from '@jetlinks-web/hooks';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const routerParams = useRouterParams();
const activeKey = ref('1');

const list = [
    {
        key: '1',
        tab: $t('Log.index.407378-0'),
    },
    {
        key: '2',
        tab: $t('Log.index.407378-1'),
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
