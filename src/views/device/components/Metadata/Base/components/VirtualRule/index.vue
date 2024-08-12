<template>
    <j-form ref="formRef" layout="vertical" :model="formData">
        <ReadType
            v-if="source !== 'rule'"
            v-model:value="formData.type"
            :disabled="source !== 'device'"
            :options="typeOptions"
        />
        <template v-if="source === 'rule'">
            <j-form-item :name="['virtualRule', 'triggerProperties']" :rules="[{
                required: true,
                message: $t('VirtualRule.index.6916230-0')
            }]">
                <template #label>
                    {{ $t('VirtualRule.index.6916230-1') }}
                    <j-tooltip>
                        <template #title>
                            <div>{{ $t('VirtualRule.index.6916230-2') }}</div>
                            <div>{{ $t('VirtualRule.index.6916230-3') }}</div>
                        </template>
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px"
                        />
                    </j-tooltip>
                </template>
                <j-select
                    v-model:value="formData.virtualRule.triggerProperties"
                    mode="multiple"
                    :placeholder="$t('VirtualRule.index.6916230-0')"
                    show-search
                    max-tag-count="responsive"
                    :getPopupContainer="(node) => tableWrapperRef || node"
                    :dropdownStyle="{
                          zIndex: 1071
                       }"
                    :virtual="true"
                >
                    <j-select-option
                        :disabled="
                            formData.virtualRule?.triggerProperties?.length &&
                            !formData.virtualRule.triggerProperties?.includes(
                                '*',
                            )
                        "
                        value="*"
                        >{{ $t('VirtualRule.index.6916230-4') }}</j-select-option
                    >
                    <j-select-option
                        :disabled="
                            formData.virtualRule?.triggerProperties?.includes(
                                '*',
                            )
                        "
                        v-for="item in options"
                        :key="item?.id"
                        >{{ item?.name }}</j-select-option
                    >
                </j-select>
            </j-form-item>
            <j-form-item
                :name="['virtualRule', 'script']"
                :label="$t('VirtualRule.index.6916230-5')"
                required
            >
                <Rule
                    v-model:value="formData.virtualRule.script"
                    :virtualRule="_virtualRule.virtualRule"
                    :propertiesOptions="options"
                    :id="value.id"
                    :aggList="aggList"
                />
            </j-form-item>
            <j-form-item
                :label="$t('VirtualRule.index.6916230-6')"
                :name="['virtualRule', 'windowType']"
                :rules="[{
                    required: true,
                    message: $t('VirtualRule.index.6916230-7')
                }]"
            >
                <j-select
                    show-search
                    :placeholder="$t('VirtualRule.index.6916230-7')"
                    v-model:value="formData.virtualRule.windowType"
                    :options="[
                        { label: $t('VirtualRule.index.6916230-8'), value: 'undefined' },
                        { label: $t('VirtualRule.index.6916230-9'), value: 'time' },
                        { label: $t('VirtualRule.index.6916230-10'), value: 'num' },
                    ]"
                    :getPopupContainer="(node) => tableWrapperRef || node"
                    :dropdownStyle="{
                        zIndex: 1071
                     }"
                    @select="windowTypeChange"
                />
            </j-form-item>
            <template
                v-if="formData.virtualRule?.windowType !== 'undefined'"
            >
                <j-form-item
                    :label="$t('VirtualRule.index.6916230-11')"
                    :name="['virtualRule', 'aggType']"
                    :rules="[{
                        required: true,
                        message: $t('VirtualRule.index.6916230-12')
                    }]"
                >
                    <j-select
                        :placeholder="$t('VirtualRule.index.6916230-12')"
                        v-model:value="formData.virtualRule.aggType"
                        :options="aggList"
                        :getPopupContainer="(node) => tableWrapperRef || node"
                        :dropdownStyle="{
                          zIndex: 1071
                       }"
                    />
                </j-form-item>
                <j-form-item
                    :label="
                        formData.virtualRule?.windowType === 'time'
                            ?  $t('VirtualRule.index.6916230-13')
                            : $t('VirtualRule.index.6916230-22')
                    "
                    :name="['virtualRule', 'window', 'span']"
                    required
                    :rules="[
                        {
                            required: true,
                            message: $t('VirtualRule.index.6916230-15'),
                        },
                        {
                            pattern: /^\d+$/,
                            message: $t('VirtualRule.index.6916230-16'),
                        },
                    ]"
                >
                    <j-input-number
                        v-model:value="formData.virtualRule.window.span"
                        :max="999999"
                        :min="1"
                        :placeholder="$t('VirtualRule.index.6916230-15')"
                        style="width: 100%"
                    />
                </j-form-item>
                <j-form-item
                    :label="
                        formData.virtualRule?.windowType === 'time'
                            ? $t('VirtualRule.index.6916230-17')
                            : $t('VirtualRule.index.6916230-23')
                    "
                    :name="['virtualRule', 'window', 'every']"
                    required
                    :rules="[
                        {
                            required: true,
                            message: $t('VirtualRule.index.6916230-18'),
                        },
                        {
                            pattern: /^\d+$/,
                            message: $t('VirtualRule.index.6916230-16'),
                        },
                    ]"
                >
                    <j-input-number
                        style="width: 100%"
                        v-model:value="formData.virtualRule.window.every"
                        :placeholder="$t('VirtualRule.index.6916230-18')"
                        :max="999999"
                        :min="1"
                    />
                </j-form-item>
            </template>
        </template>
    </j-form>
</template>

<script setup lang="ts" name="VirtualRule">
import Rule from './Rule.vue';
import { queryDeviceVirtualProperty } from '@/api/device/instance';
import {
    queryProductVirtualProperty,
    getStreamingAggType,
} from '@/api/device/product';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import {PropType, Ref} from 'vue';
import { ReadType } from '@/components/Metadata/components';
import {useTableWrapper} from "@/components/Metadata/Table/context";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


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
        return [{ value: 'write', label: $t('VirtualRule.index.6916230-19') }];
    } else if (props.source === 'rule') {
        return [{ value: 'report', label: $t('VirtualRule.index.6916230-20') }];
    } else {
        return [
            { value: 'read', label: $t('VirtualRule.index.6916230-21') },
            { value: 'write', label: $t('VirtualRule.index.6916230-19') },
            { value: 'report', label: $t('VirtualRule.index.6916230-20') },
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
