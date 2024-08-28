<template>
    <a-modal
        visible
        title="新增计划"
        @ok="submitData"
        @cancel="emit('closeModal')"
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
                <a-input
                    v-model:value="formData.name"
                    placeholder="请输入计划名称"
                ></a-input>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup>
import { savePlan } from '@/api/media/auto';
import { onlyMessage } from "@/utils/comm"
const emit = defineEmits(['closeModal']);
const formRef = ref();
const formData = reactive({
    name: '',
});
const submitData =async () => {
    const res = await formRef.value?.validate();
    if(res){
        const resp = await savePlan({
            ...res,
            type:'screenshot'
        });
        if (resp.status === 200) {
            onlyMessage('操作成功!');
            emit('closeModal',resp.result.id);
        }
    }
}

</script>
<style lang="less" scoped></style>
