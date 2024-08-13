<template>
    <j-modal
        title="查看"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        width="550px"
        :confirmLoading="loading"
    >
        <j-form layout="vertical" :model="form" ref="formRef">
            <j-form-item label="清洗规则" class="item_title">
                <j-form-item label="最大值" v-if="form.maxValue ? true : false"
                    ><j-input-number
                        v-model:value="form.maxValue"
                        :disabled="isDisabled"
                        style="width: 90%"
                /></j-form-item>
                <j-form-item label="最小值" v-if="form.mimValue ? true : false"
                    ><j-input-number
                        v-model:value="form.mimValue"
                        :disabled="isDisabled"
                        style="width: 90%"
                /></j-form-item>
                <j-form-item
                    label="异常值"
                    v-if="form.exceptionValue ? true : false"
                    ><j-input-number
                        v-model:value="form.exceptionValue"
                        :disabled="isDisabled"
                        style="width: 90%"
                /></j-form-item>
                <j-form-item
                    label="无效值"
                    v-if="form.invalidValue ? true : false"
                    ><j-input-number
                        v-model:value="form.invalidValue"
                        :disabled="isDisabled"
                        style="width: 90%"
                /></j-form-item>
            </j-form-item>
            <j-form-item label="上报数据" class="item_title">
                <j-textarea
                    v-model:value="form.originJson"
                    placeholder="这里回显设备上报数据json"
                    :rows="8"
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
        maxValue: data?.cleanRule?.maxValue,
        mimValue: data?.cleanRule?.mimValue,
        exceptionValue: data?.cleanRule?.exceptionValue,
        invalidValue: data?.cleanRule?.invalidValue,
        originJson: data?.originJson,
    };
};

defineExpose({
    show: show,
});

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
