<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        :visible="true"
        :title="!!data?.id ? '编辑区域' : '新增区域'"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
                <j-form-item name="parentId" label="上级区域">
                    <j-tree-select
                        showSearch
                        v-model:value="modelRef.parentId"
                        placeholder="1级区域不需要选择"
                        :tree-data="areaList"
                        allowClear
                        :field-names="{
                            children: 'children',
                            label: 'name',
                            value: 'id',
                        }"
                        tree-node-filter-prop="name"
                    />
                </j-form-item>
                <j-form-item name="type" label="添加方式">
                    <j-radio-group
                        v-model:value="modelRef.type"
                        button-style="solid"
                        @change="onChange"
                    >
                        <a-radio-button value="builtIn"
                            >内置行政区</a-radio-button
                        >
                        <a-radio-button value="Custom"
                            >自定义数据</a-radio-button
                        >
                    </j-radio-group>
                </j-form-item>
                <j-form-item v-if="modelRef.type === 'builtIn'">
                    <BuildIn v-model:value="modelRef.features" />
                </j-form-item>
                <j-form-item
                    label="区域名称"
                    name="name"
                    required
                    :rules="[
                        {
                            required: true,
                            message: '请输入区域名称',
                        },
                        {
                            max: 64,
                            message: '最多输入64个字符',
                        },
                        {
                            validator: vailName,
                            trigger: 'blur',
                        },
                    ]"
                >
                    <j-input
                        v-model:value="modelRef.name"
                        placeholder="请输入区域名称"
                    />
                </j-form-item>
                <j-form-item
                    label="行政区划代码"
                    name="code"
                    required
                    :rules="[
                        {
                            required: true,
                            message: '请输入行政区划代码',
                        },
                        {
                            validator: vailCode,
                            trigger: 'blur',
                        },
                    ]"
                >
                    <j-input-number
                        v-model:value="modelRef.code"
                        style="width: 100%"
                        placeholder="请输入行政区划代码"
                    />
                </j-form-item>
                <j-form-item
                    v-if="modelRef.type !== 'builtIn'"
                    label="区划划分"
                    required
                    name="features"
                >
                    <TracePoint v-model:value="modelRef.features" />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, PropType, onMounted } from 'vue';
import TracePoint from './TracePoint.vue';
import BuildIn from './BuildIn.vue';
import {
    validateName,
    getRegionTree,
    validateCode,
} from '@/api/system/region';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    mode: {
        type: String as PropType<'add' | 'edit'>,
        default: 'add',
    },
});
const areaList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);

const formRef = ref();

const modelRef = reactive({
    parentId: undefined,
    id: undefined,
    name: undefined,
    code: undefined,
    type: 'builtIn',
    features: undefined,
});

watch(
    () => props.data,
    () => {
        console.log(props.data);
        Object.assign(modelRef, props.data);
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('close');
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async (_data: any) => {
            loading.value = true;
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};

const vailName = async (_: Record<string, any>, value: string) => {
    if (!props?.data?.id && value) {
        const resp = await validateName(value, props.data.id);
        if (resp.status === 200 && resp.result) {
            return Promise.reject('区域名称重复');
        } else {
            return Promise.resolve();
        }
    } else {
        return Promise.resolve();
    }
};

const vailCode = async (_: Record<string, any>, value: string) => {
    if (!props?.data?.id && value) {
        const resp = await validateCode(value, props.data.id);
        if (resp.status === 200 && resp.result) {
            return Promise.reject('行政区域代码重复');
        } else {
            return Promise.resolve();
        }
    } else {
        return Promise.resolve();
    }
};

const onChange = () => {
    // console.log(e.target.value)
    modelRef.features = undefined
}

const handleSearch = async () => {
    const resp = await getRegionTree();
    if (resp.success) {
        areaList.value = resp?.result || [];
    }
};

onMounted(() => {
    handleSearch();
});
</script>