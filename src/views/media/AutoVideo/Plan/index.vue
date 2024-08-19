<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="auto-video-plan"
            @search="handleSearch"
        />

        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="columns"
                model="CARD"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="media/Device:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增计划
                    </PermissionButton>
                </template>
                <template #card="slotProps">
                    <CardBox
                        @click="() => handleClick(slotProps)"
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :showStatus="true"
                        :status="slotProps.state.value"
                        :statusText="slotProps.state.text"
                        :statusNames="{
                            online: 'processing',
                            offline: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/device-media.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 700">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        厂商
                                    </div>
                                    <Ellipsis style="width: calc(100% - 20px)">
                                        <div>{{ slotProps.manufacturer }}</div>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        通道数量
                                    </div>
                                    <div>{{ slotProps.channelNumber }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        型号
                                    </div>
                                    <Ellipsis
                                        style="width: calc(100% - 20px)"
                                        >{{ slotProps.model }}</Ellipsis
                                    >
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        接入方式
                                    </div>
                                    <div>
                                        <!-- {{ providerType[slotProps.provider] }} -->
                                    </div>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="
                                    'media/Device:' +
                                    (item.key !== 'updateChannel'
                                        ? item.key
                                        : 'update')
                                "
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
    </page-container>
</template>

<script setup lang="ts">
import DeviceApi from '@/api/media/device';
import type { ActionsType } from '@/views/device/Instance/typings';
import { getImage, onlyMessage } from '@/utils/comm';
import { PROVIDER_OPTIONS } from '@/views/media/Device/const';
import encodeQuery from '@/utils/encodeQuery';
import { useMenuStore } from 'store/menu';
import Summary from './Summary/index.vue';

const params = ref();
const menuStory = useMenuStore();
const tableRef = ref();

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        fixed: 'left',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Device/Save',
                    {},
                    {
                        id: data.id,
                    },
                );
            },
        },
        {
            key: 'view',
            text: '查看通道',
            tooltip: {
                title: '查看通道',
            },
            icon: 'PartitionOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'media/Device/Channel',
                    {},
                    {
                        id: data.id,
                        type: data.provider,
                    },
                );
            },
        },
        {
            key: 'viewDevice',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                menuStory.jumpPage('device/Instance/Detail', { id: data.id });
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title:
                    data.state.value === 'online' ? '在线设备无法删除' : '删除',
            },
            disabled: data.state.value === 'online',
            popConfirm: {
                title: '确认删除?',
                onConfirm: () => {
                    const response = DeviceApi.del(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage('操作成功！');
                            tableRef.value?.reload();
                        } else {
                            onlyMessage('操作失败！', 'error');
                        }
                    });
                    return response;
                },
            },
            icon: 'DeleteOutlined',
        },
    ];

    let acts: any = [];
    if (type === 'card') {
        // 卡片不展示查看按钮
        const tempActs = actions.filter((f: any) => f.key !== 'viewDevice');
        acts =
            data.provider === 'fixed-media'
                ? tempActs.filter((f: any) => f.key !== 'updateChannel')
                : tempActs;
    } else {
        acts =
            data.provider === 'fixed-media'
                ? actions.filter((f: any) => f.key !== 'updateChannel')
                : actions;
    }
    return acts;
};

const handleAdd = () => {
    menuStory.jumpPage('media/Device/Save', {
        id: ':id',
    });
};
const handleSearch = (e: any) => {
    params.value = e;
};

const handleClick = (data: any) => {};
</script>

<style lang="less" scoped></style>
