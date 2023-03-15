<template>
    <j-modal
        visible
        title="新增"
        width="670px"
        @cancel="emits('update:visible', false)"
        @ok="confirm"
        :confirm-loading="loading"
    >
        <j-form ref="formRef" :model="form" layout="vertical">
            <j-form-item
                name="name"
                label="名称"
                :rules="[
                    { required: true, message: '请输入名称' },
                    { max: 64, message: '最多可输入64个字符' },
                ]"
            >
                <j-input
                    v-model:value="form.name"
                    placeholder="请输入角色名称"
                    allow-clear
                />
            </j-form-item>
            <j-form-item name="name" label="说明">
                <j-textarea
                    v-model:value="form.description"
                    placeholder="请输入说明"
                    allow-clear
                    :maxlength="200"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { FormInstance, message } from 'ant-design-vue';
import { saveRole_api } from '@/api/system/role';
import { useMenuStore } from '@/store/menu';
const route = useRoute();
const { jumpPage } = useMenuStore();

const emits = defineEmits(['update:visible']);
const props = defineProps<{
    visible: boolean;
}>();
// 弹窗相关
const loading = ref(false);
const form = ref<any>({});
const formRef = ref<FormInstance>();

const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(() => saveRole_api(form.value))
        .then((resp) => {
            if (resp.status === 200) {
                message.success('操作成功');
                emits('update:visible', false);

                if (route.query.save) {
                    // @ts-ignore
                    window?.onSaveSuccess(resp.result.id);
                    window.close();
                } else jumpPage(`system/Role/Detail`, { id: resp.result.id });
            }
        })
        .finally(() => (loading.value = false));
};
// 表单相关
</script>

<style scoped></style>
