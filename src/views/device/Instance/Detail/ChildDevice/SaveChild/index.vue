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
import { getEdgeMap, removeEdgeMap } from '@/api/device/instance';
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
        current.value.parentId = props.childData.id;
        form.name = props.childData?.name;
        form.productId = props.childData?.productId;
        if (props.childData.deriveMetadata) {
            const metadata = JSON.parse(
                props.childData?.deriveMetadata || {},
            )?.properties?.map((item: any) => ({
                metadataId: item.id,
                metadataName: `${item.name}(${item.id})`,
                metadataType: 'property',
                name: item.name,
            }));
            if (metadata && metadata.length !== 0) {
                getEdgeMap(current.value.id, {
                    deviceId: props.childData.id,
                    query: {},
                }).then((res) => {
                    if (res.status === 200) {
                        // console.log(res.result)
                        //合并物模型
                        const array = res.result[0]?.reduce(
                            (x: any, y: any) => {
                                const metadataId = metadata.find(
                                    (item: any) =>
                                        item.metadataId === y.metadataId,
                                );
                                if (metadataId) {
                                    Object.assign(metadataId, y);
                                } else {
                                    x.push(y);
                                }
                                return x;
                            },
                            metadata,
                        );
                        //删除物模型
                        const items = array.filter(
                            (item: any) => item.metadataName,
                        );
                        current.value.metadata = items;
                        const delList = array
                            .filter((a: any) => !a.metadataName)
                            .map((b: any) => b.id);
                        //删除后解绑
                        if (delList && delList.length !== 0) {
                            removeEdgeMap(current.value.id, {
                                deviceId: props.childData.id,
                                idList: [...delList],
                            });
                        }
                    }
                });
            }
        }
        visible.value = true;
    }
});

const validate = async () => {
    return formRef.value.validateFields();
};
provide('validate', validate);
const comeBack = () => {
    emit('closeChildSave');
};
</script>
<style lang="less" scoped>
</style>