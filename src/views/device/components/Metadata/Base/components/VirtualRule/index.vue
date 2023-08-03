<template>
    <j-form ref="formRef" layout="vertical" :model="formData">
        <ReadType
            v-model:value="formData.type"
            :disabled="source !== 'device'"
            :options="typeOptions"
        />
        <template v-if="source === 'rule'">
            <j-form-item :name="['virtualRule', 'triggerProperties']" :rules="[{
                required: true,
                message: '请选择触发属性'
            }]">
                <template #label>
                    触发属性
                    <j-tooltip>
                        <template #title>
                            <div>选择当前产品物模型下的属性作为触发属性</div>
                            <div>任意属性值更新时将触发下方计算规则</div>
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
                    placeholder="请选择触发属性"
                    show-search
                    max-tag-count="responsive"
                >
                    <j-select-option
                        :disabled="
                            formData.virtualRule?.triggerProperties?.length &&
                            !formData.virtualRule?.triggerProperties?.includes(
                                '*',
                            )
                        "
                        value="*"
                        >任意属性</j-select-option
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
                label="计算规则"
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
                label="窗口"
                :name="['virtualRule', 'windowType']"
                :rules="[{
                    required: true,
                    message: '请选择窗口类型'
                }]"
            >
                <j-select
                    v-model:value="formData.virtualRule.windowType"
                    :options="[
                        { label: '无', value: 'undefined' },
                        { label: '时间窗口', value: 'time' },
                        { label: '频次窗口', value: 'num' },
                    ]"
                    show-search
                    placeholder="请选择窗口类型"
                    @select="windowTypeChange"
                />
            </j-form-item>
            <template
                v-if="formData.virtualRule?.windowType !== 'undefined'"
            >
                <j-form-item
                    label="聚合函数"
                    :name="['virtualRule', 'aggType']"
                    :rules="[{
                        required: true,
                        message: '请选择聚合函数'
                    }]"
                >
                    <j-select
                        v-model:value="formData.virtualRule.aggType"
                        :options="aggList"
                        placeholder="请选择聚合函数"
                    />
                </j-form-item>
                <j-form-item
                    :label="
                        formData.virtualRule?.windowType === 'time'
                            ? '窗口长度(s)'
                            : '窗口长度(次)'
                    "
                    :name="['virtualRule', 'window', 'span']"
                    required
                    :rules="[
                        {
                            required: true,
                            message: '请输入窗口长度',
                        },
                        {
                            pattern: /^\d+$/,
                            message: '请输入1-999999之间的正整数',
                        },
                    ]"
                >
                    <j-input-number
                        v-model:value="formData.virtualRule.window.span"
                        :max="999999"
                        :min="1"
                        placeholder="请输入窗口长度"
                        style="width: 100%"
                    />
                </j-form-item>
                <j-form-item
                    :label="
                        formData.virtualRule?.windowType === 'time'
                            ? '步长(s)'
                            : '步长(次)'
                    "
                    :name="['virtualRule', 'window', 'every']"
                    required
                    :rules="[
                        {
                            required: true,
                            message: '请输入步长',
                        },
                        {
                            pattern: /^\d+$/,
                            message: '请输入1-999999之间的正整数',
                        },
                    ]"
                >
                    <j-input-number
                        style="width: 100%"
                        v-model:value="formData.virtualRule.window.every"
                        placeholder="请输入步长"
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
    type: [],
    virtualRule: undefined,
});

const dataSource = inject<Ref<any[]>>('_dataSource')

const windowTypeChange = () => {
  formData.virtualRule!.window = {
    span: undefined,
    every: undefined
  }
}

const typeOptions = computed(() => {
    if (props.source === 'manual') {
        return [{ value: 'write', label: '写' }];
    } else if (props.source === 'rule') {
        return [{ value: 'report', label: '上报' }];
    } else {
        return [
            { value: 'read', label: '读' },
            { value: 'write', label: '写' },
            { value: 'report', label: '上报' },
        ];
    }
});

const options = computed(() => {
    return (dataSource?.value || []).filter((item: any) => item?.id !== props.value?.id);
});

const setInitVirtualRule = () => {
  console.log(props.value?.expands?.virtualRule);
  formData.virtualRule = {
    ...initData,
    ...(props.value?.expands?.virtualRule || {}),
    triggerProperties: props.value?.expands?.virtualRule?.triggerProperties || ['*'],
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
        formData.virtualRule = {
          triggerProperties: resp.result.triggerProperties,
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
    () => props.value,
    () => {
        formData.type = props.value.expands?.type;
    },
    { immediate: true, deep: true },
);

watch(
    () => props.source,
    (newVal: SourceType) => {
        if (newVal === 'rule') {
            formData.virtualRule = initData;

            handleSearch();
        } else {
            formData.virtualRule = undefined;
        }
    },
    {
        immediate: true,
        deep: true
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