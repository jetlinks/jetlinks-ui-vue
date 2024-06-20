<template>
    <j-modal title="详情" v-model:visible="visible" :width="800">
        <a-descriptions bordered :column="2">
            <a-descriptions-item label="车辆类型">{{
                data?.vehicleTypeEnum
            }}</a-descriptions-item>
            <a-descriptions-item label="出厂编号">{{
                data?.factoryNumber
            }}</a-descriptions-item>
            <a-descriptions-item label="车辆简称">{{
                data?.simpleName
            }}</a-descriptions-item>
            <a-descriptions-item label="子设备">{{
                data?.subEquipment
            }}</a-descriptions-item>
            <a-descriptions-item label="清洗时间">
                {{
                    dayjs(Number(data?.cleaningTime)).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                }}
            </a-descriptions-item>
            <a-descriptions-item label="清洗字段">{{
                data?.cleaningField
            }}</a-descriptions-item>
            <a-descriptions-item label="上报值">{{
                data?.reportedValue
            }}</a-descriptions-item>
            <a-descriptions-item label="型号">{{
                data?.modelNumber
            }}</a-descriptions-item>
            <a-descriptions-item label="所属组织">{{
                data?.orgName
            }}</a-descriptions-item>
        </a-descriptions>
        <template #footer>
            <j-button type="primary" @click="close">关闭</j-button>
        </template>
    </j-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
const emit = defineEmits<{
    (e: 'update:modelValue', data: boolean): void;
}>();
const props = defineProps<{
    data: any;
    modelValue: boolean;
}>();

const visible = computed({
    get: () => props.modelValue,
    set: () => emit('update:modelValue', false),
});

const close = () => {
    emit('update:modelValue', false);
};
</script>

<style lang="less" scoped></style>
