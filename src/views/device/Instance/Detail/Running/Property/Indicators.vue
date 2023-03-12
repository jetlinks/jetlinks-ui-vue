<template>
    <j-modal
        :maskClosable="false"
        :visible="true"
        title="编辑指标"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <j-alert
            message="场景联动页面可引用指标配置触发条件"
            type="warning"
            showIcon
        />
        <j-form
            layout="vertical"
            ref="formRef"
            :model="modelRef"
            style="margin-top: 20px"
        >
            <template v-for="(item, index) in modelRef.metrics" :key="index">
                <j-row type="flex" justify="space-between" :align="'bottom'">
                    <j-col :span="item.range ? 11 : 24">
                        <j-form-item
                            :rules="{
                                required: true,
                                message: `请${
                                    ['date', 'boolean'].includes(
                                        data?.valueType?.type,
                                    )
                                        ? '选择'
                                        : '输入'
                                }指标值`,
                            }"
                            :name="['metrics', index, 'value', 0]"
                            :label="item?.name || '指标值'"
                        >
                            <ValueItem
                                v-model:modelValue="item.value[0]"
                                :itemType="data.valueType?.type"
                                :options="
                                    data.valueType?.type === 'boolean'
                                        ? [
                                              {
                                                  label: data.valueType
                                                      ?.trueText,
                                                  value: String(
                                                      data.valueType?.trueValue,
                                                  ),
                                              },
                                              {
                                                  label: data.valueType
                                                      ?.falseText,
                                                  value: String(
                                                      data.valueType
                                                          ?.falseValue,
                                                  ),
                                              },
                                          ]
                                        : undefined
                                "
                            />
                        </j-form-item>
                    </j-col>
                    <template v-if="item.range">
                        <j-col><div class="center-icon">~</div></j-col>
                        <j-col :span="11">
                            <j-form-item
                                :name="['metrics', index, 'value', 1]"
                                :rules="{
                                    required: true,
                                    message: `请${
                                        ['date', 'boolean'].includes(
                                            data?.valueType?.type,
                                        )
                                            ? '选择'
                                            : '输入'
                                    }指标值`,
                                }"
                            >
                                <ValueItem
                                    v-model:modelValue="item.value[1]"
                                    :itemType="data.valueType?.type"
                                />
                            </j-form-item>
                        </j-col>
                    </template>
                </j-row>
            </template>
        </j-form>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryMetric, saveMetric } from '@/api/device/instance';
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

const modelRef = reactive<{
    metrics: any[]
}>({
    metrics: [],
});

const handleCancel = () => {
    emit('close');
};

watch(
    () => props.data.id,
    (newVal) => {
        if (newVal && instanceStore.current.id) {
            queryMetric(instanceStore.current.id, props.data.id).then(
                (resp) => {
                    if (resp.status === 200) {
                        if (
                            Array.isArray(resp?.result) &&
                            resp?.result.length
                        ) {
                            const list = resp?.result.map((item: any) => {
                                const val = Array.isArray(item?.value)
                                    ? [item?.value]
                                    : item?.value?.split(',');
                                return {
                                    ...item,
                                    value: val,
                                };
                            });
                            modelRef.metrics = list as any;
                        } else {
                            const type = props.data.valueType?.type;
                            if (type === 'boolean') {
                                const list = props.data.expands?.metrics.map(
                                    (item: any) => {
                                        const value =
                                            (item?.value || {}).map((i: any) =>
                                                String(i),
                                            ) || {};
                                        return {
                                            ...item,
                                            value,
                                        };
                                    },
                                );
                                modelRef.metrics = list || [];
                            } else {
                                modelRef.metrics =
                                    props.data.expands?.metrics || [];
                            }
                        }
                    }
                },
            );
        }
    },
    { immediate: true, deep: true },
);

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            const list = (toRaw(modelRef)?.metrics || []).map((item: any) => {
                return {
                    ...item,
                    value: item.value.join(','),
                };
            });
            const resp = await saveMetric(
                instanceStore.current.id || '',
                props.data.id || '',
                list,
            ).finally(() => {
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

<style lang="less" scoped>
.center-icon {
    height: 86px;
    display: flex;
    align-items: center;
}
</style>