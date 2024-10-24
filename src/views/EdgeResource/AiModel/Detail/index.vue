<template>
    <page-container
        :tabList="list"
        :showBack="true"
        @tabChange="onTabChange"
    >
        <template #title>
            {{detailData.name}}
        </template>
        <FullPage>
            <div style="padding: 24px; height: 100%">
                <component
                    :is="tabs[tabKey]"
                    :data="detailData"
                    v-bind="{ type: 'device' }"
                    @onJump="onTabChange"
                    @refresh="handleRefresh"
                />
            </div>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import Info from './Info/index.vue';
import Record from './Record/index.vue';
import { detail } from "@/api/edge-resource/ai-model";
import { useResourceStore } from "store/resource";

const list = ref([
    {
        key: 'Info',
        tab: '基础信息',
    },
    {
        key: 'Record',
        tab: '下发记录',
    }
])

const tabs = {
    Info,
    Record
}

const resourceStore = useResourceStore();
const tabKey = ref('Info');
const onTabChange = (e: string) => {
    tabKey.value = e;
};
const detailData = ref({});

const route = useRoute();

const getDetail = async () => {
    const res = await detail(route.params.id);
    if(res.success) {
        resourceStore.resource = res.result;
        detailData.value = res.result;
    }
}

const handleRefresh = () => {
    getDetail();
}

watch(() => route.params.id, (val) => {
    if(val) {
        getDetail()
    }
}, {immediate: true})
</script>

<style scoped lang="less">

</style>