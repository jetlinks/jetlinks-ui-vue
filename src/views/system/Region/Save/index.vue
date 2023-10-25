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
                <j-form-item name="productId" label="上级区域">
                    <j-select
                        showSearch
                        v-model:value="modelRef.productId"
                        placeholder="1级区域不需要选择"
                    >
                        <j-select-option
                            :value="item.id"
                            v-for="item in productList"
                            :key="item.id"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item name="type" label="添加方式">
                    <j-radio-group
                        v-model:value="modelRef.type"
                        button-style="solid"
                    >
                        <a-radio-button value="a">内置行政区</a-radio-button>
                        <a-radio-button value="b">自定义数据</a-radio-button>
                    </j-radio-group>
                </j-form-item>
                <j-form-item>
                    <j-select
                        showSearch
                        v-model:value="modelRef.productId"
                        placeholder="1级区域不需要选择"
                    >
                        <j-select-option
                            :value="item.id"
                            v-for="item in productList"
                            :key="item.id"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                    <j-checkbox v-model:checked="modelRef.productId">同步添加下一级区域</j-checkbox>
                </j-form-item>
                <j-form-item
                    label="区域名称"
                    name="name"
                    :rules="[
                        {
                            max: 200,
                            message: '最多输入200个字符',
                        },
                    ]"
                >
                    <j-textarea
                        v-model:value="modelRef.describe"
                        placeholder="请输入说明"
                        showCount
                        :maxlength="200"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { ref, watch, reactive } from 'vue';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Object,
        default: undefined,
    },
});
const productList = ref<Record<string, any>[]>([]);
const loading = ref<boolean>(false);

const formRef = ref();

const modelRef = reactive({
    productId: undefined,
    id: undefined,
    name: '',
    describe: '',
    type: 'a',
});

watch(
    () => props.data,
    (newValue) => {
        Object.assign(modelRef, newValue);
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
</script>