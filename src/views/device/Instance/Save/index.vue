<template>
    <a-modal
        :maskClosable="false"
        width="650px"
        :visible="true"
        :title="!!props.data.id ? '编辑' : '新增'"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <a-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <a-row type="flex">
                    <a-col flex="180px">
                        <a-form-item name="photoUrl">
                            <JUpload v-model="modelRef.photoUrl" />
                        </a-form-item>
                    </a-col>
                    <a-col flex="auto">
                        <a-form-item name="id">
                            <template #label>
                                <span>
                                    ID
                                    <a-tooltip title="若不填写，系统将自动生成唯一ID">
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px;" />
                                    </a-tooltip>
                                </span>
                            </template>
                            <a-input
                                v-model:value="modelRef.id"
                                placeholder="请输入ID"
                                :disabled="!!props.data.id"
                            />
                        </a-form-item>
                        <a-form-item label="名称" name="name">
                            <a-input
                                v-model:value="modelRef.name"
                                placeholder="请输入名称"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item name="productId">
                    <template #label>
                        <span>所属产品
                            <a-tooltip title="只能选择“正常”状态的产品">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px" />
                            </a-tooltip>
                        </span>
                    </template>
                    <a-select
                        showSearch
                        v-model:value="modelRef.productId"
                        placeholder="请选择所属产品"
                    >
                        <a-select-option
                            :value="item.id"
                            v-for="item in productList"
                            :key="item.id"
                            :title="item.name"
                            :disabled="!!props.data.id"
                        ></a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="说明" name="describe">
                    <a-textarea
                        v-model:value="modelRef.describe"
                        placeholder="请输入说明"
                        showCount
                        :maxlength="200"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';
import { isExists, update } from '@/api/device/instance';
import { getImage } from '@/utils/comm';
import { message } from 'ant-design-vue';

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
    id: '',
    name: '',
    describe: '',
    photoUrl: getImage('/device/instance/device-card.png'),
});

const vailId = async (_: Record<string, any>, value: string) => {
    if (!props?.data?.id && value) {
        const resp = await isExists(value);
        if (resp.status === 200 && resp.result) {
            return Promise.reject('ID重复');
        } else {
            return Promise.resolve();
        }
    } else {
        return Promise.resolve();
    }
};

const rules = {
    name: [
        {
            required: true,
            message: '请输入名称',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
    photoUrl: [
        {
            required: true,
            message: '请上传图标',
        },
    ],
    productId: [
        {
            required: true,
            message: '请选择所属产品',
        },
    ],
    id: [
        {
            max: 64,
            message: '最多输入64个字符',
        },
        {
            pattern: /^[a-zA-Z0-9_\-]+$/,
            message: '请输入英文或者数字或者-或者_',
        },
        {
            validator: vailId,
            trigger: 'blur',
        },
    ],
};

watch(
    () => props.data,
    (newValue) => {
        queryNoPagingPost({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    terms: [
                        {
                            termType: 'eq',
                            column: 'state',
                            value: 1,
                        },
                    ],
                },
            ],
        }).then((resp) => {
            if (resp.status === 200) {
                productList.value = resp.result as Record<string, any>[];
            }
        });
        Object.assign(modelRef, newValue);
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('close');
    formRef.value.resetFields();
};

const handleSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            const resp = await update(toRaw(modelRef));
            loading.value = false;
            if (resp.status === 200) {
                message.success('操作成功！');
                emit('save');
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>