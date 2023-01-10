<template>
    <a-modal
        v-model:visible="visible"
        title="选择产品"
        style="width: 500px"
        @ok="handleOk"
        show-search
        :filter-option="filterOption"
    >
        <a-select
            v-model:value="productId"
            style="width: 100%"
            :options="productList"
        >
        </a-select>
        <template #footer>
            <a-button key="back" @click="visible = false">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk"
                >确认</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import { productItem } from '../../index';

const props = defineProps({
    openNumber: Number,
});
const emits = defineEmits(['confirm']);
const { openNumber } = toRefs(props);
const visible = ref<boolean>(false);

const productId = ref<string>('');
const productList = ref<[productItem] | []>([]);

const getOptions = () => {
    productList.value = [];
};
const handleOk = () => {
    emits('confirm', productId.value);
    visible.value = false;
};
const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
watch(openNumber, () => {
    visible.value = true;
    productId.value = '';
    getOptions();
});
</script>

<style scoped></style>
