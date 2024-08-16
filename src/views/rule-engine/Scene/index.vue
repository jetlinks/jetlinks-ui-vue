<template>
    <page-container>

        <pro-search :columns="columns" target="scene" @search="handleSearch" />
      <FullPage>
        <JProTable
            ref="sceneRef"
            :columns="columns"
            :request="query"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :params="params"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="rule-engine/Scene:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Scene.index.542572-0') }}
                    </PermissionButton>
                </j-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    @click="handleView(slotProps.id, slotProps.triggerType)"
                    :actions="getActions(slotProps, 'card')"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state.value==='started'?$t('Instance.index.052151-1'):$t('Instance.index.052151-2')"
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
                      <div class="subTitle">
                        <span class='subTitle-title'>
                        {{ $t('Scene.index.542572-1') }}
                        </span>
                        <span class='subTitle-content'>
                          <Ellipsis :lineClamp="2">
                                  {{
                                      slotProps?.description ? slotProps?.description :
                                      typeMap.get(slotProps.triggerType)?.tip
                                  }}
                          </Ellipsis>
                        </span>
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
            <template #triggerType="slotProps">
                {{ typeMap.get(slotProps.triggerType)?.text }}
            </template>
            <template #state="slotProps">
                <BadgeStatus
                    :status="slotProps.state?.value"
                    :text="slotProps.state?.text"
                    :statusNames="{
                        started: 'processing',
                        disable: 'error',
                    }"
                />
            </template>
            <template #action="slotProps">
                <j-space :size="16">
                    <template
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                    >
                        <PermissionButton
                            :disabled="i.disabled"
                            :popConfirm="i.popConfirm"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            @click="i.onClick"
                            type="link"
                            :danger="i.key === 'delete'"
                            style="padding: 0 5px"
                            :hasPermission="i.key === 'view' ? true : 'rule-engine/Scene:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
      </FullPage>
        <SaveModal v-if="visible" @close="visible = false" :data="current" />
    </page-container>
</template>

<script setup lang='ts' name='Scene'>
import SaveModal from './Save/save.vue';
import type { SceneItem } from './typings';
import { useMenuStore } from 'store/menu';
import { query, _delete, _action, _execute } from '@/api/rule-engine/scene';
import {
  queryList,
} from '@/api/rule-engine/configuration';
import type { ActionsType } from '@/components/Table';
import { getImage, onlyMessage } from '@/utils/comm';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { Modal } from 'jetlinks-ui-components'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const statusMap = new Map();
statusMap.set('started', 'success');
statusMap.set('disable', 'error');

const params = ref<Record<string, any>>({});
const sceneRef = ref<Record<string, any>>({});

const typeMap = new Map();
typeMap.set('manual', {
    text: $t('Scene.index.542572-2'),
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: $t('Scene.index.542572-3'),
});
typeMap.set('timer', {
    text: $t('Scene.index.542572-4'),
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: $t('Scene.index.542572-5'),
});
typeMap.set('device', {
    text: $t('Scene.index.542572-6'),
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: $t('Scene.index.542572-7'),
});

