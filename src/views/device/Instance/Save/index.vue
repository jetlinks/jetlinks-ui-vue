<template>
    <j-modal
        :maskClosable="false"
        width="650px"
        :visible="true"
        :title="!!data?.id ? '编辑' : '新增'"
        @ok="handleSave"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-row type="flex">
                    <j-col flex="180px">
                        <j-form-item name="photoUrl">
                            <JProUpload v-model="modelRef.photoUrl" />
                        </j-form-item>
                    </j-col>
                    <j-col flex="auto">
                        <j-form-item name="id">
                            <template #label>
                                <span>
                                    ID
                                    <j-tooltip title="若不填写，系统将自动生成唯一ID">
                                        <AIcon
                                            type="QuestionCircleOutlined"
                                            style="margin-left: 2px;" />
                                    </j-tooltip>
                                </span>
                            </template>
                            <j-input
                                v-model:value="modelRef.id"
                                placeholder="请输入ID"
                                :disabled="!!data?.id"
                            />
                        </j-form-item>
                        <j-form-item label="名称" name="name">
                            <j-input
                                v-model:value="modelRef.name"
                                placeholder="请输入名称"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
                <j-form-item name="productId">
                    <template #label>
                        <span>所属产品
                            <j-tooltip title="只能选择“正常”状态的产品">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px" />
                            </j-tooltip>
                        </span>
                    </template>
                    <j-select
                        showSearch
                        v-model:value="modelRef.productId"
                        :disabled="!!data?.id"
                        placeholder="请选择状态为“正常”的产品"
                    >
                        <j-select-option
                            :value="item.id"
                            v-for="item in productList"
                            :key="item.id"
                            :label="item.name"
                        >{{item.name}}</j-select-option>
                    </j-select>
                </j-form-item>
                <j-form-item label="说明" name="describe">
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
    id: undefined,
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
            pattern: /^[j-zA-Z0-9_\-]+$/,
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
        .then(async (_data: any) => {
            loading.value = true;
            const obj = {...toRaw(modelRef), ..._data}
            if(!obj.id){
                delete obj.id
            }
            const resp = await update(obj).finally(() => {
                loading.value = false;
            })
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