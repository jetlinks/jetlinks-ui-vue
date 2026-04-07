<template>
    <a-form ref="formRef" layout="vertical" :model="formData">
        <ReadType
            v-if="source !== 'rule'"
            v-model:value="formData.type"
            :disabled="source !== 'device'"
            :options="typeOptions"
            :formRef="formRef"
        />
        <template v-if="source === 'rule'">
            <a-form-item :name="['virtualRule', 'triggerProperties']" :rules="[{
                required: true,
                message: $t('VirtualRule.index.946602-0')
            }]">
                <template #label>
                    {{ $t('VirtualRule.index.946602-1') }}
                    <a-tooltip>
                        <template #title>
                            <div>
                              {{ $t('VirtualRule.index.946602-2') }}；{{ $t('VirtualRule.index.946602-3') }}
                            </div>
                        </template>
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px"
                        />
                    </a-tooltip>
                </template>
                <a-select
                    v-model:value="formData.virtualRule.triggerProperties"
                    mode="multiple"
                    :placeholder="$t('VirtualRule.index.946602-0')"
                    show-search
                    max-tag-count="responsive"
                    :getPopupContainer="(node) => tableWrapperRef || node"
                    :dropdownStyle="{
                          zIndex: 1071
                       }"
                    :virtual="true"
                >
                    <a-select-option
                        :disabled="
                            formData.virtualRule?.triggerProperties?.length &&
                            !formData.virtualRule.triggerProperties?.includes(
                                '*',
                            )
                        "
                        value="*"
                        >{{ $t('VirtualRule.index.946602-4') }}</a-select-option
                    >
                    <a-select-option
                        :disabled="
                            formData.virtualRule?.triggerProperties?.includes(
                                '*',
                            )
                        "
                        v-for="item in options"
                        :key="item?.id"
                        >{{ item?.name }}</a-select-option
                    >
                </a-select>
            </a-form-item>
            <a-form-item
                :name="['virtualRule', 'script']"
                :label="$t('VirtualRule.index.946602-5')"
                required
            >
                <Rule
                    v-model:value="formData.virtualRule.script"
                    :virtualRule="_virtualRule.virtualRule"
                    :propertiesOptions="options"
                    :id="value.id"
                    :aggList="aggList"
                />
            </a-form-item>
            <a-form-item
                :label="$t('VirtualRule.index.946602-6')"
                :name="['virtualRule', 'windowType']"
                :rules="[{
                    required: true,
                    message: $t('VirtualRule.index.946602-7')
                }]"
            >
                <a-select
                    show-search
                    :placeholder="$t('VirtualRule.index.946602-7')"
                    v-model:value="formData.virtualRule.windowType"
                    :options="[
                        { label: $t('VirtualRule.index.946602-8'), value: 'undefined' },
                        { label: $t('VirtualRule.index.946602-9'), value: 'time' },
                        { label: $t('VirtualRule.index.946602-10'), value: 'num' },
                    ]"
                    :getPopupContainer="(node) => tableWrapperRef || node"
                    :dropdownStyle="{
                        zIndex: 1071
                     }"
                    @select="windowTypeChange"
                />
            </a-form-item>
            <template
                v-if="formData.virtualRule?.windowType !== 'undefined'"
            >
                <a-form-item
                    :label="$t('VirtualRule.index.946602-11')"
                    :name="['virtualRule', 'aggType']"
                    :rules="[{
                        required: true,
                        message: $t('VirtualRule.index.946602-12')
                    }]"
                >
                    <a-select
                        :placeholder="$t('VirtualRule.index.946602-12')"
                        v-model:value="formData.virtualRule.aggType"
                        :options="aggList"
                        :getPopupContainer="(node) => tableWrapperRef || node"
                        :dropdownStyle="{
                          zIndex: 1071
                       }"
                    />
                </a-form-item>
                <a-form-item
                    :label="
                        formData.virtualRule?.windowType === 'time'
                            ? $t('VirtualRule.index.946602-13') + '(s)'
                            : `${$t('VirtualRule.index.946602-13')}(${$t('VirtualRule.index.946602-14')})`
                    "
                    :name="['virtualRule', 'window', 'span']"
                    required
                    :rules="[
                        {
                            required: true,
                            message: $t('VirtualRule.index.946602-15'),
                        },
                        {
                            pattern: /^\d+$/,
                            message: $t('VirtualRule.index.946602-16'),
                        },
                    ]"
                >
                    <a-input-number
                        v-model:value="formData.virtualRule.window.span"
                        :max="999999"
                        :min="1"
                        :placeholder="$t('VirtualRule.index.946602-15')"
                        style="width: 100%"
                    />
                </a-form-item>
                <a-form-item
                    :label="
                        formData.virtualRule?.windowType === 'time'
                            ? $t('VirtualRule.index.946602-17') + '(s)'
                            : $t('VirtualRule.index.946602-17') + `(${$t('VirtualRule.index.946602-14')})`
                    "
                    :name="['virtualRule', 'window', 'every']"
                    required
                    :rules="[
                        {
                            required: true,
                            message: $t('VirtualRule.index.946602-18'),
                        },
                        {
                            pattern: /^\d+$/,
                            message: $t('VirtualRule.index.946602-16'),
                        },
                    ]"
                >
                    <a-input-number
                        style="width: 100%"
                        v-model:value="formData.virtualRule.window.every"
                        :placeholder="$t('VirtualRule.index.946602-18')"
                        :max="999999"
                        :min="1"
                    />
                </a-form-item>
            </template>
        </template>
    </a-form>