const columns = [
    {
        dataIndex: 'name',
        fixed: 'left',
        ellipsis: true,
        width: 300,
        title: $t('Scene.index.542572-8'),
        search: {
            type: 'string',
        },
    },
    {
        dataIndex: 'triggerType',
        title: $t('Scene.index.542572-9'),
        scopedSlots: true,
        search: {
            type: 'select',
            options: Array.from(typeMap).map((item) => {
                return {
                    label: item[1]?.text,
                    value: item[0],
                };
            }),
        },
    },
    {
        dataIndex: 'state',
        title: $t('Scene.index.542572-10'),
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Scene.index.542572-11'), value: 'started' },
                { label: $t('Scene.index.542572-12'), value: 'disable' },
            ],
        },
    },
    {
        dataIndex: 'description',
        title: $t('Scene.index.542572-13'),
        ellipsis: true,
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: $t('Scene.index.542572-14'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const deleteScene = async (id: string) => {
  const resp = await _delete(id);
  if (resp.status === 200) {
    onlyMessage($t('Scene.index.542572-15'));
    sceneRef.value?.reload();
  } else {
    onlyMessage($t('Scene.index.542572-16'), 'error');
  }
}

const deleteModal = (id: string) => {
  Modal.confirm({
    title: $t('Scene.index.542572-17'),
    onOk: async () => {
      await deleteScene(id)
    }
  })
}



const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions: ActionsType[] = [
        {
            key: 'update',
            text: $t('Scene.index.542572-18'),
            tooltip: {
                title: $t('Scene.index.542572-18'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disable' ? $t('Scene.index.542572-28') : $t('Scene.index.542572-19'),
            tooltip: {
                title: !(!!data.triggerType && (data.branches || [])?.length)
                    ? $t('Scene.index.542572-20')
                    : data.state?.value !== 'disable'
                    ? $t('Scene.index.542572-28')
                    : $t('Scene.index.542572-19'),
            },
            disabled: !(!!data?.triggerType && (data?.branches || [])?.length),
            icon:
                data.state.value !== 'disable'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${
                    data.state.value !== 'disable' ? $t('Scene.index.542572-21') : $t('Scene.index.542572-29')
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value !== 'disable') {
                        response = await _action(data.id, '_disable');
                    } else {
                        response = await _action(data.id, '_enable');
                    }
                    if (response && response.status === 200) {
                        onlyMessage($t('Scene.index.542572-15'));
                        sceneRef.value?.reload();
                    } else {
                        onlyMessage($t('Scene.index.542572-16'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: $t('Scene.index.542572-22'),
            disabled: data.state?.value !== 'disable',
            tooltip: {
                title:
                    data.state.value !== 'disable'
                        ? $t('Scene.index.542572-23')
                        : $t('Scene.index.542572-22'),
            },
            popConfirm: {
                title: $t('Scene.index.542572-24'),
                onConfirm: async () => {
                  // 查询该场景是否绑定告警
                  const resp = await queryList({
                    pageSize: 10,
                    pageIndex: 0,
                    terms: [
                      {
                        terms: [
                          {
                            column: 'id',
                            termType: 'rule-bind-alarm',
                            value: {
                              ruleId: [data.id],
                              branchId: [-1]
                            },
                          },
                        ]
                      }
                    ],
                  })
                  if (resp.success && resp.result?.total) {
                    await deleteModal(data.id)
                  } else {
                    await deleteScene(data.id)
                  }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (data.triggerType === 'manual') {
        const _item: ActionsType = {
            key: 'tigger',
            text: $t('Scene.index.542572-2'),
            disabled: data.state?.value === 'disable',
            tooltip: {
                title:
                    data.state.value !== 'disable'
                        ? $t('Scene.index.542572-2')
                        : $t('Scene.index.542572-25'),
            },
            icon: 'LikeOutlined',
            popConfirm: {
                title: $t('Scene.index.542572-26'),
                onConfirm: async () => {
                    const resp = await _execute(data.id);
                    if (resp.status === 200) {
                        onlyMessage($t('Scene.index.542572-15'));
                        sceneRef.value?.reload();
                    } else {
                        onlyMessage($t('Scene.index.542572-16'), 'error');
                    }
                },
            },
        };
        actions.splice(1, 0, _item);
    }
    if (type === 'table') {
        actions.splice(0, 0, {
            key: 'view',
            text: $t('Scene.index.542572-27'),
            tooltip: {
                title: $t('Scene.index.542572-27'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id, data.triggerType);
            },
        });
    }
    return actions;
};

const handleSearch = (_params: any) => {
    params.value = _params;
};

const handleAdd = () => {
    visible.value = true;
    current.value = {};
};

/**
 * 编辑
 * @param id
 * @param triggerType 触发类型
 */
const handleEdit = (id: string, triggerType: string) => {
    menuStory.jumpPage(
        'rule-engine/Scene/Save',
        {},
        { triggerType: triggerType, id, type: 'edit' },
    );
};

/**
 * 查看
 * @param id
 * @param triggerType 触发类型
 */
const handleView = (id: string, triggerType: string) => {
    menuStory.jumpPage(
        'rule-engine/Scene/Save',
        {},
        { triggerType: triggerType, id, type: 'view' },
    );
};
</script>

<style scoped lang='less'>
.subTitle {
  position: relative;
  margin-top: 18px;
  display: inline-block;
  height: 50px;

  .subTitle-title {
    position: absolute;
    top: 0;
    left: 0;
  }

  .subTitle-content {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    text-indent: 38px;

  }
}
</style>
