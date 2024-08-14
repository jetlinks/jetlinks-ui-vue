<template>
    <page-container>
        <j-card>
            <j-tabs :activeKey="activeKey" @change="changeTabs">
                <j-tab-pane key="1" :tab="$t('Save.index.4265313-0')">
                    <Base v-if="activeKey === '1'" @change="typeChange" />
                </j-tab-pane>
                <j-tab-pane key="2" :tab="$t('Save.index.4265313-1')">
                    <Scene></Scene>
                </j-tab-pane>
                <j-tab-pane key="3" :tab="$t('Save.index.4265313-2')">
                    <Log v-if="activeKey === '3'" :type="type" />
                </j-tab-pane>
            </j-tabs>
        </j-card>
    </page-container>
</template>

<script lang="ts" setup>
import Base from './Base/index.vue';
import Scene from './Scene/index.vue';
import Log from './Log/indev.vue';
import { useRoute } from 'vue-router';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const route = useRoute();
const changeTabs = (e: any) => {
    if (route.query?.id) {
        activeKey.value = e;
    } else {
        onlyMessage($t('Save.index.4265313-3'), 'error');
    }
};
const activeKey = ref('1');
const type = ref('detail')

const typeChange = (_type: string) => {
  console.log(_type)
  type.value = _type
}
</script>
<style lang="less" scoped>
</style>