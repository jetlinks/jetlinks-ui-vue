<template>
    <div style="margin-top: 20px">
        <j-descriptions bordered>
            <template #title>
                关系信息
                <PermissionButton
                    type="link"
                    @click="visible = true"
                    hasPermission="device/Instance:update"
                >
                    <AIcon type="EditOutlined" />编辑<j-tooltip
                        title="管理设备与其他业务的关联关系，关系来源于关系配置"
                        ><AIcon type="QuestionCircleOutlined"
                    /></j-tooltip>
                </PermissionButton>
            </template>
            <j-descriptions-item
                :span="1"
                v-for="item in dataSource"
                :key="item.objectId"
            >
                <template #label>
                    <Ellipsis>{{ item.relationName }}</Ellipsis>
                </template>
                <Ellipsis>
                    {{
                        item?.related
                            ? (item?.related || []).map((i) => i.name).join(',')
                            : ''
                    }}
                </Ellipsis>
            </j-descriptions-item>
        </j-descriptions>
        <Save v-if="visible" @save="saveBtn" @close="visible = false" />
    </div>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Save from './Save.vue';
const instanceStore = useInstanceStore();

const dataSource = ref<Record<any, any>[]>([]);
const visible = ref<boolean>(false);

watchEffect(() => {
    const arr = (instanceStore.current?.relations || []).reverse();
    dataSource.value = arr as Record<any, any>[];
});

const saveBtn = () => {
    visible.value = false;
    if (instanceStore.current.id) {
        instanceStore.refresh(instanceStore.current.id);
    }
};
</script>
