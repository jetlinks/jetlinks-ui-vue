<template>
    <a-modal
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
            <a-descriptions
                :column="2"
                bordered
                :contentStyle="{ minWidth: '300px' }"
                :labelStyle="{ minWidth: '120px' }"
            >
                <a-descriptions-item label="充值金额">{{
                    data.chargeMoney
                }}</a-descriptions-item>
                <a-descriptions-item label="账户id">{{
                    data?.rechargeId
                }}</a-descriptions-item>
                <a-descriptions-item label="平台对接">{{
                    data.configName
                }}</a-descriptions-item>
                <a-descriptions-item label="订单号">{{
                    data.orderNumber
                }}</a-descriptions-item>
                <a-descriptions-item label="支付方式">{{
                    data.paymentType
                }}</a-descriptions-item>
                <a-descriptions-item label="支付URL">
                    <div style="height: 100px; overflow: auto">
                        {{ data.url ? data.url : '' }}
                    </div>
                </a-descriptions-item>
                <a-descriptions-item label="订单时间">{{
                    data.createTime
                        ? moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
                        : '-'
                }}</a-descriptions-item>
            </a-descriptions>
        </div>
    </a-modal>
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
