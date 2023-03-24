<template>
    <j-modal
        class="edit-permission-dialog-container"
        title="编辑"
        width="500px"
        @ok="confirm"
        :confirmLoading="loading"
        visible
        @cancel="emits('update:visible', false)"
    >
        <a-alert
            message="只能分配有'共享'权限的资产数据"
            type="warning"
            show-icon
        />
        <div style="margin-top: 5px;">
            <span>资产权限：</span>
            <j-checkbox-group
                v-model:value="form.permission"
                :options="options"
            />
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import type { dictType, optionsType } from '../typing';
import { updatePermission_api } from '@/api/system/department';
import { message } from 'jetlinks-ui-components';

const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    ids: string[];
    permissionList: string[];
    parentId: string;
    allPermission: dictType;
    assetType: 'product' | 'device';
}>();
// 弹窗相关
const loading = ref(false);
const confirm = () => {
    loading.value = true;
    updatePermission_api(props.assetType, props.parentId, form)
        .then(() => {
            message.success('操作成功');
            emits('confirm');
            emits('update:visible', false);
        })
        .finally(() => (loading.value = false));
};
const form = reactive({
    assetIdList: [...props.ids],
    permission: [...props.permissionList],
});
const options = computed(() => {
    const result: optionsType = [];
    props.allPermission.forEach((item) => {
        if (props.permissionList.includes(item.id))
            result.push({
                label: item.name,
                value: item.id,
                disabled: item.id === 'read',
            });
    });
    return result;
});
</script>

<style scoped></style>
