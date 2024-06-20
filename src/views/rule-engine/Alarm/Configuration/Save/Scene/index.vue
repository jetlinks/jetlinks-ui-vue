<template>
    <FullPage>
        <JProTable
            model="CARD"
            :request="queryTable"
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
                    @click="handleView(slotProps)"
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
                      <div style="height: 102px;">
                        <Ellipsis style="width: calc(100% - 100px)">
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </Ellipsis>
                        <div v-if="slotProps.branchName">
                          {{ slotProps.branchName }}
                        </div>
                        <Ellipsis :lineClamp="2">
                            <div class="subTitle">
                                说明：{{
                                    slotProps?.description ||
                                    typeMap.get(slotProps.triggerType)?.tip
                                }}
                            </div>
                        </Ellipsis>
                      </div>
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
        v-if="visible"
        :id="id"
        :type="configurationData.current?.targetType"
        @close-save="closeSave"
        @save-scene="saveSuccess"
    ></Save>

  <SceneDrawer
    v-if="scene.visible"
    :detail="scene.detail"
    :id="id"
    @cancel="sceneCancel"
  />

</template>

<script lang="ts" setup>
import { query} from '@/api/rule-engine/scene';
import { unbindScene } from '@/api/rule-engine/configuration';
import { useRoute } from 'vue-router';
import type { ActionsType } from '@/components/Table';
import { getImage, onlyMessage } from '@/utils/comm';
import Save from './Save/index.vue';
import { useAlarmConfigurationStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import { useMenuStore } from 'store/menu';
import SceneDrawer from './SceneDrawer.vue'
import { typeMap } from './Save/utils'

const menuStory = useMenuStore();
const route = useRoute();
const id = route.query?.id;

const alarmConfigurationStore = useAlarmConfigurationStore();
const { configurationData } = storeToRefs(alarmConfigurationStore);
const scene = reactive({
  visible: false,
  detail: undefined
})

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
                    // const res = await unbindScene(id, [data.id], data.branchIndex);
                    const res = await unbindScene(id, [data.id]);
                    if (res.status === 200) {
                        onlyMessage('操作成功');
                        actionRef.value.reload();
                    }
                },
            },
        },
    ];
    return actions;
};

const queryTable = (_terms: any) => {
  return query(_terms, id)
}

const visible = ref(false);


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
/**
 * 查看
 * @param record
 */
 const handleView = (record: Record<string, any>) => {
   scene.detail = record
   scene.visible = true
};

 const sceneCancel = () => {
   scene.visible = false
   scene.detail = undefined
   actionRef.value?.reload()
 }
</script>
<style lang="less" scoped>
.subTitle {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    margin-top: 10px;
}
</style>
