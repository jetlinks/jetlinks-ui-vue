<template lang="">
    <j-modal
        :title="data.id ? '编辑' : '新增'"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <j-form-item
                label="所属通道"
                name="channelId"
                :rules="LeftTreeRules.channelId"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.channelId"
                    :options="channelList"
                    placeholder="请选择所属通道"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                    :disabled="!!id"
                />
            </j-form-item>
            <j-form-item
                label="采集器名称"
                name="name"
                :rules="LeftTreeRules.name"
            >
                <j-input
                    placeholder="请输入采集器名称"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item
                label="从机地址"
                :name="['configuration', 'unitId']"
                v-if="visibleUnitId"
                :rules="LeftTreeRules.unitId"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入从机地址"
                    v-model:value="formData.configuration.unitId"
                    :min="0"
                    :max="255"
                />
            </j-form-item>
            <j-form-item
                :name="['circuitBreaker', 'type']"
                :rules="LeftTreeRules.type"
                label="故障处理"
            >
                <j-card-select
                    :showImage="false"
                    v-model:value="formData.circuitBreaker.type"
                    :options="[
                        { label: '降频', value: 'LowerFrequency' },
                        { label: '断开', value: 'Break' },
                        { label: '忽略', value: 'Ignore' },
                    ]"
                    @change="changeCardSelectType"
                />
            </j-form-item>
            <p style="color: #616161">
                {{ getTypeTooltip(formData.circuitBreaker.type) }}
            </p>
            <j-form-item
                label="双字高低位切换"
                :name="['configuration', 'endian']"
                v-if="visibleEndian"
                :rules="LeftTreeRules.endian"
            >
                <j-card-select
                    :showImage="false"
                    v-model:value="formData.configuration.endian"
                    :options="[
                        { label: 'AB', value: 'BIG' },
                        { label: 'BA', value: 'LITTLE' },
                    ]"
                    @change="changeCardSelectEndian"
                    :column="2"
                />
            </j-form-item>
            <j-form-item
                label="单字高低位切换"
                :name="['configuration', 'endianIn']"
                v-if="visibleEndian"
                :rules="LeftTreeRules.endianIn"
            >
                <j-card-select
                    :showImage="false"
                    v-model:value="formData.configuration.endianIn"
                    :options="[
                        { label: 'AB', value: 'BIG' },
                        { label: 'BA', value: 'LITTLE' },
                    ]"
                    @change="changeCardSelectEndianIn"
                    :column="2"
                />
            </j-form-item>
            <div style="color: #616161" v-if="visibleEndian">
                <p>当前内存布局: {{ endianData }}</p>
                <p>
                    只有4字节数据类型(int32、ieee754 float)
                    具有4种内存布局，其它只有ABCD、DCBA两种内存布局(以双字配置为准)
                </p>
            </div>
            <j-form-item
                label="请求超时时间配置"
                :name="['configuration', 'requsetTimeout']"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入请求超时时间配置"
                    v-model:value="formData.configuration.requsetTimeout"
                    addon-after="ms"
                    :max="9999999999999998"
                    :min="1"
                />
            </j-form-item>

            <j-form-item label="说明" name="description">
                <j-textarea
                    placeholder="请输入说明"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">取消</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:${
                    id ? 'update' : 'add'
                }`"
            >
                确认
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import { save, update } from '@/api/data-collect/collector';
import { Store } from 'jetlinks-store';
import { LeftTreeRules } from '../../data';
import type { FormInstance } from 'ant-design-vue';

const loading = ref(false);
const channelListAll = ref();
const channelList = ref();
const visibleEndian = ref(false);
const visibleUnitId = ref(false);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const id = props.data.id;
const formRef = ref<FormInstance>();


const endianData = computed(() => {
    const { endian, endianIn } = formData.value.configuration;
    if (endian) {
        if (endianIn) {
            if (endian === 'BIG') {
                return endianIn === 'BIG' ? 'ABCD' : 'BADC';
            } else {
                return endianIn === 'BIG' ? 'CDBA' : 'DCBA';
            }
        } else {
            return endian === 'BIG' ? 'ABCD' : 'DCBA';
        }
    }
});

const formData = ref({
    channelId: undefined,
    name: '',
    configuration: {
        unitId: '',
        type: 'LowerFrequency',
        endian: 'BIG',
        endianIn: 'BIG',
        requsetTimeout: 2000,
    },
    circuitBreaker: {
        type: 'LowerFrequency',
    },
    description: '',
});

const handleOk = async () => {
    const data = await formRef.value?.validate();

    const { provider, name } = channelListAll.value.find(
        (item: any) => item.id === formData.value.channelId,
    );
    const params = {
        ...data,
        provider,
        channelName: name,
    };

    loading.value = true;
    const response = !id
        ? await save(params).catch(() => { success: false })
        : await update(id, { ...props.data, ...params }).catch(() => { success: false });
    loading.value = false;
    if (response.success) {
        emit('change', true);
    }
};

const getTypeTooltip = (value: string) =>
    value === 'LowerFrequency'
        ? '连续20次异常，降低连接频率至原有频率的1/10（重试间隔不超过1分钟），故障处理后自动恢复至设定连接频率'
        : value === 'Break'
        ? '连续10分钟异常，停止采集数据进入断开状态，设备重新启用后恢复采集状态'
        : '忽略异常，保持原采集频率超时时间为5s';

const handleCancel = () => {
    emit('change', false);
};

const changeCardSelectType = (value: Array<string>) => {
    formData.value.circuitBreaker.type = value[0];
};
const changeCardSelectEndian = (value: Array<string>) => {
    formData.value.configuration.endian = value[0];
};
const changeCardSelectEndianIn = (value: Array<string>) => {
    formData.value.configuration.endianIn = value[0];
};
const getChannelNoPaging = async () => {
    channelListAll.value = Store.get('channelListAll');
    channelList.value = channelListAll.value.map((item) => ({
        value: item.id,
        label: item.name,
    }));
};
getChannelNoPaging();

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

watch(
    () => formData.value.channelId,
    (value) => {
        const dt = channelListAll.value.find((item) => item.id === value);
        visibleUnitId.value = visibleEndian.value =
            dt?.provider && dt?.provider === 'MODBUS_TCP';
    },
    { deep: true },
);

watch(
    () => props.data,
    (value) => {
        if (value.id) formData.value = value;
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped>
.form {
    .form-radio-button {
        width: 148px;
        height: 80px;
        padding: 0;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .form-upload-button {
        margin-top: 10px;
    }
    .form-submit {
        background-color: @primary-color !important;
    }
}
</style>
