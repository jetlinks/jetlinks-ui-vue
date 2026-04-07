<template>
    <div class="principal-container" v-if="principalList.length > 0">
        <a-card class="principal-card" :bordered="true">
            <template #title>
                <div class="card-title">
                    <AIcon type="SafetyOutlined" class="card-icon" />
                    <span>{{ $t('Principal.index.100001-0') }}</span>
                </div>
            </template>
            <template #extra>
                <a-popconfirm
                    :title="$t('Principal.index.100001-5')"
                    placement="bottomRight"
                    @confirm="handleReset"
                >
                    <j-permission-button
                        type="link"
                        class="reset-button"
                        hasPermission="device/Instance:update"
                    >
                        <template #icon><AIcon type="SyncOutlined" /></template>
                        {{ $t('Principal.index.100001-6') }}
                    </j-permission-button>
                </a-popconfirm>
            </template>
            <div class="principal-rows">
                <div
                    class="principal-row"
                    v-for="(principal, index) in principalList"
                    :key="principal.id || index"
                >
                    <template v-if="principal.metadata?.name || principal.metadata?.description">
                        <a-tag class="metadata-tag">
                            <span class="metadata-name">
                                {{ principal.metadata?.name || $t('Principal.index.100001-0') }}
                            </span>
                            <a-tooltip
                                v-if="principal.metadata?.description"
                                :title="principal.metadata.description"
                            >
                                <AIcon type="QuestionCircleOutlined" class="description-icon" />
                            </a-tooltip>
                        </a-tag>
                    </template>

                    <div class="info-field">
                        <AIcon type="IdcardOutlined" class="field-icon" />
                        <span class="field-label">{{ $t('Principal.index.100001-1') }}</span>
                        <a-tag class="field-value-tag">
                            <j-ellipsis class="field-text">{{ principal.identity?.identifier || '--' }}</j-ellipsis>
                            <a-tooltip
                                :title="copySuccessMap[`identity-${principal.id || index}`] ? $t('Principal.index.100001-8') : ''"
                                :open="copySuccessMap[`identity-${principal.id || index}`]"
                                placement="top"
                            >
                                <span
                                    class="copy-icon-wrapper"
                                    @click.stop.prevent="copyToClipboard(principal.identity?.identifier || '', `identity-${principal.id || index}`)"
                                >
                                    <AIcon
                                        type="CopyOutlined"
                                        class="copy-icon"
                                    />
                                </span>
                            </a-tooltip>
                        </a-tag>
                    </div>

                    <template v-if="principal.credential?.type?.toLowerCase() === 'token'">
                        <div class="info-field">
                            <AIcon type="KeyOutlined" class="field-icon" />
                            <span class="field-label">{{ $t('Principal.index.100001-2') }}</span>
                            <a-tooltip
                                :title="copySuccessMap[`token-${principal.id || index}`] ? $t('Principal.index.100001-8') : ''"
                                :open="copySuccessMap[`token-${principal.id || index}`]"
                                placement="top"
                            >
                                <a-tag
                                    class="field-value-tag clickable-tag"
                                    @click.stop.prevent="copyToClipboard(principal.credential?.content?.token || '', `token-${principal.id || index}`)"
                                >
                                    <j-ellipsis class="field-text">{{ $t('Principal.index.100001-11') }}</j-ellipsis>
                                </a-tag>
                            </a-tooltip>
                        </div>
                    </template>

                    <template v-else-if="principal.credential?.type?.toLowerCase() === 'password'">
                        <div class="info-field">
                            <AIcon type="UserOutlined" class="field-icon" />
                            <span class="field-label">{{ $t('Principal.index.100001-3') }}</span>
                            <a-tooltip
                                :title="copySuccessMap[`username-${principal.id || index}`] ? $t('Principal.index.100001-8') : ''"
                                :open="copySuccessMap[`username-${principal.id || index}`]"
                                placement="top"
                            >
                                <a-tag
                                    class="field-value-tag clickable-tag"
                                    @click.stop.prevent="copyToClipboard(principal.credential?.content?.username || '', `username-${principal.id || index}`)"
                                >
                                    <j-ellipsis class="field-text">
                                        {{ principal.credential?.content?.username ? $t('Principal.index.100001-11') : '--' }}
                                    </j-ellipsis>
                                </a-tag>
                            </a-tooltip>
                        </div>
                        <div class="info-field">
                            <AIcon type="LockOutlined" class="field-icon" />
                            <span class="field-label">{{ $t('Principal.index.100001-4') }}</span>
                            <a-tooltip
                                :title="copySuccessMap[`password-${principal.id || index}`] ? $t('Principal.index.100001-8') : ''"
                                :open="copySuccessMap[`password-${principal.id || index}`]"
                                placement="top"
                            >
                                <a-tag
                                    class="field-value-tag clickable-tag"
                                    @click.stop.prevent="copyToClipboard(principal.credential?.content?.password || '', `password-${principal.id || index}`)"
                                >
                                    <j-ellipsis class="field-text">
                                        {{ principal.credential?.content?.password ? $t('Principal.index.100001-11') : '--' }}
                                    </j-ellipsis>
                                </a-tag>
                            </a-tooltip>
                        </div>
                    </template>

                    <div
                        class="row-divider"
                        v-if="index < principalList.length - 1"
                    ></div>
                </div>
            </div>
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@device-manager-ui/store/instance';
import { getDevicePrincipal, resetDevicePrincipal, existsDevicePrincipalSupport } from '@device-manager-ui/api/instance';
import { useI18n } from 'vue-i18n';
import { onlyMessage } from '@jetlinks-web/utils';
import useClipboard from 'vue-clipboard3';

