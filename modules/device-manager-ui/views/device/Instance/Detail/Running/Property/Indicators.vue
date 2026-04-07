<template>
    <a-modal
        :maskClosable="false"
        :open="true"
        :title="$t('Property.Indicators.505585-0')"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <a-alert
            :message="$t('Property.Indicators.505585-1')"
            type="warning"
            showIcon
        />
        <a-form
            layout="vertical"
            ref="formRef"
            :model="modelRef"
            style="margin-top: 20px"
        >
            <template v-for="(item, index) in modelRef.metrics" :key="index">
                <a-row type="flex" justify="space-between" :align="'bottom'">
                    <a-col :span="item.range ? 11 : 24">
                        <a-form-item
                            :rules="{
                                required: true,
                                message: $t('Property.Indicators.505585-2', [['date', 'boolean'].includes(data?.valueType?.type,) ? $t('Property.Indicators.505585-6'): $t('Property.Indicators.505585-7')]),
                            }"
                            :name="['metrics', index, 'value', 0]"
                        >
                            <template #label>
                                <j-ellipsis>{{ item?.name || $t('Property.Indicators.505585-3') }}</j-ellipsis>
                            </template>
                            <j-value-item
                                v-model:modelValue="item.value[0]"
                                :itemType="data.valueType?.type"
                                style="width: 100%"
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
                        </a-form-item>
                    </a-col>
                    <template v-if="item.range">
                        <a-col><div class="center-icon">~</div></a-col>
                        <a-col :span="11">
                            <a-form-item
                                :name="['metrics', index, 'value', 1]"
                                :rules="{
                                    required: true,
                                    message: $t('Property.Indicators.505585-2', [['date', 'boolean'].includes(data?.valueType?.type,) ? $t('Property.Indicators.505585-6'): $t('Property.Indicators.505585-7')]),
                                }"
                            >
                                <j-value-item
                                    v-model:modelValue="item.value[1]"
                                    :itemType="data.valueType?.type"
                                    style="width: 100%"
                                />
                            </a-form-item>
                        </a-col>
                    </template>
                </a-row>
            </template>
        </a-form>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryMetric, saveMetric } from '../../../../../../api/instance';
import { useInstanceStore } from '../../../../../../store/instance';
import { onlyMessage } from '@jetlinks-web/utils';
import { isNumber } from 'lodash-es';
import { useI18n } from 'vue-i18n';
import dayjs from "dayjs";

const { t: $t } = useI18n();
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
    metrics: any[];
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
                    if (resp.success) {
                        if (
                            Array.isArray(resp?.result) &&
                            resp?.result.length
                        ) {
                            const list = resp?.result.map((item: any) => {
                                const val = Array.isArray(item?.value)
                                    ? item?.value
                                    : (isNumber(item?.value) ? [item.value] : item?.value?.split(','))
                                return {
                                    ...item,
                                    value: val.map((i: any) => {
                                      return props.data.valueType.type === 'date' ? dayjs(i) : i
                                    }),
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
                                modelRef.metrics = (
                                    props.data.expands?.metrics || []
                                ).map((item: any) => {
                                    const val = Array.isArray(item?.value)
                                        ? item?.value
                                        : isNumber(item?.value)
                                        ? [item.value]
                                        : item?.value?.split(',');
                                    return {
                                        ...item,
                                      value: val.map((i: any) => {
                                        return props.data.valueType.type === 'date' ? dayjs(i) : i
                                      }),
                                    };
                                });
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
        .then(async (_data: any) => {
            loading.value = true;
            const list = (toRaw(modelRef)?.metrics || []).map((item: any) => {
              let value = item.value
              if(props.data.valueType?.type === 'date'){
                value = item.value.map((i: any) => {
                  return dayjs(i).format('YYYY-MM-DD HH:mm:ss')
                })
              }
                return {
                    ...item,
                    value: value.join(','),
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
                onlyMessage($t('Property.Indicators.505585-5'));
                emit('close');
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
