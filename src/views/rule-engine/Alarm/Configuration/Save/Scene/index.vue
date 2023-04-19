<template>
    <FullPage>
        <JProTable
            model="CARD"
            :request="query"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms,
            }"
            ref="actionRef"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        type="primary"
                        @click="showModal"
                        hasPermission="rule-engine/Alarm/Configuration:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </j-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        started: 'processing',
                        disable: 'error',
                    }"
                >
                    <template #type>
                        <span
                            ><img
                                :height="16"
                                :src="typeMap.get(slotProps.triggerType)?.icon"
                                style="margin-right: 5px"
                            />{{
                                typeMap.get(slotProps.triggerType)?.text
                            }}</span
                        >
                    </template>
                    <template #img>
                        <img :src="typeMap.get(slotProps.triggerType)?.img" />
                    </template>
                    <template #content>
                        <Ellipsis style="width: calc(100% - 100px)">
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </Ellipsis>
                        <Ellipsis :lineClamp="2">
                            <div class="subTitle">
                                说明：{{
                                    slotProps?.description ||
                                    typeMap.get(slotProps.triggerType)?.tip
                                }}
                            </div>
                        </Ellipsis>
                    </template>
                    <template #actions="item">
                        <PermissionButton
                            :disabled="item.disabled"
                            :popConfirm="item.popConfirm"
                            :tooltip="{
                                ...item.tooltip,
                            }"
                            @click="item.onClick"
                            :hasPermission="'rule-engine/Scene:' + item.key"
                        >
                            <AIcon
                                type="DeleteOutlined"
                                v-if="item.key === 'delete'"
                            />
                            <template v-else>
                                <AIcon :type="item.icon" />
                                <span>{{ item?.text }}</span>
                            </template>
                        </PermissionButton>
                    </template>
                </CardBox>
            </template>
        </JProTable>
    </FullPage>
    <Save
        :id="id"
        :type="configurationData.current?.targetType"
        @close-save="closeSave"
        @save-scene="saveSuccess"
        v-if="visible"
    ></Save>
</template>

<script lang="ts" setup>
import { query } from '@/api/rule-engine/scene';
import { unbindScene } from '@/api/rule-engine/configuration';
import { useRoute } from 'vue-router';
import type { ActionsType } from '@/components/Table';
import { getImage } from '@/utils/comm';
import { message } from 'jetlinks-ui-components';
import Save from './Save/index.vue';
import { useAlarmConfigurationStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
const route = useRoute();
const id = route.query?.id;

const alarmConfigurationStore = useAlarmConfigurationStore();
const { configurationData } = storeToRefs(alarmConfigurationStore);

const terms = [
    {
        terms: [
            {
                column: 'id',
                termType: 'alarm-bind-rule',
                value: id,
            },
        ],
        type: 'and',
    },
];
const actionRef = ref();
const typeMap = new Map();
typeMap.set('manual', {
    text: '手动触发',
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: '适用于第三方平台向物联网平台下发指令控制设备',
});
typeMap.set('timer', {
    text: '定时触发',
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: '适用于定期执行固定任务',
});
typeMap.set('device', {
    text: '设备触发',
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: '适用于设备数据或行为满足触发条件时，执行指定的动作',
});
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions: ActionsType[] = [
        {
            key: 'action',
            text: '解绑',
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: '确定解绑？',
                onConfirm: async () => {
                    const res = await unbindScene(id, [data.id]);
                    if (res.status === 200) {
                        message.success('操作成功');
                        actionRef.value.reload();
                    }
                },
            },
        },
    ];
    return actions;
};
const visible = ref(false);
const log = () => {
    console.log();
};
log();
const showModal = () => {
    visible.value = true;
};
const closeSave = () => {
    visible.value = false;
};
const saveSuccess = () => {
    visible.value = false;
    actionRef.value.reload();
};
</script>
<style lang="less" scoped>
.subTitle {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-top: 10px;
}
</style>