const { t: $t } = useI18n();
const instanceStore = useInstanceStore();
const { toClipboard } = useClipboard();
const copySuccessMap = ref<Record<string, boolean>>({});
const supportPrincipal = ref<boolean | null>(null);
const currentDeviceId = ref<string | undefined>(undefined); // 记录当前设备ID
const principalList = ref<Array<{
    id: string;
    deviceId: string;
    metadata?: {
        name?: string;
        description?: string;
        type?: string;
    };
    identity: {
        type: string;
        identifier: string;
        name?: string;
    };
    credential: {
        type: string;
        content: {
            token?: string;
            username?: string;
            password?: string;
        };
    };
}>>([]);

const loadPrincipal = () => {
    const deviceId = instanceStore.current?.id;
    if (!deviceId) {
        principalList.value = [];
        currentDeviceId.value = undefined;
        return;
    }
    
    // 如果设备ID变化了，重置支持状态判断
    if (currentDeviceId.value !== deviceId) {
        supportPrincipal.value = null;
        currentDeviceId.value = deviceId;
    }
    
    // 如果已经判断过不支持，直接返回
    if (supportPrincipal.value === false) {
        principalList.value = [];
        return;
    }
    
    // 如果还未判断，先判断是否支持身份
    if (supportPrincipal.value === null) {
        existsDevicePrincipalSupport().then((resp) => {
            if (resp.status === 200 && resp.result) {
                supportPrincipal.value = true;
                loadPrincipal(); // 判断支持后，重新加载数据
            } else {
                supportPrincipal.value = false;
                principalList.value = [];
            }
        });
        return;
    }
    
    // 已经判断过支持，直接加载数据
    getDevicePrincipal(deviceId).then((resp) => {
        if (resp.status === 200) {
            principalList.value = resp.result || [];
        }
    });
};

const handleReset = () => {
    if (instanceStore.current?.id) {
        resetDevicePrincipal(instanceStore.current.id).then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('Principal.index.100001-7'));
                loadPrincipal();
            }
        });
    }
};

const copyToClipboard = async (text: string, key: string) => {
    if (!text) {
        onlyMessage($t('Principal.index.100001-10'), 'warning');
        return;
    }
    try {
        await toClipboard(text);
        // 显示成功提示
        copySuccessMap.value[key] = true;
        // 全局轻提示，避免用户误以为未生效
        onlyMessage($t('Principal.index.100001-8'));
        // 2秒后隐藏提示
        setTimeout(() => {
            copySuccessMap.value[key] = false;
        }, 2000);
    } catch (error) {
        onlyMessage($t('Principal.index.100001-9'), 'error');
    }
};

watch(
    () => instanceStore.current?.id,
    (val) => {
        if (val) {
            loadPrincipal();
        }
    },
    { immediate: true }
);

// 刷新方法：重置支持状态判断，然后重新加载
const refresh = () => {
    supportPrincipal.value = null; // 重置支持状态，重新判断
    loadPrincipal();
};

// 暴露刷新方法供父组件调用
defineExpose({
    refresh
});
</script>

<style lang="less" scoped>
.principal-container {
    margin-top: 24px;
}

.reset-button {
    padding: 0;
    height: auto;
    font-size: 14px;
}

.principal-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;

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
        padding: 12px 24px;
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

.metadata-tag {
    margin-left: 8px;
    border-radius: 4px;
    background: #e6f7ff;
    border: 1px solid #91d5ff;
    color: #1890ff;
    font-size: 13px;
    padding: 2px 8px;
    line-height: 1.5;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.metadata-name {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.description-icon {
    margin-left: 4px;
    color: #1890ff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        color: #40a9ff;
    }
}

.card-content {
    display: flex;
    align-items: center;
}

.principal-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.principal-row {
    padding: 8px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.info-field {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    flex-shrink: 0;
}

.field-icon {
    color: #1890ff;
    font-size: 14px;
    flex-shrink: 0;
}

.field-label {
    color: rgba(0, 0, 0, 0.65);
    font-weight: 500;
    white-space: nowrap;
}

.field-value {
    color: rgba(0, 0, 0, 0.85);
    max-width: 300px;
    flex: 1;
}

.field-value-tag {
    max-width: 300px;
    margin: 0;
    border-radius: 4px;
    background: #f0f2f5;
    border: 1px solid #d9d9d9;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    padding: 2px 8px;
    display: inline-flex;
    align-items: center;
    line-height: 1.5;
    gap: 4px;
}

.field-text {
    flex: 1;
    min-width: 0;
}

.clickable-tag {
    cursor: pointer;
    user-select: none;
}

.row-divider {
    width: 100%;
    height: 1px;
    background: #f0f0f0;
    margin-top: 8px;
}

.copy-button {
    padding: 0;
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
    color: #1890ff;
    transition: all 0.2s ease;

    &:hover {
        color: #40a9ff;
        background: rgba(24, 144, 255, 0.1);
    }
}
</style>
