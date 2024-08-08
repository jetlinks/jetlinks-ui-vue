<template>
    <j-modal
        :maskClosable="false"
        width="1000px"
        :visible="true"
        :title="$t('Recharge.Detail.797371-0')"
        :okText="$t('Recharge.Detail.797371-1')"
        :cancelText="$t('Recharge.Detail.797371-2')"
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
                <j-descriptions-item :label="$t('Recharge.Detail.797371-3')">{{
                    data.chargeMoney
                }}</j-descriptions-item>
                <j-descriptions-item :label="$t('Recharge.Detail.797371-4')">{{
                    data?.rechargeId
                }}</j-descriptions-item>
                <j-descriptions-item :label="$t('Recharge.Detail.797371-5')">{{
                    data.configName
                }}</j-descriptions-item>
                <j-descriptions-item :label="$t('Recharge.Detail.797371-6')">{{
                    data.orderNumber
                }}</j-descriptions-item>
                <j-descriptions-item :label="$t('Recharge.Detail.797371-7')">{{
                    data.paymentType
                }}</j-descriptions-item>
                <j-descriptions-item :label="$t('Recharge.Detail.797371-8')">
                    <div style="height: 100px; overflow: auto">
                        {{ data.url ? data.url : '' }}
                    </div>
                </j-descriptions-item>
                <j-descriptions-item :label="$t('Recharge.Detail.797371-9')">{{
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