</template>

<script setup lang="ts" name="VirtualRule">
import Rule from './Rule.vue';
import {PropType, Ref} from 'vue';
import { queryProductVirtualProperty, getStreamingAggType } from '../../../../../../../api/product';
import { queryDeviceVirtualProperty } from '../../../../../../../api/instance';
import { useInstanceStore } from '../../../../../../../store/instance';
import { useProductStore } from '../../../../../../../store/product';
import { ReadType } from '../../../../../../../components/Metadata/components';
import {useTableWrapper} from "../../../../../../../components/Metadata/context";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

type SourceType = 'device' | 'manual' | 'rule';

const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    dataSource: {
        type: Array,
        default: () => [],
    },
    source: {
        type: String as PropType<SourceType>,
        default: 'device',
    },
    record: {
      type: Object,
      default: () => ({})
    }
});

const initData = {
    triggerProperties: ['*'],
    type: undefined,
    script: '',
    isVirtualRule: false,
    windowType: 'undefined',
    aggType: undefined,
    window: {
      span: undefined,
      every: undefined,
    },
};

const instanceStore = useInstanceStore();
const productStore = useProductStore();
const tableWrapperRef = useTableWrapper()

const aggList = ref<any[]>([]);

const formRef = ref<any>(undefined);

const target = inject<'device' | 'product'>('_metadataType', 'product');

const formData = reactive<{
    type: string[];
    virtualRule?: {
        triggerProperties: string[];
        type: 'script' | 'window' | undefined;
        script: string | undefined;
        isVirtualRule: boolean;
        windowType: string;
        aggType: string | undefined;
        window: {
          span: number | undefined;
          every: number | undefined;
        };
    };
}>({
    type: props.value?.expands.type || [],
    virtualRule: undefined,
});

const dataSource = inject<Ref<any[]>>('metadataSource')

const windowTypeChange = () => {
  formData.virtualRule!.window = {
    span: undefined,
    every: undefined
  }
}

const typeOptions = computed(() => {
    if (props.source === 'manual') {
        return [{ value: 'write', label: $t('VirtualRule.index.946602-19') }];
    } else if (props.source === 'rule') {
        return [{ value: 'report', label: $t('VirtualRule.index.946602-20') }];
    } else {
        return [
            { value: 'read', label: $t('VirtualRule.index.946602-21') },
            { value: 'write', label: $t('VirtualRule.index.946602-19') },
            { value: 'report', label: $t('VirtualRule.index.946602-20') },
        ];
    }
});

const options = computed(() => {
    return (dataSource?.value || []).filter((item: any) => (item?.id !== props.value?.id) && item.id);
});

const setInitVirtualRule = () => {
  formData.virtualRule = {
    ...initData,
    ...(props.value?.expands?.virtualRule || {}),
    triggerProperties: props.value?.expands?.virtualRule?.triggerProperties?.length ? props.value?.expands?.virtualRule?.triggerProperties : ['*']
  }
}

const handleSearch = async () => {
    let resp: any = undefined;
    try {
      if (target === 'product') {
        resp = await queryProductVirtualProperty(
            productStore.current?.id,
            props.value?.id,
        );
      } else {
        resp = await queryDeviceVirtualProperty(
            instanceStore.current?.productId,
            instanceStore.current?.id,
            props.value?.id,
        );
      }
      if (resp && resp.status === 200 && resp.result) {
        const _triggerProperties = props.value?.expands?.virtualRule?.triggerProperties?.length ? props.value?.expands?.virtualRule?.triggerProperties : resp.result.triggerProperties
        formData.virtualRule = {
          triggerProperties: _triggerProperties?.length ? _triggerProperties : ['*'],
          ...resp.result.rule,
        }
      } else {
        setInitVirtualRule()
      }
    } catch (err) {
      setInitVirtualRule()
    }
};

const queryAggType = () => {
    getStreamingAggType().then((resp) => {
        if (resp.status === 200) {
            aggList.value = resp.result.map((item) => {
                return {
                    label: item?.text,
                    value: item?.value,
                };
            });
        }
    });
};

onMounted(() => {
    queryAggType();
});

watch(
    () => JSON.stringify(props.value),
    () => {
        formData.type = props.value?.expands.type
    },
    { immediate: true, },
);

watch(
    () => props.source,
    (newVal) => {
        if (newVal === 'rule') {
            formData.virtualRule = initData;

            handleSearch();
            setInitVirtualRule()
        } else {
            formData.virtualRule = undefined;
        }
    },
    {
        immediate: true,
    },
);

const _virtualRule = computed(() => {
    const flag = formData?.virtualRule?.windowType !== 'undefined';
    return {
        type: formData?.type,
        virtualRule: {
            ...formData?.virtualRule,
            type: flag ? 'window' : 'script',
            isVirtualRule: flag,
            triggerProperties: formData?.virtualRule?.triggerProperties.includes('*')
                ? []
                : formData?.virtualRule?.triggerProperties,
        },
    };
});

const onSave = () => {
    return new Promise(async (resolve, reject) => {
        const data = await formRef.value!.validate().catch(() => {
            reject();
        });
        if (data) {
            if (data.virtualRule) {
                resolve(_virtualRule.value);
            } else {
                resolve({
                    type: data.type,
                })
            }
        }
    });
};

defineExpose({ onSave });
</script>

<style scoped>
</style>
