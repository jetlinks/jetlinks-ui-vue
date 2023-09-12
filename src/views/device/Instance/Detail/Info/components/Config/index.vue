<template>
    <div style="margin-top: 20px" v-if="config.length">
        <div style="display: flex; margin-bottom: 20px; align-items: center">
            <div style="font-size: 16px; font-weight: 700">配置</div>
            <j-space>
                <PermissionButton
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <template #icon><AIcon type="EditOutlined" /></template>
                    编辑
                </PermissionButton>
                <PermissionButton
                    type="link"
                    v-if="instanceStore.detail.current?.value !== 'notActive'"
                    :popConfirm="{
                        title: '确认重新应用该配置？',
                        onConfirm: deployBtn,
                    }"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="CheckOutlined" />应用配置<j-tooltip
                        title="修改配置后需重新应用后才能生效。"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </PermissionButton>
                <PermissionButton
                    type="link"
                    v-if="instanceStore.detail.aloneConfiguration"
                    :popConfirm="{
                        title: '确认恢复默认配置？',
                        onConfirm: resetBtn,
                    }"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="SyncOutlined" />恢复默认<j-tooltip
                        title="该设备单独编辑过配置信息，点击此将恢复成默认的配置信息，请谨慎操作。"
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
                    <Ellipsis style="margin-right: 5px;">
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
                         item.type.elements?.filter((i)=>
                            i.value ===  instanceStore.current?.configuration?.[
                                item.property
                            ] 
                           )[0].text
                    }}</Ellipsis>
                    <j-tooltip
                        v-if="isExit(item.property)"
                        :title="`有效值:${
                            instanceStore.current?.configuration?.[
                                item.property
                            ]
                        }`"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </span>
                <span v-else>
                    <Ellipsis>{{
                         item.type.elements?.filter((i)=>
                            i.value ===  instanceStore.current?.configuration?.[
                                item.property
                            ] 
                           )[0].text
                    }}</Ellipsis>
                    <j-tooltip
                        v-if="isExit(item.property)"
                        :title="`有效值:${
                            instanceStore.current?.configuration?.[
                                item.property
                            ]
                        }`"
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

const instanceStore = useInstanceStore();
const visible = ref<boolean>(false);
const config = ref<ConfigMetadata[]>([]);

watchEffect(() => {
    if (instanceStore.current.id) {
        getConfigMetadata(instanceStore.current.id).then((resp) => {
            if (resp.status === 200) {
                config.value = resp?.result as ConfigMetadata[];
            }
        });
    }
});

const isExit = (property: string) => {
    return (
        instanceStore.current?.cachedConfiguration &&
        instanceStore.current?.cachedConfiguration[property] !== undefined &&
        instanceStore.current?.configuration &&
        instanceStore.current?.configuration[property] !==
            instanceStore.current?.cachedConfiguration[property]
    );
};

const deployBtn = async () => {
    if (instanceStore.current.id) {
        const resp = await _deploy(instanceStore.current.id);
        if (resp.status === 200) {
            onlyMessage('操作成功');
            instanceStore.refresh(instanceStore.current.id);
        }
    }
};

const resetBtn = async () => {
    if (instanceStore.current.id) {
        const resp = await configurationReset(instanceStore.current.id);
        if (resp.status === 200) {
            onlyMessage('恢复默认配置成功');
            instanceStore.refresh(instanceStore.current.id);
        }
    }
};

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};
</script>