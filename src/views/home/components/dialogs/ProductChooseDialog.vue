<template>
    <j-modal
        visible
        title="选择产品"
        width="700px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :filter-option="filterOption"
        :maskClosable="false"
        class="access-method-dialog-container"
    >
        <j-form :model="form" name="basic" autocomplete="off" layout="vertical">
            <j-form-item
                label="产品"
                name="productId"
                :rules="[{ required: true, message: '该字段是必填字段' }]"
            >
                <j-select
                    v-model:value="form.productId"
                    style="width: 100%"
                    :options="productList"
                >
                </j-select>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { getProductList_api } from '@/api/home';
import { productItem } from '../../typing';

const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    visible: boolean;
}>();

const confirm = () => {
    emits('confirm', form.value.productId);
    emits('update:visible', false);
};

const form = ref({
    productId: '',
});

const productList = ref<[productItem] | []>([]);
const getOptions = () => {
    getProductList_api().then((resp: any) => {
        productList.value = resp.result
            .filter((i: any) => !i?.accessId)
            .map((item: { name: any; id: any }) => ({
                label: item.name,
                value: item.id,
            })) as [productItem];
    });
};

const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
getOptions();
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
