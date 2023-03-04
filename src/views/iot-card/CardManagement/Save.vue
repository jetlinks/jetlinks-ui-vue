<template>
    <j-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        :title="type === 'add' ? '新增' : '编辑'"
        okText="确定"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <div style="margin-top: 10px">
            <j-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item label="卡号" name="id">
                    <j-input
                        v-model:value="modelRef.id"
                        placeholder="请输入卡号"
                        :disabled="type === 'edit'"
                    ></j-input>
                </j-form-item>
                <j-form-item name="iccId">
                    <template #label>
                        <span>
                            ICCID
                            <j-tooltip title="IC卡的唯一识别号码">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </span>
                    </template>
                    <j-input
                        v-model:value="modelRef.iccId"
                        placeholder="请输入ICCID"
                        :disabled="type === 'edit'"
                    />
                </j-form-item>
                <j-form-item label="平台对接" name="platformConfigId">
                    <j-select
                        showSearch
                        :filter-option="filterOption"
                        :disabled="type === 'edit'"
                        allowClear
                        :options="platformConfigList"
                        v-model:value="modelRef.platformConfigId"
                        placeholder="请选择平台对接"
                    >
                </j-select>
                </j-form-item>

                <j-form-item label="运营商" name="operatorName">
                    <j-select
                        allowClear
                        showSearch
                        :filter-option="filterOption"
                        :options="OperatorList"
                        v-model:value="modelRef.operatorName"
                        placeholder="请选择运营商"
                    >
                    </j-select>
                </j-form-item>
                <j-form-item label="类型" name="cardType">
                    <j-select
                        allowClear
                        showSearch
                        :disabled="type === 'edit'"
                        :filter-option="filterOption"
                        :options="TypeList"
                        v-model:value="modelRef.cardType"
                        placeholder="请选择类型"
                    >
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
import {
    queryPlatformNoPage,
    validateId,
    add,
    edit,
} from '@/api/iot-card/cardManagement';
import { message } from 'jetlinks-ui-components';
import { OperatorList, TypeList } from '@/views/iot-card/data';

const emit = defineEmits(['change']);
const props = defineProps({
    type: {
        type: String,
    },
    data: {
        type: Object,
        default: undefined,
    },
});

const btnLoading = ref<boolean>(false);
const platformConfigList = ref<Record<string, any>[]>([]);

const formRef = ref();

const modelRef = reactive({
    id: '',
    iccId: '',
    platformConfigId: undefined,
    operatorName: undefined,
    cardType: undefined,
    describe: '',
});

const isValidateId = async (id: string) => {
    const res: any = await validateId(id);
    if (res.status === 200) {
        if (res.result?.passed) {
            return '';
        } else {
            return res.result.reason;
        }
    } else {
        return '请输入输入正确的ICCID';
    }
};

const vailIccId = async (_: Record<string, any>, value: string) => {
    if (value) {
        const validateId =
            props.type === 'add' ? await isValidateId(value) : '';
        if (validateId === '') {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error(`${validateId}`));
        }
        // } else {
        //     return Promise.reject(new Error('请输入卡号'));
    }
};

const rules = {
    id: [
        {
            required: true,
            message: '请输入卡号',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
        {
            validator: vailIccId,
            trigger: 'blur',
        },
    ],
    iccId: [
        {
            required: true,
            message: '请输入ICCID',
        },
        {
            max: 64,
            message: '最多输入64个字符',
        },
    ],
    platformConfigId: [
        {
            required: true,
            message: '请选择平台对接',
        },
    ],
    cardType: [
        {
            required: true,
            message: '请选择类型',
        },
    ],
};

const filterOption = (input: string, option: any) => {
    return (
        option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    );
};

watch(
    () => props.data,
    (newValue) => {
        queryPlatformNoPage({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [{ column: 'state', value: 'enabled' }],
        }).then((resp: any) => {
            if (resp.status === 200) {
                platformConfigList.value = resp.result.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                }));
            }
        });
        Object.assign(modelRef, newValue);
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('change', false);
    formRef.value.resetFields();
};

const handleOk = () => {
    formRef.value
        .validate()
        .then(async () => {
            btnLoading.value = true;
            const resp =
                props.type === 'add'
                    ? await add(toRaw(modelRef))
                    : await edit(toRaw(modelRef));
            btnLoading.value = false;
            if (resp.status === 200) {
                message.success('操作成功')
                emit('change', true);
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>
