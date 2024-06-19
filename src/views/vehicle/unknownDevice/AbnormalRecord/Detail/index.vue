<template>
    <j-modal
        title="详情"
        visible
        :width="800"
        @cancel="cancel"
        :maskClosable="false"
    >
        <a-descriptions
            bordered
            :column="2"

        >
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
    </j-modal>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
const emit = defineEmits(['cancel']);
const props = defineProps<{
    data: any;
}>();

const cancel = () => {
    emit('cancel');
};
</script>

<style lang="less" scoped></style>
