<template>
    <j-modal
        visible
        :title="dialogTitle"
        :maskClosable="false"
        width="675px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        class="edit-dialog-container"
        :confirmLoading="loading"
        cancelText="取消"
        okText="确定"
    >
        <j-form ref="formRef" :model="formData" layout="vertical">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        name="companyName"
                        label="公司名称"
                        :rules="[
                            {
                                max: 50,
                                message: '公司名称长度不能超过50个字符',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.companyName"
                            placeholder="请输入姓名"
                            disabled
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="deviceRuleCode"
                        label="设备规则"
                        :rules="[
                            {
                                required: true,
                                message: '请输入设备规则',
                                trigger: 'change',
                            },
                            {
                                max: 50,
                                message: '设备规则长度不能超过50个字符',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.deviceRuleCode"
                            placeholder="请输入设备规则"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.isShow(['add'])">
                <j-col :span="12">
                    <j-form-item
                        name="address"
                        label="发送地址"
                        :rules="[
                            {
                                required: true,
                                message: '请输入发送地址',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.address"
                            placeholder="请输入发送地址"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="encryptType"
                        label="加密类型"
                        :rules="[
                            {
                                required: true,
                                message: '请选择加密方式',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-select
                            v-model:value="formData.encryptType"
                            placeholder="请选择加密类型"
                            :options="
                                encryptTypeMap.map((item) => {
                                    return {
                                        label: item.name,
                                        value: item.value,
                                    };
                                })
                            "
                        >
                            <template #placeholder>
                                <span>请选择加密类型</span>
                            </template>
                        </j-select>
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        name="username"
                        label="账号"
                        :rules="[
                            {
                                required: true,
                                message: '请输入账号',
                                trigger: 'change',
                            },
                            {
                                max: 50,
                                message: '账号长度不能超过50个字符',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.username"
                            placeholder="请输入账号"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="password"
                        label="密码"
                        :rules="[
                            {
                                required: true,
                                message: '请输入密码',
                                trigger: 'change',
                            },
                            {
                                max: 50,
                                message: '密码长度不能超过50个字符',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.password"
                            placeholder="请输入密码"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        name="efficaciousStartTime"
                        label="有效开始时间"
                        :rules="[
                            {
                                required: true,
                                message: '请选择有效开始时间',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-date-picker
                            type="datetime"
                            showTime
                            v-model:value="formData.efficaciousStartTime"
                            placeholder="请选择有效开始时间"
                            style="width: 100%"
                            value-format="x"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="efficaciousEndTime"
                        label="有效结束时间"
                        :rules="[
                            {
                                required: true,
                                message: '请选择有效结束时间',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-date-picker
                            type="datetime"
                            showTime
                            v-model:value="formData.efficaciousEndTime"
                            placeholder="请选择有效结束时间"
                            style="width: 100%"
                            value-format="x"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row>
                <j-col :span="24">
                    <j-form-item
                        name="publicKey"
                        label="公钥"
                        :rules="[
                            {
                                required: true,
                                message: '请输入公钥',
                                trigger: 'change',
                            },
                        ]"
                    >
                        <j-textarea
                            v-model:value="formData.publicKey"
                            placeholder="请输入公钥"
                            :auto-size="{ minRows: 3, maxRows: 10 }"
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { addSingleConfig, updateSingleConfig } from '@/api/system/push';
import { FormInstance } from 'ant-design-vue';

const formRef = ref<FormInstance>();

const props = defineProps<{
    type: modalType;
    encryptTypeMap: any[];
    propFormData: any;
}>();

const emits = defineEmits(['confirm', 'update:visible']);
// 是否正在加载
const loading = ref(false);

// 监听弹窗标题
const dialogTitle = computed(() => {
    if (props.type === 'add') return '新增';
    else if (props.type === 'edit') return '编辑';
    else return '';
});

type modalType = '' | 'add' | 'edit';
interface formType {
    id?: string;
    companyName?: string;
    address: string;
    deviceRuleCode: string;
    username: string;
    password: string;
    encryptType: number | undefined;
    publicKey: string;
    efficaciousStartTime?: number | string;
    efficaciousEndTime?: number | string;
}

// 获取传入的formData的值
const formData = reactive<formType>({
    ...props.propFormData,
});

const form = reactive({
    /**
     * @function isShow 控制当前的form-item是否展示
     * @param showTypes 需要展示的type,
     */
    isShow(showTypes: modalType[]) {
        return showTypes.includes(props.type);
    },
    submit() {
        if (props.type === 'add') {
            const data = {};
            // 只取有值的字段，避免id为空
            for (const key in formData) {
                if (formData[key]) {
                    data[key] = formData[key];
                }
            }
            return addSingleConfig(data);
        } else {
            if (formData.id) {
                // 对encryptType传递过来的值可能是name，需要转换成对应的value
                props.encryptTypeMap.forEach((item) => {
                    if (item.name === formData.encryptType) {
                        formData.encryptType = item.value;
                    }
                });
                return updateSingleConfig(formData, formData.id);
            } else {
                return Promise.reject();
            }
        }
    },
});

const confirm = () => {
    formRef?.value
        ?.validate()
        .then(() => form.submit())
        .then((resp: any) => {
            if (resp.status === 200) {
                onlyMessage('操作成功');
                emits('update:visible', false);
                emits('confirm');
            } else {
                onlyMessage('操作失败');
                emits('update:visible', false);
                emits('confirm');
            }
        });
};
</script>

<style lang="less" scoped>
.formName {
    margin-bottom: 10px;
    font-size: 16px;
    &::before {
        width: 2px;
        background-color: rgb(184, 184, 184);
        display: inline-block;
        height: 13px;
        margin-right: 3px;
        content: '';
    }
}
</style>
