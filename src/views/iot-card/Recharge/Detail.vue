<template>
    <j-modal
        :maskClosable="false"
        width="1000px"
        :visible="true"
        title="详情"
        okText="确定"
        cancelText="取消"
        @ok="handleCancel"
        @cancel="handleCancel"
    >
        <div style="margin-top: 10px">
            <j-descriptions
                :column="2"
                bordered
                :contentStyle="{ minWidth: '300px' }"
                :labelStyle="{ minWidth: '120px' }"
            >
                <j-descriptions-item label="充值金额">{{
                    data.chargeMoney
                }}</j-descriptions-item>
                <j-descriptions-item label="账户id">{{
                    data?.rechargeId
                }}</j-descriptions-item>
                <j-descriptions-item label="平台对接">{{
                    data.configName
                }}</j-descriptions-item>
                <j-descriptions-item label="订单号">{{
                    data.orderNumber
                }}</j-descriptions-item>
                <j-descriptions-item label="支付方式">{{
                    data.paymentType
                }}</j-descriptions-item>
                <j-descriptions-item label="支付URL">
                    <div style="height: 100px; overflow: auto">
                        {{ data.url ? data.url : '' }}
                    </div>
                </j-descriptions-item>
                <j-descriptions-item label="订单时间">{{
                    data.createTime
                        ? moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
                        : '-'
                }}</j-descriptions-item>
            </j-descriptions>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import moment from 'moment';
const emit = defineEmits(['close']);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const handleCancel = () => {
    emit('close');
};
</script>
