<template>
    <a-modal
        :maskClosable="false"
        width="650px"
        destroyOnClose
        v-model:visible="visible"
        :title="props.title"
        @ok="handleSave"
        @cancel="handleCancel"
        okText="确定"
        cancelText="取消"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <a-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <a-form-item label="名称" name="name">
                    <a-input
                        v-model:value="modelRef.name"
                        placeholder="请输入名称"
                    />
                </a-form-item>
                <a-form-item label="说明" name="describe">
                    <a-textarea
                        v-model:value="modelRef.description"
                        placeholder="请输入说明"
                        showCount
                        :maxlength="200"
                        :rows="4"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { saveRule , modify } from '@/api/rule-engine/instance';
import { getImage } from '@/utils/comm';
import { message } from 'ant-design-vue';

const emit = defineEmits(['success']);
const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    isAdd: {
        type: Number,
        default: '',
    },
});
const productList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const visible = ref<boolean>(false);
const formRef = ref();
let id = ref<string>();
const modelRef = reactive({
    name: '',
    description: '',
});

const rules = {
    name: [
        {
            required: true,
            message: '请输入名称',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
};

watch(
    () => props.isAdd,
    () => {},
    { immediate: true, deep: true },
);

const handleCancel = () => {
    visible.value = false;
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            if (props.isAdd === 1) {
                let resp = await saveRule(modelRef);
                loading.value = false;
                if (resp.status === 200) {
                    message.success('操作成功！');
                    emit('success');
                    formRef.value.resetFields();
                    visible.value = false;
                }else{
                    message.error('操作失败')
                }
            }else if(props.isAdd === 2) {
                let resp = await modify(id,modelRef);
                loading.value = false;
                if (resp.status === 200) {
                    message.success('操作成功！');
                    emit('success');
                    formRef.value.resetFields();
                    visible.value = false;
                }else{
                    message.error('操作失败！');
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};

const show = (data: any) => {
    if (props.isAdd === 1) {
        modelRef.name = '';
        modelRef.description = '';
    } else if (props.isAdd === 2) {
        modelRef.name = data?.name;
        modelRef.description = data?.description;
        id = data.id
    }
    visible.value = true;
};
defineExpose({
    show: show,
});
</script>