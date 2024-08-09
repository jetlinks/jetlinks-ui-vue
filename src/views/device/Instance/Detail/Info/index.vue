<template>
    <j-descriptions bordered>
        <template #title>
            {{ $t('Info.index.735510-0') }}
            <PermissionButton
                type="link"
                @click="visible = true"
                hasPermission="device/Instance:update"
            >
                <template #icon><AIcon type="EditOutlined" /></template>
                {{ $t('Info.index.735510-1') }}
            </PermissionButton>
        </template>
        <j-descriptions-item :label="$t('Info.index.735510-2')">
            <div style="display: flex">
                <div style="flex: 1">
                    <j-ellipsis> {{ instanceStore.current?.id }} </j-ellipsis>
                </div>
                <div
                    v-if="
                        instanceStore.current?.accessProvider ===
                        'plugin_gateway'
                    "
                >
                    <j-tooltip>
                        <template #title>
                            <p>
                                {{ $t('Info.index.735510-3') }}
                            </p>
                            {{ $t('Info.index.735510-4') }}
                        </template>
                        <a
                            v-if="!inklingDeviceId"
                            type="link"
                            @click="giveAnInkling"
                        >
                            {{ $t('Info.index.735510-5') }}
                        </a>
                        <a v-else type="link" @click="inkingVisible = true">
                            {{ $t('Info.index.735510-6') }}
                        </a>
                    </j-tooltip>
                </div>
            </div>
        </j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-7')">{{
            instanceStore.current?.productName
        }}</j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-8')">{{
            instanceStore.current?.deviceType?.text
        }}</j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-9')">{{
            instanceStore.current?.firmwareInfo?.version
        }}</j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-10')">{{
            instanceStore.current?.transport
        }}</j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-11')">{{
            instanceStore.current?.protocolName
        }}</j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-12')">{{
            instanceStore.current?.createTime
                ? moment(instanceStore.current?.createTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : ''
        }}</j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-13')">{{
            instanceStore.current?.registerTime
                ? moment(instanceStore.current?.registerTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : ''
        }}</j-descriptions-item>
        <j-descriptions-item :label="$t('Info.index.735510-14')">{{
            instanceStore.current?.onlineTime
                ? moment(instanceStore.current?.onlineTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : ''
        }}</j-descriptions-item>
        <j-descriptions-item
            :label="$t('Info.index.735510-15')"
            v-if="instanceStore.current?.deviceType?.value === 'childrenDevice'"
            >{{ instanceStore.current?.parentId }}</j-descriptions-item
        >
        <j-descriptions-item :label="$t('Info.index.735510-16')">{{
            instanceStore.current?.description
        }}</j-descriptions-item>
    </j-descriptions>
    <Config />
    <Tags
        v-if="
            instanceStore.current?.tags &&
            instanceStore.current?.tags.length > 0
        "
    />
    <Relation
        v-if="
            instanceStore.current?.relations &&
            instanceStore.current?.relations.length > 0
        "
    />
    <Save
        v-if="visible"
        :data="instanceStore.current"
        @close="visible = false"
        @save="saveBtn"
    />
    <InkingModal
        v-if="inkingVisible"
        :id="inklingDeviceId"
        :accessId="instanceStore.current.accessId"
        :pluginId="channelId"
        @cancel="inkingVisible = false"
        @submit="saveInkling"
    />
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Save from '../../Save/index.vue';
import Config from './components/Config/index.vue';
import Tags from './components/Tags/index.vue';
import Relation from './components/Relation/index.vue';
import InkingModal from './components/InklingModal';
import moment from 'moment';
import { detail as queryPluginAccessDetail } from '@/api/link/accessConfig';
import { getPluginData } from '@/api/link/plugin';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const visible = ref<boolean>(false);
const inkingVisible = ref<boolean>(false);
const instanceStore = useInstanceStore();
const inklingDeviceId = ref();
const channelId = ref();

const saveBtn = () => {
    if (instanceStore.current?.id) {
        instanceStore.refresh(instanceStore.current?.id);
    }
    visible.value = false;
};

const saveInkling = (id: string) => {
    if (instanceStore.current?.id) {
        instanceStore.refresh(instanceStore.current?.id);
    }
    channelId.value = id;
    queryInkling();
    inkingVisible.value = false;
};

const giveAnInkling = () => {
    inkingVisible.value = true;
};

const queryInkling = () => {
    if (instanceStore.current?.accessProvider === 'plugin_gateway') {
        queryPluginAccessDetail(instanceStore.current?.accessId).then(
            async (res) => {
                if (res.success) {
                    channelId.value = res.result.channelId;
                    const pluginRes = await getPluginData(
                        'device',
                        instanceStore.current?.accessId,
                        instanceStore.current?.id,
                    );
                    if (pluginRes.success) {
                        inklingDeviceId.value = pluginRes.result?.externalId;
                    }
                }
            },
        );
    }
};

onMounted(() => {
    // 设备编辑标签后，返回实力信息页面，标签栏没有更新
    if (instanceStore?.current?.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
});
watch(
    () => instanceStore.current?.id,
    () => {
        if (instanceStore.current?.id) {
            queryInkling();
        }
    },
    { immediate: true },
);
</script>
