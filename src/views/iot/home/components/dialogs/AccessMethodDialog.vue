<template>
    <div ref="modal" class="access-method-dialog-container"></div>
    <a-modal
        v-model:visible="visible"
        title="选择产品"
        style="width: 700px"
        @ok="handleOk"
        show-search
        :filter-option="filterOption"
        :getContainer="getContainer"
        :maskClosable="false"
    >
        <a-form :model="form" name="basic" autocomplete="off" layout="vertical">
            <a-form-item
                label="产品"
                name="productId"
                :rules="[{ required: true, message: '该字段是必填字段' }]"
            >
                <a-select
                    v-model:value="form.productId"
                    style="width: 100%"
                    :options="productList"
                >
                </a-select>
            </a-form-item>
        </a-form>

        <template #footer>
            <a-button key="back" @click="visible = false">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk"
                >确认</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { ComponentInternalInstance } from 'vue';
import { productItem } from '../../index';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const props = defineProps({
    openNumber: Number,
});
const emits = defineEmits(['confirm']);
const visible = ref<boolean>(false);
const form = ref({
    productId: '',
});

const productList = ref<[productItem] | []>([]);

const getContainer = () => proxy?.$refs.modal as HTMLElement;
const getOptions = () => {
    productList.value = [];
};
const handleOk = () => {
    emits('confirm', form.value);
    visible.value = false;
};
const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
watch(
    () => props.openNumber,
    () => {
        visible.value = true;
        form.value.productId = '';
        getOptions();
    },
);
</script>

<style lang="less" scoped>
.access-method-dialog-container {
    :deep(.ant-modal-body) {
        .ant-form {
            .ant-form-item-label {
                color: green;
                .ant-form-item-required {
                    &::before {
                        position: absolute;
                        left: 30px;
                    }
                }
            }
        }
    }
}
</style>
