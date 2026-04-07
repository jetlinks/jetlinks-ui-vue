<template>
    <div>
        <TitleComponent :data="$t('SaveChild.index.898555-0')">
            <template #extra>
                <a-button @click="comeBack" style="margin-left: 10px;">{{ $t('SaveChild.index.898555-1') }}</a-button>
            </template>
        </TitleComponent>
        <a-form layout="vertical" :model="form" ref="formRef">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        :label="$t('SaveChild.index.898555-2')"
                        name="name"
                        :rules="{ required: true, message: $t('SaveChild.index.898555-3') }"
                    >
                        <a-input v-model:value="form.name"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        :label="$t('SaveChild.index.898555-4')"
                        name="productId"
                        :rules="{ required: true, message: $t('SaveChild.index.898555-5') }"
                    >
                        <a-select
                            :disabled="props.childData?.id"
                            @change="selectChange"
                            v-model:value="form.productId"
                        >
                            <a-select-option
                                v-for="i in productList"
                                :key="i.id"
                                :value="i.id"
                                >{{ i.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="visible">
                <a-col :span="24"
                    ><EdgeMap
                        :productList="productList"
                        @close="comeBack"
                        @getEdgeMap="getEdgeMapData"
                /></a-col>
            </a-row>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
import { getProductListNoPage, getEdgeMap, removeEdgeMap } from '../../../../../../api/instance';
import EdgeMap from '../EdgeMap/index.vue';
import { useInstanceStore } from '../../../../../../store/instance';
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
/**
 * 获取产品列表
 */
const getProductList = async () => {
    const res = await getProductListNoPage({
        terms: [{ column: 'accessProvider', value: 'edge-child-device' }],
    });
    if (res.status === 200) {
        productList.value = res.result;
        getEdgeMapData();
    }
};
/**
 * 获取映射数据
 */
const getEdgeMapData = () => {
    if (props.childData?.id) {
        current.value.parentId = props.childData.id;
        form.name = props.childData?.name;
        form.productId = props.childData?.productId;
        selectChange(form.productId);
        if (current.value.metadata) {
            const metadata = current.value.metadata;
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
    } else {
        current.value.parentId = '';
    }
};
/**
 * 根据产品id获取对应映射列表
 * @param e 产品id
 */
const selectChange = (e: any) => {
    if (e) {
        visible.value = true;
    }
    const item = productList.value.filter((i: any) => i.id === e)[0];
    const array = JSON.parse(item?.metadata || '{}')?.properties?.map(
        (i: any) => ({
            metadataType: 'property',
            metadataName: `${i.name}(${i.id})`,
            metadataId: i.id,
            name: i.name,
        }),
    );
    current.value.metadata = array;
};
onMounted(() => {
    getProductList();
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
