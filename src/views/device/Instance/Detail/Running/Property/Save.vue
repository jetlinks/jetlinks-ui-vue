<template>
    <j-modal
        :maskClosable="false"
        :visible="true"
        title="编辑"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <j-alert
            message="当数据来源为设备时，填写的值将下发到设备"
            type="warning"
            showIcon
        />
        <j-form
            :rules="rules"
            layout="vertical"
            ref="formRef"
            :model="modelRef"
            style="margin-top: 20px"
        >
            <j-form-item
                name="propertyValue"
                :label="data?.name || '自定义属性'"
            >
                <ValueItem
                    v-model:modelValue="modelRef.propertyValue"
                    :itemType="data?.valueType?.type || data?.dataType"
                    :options="options"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { setProperty } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { message } from 'jetlinks-ui-components';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['close']);

const loading = ref<boolean>(false);
const instanceStore = useInstanceStore();

const formRef = ref();

const modelRef = reactive({
    propertyValue: undefined,
});

const handleCancel = () => {
    emit('close');
};

const options = computed(() => {
    const _type = props.data?.valueType?.type || props.data?.dataType;
    if (_type === 'enum') {
        return (props.data?.valueType?.elements || []).map((item: any) => {
            return {
                label: item?.text,
                value: item?.value,
            };
        });
    }
    if (_type === 'boolean') {
        return [
            {
                label: props.data?.valueType?.falseText,
                value: props.data?.valueType?.falseValue,
            },
            {
                label: props.data?.valueType?.trueText,
                value: props.data?.valueType?.trueValue,
            }
        ];
    }
    return undefined;
});

const rules = {
    propertyValue: [
        {
            required: true,
            message: '该字段是必填字段',
        },
    ],
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            const resp = await setProperty(instanceStore.current?.id || '', {
                [props.data?.id]: toRaw(modelRef)?.propertyValue,
            }).finally(() => {
                loading.value = false;
            });
            if (resp.status === 200) {
                message.success('操作成功！');
                emit('close');
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>