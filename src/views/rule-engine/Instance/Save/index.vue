<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        destroyOnClose
        visible
        :title="props.data?.id ? '编辑' : '新增'"
        @ok="handleSave"
        @cancel="handleCancel"
        okText="确定"
        cancelText="取消"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item label="名称" name="name">
                    <j-input
                        v-model:value="modelRef.name"
                        placeholder="请输入名称"
                    />
                </j-form-item>
                <j-form-item label="说明" name="describe">
                    <j-textarea
                        v-model:value="modelRef.description"
                        placeholder="请输入说明"
                        showCount
                        :maxlength="200"
                        :rows="4"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { saveRule, modify } from '@/api/rule-engine/instance';
import { getImage } from '@/utils/comm';
import { message } from 'ant-design-vue';

const emit = defineEmits(['success', 'closeSave']);
const props = defineProps({
    data: {
        type: Object,
    },
});

const productList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);
const formRef = ref();
const modelRef = ref();
modelRef.value = {...props.data};
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
const handleCancel = () => {
    emit('closeSave');
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            if (!modelRef.value?.id) {
                let resp = await saveRule(modelRef.value);
                loading.value = false;
                if (resp.status === 200) {
                    message.success('操作成功！');
                    emit('closeSave');
                    emit('success');
                } else {
                    message.error('操作失败');
                }
            } else {
                let resp = await modify(modelRef.value?.id, modelRef.value);
                loading.value = false;
                if (resp.status === 200) {
                    message.success('操作成功！');
                    emit('closeSave');
                    emit('success');
                } else {
                    message.error('操作失败！');
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>