<template>
    <div class="device-detail-metadata" style="position: relative">
        <!-- <div class="tips">-->
        <!--        <j-tooltip :title="instanceStore.detail?.independentMetadata && type === 'device'-->
        <!--        ? '该设备已脱离产品物模型，修改产品物模型对该设备无影响'-->
        <!--        : '设备会默认继承产品的物模型，修改设备物模型后将脱离产品物模型'">-->
        <!--          <div class="ellipsis" style='color: #999;'>-->
        <!--            <AIcon type="InfoCircleOutlined" style="margin-right: 3px" />-->
        <!--            {{-->
        <!--              instanceStore.detail?.independentMetadata && type === 'device'-->
        <!--                ? '该设备已脱离产品物模型，修改产品物模型对该设备无影响'-->
        <!--                : '设备会默认继承产品的物模型，修改设备物模型后将脱离产品物模型'-->
        <!--            }}-->
        <!--          </div>-->
        <!--        </j-tooltip> -->
        <!-- </div> -->
        <j-tabs
            class="metadataNav"
            :activeKey="tabActiveKey"
            destroyInactiveTabPane
            type="card"
            @change="tabsChange"
        >
            <template #rightExtra>
                <j-space>
                    <PermissionButton
                        v-if="showReset"
                        key="reload"
                        :hasPermission="`${permission}:update`"
                        :popConfirm="{
                            title: '确认重置？',
                            onConfirm: resetMetadata,
                        }"
                        :tooltip="{ title: '重置后将使用产品的物模型配置' }"
                    >
                        重置操作
                    </PermissionButton>
                    <PermissionButton
                        :hasPermission="`${permission}:update`"
                        @click="visible = true"
                        key="import"
                        v-if="type === 'product'"
                        >快速导入</PermissionButton
                    >
                    <PermissionButton
                        :hasPermission="`${permission}:update`"
                        @click="cat = true"
                        key="tsl"
                        >物模型TSL</PermissionButton
                    >
                </j-space>
            </template>
            <template #centerExtra>
                <span class="desc"
                    >设备会默认继承产品的物模型，继承的物模型不支持删改</span
                >
            </template>
            <j-tab-pane tab="属性定义" key="properties">
                <BaseMetadata
                    :target="type"
                    type="properties"
                    :permission="permission"
                />
            </j-tab-pane>
            <j-tab-pane tab="功能定义" key="functions">
                <BaseMetadata
                    :target="type"
                    type="functions"
                    :permission="permission"
                />
            </j-tab-pane>
            <j-tab-pane tab="事件定义" key="events">
                <BaseMetadata
                    :target="type"
                    type="events"
                    :permission="permission"
                />
            </j-tab-pane>
            <j-tab-pane tab="标签定义" key="tags">
                <BaseMetadata
                    :target="type"
                    type="tags"
                    :permission="permission"
                />
            </j-tab-pane>
        </j-tabs>
        <Import
            v-if="visible"
            v-model:visible="visible"
            :type="type"
            @close="visible = false"
        />
        <Cat v-model:visible="cat" @close="cat = false" :type="type" />
    </div>
</template>
<script setup lang="ts" name="Metadata">
import PermissionButton from '@/components/PermissionButton/index.vue';
import { deleteMetadata } from '@/api/device/instance.js';
import { message } from 'jetlinks-ui-components';
import { useInstanceStore } from '@/store/instance';
import Import from './Import/index.vue';
import Cat from './Cat/index.vue';
// import BaseMetadata from './Base/index.vue'
import BaseMetadata from './Base/Base.vue';
import { useMetadataStore } from '@/store/metadata';
import { EventEmitter } from '@/utils/utils';
import { isEqual } from 'lodash-es';

const route = useRoute();
const instanceStore = useInstanceStore();
const metadataStore = useMetadataStore();
interface Props {
    type: 'product' | 'device';
    independentMetadata?: boolean;
}
const props = defineProps<Props>();

const permission = computed(() =>
    props.type === 'device' ? 'device/Instance' : 'device/Product',
);
const visible = ref(false);
const cat = ref(false);
const tabActiveKey = ref('properties');

provide('_metadataType', props.type);

const showReset = computed(() => {
    if (props.type === 'device' && instanceStore.current.productMetadata) {
        const proMetadata = JSON.parse(
            instanceStore.current.productMetadata || '{}',
        );
        const _metadata = JSON.parse(instanceStore.current.metadata || '{}');
        return !isEqual(_metadata, proMetadata);
    }

    return false;
});

// 重置物模型
const resetMetadata = () => {
    const { id } = route.params;
    const response = deleteMetadata(id as string);
    response.then((resp) => {
        if (resp.status === 200) {
            message.info('操作成功');
            instanceStore.refresh(id as string).then(() => {
                metadataStore.set('importMetadata', true);
            });
        }
    });
    return response
};

const tabsChange = (e: string) => {
    EventEmitter.emit('MetadataTabs', () => {
        tabActiveKey.value = e;
    });
};
</script>
<style scoped lang="less">
.device-detail-metadata {
    .tips {
        // width: calc(100% - 670px);
        position: absolute;
        top: 12px;
        z-index: 1;
        margin-left: 420px;
        font-weight: 100;
    }

    .metadataNav {
        :deep(.ant-card-body) {
            padding: 0;
        }
    }
    .desc {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.8);
        display: inline-block;
        margin-top: 12px;
        margin-left: 5px;
    }
}
</style>
