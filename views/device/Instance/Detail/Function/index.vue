<template>
    <j-empty
        v-if="!metadata || (metadata && !metadata.functions?.length)"
        style="margin-top: 50px"
    >
        <template #description>
            <template v-if="hasPerm">
                {{ $t('Function.index.709787-0') }}
                <!-- <a @click="emits('onJump', 'Metadata')">{{ $t('Function.index.709787-1') }}</a> -->
                <a @click="onJump">{{ $t('Function.index.709787-1') }}</a>
            </template>
            <template v-else>
                {{ $t('Function.index.709787-0-1') }}{{ $t('Function.index.709787-1') }}
            </template>
        </template>
    </j-empty>
    <template v-else>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="Simple" :tab="$t('Function.index.709787-2')" />
            <a-tab-pane key="Advance" :tab="$t('Function.index.709787-3')" />
        </a-tabs>
        <component :is="tabs[activeKey]" />
    </template>
</template>

<script setup lang="ts">
import { useInstanceStore } from '../../../../../store/instance';
import Simple from './components/Simple.vue';
import Advance from './components/Advance.vue';
import { useMenuStore } from '@jetlinks-web-core/store';
import { usePermission } from '@jetlinks-web/hooks'

const menuStory = useMenuStore();
const { hasPerm } = usePermission(
  ref(`device/Product:update`),
)

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
        params: {
          id: instanceStore.current.productId,
          tab: 'Metadata'
        },
      });
};
</script>
