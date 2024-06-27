<template>
    <page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title> </template>
        <FullPage>
            <div style="padding: 24px; height: 100%">
                <component
                    :is="tabs[tabActiveKey]"
                    v-bind="{ type: 'device' }"
                    @onJump="onTabChange"
                />
            </div>
        </FullPage>
        <FloatBackBtn></FloatBackBtn>
    </page-container>
</template>

<script lang="ts" setup>
import FloatBackBtn from './components/FloatBackBtn/index.vue';
import Basic from './Basic/index.vue';
import Sub from './Sub/index.vue';

const initList = [
    {
        key: 'Basic',
        tab: '基础信息',
    },
    {
        key: 'Running',
        tab: '运行状态',
    },
    {
        key: 'Sub',
        tab: '子设备',
    },
    {
        key: 'Forklift',
        tab: '叉车监控',
    },
];
const list = ref([...initList]);
const tabActiveKey = ref('Basic');

const tabs = {
    Basic,
    Sub,
};

const onTabChange = (e: string) => {
    tabActiveKey.value = e;
};
</script>

<style lang="less" scoped>
.detail {
    width: 100%;
    height: 100%;
    .tabs {
        margin-left: 30px;
        width: 98%;
        .tab_con {
            margin: 10px;
        }
    }
}
</style>
