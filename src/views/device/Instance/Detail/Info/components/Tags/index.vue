<template>
    <div style="margin-top: 20px">
        <a-descriptions bordered>
            <template #title>
                标签
                <PermissionButton
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="EditOutlined" />编辑
                </PermissionButton>
            </template>
            <a-descriptions-item
                :span="1"
                v-for="item in dataSource"
                :key="item.key"
                :label="`${item.name}（${item.key})`"
                >{{ item?.value }}</a-descriptions-item
            >
        </a-descriptions>
        <Save v-if="visible" @close="visible = false" @save="saveBtn" />
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Save from './Save.vue';

const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const visible = ref<boolean>(false);

watchEffect(() => {
    const arr = instanceStore.current?.tags || [];
    dataSource.value = arr as Record<any, any>[];
});

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};
</script>
