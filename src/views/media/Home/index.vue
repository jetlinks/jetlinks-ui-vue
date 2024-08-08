<template>
    <page-container>
        <j-row :gutter="24">
            <j-col :span="14">
                <BootCard
                    :cardData="deviceBootConfig"
                    :cardTitle="$t('Home.index.895071-0')"
                />
            </j-col>
            <j-col :span="10">
                <BasicCountCard />
            </j-col>
            <j-col :span="24" style="margin: 20px 0">
                <PlatformPicCard />
            </j-col>
            <j-col :span="24">
                <StepCard
                    :cardTitle="$t('Home.index.895071-1')"
                    :tooltip="$t('Home.index.895071-2')"
                    :dataList="deviceStepDetails"
                />
            </j-col>
        </j-row>

        <!-- {{ $t('Home.index.895071-3') }} -->
        <j-modal
            :title="$t('Home.index.895071-3')"
            width="850px"
            v-model:visible="visible"
            :maskClosable="false"
            :destroyOnClose="true"
            @cancel="visible = false"
            @ok="handleSubmit"
        >
            <j-advanced-search
                type="simple"
                :columns="columns"
                @search="handleSearch"
            />
            <JProTable
                ref="tableRef"
                model="table"
                rowKey="id"
                :columns="columns"
                :request="deviceApi.list"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :rowSelection="{
                    type: 'radio',
                    selectedRowKeys: deviceItem?.id
                        ? [deviceItem.id]
                        : undefined,
                    onSelect: (record: any) => {
                        deviceItem = record;
                    }
                }"
                :alertRender="false"
            >
                <template #channelNumber="slotProps">
                    <span>{{ slotProps.channelNumber || 0 }}</span>
                </template>
                <template #state="slotProps">
                    <j-space>
                        <j-badge
                            :status="
                                slotProps.state.value === 'online'
                                    ? 'success'
                                    : 'error'
                            "
                            :text="slotProps.state.text"
                        />
                    </j-space>
                </template>
            </JProTable>
        </j-modal>
    </page-container>
</template>

<script setup lang="ts">
import BootCard from '@/views/home/components/BootCard.vue';
import PlatformPicCard from '@/views/home/components/PlatformPicCard.vue';
import StepCard from '@/views/home/components/StepCard.vue';
import BasicCountCard from '@/views/media/Home/components/BasicCountCard.vue';

import { usePermissionStore } from '@/store/permission';
import type { bootConfig, recommendList } from '@/views/home/typing';

import deviceApi from '@/api/media/device';

import { useMenuStore } from 'store/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const menuStory = useMenuStore();

// 权限控制
const hasPermission = usePermissionStore().hasPermission;

const deviceBootConfig: bootConfig[] = [
    {
        english: 'STEP1',
        label: $t('Home.index.895071-4'),
        link: 'media/Device/Save',
        auth: hasPermission('media/Device:add'),
    },
    {
        english: 'STEP2',
        label: $t('Home.index.895071-5'),
        link: 'media/SplitScreen',
    },
    {
        english: 'STEP3',
        label: $t('Home.index.895071-6'),
        link: 'media/Cascade',
    },
];

const deviceStepDetails: recommendList[] = [
    {
        title: $t('Home.index.895071-4'),
        details: $t('Home.index.895071-7'),
        iconUrl: '/images/home/bottom-6.png',
        linkUrl: 'media/Device/Save',
        auth: hasPermission('media/Device:add'),
    },
    {
        title: $t('Home.index.895071-8'),
        details: $t('Home.index.895071-9'),
        iconUrl: '/images/home/bottom-7.png',
        // linkUrl: 'media/Device/Channel',
        linkUrl: '',
        auth: hasPermission('media/Device:view'),
        onClick: (row: any) => {
            if (hasPermission('media/Device:view')) {
                visible.value = true;
            } else {
                onlyMessage($t('Home.index.895071-10'), 'warning');
            }
        },
    },
    {
        title: $t('Home.index.895071-5'),
        details: $t('Home.index.895071-11'),
        iconUrl: '/images/home/bottom-8.png',
        linkUrl: 'media/SplitScreen',
    },
];

// 选择设备
const visible = ref(false);
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis:true,
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
    },
    {
        title: $t('Home.index.895071-12'),
        dataIndex: 'name',
        key: 'name',
        ellipsis:true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Home.index.895071-13'),
        dataIndex: 'channelNumber',
        key: 'channelNumber',
        width:100,
        scopedSlots: true,
    },
    {
        title: $t('Home.index.895071-14'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Home.index.895071-15'), value: 'online' },
                { label: $t('Home.index.895071-16'), value: 'offline' },
                { label: $t('Home.index.895071-17'), value: 'notActive'}
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
        width:80
    },
];
const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const deviceItem = ref();
const handleSubmit = () => {
    if (deviceItem.value && deviceItem.value.id) {
        menuStory.jumpPage(
            'media/Device/Channel',
            {},
            {
                id: deviceItem.value.id,
                type: deviceItem.value.provider,
            },
        );
    } else {
        onlyMessage($t('Home.index.895071-18'), 'warning');
    }
};
</script>
