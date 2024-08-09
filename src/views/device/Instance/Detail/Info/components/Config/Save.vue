<template>
    <j-drawer placement="right" :closable="false" :visible="true">
        <template #title>
            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                "
            >
                <span
                    ><AIcon
                        type="CloseOutlined"
                        style="margin-right: 5px"
                        @click="onClose"
                    />{{ $t('Config.Save.735527-0') }}</span
                >
                <j-button type="primary" @click="saveBtn">{{ $t('Config.Save.735527-1') }}</j-button>
            </div>
        </template>
        <j-form layout="vertical" ref="formRef" :model="modelRef">
            <template v-for="(item, index) in props.config || []" :key="index">
                <j-form-item
                    v-for="i in item.properties"
                    :name="i.property"
                    :key="i.property"
                    :required="!!i.type.expands?.required"
                    :rules="
                        !!i.type.expands?.required
                            ? [{ required: true, message: $t('Config.Save.735527-2', [i.name]) }]
                            : []
                    "
                >
                    <template #label>
                        <span style="margin-right: 5px">{{ i.name }}</span>
                        <j-tooltip v-if="i.description" :title="i.description"
                            ><AIcon type="QuestionCircleOutlined"
                        /></j-tooltip>
                    </template>
                    <ValueItem
                        v-model:modelValue="modelRef[i.property]"
                        :itemType="i.type.type"
                        :options="getOptions(i)"
                    />
                </j-form-item>
            </template>
        </j-form>
    </j-drawer>
</template>

<script lang="ts" setup>
import { modify } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const emit = defineEmits(['close', 'save']);

const formRef = ref();
const modelRef = reactive({});

const instanceStore = useInstanceStore();

const props = defineProps({
    config: {
        type: Array,
        default: [],
    },
});

const getOptions = (i: any) => {
    if (i.type.type === 'enum') {
        return (i.type?.elements || []).map((item) => {
            return {
                label: item?.text,
                value: item?.value,
            };
        });
    } else if (i.type.type === 'boolean') {
        return [
            {
                label: i.type?.falseText,
                value: i.type?.falseValue,
            },
            {
                label: i.type?.trueText,
                value: i.type?.trueValue,
            }
        ];
    }
    return undefined;
};
watchEffect(() => {
    const obj = instanceStore.current?.configuration;
    if (obj && Object.keys(obj).length) {
        (props?.config || []).map((item: any) => {
            if (Array.isArray(item.properties) && item?.properties.length) {
                item.properties.map((i: any) => {
                    modelRef[i.property] = obj[i.property];
                });
            }
        });
    }
});

const onClose = () => {
    emit('close');
    formRef.value.resetFields();
};

const saveBtn = () => {
    formRef.value.validate().then(async (res) => {
        if (res) {
            const values = toRaw(modelRef);
            const resp = await modify(instanceStore.current?.id || '', {
                id: instanceStore.current?.id,
                configuration: { ...values },
            });
            if (resp.status === 200) {
                onlyMessage($t('Config.Save.735527-3'));
                emit('save');
            }
        }
    });
};
</script>
