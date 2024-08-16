<template>
    <j-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        :title="$t('Recharge.Save.797370-0')"
        :okText="$t('Recharge.Save.797370-1')"
        :cancelText="$t('Recharge.Save.797370-2')"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <div>
            <div class="modal-info">
                <AIcon
                    type="ExclamationCircleOutlined"
                    style="margin-right: 6px"
                />{{ $t('Recharge.Save.797370-3') }}
            </div>
            <j-form
                layout="vertical"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item :label="$t('Recharge.Save.797370-4')" name="configId">
                    <j-select
                        v-model:value="modelRef.configId"
                        :options="configList"
                        allowClear
                        show-search
                        style="width: 100%"
                        :placeholder="$t('Recharge.Save.797370-5')"
                    >
                    </j-select>
                </j-form-item>
                <j-form-item :label="$t('Recharge.Save.797370-6')" name="rechargeId">
                    <j-input
                        v-model:value="modelRef.rechargeId"
                        :placeholder="$t('Recharge.Save.797370-7')"
                    />
                </j-form-item>
                <j-form-item :label="$t('Recharge.Save.797370-8')" name="chargeMoney">
                    <j-input-number
                        allowClear
                        :precision="2"
                        style="width: 100%"
                        v-model:value="modelRef.chargeMoney"
                        :min="1"
                        :max="500"
                        :placeholder="$t('Recharge.Save.797370-9')"
                    />
                </j-form-item>

                <j-form-item :label="$t('Recharge.Save.797370-10')" name="paymentType">
                    <j-select
                        allowClear
                        :options="PaymentMethod"
                        v-model:value="modelRef.paymentType"
                        :placeholder="$t('Recharge.Save.797370-11')"
                    >
                    </j-select>
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryPlatformNoPage, recharge } from '@/api/iot-card/cardManagement';
import { PaymentMethod } from '@/views/iot-card/data';
import { onlyMessage } from '@/utils/comm'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emit = defineEmits(['change', 'save']);

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
            message: $t('Recharge.Save.797370-5'),
        },
        {
            max: 64,
            message: $t('Recharge.Save.797370-12'),
        },
    ],
    rechargeId: [
        {
            required: true,
            message: $t('Recharge.Save.797370-7'),
        },
        {
            max: 64,
            message: $t('Recharge.Save.797370-12'),
        },
    ],
    chargeMoney: [
        {
            required: true,
            message: $t('Recharge.Save.797370-13'),
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
            message: $t('Recharge.Save.797370-11'),
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
                if (resp.result === $t('Recharge.Save.344053-0')) {
                    onlyMessage($t('Recharge.Save.797370-15'), 'error')
                } else if(!resp.result) {
                  onlyMessage($t('Recharge.Save.797370-16'), 'warning')
                } else {
                    window.open(resp.result);
                }
                emit('change', true);
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            btnLoading.value=false
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
