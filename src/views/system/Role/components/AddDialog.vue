<template>
    <a-modal
        v-model:visible="dialog.visible"
        title="新增"
        width="670px"
        @ok="dialog.handleOk"
    >
        <a-form ref="formRef" :model="form.data" layout="vertical">
            <a-form-item
                name="name"
                label="名称"
                :rules="[{ required: true, message: '请输入名称' }]"
            >
                <a-input
                    v-model:value="form.data.name"
                    placeholder="请输入角色名称"
                    allow-clear
                    :maxlength="64"
                />
            </a-form-item>
            <a-form-item name="name" label="说明">
                <a-textarea
                    v-model:value="form.data.description"
                    placeholder="请输入说明"
                    allow-clear
                    :maxlength="200"
                />
            </a-form-item>
        </a-form>

        <template #footer>
            <a-button key="back" @click="dialog.visible = false">取消</a-button>
            <a-button
                key="submit"
                type="primary"
                :loading="form.loading"
                @click="dialog.handleOk"
                >确定</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { FormInstance, message } from 'ant-design-vue';
import { saveRole_api } from '@/api/system/role';
const router = useRouter()
const props = defineProps({
    open: Number,
});
// 弹窗相关
const dialog = reactive({
    visible: false,
    handleOk: () => {
        formRef.value
            ?.validate()
            .then(() => saveRole_api(form.data))
            .then((resp) => {
                if (resp.status === 200) {
                    message.success('操作成功');
                    dialog.visible = false;
                    router.push(`/system/Role/detail/${resp.result.id}`)
                }
            });
    },
});
// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    data: {
        name: '',
        description: '',
    },
});

watch(
    () => props.open,
    () => {
        // 重置表单
        form.data = {
            name: '',
            description: '',
        };
        formRef.value?.resetFields();
        dialog.visible = true;
    },
);
</script>

<style scoped></style>
