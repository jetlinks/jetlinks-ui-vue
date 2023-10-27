<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        :visible="true"
        :title="mode === 'edit' ? '编辑区域' : '新增区域'"
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
                <j-form-item :name="['properties', 'type']" label="添加方式">
                    <j-radio-group
                        v-model:value="modelRef.properties.type"
                        button-style="solid"
                        @change="onChange"
                    >
                        <j-radio-button value="builtin"
                            >内置行政区</j-radio-button
                        >
                        <j-radio-button value="Custom"
                            >自定义数据</j-radio-button
                        >
                    </j-radio-group>
                </j-form-item>
                <j-form-item v-if="modelRef.properties.type === 'builtin'">
                    <BuildIn
                        v-model:value="modelRef.code"
                        v-model:children="modelRef.children"
                        v-model:name="modelRef.name"
                    />
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
                    v-if="modelRef.properties.type !== 'builtin'"
                    label="区划划分"
                    required
                    name="features"
                >
                    <TracePoint @close="emit('close')" v-model:value="modelRef.features" />
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
    updateRegion,
} from '@/api/system/region';
import { onlyMessage } from '@/utils/comm';

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

const init = {
    parentId: undefined,
    id: undefined,
    name: undefined,
    code: undefined,
    features: undefined,
    children: [],
    properties: {
        type: 'builtin',
    },
};

const modelRef = reactive(init);

watch(
    () => props.data,
    () => {
        Object.assign(modelRef, {});
        if (props.mode === 'add' && props.data?.id) {
            // 添加子
            Object.assign(modelRef, {
                ...init,
                parentId: props.data.id,
            });
        } else if (props.mode === 'edit') {
            // 编辑
            Object.assign(modelRef, props.data);
        } else {
            Object.assign(modelRef, init);
        }
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
            const resp = await updateRegion({
                ...props.data,
                ...modelRef,
            }).finally(() => {
                loading.value = false;
            });
            if (resp.status === 200) {
                onlyMessage('操作成功！');
                emit('save');
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};

const vailName = async (_: Record<string, any>, value: string) => {
    if (!props?.data?.id && value) {
        const resp = await validateName(value, props.data.id);
        if (resp.status === 200 && !resp.result?.passed) {
            return Promise.reject(resp.result?.reason || '区域名称重复');
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
        if (resp.status === 200 && !resp.result?.passed) {
            return Promise.reject(resp.result?.reason || '行政区域代码重复');
        } else {
            return Promise.resolve();
        }
    } else {
        return Promise.resolve();
    }
};

const onChange = () => {
    modelRef.features = undefined;
};

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