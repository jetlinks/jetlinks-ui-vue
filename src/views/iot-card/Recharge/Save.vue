<template>
    <j-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        title="充值"
        okText="确定"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <div>
            <div class="modal-info">
                <AIcon
                    type="ExclamationCircleOutlined"
                    style="margin-right: 6px"
                />暂只支持移动OneLink平台
            </div>
            <j-form
                layout="vertical"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item label="平台对接" name="configId">
                    <j-select
                        v-model:value="modelRef.configId"
                        :options="configList"
                        allowClear
                        show-search
                        style="width: 100%"
                        placeholder="请选择平台对接"
                    >
                    </j-select>
                </j-form-item>
                <j-form-item label="账户id" name="rechargeId">
                    <j-input
                        v-model:value="modelRef.rechargeId"
                        placeholder="请输入账户id"
                    />
                </j-form-item>
                <j-form-item label="充值金额" name="chargeMoney">
                    <j-input-number
                        allowClear
                        :precision="2"
                        style="width: 100%"
                        v-model:value="modelRef.chargeMoney"
                        :min="1"
                        :max="500"
                        placeholder="请输入1~500之间的金额"
                    />
                </j-form-item>

                <j-form-item label="支付方式" name="paymentType">
                    <j-select
                        allowClear
                        :options="PaymentMethod"
                        v-model:value="modelRef.paymentType"
                        placeholder="请选择支付方式"
                    >
                    </j-select>
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryPlatformNoPage, recharge } from '@/api/iot-card/cardManagement';
import { message } from 'ant-design-vue';
import { PaymentMethod } from '@/views/iot-card/data';

const emit = defineEmits(['change']);

const btnLoading = ref<boolean>(false);
const configList = ref<Record<string, any>[]>([]);

const formRef = ref();

const modelRef = reactive({
    configId: undefined,
    rechargeId: '',
    chargeMoney: undefined,
    paymentType: undefined,
});

const rules = {
    configId: [
        {
            required: true,
            message: '请选择平台对接',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
    rechargeId: [
        {
            required: true,
            message: '请输入账户id',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
    chargeMoney: [
        {
            required: true,
            message: '请输入充值金额',
        },
        // {
        //     min: 1,
        //     max: 500,
        //     message: '请输入1~500之间的数字',
        // },
    ],
    paymentType: [
        {
            required: true,
            message: '请选择支付方式',
        },
    ],
};

const queryProvidersList = () => {
    queryPlatformNoPage({
        paging: false,
        terms: [
            {
                terms: [
                    {
                        column: 'operatorName',
                        termType: 'eq',
                        value: 'onelink',
                    },
                    {
                        column: 'state',
                        termType: 'eq',
                        value: 'enabled',
                        type: 'and',
                    },
                ],
            },
        ],
    }).then((res: any) => {
        configList.value = res.result.map((item: any) => ({
            label: item.name,
            value: item.id,
        }));
    });
};

const handleCancel = () => {
    emit('change');
    formRef.value.resetFields();
};

const handleOk = () => {
    formRef.value
        .validate()
        .then(async () => {
            btnLoading.value = true;
            const resp: any = await recharge(toRaw(modelRef));
            btnLoading.value = false;
            if (resp.status === 200) {
                if (resp.result === '失败') {
                    message.error('缴费失败');
                } else {
                    window.open(resp.result);
                }
                emit('change');
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};

queryProvidersList();
</script>

<style scoped lang="less">
.modal-info {
    color: rgba(0, 0, 0, 0.55);
    background-color: #f6f6f6;
    padding: 6px 12px;
    margin-bottom: 12px;
}
</style>
