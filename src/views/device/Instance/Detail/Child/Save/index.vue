<template>
    <a-modal
        visible
        title="新增并绑定平台设备"
        width="600px"
        @ok="onSave"
        @cancel="emits('close')"
        :confirmLoading="loading"
    >
        <a-form layout="vertical" :model="form" ref="formRef">
            <a-form-item
                label="设备名称"
                name="name"
                :rules="[
                    { required: true, message: '请输入设备名称' },
                    {
                        max: 64,
                        message: '最多输入64个字符',
                    },
                ]"
            >
                <a-input
                    v-model:value="form.name"
                    placeholder="请输入设备名称"
                ></a-input>
            </a-form-item>

            <a-form-item
                label="所属产品"
                name="productId"
                :rules="{ required: true, message: '请选择产品' }"
            >
                <a-select
                    @change="selectChange"
                    v-model:value="form.productId"
                    placeholder="请选择产品"
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
import { getProductListNoPage, addDevice } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { onlyMessage } from '@/utils/comm';

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
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            {
                termType: 'eq',
                column: 'deviceType',
                value: 'childrenDevice',
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
            onlyMessage('操作成功');
            emits('close');
        }
    }
};

onMounted(() => {
    getProductList();
});
</script>

<style lang="less" scoped></style>
