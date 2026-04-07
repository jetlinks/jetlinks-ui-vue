<template>
    <j-page-container>
        <a-card>
            <a-tabs :activeKey="activeKey" @change="changeTabs">
                <a-tab-pane key="1" :tab="$t('Save.index.021441-0')">
                    <Base v-if="activeKey === '1'" ref="baseRef" @change="typeChange" />
                </a-tab-pane>
                <a-tab-pane key="2" :tab="$t('Save.index.021441-1')">
                    <Scene></Scene>
                </a-tab-pane>
                <a-tab-pane key="3" :tab="$t('Save.index.021441-2')" v-if="permissionStore.hasPermission(`${alarmLogPermissionKey}:view`)">
                    <Log v-if="activeKey === '3'" :type="type" />
                </a-tab-pane>
            </a-tabs>
        </a-card>
    </j-page-container>
</template>

<script lang="ts" setup>
import Base from './Base/index.vue';
import Scene from './Scene/index.vue';
import Log from './Log/indev.vue';
import { useRoute } from 'vue-router';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from "pinia";
import { useAlarmConfigurationStore } from "../../../../store/alarm";
import { isEqual, pick } from 'lodash-es';
import {useAuthStore} from "@jetlinks-web-core/store";

const { t: $t } = useI18n();
const route = useRoute();
const alarmConfigurationStore = useAlarmConfigurationStore();
const { configurationData } = storeToRefs(alarmConfigurationStore);

const alarmLogPermissionKey = inject('alarmLogPermissionKey', 'rule-engine/Alarm/Log');

const baseRef = ref();
const changeTabs = (e: any) => {
    if (route.query?.id) {
        const oldValue = pick(configurationData.value?.current, ['level', 'targetType', 'name', 'description']);
        const newValue = pick(baseRef.value?.data(), ['level', 'targetType', 'name', 'description']);
        const isEq = isEqual(oldValue, newValue);
        if(!isEq && (e.key !== '1' && activeKey.value === '1')) {
            onlyMessage($t('Save.index.021441-3'), 'error');
        } else {
            activeKey.value = e;
        }
    } else {
        onlyMessage($t('Save.index.021441-3'), 'error');
    }
};
const activeKey = ref('1');
const type = ref('detail')
const permissionStore = useAuthStore();

const typeChange = (_type: string) => {
  type.value = _type
}
</script>
<style lang="less" scoped>
</style>
