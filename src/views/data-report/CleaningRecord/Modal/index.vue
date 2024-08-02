<template>
    <j-modal
        title="查看"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        width="400px"
        :confirmLoading="loading"
    >
        <j-form layout="vertical" :model="form" ref="formRef">
            <j-form-item label="清洗规则" class="item_title">
                <j-form-item label="最大值"
                    ><j-input-number
                        v-model:value="form.maxNumber"
                        :disabled="isDisabled"
                        style="width: 90%"
                /></j-form-item>
                <j-form-item label="最小值"
                    ><j-input-number
                        v-model:value="form.minNumber"
                        :disabled="isDisabled"
                        style="width: 90%"
                /></j-form-item>
            </j-form-item>
            <j-form-item label="上报数据" class="item_title">
                <j-textarea
                    v-model:value="form.reportData"
                    placeholder="这里回显设备上报数据json"
                    :disabled="isDisabled"
                    :rows="6"
                    :maxlength="6"
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="close">取消</j-button>
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';

const visible = ref(false);
const loading = ref(false);
const formRef = ref();
const isDisabled = ref(true);

const form = ref<any>({});

/**
 * 显示弹窗
 */
const show = (data: any) => {
    visible.value = true;
    form.value = {
        maxNumber: data.max,
        minNumber: data.min,
    };
};

defineExpose({
    show: show,
});

const submitData = () => {
    loading.value = true;
    formRef.value.validate().then(async () => {
        onlyMessage('确定', 'warning');
    });

    setTimeout(() => {
        loading.value = false;
        visible.value = false;
    }, 1000);
};

const close = () => {
    visible.value = false;
};
</script>

<style lang="less" scoped>
.ant-form-item {
    margin-bottom: 12px;
}
:deep(.item_title > .ant-form-item-label > label) {
    font-size: 16px;
}
</style>
