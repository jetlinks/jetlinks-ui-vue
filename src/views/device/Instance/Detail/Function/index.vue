<template>
    <j-empty
        v-if="!metadata || (metadata && !metadata.functions?.length)"
        style="margin-top: 50px"
    >
        <template #description>
            {{ $t('Function.index.155740-0') }}
            <!-- <a @click="emits('onJump', 'Metadata')">{{ $t('Function.index.155740-1') }}</a> -->
            <a @click="onJump">{{ $t('Function.index.155740-1') }}</a>
        </template>
    </j-empty>
    <template v-else>
        <j-tabs v-model:activeKey="activeKey">
            <j-tab-pane key="Simple" :tab="$t('Function.index.155740-2')" />
            <j-tab-pane key="Advance" :tab="$t('Function.index.155740-3')" />
        </j-tabs>
        <component :is="tabs[activeKey]" />
    </template>
</template>

<script setup lang="ts">
import { useInstanceStore } from '@/store/instance';
import Simple from './components/Simple.vue';
import Advance from './components/Advance.vue';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();

const instanceStore = useInstanceStore();
// const emits = defineEmits(['onJump']);

const metadata = computed(() => JSON.parse(instanceStore.detail?.metadata || '{}'));

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
