<template>
    <a-modal
        open
        :title="$t('Save.index.126289-0')"
        width="600px"
        @ok="onSave"
        @cancel="emits('close')"
        :confirmLoading="loading"
    >
        <a-form layout="vertical" :model="form" ref="formRef">
            <a-form-item
                :label="$t('Save.index.126289-1')"
                name="name"
                :rules="[
                    { required: true, message: $t('Save.index.126289-2') },
                    {
                        max: 64,
                        message: $t('Save.index.126289-3'),
                    },
                ]"
            >
                <a-input
                    v-model:value="form.name"
                    :placeholder="$t('Save.index.126289-2')"
                ></a-input>
            </a-form-item>

            <a-form-item
                :label="$t('Save.index.126289-4')"
                name="productId"
                :rules="{ required: true, message: $t('Save.index.126289-5') }"
            >
                <a-select
                    @change="selectChange"
                    v-model:value="form.productId"
                    :placeholder="$t('Save.index.126289-5')"
                >
                    <a-select-option
                        v-for="i in productList"
                        :key="i.id"
                        :value="i.id"
                    >
                        {{ i.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup name="Save">
import { getProductListNoPage, addDevice } from '../../../../../../api/instance';

import { useInstanceStore } from '../../../../../../store/instance';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const emits = defineEmits(['close']);

const instanceStore = useInstanceStore();
const form = reactive({
    name: '',
    productId: undefined,
    productName: '',
    parentId: instanceStore.current.id,
});
const formRef = ref();
const loading = ref(false);
const productList = ref([]);

const getProductList = async () => {
    const res = await getProductListNoPage({
        terms: [
            {
                termType: 'eq',
                column: 'deviceType',
                value: 'childrenDevice',
            },
            {
                termType: 'eq',
                column: 'state',
                value: 1,
                type: 'and',
            },
        ],
    });
    if (res.status === 200) {
        productList.value = res.result;
    }
};

const selectChange = (_, item) => {
    form.productName = item.name;
};

const onSave = async () => {
    const res = await formRef.value.validateFields();
    if (res) {
        loading.value = true;
        const resp = await addDevice(form).finally(() => {
            loading.value = false;
        });
        if (resp.success) {
            onlyMessage($t('Save.index.126289-6'));
            emits('close');
        }
    }
};

onMounted(() => {
    getProductList();
});
</script>

<style lang="less" scoped></style>
