<template>
    <a-card class="info-card" :bordered="true">
        <template #title>
            <div class="card-title">
                <AIcon type="InfoCircleOutlined" class="card-icon" />
                <span>{{ $t('Info.index.208636-0') }}</span>
            </div>
        </template>
        <template #extra>
            <j-permission-button
                type="link"
                class="edit-button"
                @click="visible = true"
                hasPermission="device/Instance:update"
            >
                <template #icon><AIcon type="EditOutlined" /></template>
                {{ $t('Info.index.208636-1') }}
            </j-permission-button>
        </template>
        <a-descriptions class="compact-descriptions" :labelStyle="{width: '120px'}" bordered size="small">
        <a-descriptions-item :label="$t('Info.index.208636-2')">
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
                    <a-tooltip>
                        <template #title>
                            <p>
                                {{ $t('Info.index.208636-3') }}
                            </p>
                            {{ $t('Info.index.208636-4') }}
                        </template>
                        <a
                            v-if="!inklingDeviceId"
                            type="link"
                            @click="giveAnInkling"
                        >
                            {{ $t('Info.index.208636-5') }}
                        </a>
                        <a v-else type="link" @click="inkingVisible = true">
                            {{ $t('Info.index.208636-6') }}
                        </a>
                    </a-tooltip>
                </div>
            </div>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-7')">
          <j-ellipsis>{{
              instanceStore.current?.productName
            }}</j-ellipsis>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-8')">{{
            instanceStore.current?.deviceType?.text
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-9')">{{
            instanceStore.current?.firmwareInfo?.version || '--'
        }}
          <a-tooltip :title="$t('Info.index.208636-17')">
            <AIcon type="QuestionCircleOutlined" />
          </a-tooltip>
        </a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-10')">{{
            instanceStore.current?.transport
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-11')">{{
            instanceStore.current?.protocolName
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-12')">{{
            instanceStore.current?.createTime
                ? dayjs(instanceStore.current?.createTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : ''
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-13')">{{
            instanceStore.current?.registerTime
                ? dayjs(instanceStore.current?.registerTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : ''
        }}</a-descriptions-item>
        <a-descriptions-item :label="$t('Info.index.208636-14')">{{
            instanceStore.current?.onlineTime
                ? dayjs(instanceStore.current?.onlineTime).format(
                      'YYYY-MM-DD HH:mm:ss',
                  )
                : ''
        }}</a-descriptions-item>
        <a-descriptions-item
            :label="$t('Info.index.208636-15')"
            v-if="instanceStore.current?.deviceType?.value === 'childrenDevice'"
            >{{ instanceStore.current?.parentId }}</a-descriptions-item
        >
        <a-descriptions-item :label="$t('Info.index.208636-16')">{{
            instanceStore.current?.description
        }}</a-descriptions-item>
        </a-descriptions>
    </a-card>
    <Config @saved="handleConfigSaved" />
    <Principal ref="principalRef" />
    <Tags
        v-if="
            instanceStore.current?.tags &&
            instanceStore.current?.tags.length > 0
        "
    />
    <!-- <Relation
        v-if="
            instanceStore.current?.relations &&
            instanceStore.current?.relations.length > 0
        "
    /> -->
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
import { useInstanceStore } from '../../../../../store/instance';
import Save from '../../Save/index.vue';
import Config from './components/Config/index.vue';
import Principal from './components/Principal/index.vue';
import Tags from './components/Tags/index.vue';
import Relation from './components/Relation/index.vue';
import InkingModal from './components/InklingModal';
import dayjs from 'dayjs';
import { detail as queryPluginAccessDetail } from '../../../../../api/link/accessConfig';
import { getPluginData } from '../../../../../api/link/plugin';
import {useI18n} from "vue-i18n";

const { t: $t } = useI18n();
const visible = ref<boolean>(false);
const inkingVisible = ref<boolean>(false);
const instanceStore = useInstanceStore();
const inklingDeviceId = ref();
const channelId = ref();
const principalRef = ref();

const saveBtn = () => {
    if (instanceStore.current?.id) {
        const refreshPromise = instanceStore.refresh(instanceStore.current?.id);
        if (refreshPromise && typeof refreshPromise.then === 'function') {
            refreshPromise.then(() => {
                // 刷新接入身份信息
                if (principalRef.value?.refresh) {
                    principalRef.value.refresh();
                }
            });
        } else {
            // 如果不是 Promise，直接调用刷新
            setTimeout(() => {
                if (principalRef.value?.refresh) {
                    principalRef.value.refresh();
                }
            }, 100);
        }
    }
    visible.value = false;
};

// 配置保存后，仅刷新接入身份信息（配置组件内部已经刷新了实例详情）
const handleConfigSaved = () => {
    if (principalRef.value?.refresh) {
        principalRef.value.refresh();
    }
};

const saveInkling = (id: string) => {
    if (instanceStore.current?.id) {
        const refreshPromise = instanceStore.refresh(instanceStore.current?.id);
        if (refreshPromise && typeof refreshPromise.then === 'function') {
            refreshPromise.then(() => {
                // 刷新接入身份信息
                if (principalRef.value?.refresh) {
                    principalRef.value.refresh();
                }
            });
        } else {
            // 如果不是 Promise，直接调用刷新
            setTimeout(() => {
                if (principalRef.value?.refresh) {
                    principalRef.value.refresh();
                }
            }, 100);
        }
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

<style lang="less" scoped>
.info-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
    margin-bottom: 16px;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        border-color: #d9d9d9;
    }

    :deep(.ant-card-head) {
        border-bottom: 1px solid #f0f0f0;
        padding: 12px 24px;
        min-height: 48px;
    }

    :deep(.ant-card-body) {
        padding: 16px 20px;
    }
}

.compact-descriptions {
    :deep(.ant-descriptions-item-label) {
        font-size: 13px;
        padding: 8px 12px;
    }

    :deep(.ant-descriptions-item-content) {
        font-size: 13px;
        padding: 8px 12px;
    }

    :deep(.ant-descriptions-row) {
        > td {
            padding-bottom: 8px;
        }
    }
}

.card-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);

    .card-icon {
        color: #1890ff;
        font-size: 16px;
    }
}

.edit-button {
    padding: 0;
    height: auto;
    font-size: 14px;
}
</style>
