<template>
    <div>
        <TitleComponent data="基本信息">
            <template #extra>
                <j-button @click="comeBack">返回</j-button>
            </template>
        </TitleComponent>
        <j-form layout="vertical" :model="form" ref="formRef">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        label="设备名称"
                        name="name"
                        :rules="{ required: true, message: '请输入设备名称' }"
                    >
                        <j-input v-model:value="form.name"></j-input>
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        label="产品名称"
                        name="productId"
                        :rules="{ required: true, message: '请选择产品名称' }"
                    >
                        <j-select
                            :disabled="props.childData?.id"
                            @change="selectChange"
                            v-model:value="form.productId"
                        >
                            <j-select-option
                                v-for="i in productList"
                                :key="i.id"
                                :value="i.id"
                                >{{ i.name }}</j-select-option
                            >
                        </j-select>
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="visible">
                <j-col :span="24"
                    ><EdgeMap :productList="productList" @close="comeBack"
                /></j-col>
            </j-row>
        </j-form>
    </div>
</template>

<script lang="ts" setup>
import { getProductListNoPage } from '@/api/device/instance';
import EdgeMap from '../EdgeMap/index.vue';
import { useInstanceStore } from '@/store/instance';
import { storeToRefs } from 'pinia';
import { provide } from 'vue';
const instanceStore = useInstanceStore();
const { current } = storeToRefs(instanceStore);
const props = defineProps(['childData']);
const form = reactive({
    name: '',
    productId: '',
});
const formRef = ref();
const emit = defineEmits(['closeChildSave']);
const productList = ref();
const visible = ref(false);
const getProductList = async () => {
    const res = await getProductListNoPage({
        terms: [{ column: 'accessProvider', value: 'edge-child-device' }],
    });
    if (res.status === 200) {
        productList.value = res.result;
    }
};
getProductList();
const selectChange = (e: any) => {
    if (e) {
        visible.value = true;
    }
    const item = productList.value.filter((i: any) => i.id === e)[0];
    const array = JSON.parse(item.metadata || [])?.properties?.map(
        (i: any) => ({
            metadataType: 'property',
            metadataName: `${i.name}(${i.id})`,
            metadataId: i.id,
            name: i.name,
        }),
    );
    current.value.metadata = array;
};
watchEffect(() => {
    if (props.childData?.id) {
        visible.value = true;
    }
});
watchEffect(() => {});

const validate = async () => {
   return  formRef.value.validateFields();
};
provide('validate',validate);
const comeBack = () =>{
    emit('closeChildSave');
}
</script>
<style lang="less" scoped>
</style>