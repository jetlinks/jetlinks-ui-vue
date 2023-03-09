<template>
    <div>
        <a-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-row>
                <j-col :span="11">
                    <j-form-item
                        :name="['message', 'properties']"
                        label="读取属性"
                        :rules="[{ required: true, message: '请选择读取属性' }]"
                    >
                        <j-select
                            showSearch
                            placeholder="请选择属性"
                            v-model:value="modelRef.properties"
                        >
                            <j-select-option
                                v-for="item in metadata?.properties || []"
                                :value="item?.id"
                                :key="item?.id"
                                >{{ item?.name }}</j-select-option
                            >
                        </j-select>
                    </j-form-item>
                </j-col>
                <j-col :span="2"></j-col>
                <j-col :span="11">
                    <j-form-item
                        :name="['message', 'propertiesValue']"
                        label="属性值"
                        :rules="[{ required: true, message: '请选择' }]"
                    >
                        <ParamsDropdown
                            icon="icon-canshu"
                            placeholder="请选择"
                            :options="[]"
                            :tabsOptions="tabOptions"
                            :metricOption="upperOptions(getType)"
                            v-model:value="modelRef.propertiesValue"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </a-form>
    </div>
</template>

<script lang="ts" setup>
const props = defineProps({
    value: {
        type: Object,
        default: () => {},
    },
    metadata: {
        type: Object,
        default: () => {
            return {
                properties: [],
            };
        },
    },
    builtInList: {
        type: Array,
        default: () => []
    },
});

const formRef = ref();

const modelRef = reactive({
    properties: '',
    propertiesValue: '',
    source: '',
});

const tabOptions = [
    {
        label: '手动输入',
        component: 'string',
        key: 'fixed',
    },
    {
        label: '内置参数',
        component: 'tree',
        key: 'upper',
    },
];
const getType = computed(() => {
    return props.metadata.properties.find((item: any) => item.id === modelRef.properties)?.valueType?.type
})

const filterParamsData = (type?: string, data?: any[]): any[] => {
    if (type && data) {
        return data.filter((item) => {
            if (item.children) {
                const _children = filterParamsData(type, item.children);
                item.children = _children;
                return _children.length ? true : false;
            } else if (item.type === type) {
                //   optionMap.current.set(item.id, item);
                return true;
            }
            return false;
        });
    }
    return data || [];
};

const upperOptions = (type: string) => {
    return filterParamsData(type, props?.builtInList) || []
}

watch(
    () => props.value,
    (newVal) => {
        const _keys = Object.keys(newVal)?.[0];
        if (_keys) {
            (modelRef.properties = _keys),
                (modelRef.propertiesValue = newVal[_keys]?.value);
            modelRef.source = newVal[_keys]?.source;
        }
    },
    { deep: true, immediate: true },
);

const onFormSave = () => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(async (_data: any) => {
                // 处理回传数据
                resolve(_data);
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

defineExpose({ onFormSave });
</script>