<template>
    <j-modal
        :visible="visible"
        :title="title"
        width="520px"
        @ok="handleOk"
        :maskClosable="false"
        @cancel="cancel"
        :loading="loading"
    >
        <j-form layout="vertical" :model="form" :rules="rules" ref="formRef">
            <j-form-item label="名称" name="name">
                <j-input v-model:value="form.name" placeholder="请输入名称" />
            </j-form-item>
            <j-form-item label="标识" name="id">
                <j-input v-model:value="form.id" placeholder="请输入标识" />
            </j-form-item>
            <j-form-item label="说明" name="describe">
                <j-textarea
                    :maxlength="160"
                    showCount
                    :auto-size="{ minRows: 4, maxRows: 5 }"
                    v-model:value="form.describe"
                    placeholder="请输入说明"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { filterSelectNode, onlyMessage } from '@/utils/comm';

const emit = defineEmits(['success']);
const props = defineProps<{
    isAdd: number;
    title: string;
}>();

const formRef = ref();
const formValue = reactive({
    form: { id: '', name: '', describe: '' },
    rules: {
        name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64位字符', trigger: 'change' },
        ],
        id: [
            { required: true, message: '请输入标识', trigger: 'blur' },
            { max: 64, message: '最多可输入64位字符', trigger: 'change' },
        ],
    },
    visible: false as boolean,
});

const { form, rules, visible } = toRefs(formValue);
const loading = ref(false);

/**
 * 显示弹窗
 */
const show = (data: any) => {
    if (props.isAdd === 1) {
        form.value = { id: '', name: '', describe: '' };
    } else {
        form.value = data;
    }
    visible.value = true;
};

const handleOk = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            if (props.isAdd === 1) {
                // 新增
                loading.value = false;
                visible.value = false;
                emit('success');
                onlyMessage('添加成功');
            } else if (props.isAdd === 2) {
                //更新
                loading.value = false;
                visible.value = false;
                emit('success');
                onlyMessage('修改成功');
            }
        })
        .catch((err: any) => {
            // loading.value = false;
        });
};

const cancel = () => {
    visible.value = false;
    //   departmentStore.setProductId()
    // emits('update:visible', false);
};

defineExpose({
    show: show,
});
</script>

<style scoped></style>
