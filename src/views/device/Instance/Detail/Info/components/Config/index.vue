<template>
    <div style="margin-top: 20px" v-if="config.length">
        <div style="display: flex; margin-bottom: 20px; align-items: center">
            <div style="font-size: 16px; font-weight: 700">{{ $t('Config.index.735528-0') }}</div>
            <j-space>
                <PermissionButton
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <template #icon><AIcon type="EditOutlined" /></template>
                    {{ $t('Config.index.735528-1') }}
                </PermissionButton>
                <PermissionButton
                    type="link"
                    v-if="instanceStore.detail.current?.value !== 'notActive'"
                    :popConfirm="{
                        title: $t('Config.index.735528-2'),
                        onConfirm: deployBtn,
                    }"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="CheckOutlined" />{{ $t('Config.index.735528-3') }}<j-tooltip
                        :title="$t('Config.index.735528-4')"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </PermissionButton>
                <PermissionButton
                    type="link"
                    v-if="instanceStore.detail.aloneConfiguration"
                    :popConfirm="{
                        title: $t('Config.index.735528-5'),
                        onConfirm: resetBtn,
                    }"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="SyncOutlined" />{{ $t('Config.index.735528-6') }}<j-tooltip
                        :title="$t('Config.index.735528-7')"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </PermissionButton>
            </j-space>
        </div>
        <j-descriptions bordered size="small" v-for="i in config" :key="i.name">
            <template #title
                ><h4 style="font-size: 15px">{{ i.name }}</h4></template
            >
            <j-descriptions-item
                v-for="item in i.properties"
                :key="item.property"
            >
                <template #label>
                    <Ellipsis style="margin-right: 5px">
                        {{ item.name }}
                        <j-tooltip
                            v-if="item.description"
                            :title="item.description"
                            ><AIcon type="QuestionCircleOutlined"
                        /></j-tooltip>
                    </Ellipsis>
                </template>
                <span
                    v-if="
                        item.type.type === 'password' &&
                        instanceStore.current?.configuration?.[item.property]
                            ?.length > 0
                    "
                    >******</span
                >
                <span v-else-if="item.type.type === 'enum'">
                    <Ellipsis>{{
                        item.type.elements?.find(
                            (i) =>
                                i.value ===
                                instanceStore.current?.configuration?.[
                                    item.property
                                ],
                        )?.text || ''
                    }}</Ellipsis>
                    <j-tooltip
                        v-if="isExit(item.property)"
                        :title="$t('Config.index.735528-8', [instanceStore.current?.configuration?.[
                                item.property
                            ]])"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </span>
                <span v-else-if="item.type.type === 'boolean'">
                    <Ellipsis>{{
                        [
                            {
                                label: item?.type?.falseText,
                                value: item?.type?.falseValue,
                            },
                            {
                                label: item?.type?.trueText,
                                value: item?.type?.trueValue,
                            },
                        ].find(
                            (i) =>
                                i.value ===
                                instanceStore.current?.configuration?.[
                                    item.property
                                ],
                        )?.label || ''
                    }}</Ellipsis>
                </span>
                <span v-else>
                    <Ellipsis>{{
                        instanceStore.current?.configuration?.[item.property] ||
                        ''
                    }}</Ellipsis>
                    <j-tooltip
                        v-if="isExit(item.property)"
                        :title="$t('Config.index.735528-8', [ instanceStore.current?.configuration?.[
                                item.property
                            ]])"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </span>
            </j-descriptions-item>
        </j-descriptions>
        <Save
            v-if="visible"
            @save="saveBtn"
            @close="visible = false"
            :config="config"
        />
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import { ConfigMetadata } from '@/views/device/Product/typings';
import {
    getConfigMetadata,
    _deploy,
    configurationReset,
} from '@/api/device/instance';
import Save from './Save.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const instanceStore = useInstanceStore();
const visible = ref<boolean>(false);
const config = ref<ConfigMetadata[]>([]);

watch(
    () => instanceStore.current.id,
    (val) => {
        if (val) {
            getConfigMetadata(val).then((resp) => {
                if (resp.status === 200) {
                    config.value = resp?.result as ConfigMetadata[];
                }
            });
        }
    },
    { immediate: true },
);

const isExit = (property: string) => {
    return (
        instanceStore.current?.cachedConfiguration &&
        instanceStore.current?.cachedConfiguration[property] !== undefined &&
        instanceStore.current?.configuration &&
        instanceStore.current?.configuration[property] !==
            instanceStore.current?.cachedConfiguration[property]
    );
};

const deployBtn = () => {
    if (instanceStore.current.id) {
        const response = _deploy(instanceStore.current.id);
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('Config.index.735528-9'));
                instanceStore.refresh(instanceStore.current.id);
            }
        });
        return response;
    }
};

const resetBtn = () => {
    if (instanceStore.current.id) {
        const response = configurationReset(instanceStore.current.id);
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('Config.index.735528-10'));
                instanceStore.refresh(instanceStore.current.id);
            }
        });
        return response
    }
};

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};
</script>
