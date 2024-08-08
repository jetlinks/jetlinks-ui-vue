<!-- 平台对接 -->
<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="platform-search"
            @search="handleSearch"
        />
        <FullPage>
            <j-pro-table
                ref="platformRef"
                :columns="columns"
                :request="queryList"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <j-space>
                        <!-- <j-button type="primary" @click="handleAdd">
                          <AIcon type="PlusOutlined" />{{ $t('Platform.index.387410-0') }}
                          </j-button> -->
                        <PermissionButton
                            @click="handleAdd"
                            :hasPermission="'iot-card/Platform:add'"
                            type="primary"
                        >
                            <AIcon type="PlusOutlined" />{{ $t('Platform.index.387410-0') }}
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                        v-bind="slotProps"
                        :status="slotProps.state.value"
                        :statusText="slotProps.state.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :src="getImage('/iot-card/iot-card-bg.png')"
                                />
                            </slot>
                        </template>
                        <template #content>
                            <h3
                                style="
                                    font-size: 16px;
                                    width: calc(100% - 90px);
                                    margin-bottom: 18px;
                                "
                            >
                                <Ellipsis>
                                    {{ slotProps.name }}
                                </Ellipsis>
                            </h3>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Platform.index.387410-1') }}
                                    </div>
                                    <div>{{ slotProps.operatorName }}</div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Platform.index.387410-2') }}
                                    </div>
                                    <Ellipsis>{{ slotProps.explain }}</Ellipsis>
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
                                :hasPermission="'iot-card/Platform:' + item.key"
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
                <template #state="slotProps">
                    <j-badge
                        :text="slotProps.state.text"
                        :status="
                            slotProps.state.value === 'disabled'
                                ? 'error'
                                : 'success'
                        "
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
                                style="padding: 0px"
                                :hasPermission="'iot-card/Platform:' + i.key"
                            >
                                <template #icon>
                                    <AIcon :type="i.icon" />
                                </template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </j-pro-table>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import type { ActionsType } from '@/components/Table';
import { queryList, update, del } from '@/api/iot-card/platform';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const menuStory = useMenuStore();
const router = useRouter();
const platformRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: $t('Platform.index.387410-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Platform.index.387410-1'),
        dataIndex: 'operatorName',
        key: 'operatorName',
        search: {
            type: 'select',
            options: [
                { label: $t('Platform.index.387410-4'), value: 'onelink' },
                { label: $t('Platform.index.387410-5'), value: 'ctwing' },
                { label: $t('Platform.index.387410-6'), value: 'unicom' },
            ],
        },
    },
    {
        title: $t('Platform.index.387410-7'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                { label: $t('Platform.index.387410-8'), value: 'enabled' },
                { label: $t('Platform.index.387410-9'), value: 'disabled' },
            ],
        },
    },
    {
        title: $t('Platform.index.387410-2'),
        dataIndex: 'explain',
        key: 'explain',
        ellipsis: true,
    },
    {
        title: $t('Platform.index.387410-10'),
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
    },
];

const statusUpdate = (data: any) => {
    const response = update(data);
    response.then((res) => {
        if (res.status === 200) {
            onlyMessage($t('Platform.index.387410-11'));
            platformRef.value?.reload();
        }
    });
    return response;
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'update',
            text: $t('Platform.index.387410-12'),
            tooltip: {
                title: $t('Platform.index.387410-12'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                //   router.push(`/iot-card/Platform/detail/${data.id}`);
                menuStory.jumpPage('iot-card/Platform/Detail', { id: data.id });
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? $t('Platform.index.387410-9') : $t('Platform.index.387410-8'),
            tooltip: {
                title: data.state.value === 'enabled' ? $t('Platform.index.387410-9') : $t('Platform.index.387410-8'),
            },
            icon:
                data.state.value === 'enabled'
                    ? 'StopOutlined'
                    : 'PlayCircleOutlined',
            popConfirm: {
                title: `${
                    data.state.value === 'enabled' ? $t('Platform.index.387410-13') : $t('Platform.index.387410-14')
                }？`,
                okText: ' 确定',
                cancelText: $t('Platform.index.387410-16'),
                onConfirm: () => {
                    if (data.state.value === 'enabled') {
                        return statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'disabled',
                            operatorName: data.operatorName,
                        });
                    } else {
                        return statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'enabled',
                            operatorName: data.operatorName,
                        });
                    }
                },
            },
        },
        {
            key: 'delete',
            text: $t('Platform.index.387410-17'),
            tooltip: {
                title:
                    data.state.value !== 'enabled' ? $t('Platform.index.387410-17') : $t('Platform.index.387410-18'),
            },
            disabled: data.state.value === 'enabled',
            popConfirm: {
                title: $t('Platform.index.387410-19'),
                okText: ' 确定',
                cancelText: $t('Platform.index.387410-16'),
                onConfirm: () => {
                    const response: any = del(data.id);
                    response.then((resp:any) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Platform.index.387410-20'));
                            platformRef.value?.reload();
                        } else {
                            onlyMessage($t('Platform.index.387410-21'), 'error');
                        }
                    });
                    return response
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 新增
 */
const handleAdd = () => {
    menuStory.jumpPage('iot-card/Platform/Detail', { id: ':id' });
};
</script>

<style scoped lang="less"></style>
