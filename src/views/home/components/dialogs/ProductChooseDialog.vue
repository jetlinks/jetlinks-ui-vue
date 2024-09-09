<template>
    <j-modal
        visible
        :title="$t('dialogs.ProductChooseDialog.926510-0')"
        width="700px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :maskClosable="false"
        class="access-method-dialog-container"
    >
        <j-form :model="form" ref="formRef" layout="vertical">
            <j-form-item
                :label="$t('dialogs.ProductChooseDialog.926510-1')"
                name="productId"
                :rules="[{ required: true, message: $t('dialogs.ProductChooseDialog.926510-2') }]"
            >
                <j-select
                    v-model:value="form.productId"
                    style="width: 100%"
                    show-search
                    :options="productList"
                    :placeholder="$t('dialogs.ProductChooseDialog.926510-2')"
                >
                </j-select>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { getProductList_api } from '@/api/home';
import { productItem } from '../../typing';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    visible: boolean;
}>();

const formRef = ref<any>()

const form = reactive({
    productId: undefined,
});

const productList = ref<[productItem] | []>([]);
const getOptions = () => {
    getProductList_api().then(({ result }: any) => {
        productList.value = result
            .filter((i: any) => !i?.accessId)
            .map((item: { name: any; id: any }) => ({
                label: item.name,
                value: item.id,
            })) as [productItem];
    });
};

getOptions();

const confirm = () => {
    formRef.value?.validate().then(() => {
        emits('confirm', form.productId);
        emits('update:visible', false);
    })
};
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
