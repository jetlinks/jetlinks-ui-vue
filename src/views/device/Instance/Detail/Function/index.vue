<template>
    <a-card>
        <a-empty
            v-if="!metadata || (metadata && !metadata.functions)"
            style="margin-top: 100px"
        >
            <template #description>
                暂无数据，请配置
                <a @click="emits('onJump', 'Metadata')">物模型</a>
            </template>
        </a-empty>
        <template v-else>
            <a-tabs v-model:activeKey="activeKey">
                <a-tab-pane key="Simple" tab="精简模式" />
                <a-tab-pane key="Advance" tab="高级模式" />
            </a-tabs>
            <component :is="tabs[activeKey]" />
        </template>
    </a-card>
</template>

<script setup lang="ts">
import { useInstanceStore } from '@/store/instance';
import Simple from './components/Simple.vue';
import Advance from './components/Advance.vue';

const instanceStore = useInstanceStore();
const emits = defineEmits(['onJump']);

const metadata = computed(() => JSON.parse(instanceStore.detail.metadata));

const activeKey = ref('Simple');
const tabs = {
    Simple,
    Advance,
};
</script>

<style lang="less" scoped></style>
