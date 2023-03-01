<template>
    <a-card>
        <a-empty
            v-if="!metadata || (metadata && !metadata.functions.length)"
            style="margin-top: 50px"
        >
            <template #description>
                请配置对应产品的
                <!-- <a @click="emits('onJump', 'Metadata')">物模型属性功能</a> -->
                <a @click="onJump">物模型属性功能</a>
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
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();

const instanceStore = useInstanceStore();
// const emits = defineEmits(['onJump']);

const metadata = computed(() => JSON.parse(instanceStore.detail.metadata));

const activeKey = ref('Simple');
const tabs = {
    Simple,
    Advance,
};

const onJump = () => {
    menuStory.jumpPage(
        'device/Product/Detail',
        {
            id: instanceStore.current.productId,
        },
        { key: 'metadata' },
    );
};
</script>
