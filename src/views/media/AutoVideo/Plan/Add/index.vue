<template>
    <a-modal
        visible
        title="新增-录像计划"
        @ok="submitData"
        @cancel="$emit('closeModal')"
    >
        <a-form ref="formRef" layout="vertical" :model="formData">
            <a-form-item
                label="计划名称"
                name="name"
                :rules="[
                    {
                        required: true,
                        message: '请输入计划名称',
                    },
                    {
                        max: 64,
                        message: '最多可输入64个字符',
                    },
                ]"
            >
                <a-input v-model:value="formData.name"></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { savePlan } from '@/api/media/auto';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
const emit = defineEmits(['closeModal']);
const formRef = ref();
const formData = ref({
    name: '',
    type: 'video',
});
const menuStory = useMenuStore();
const submitData = () => {
    formRef.value.validate().then(async () => {
        const res = await savePlan(formData.value);
        if (res.success) {
            onlyMessage('操作成功');
            menuStory.jumpPage(
                'media/AutoVideo/Plan/Detail',
                {
                    id: res.result.id,
                },
                {
                    type: 'edit',
                },
            );
        }
    });
};
</script>
<style lang="less" scoped></style>
