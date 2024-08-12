<template>
    <j-modal
        :visible="visible"
        title="清洗规则"
        @ok="modalEvent.confirm"
        @cancel="modalEvent.cancel"
        class="modal-style"
    >
        <j-spin :spinning="isLoading">
            <div class="tag">
                <p class="tag-key">标识: {{ info.id }}</p>
                <p class="tag-desc">名称: {{ info.name }}</p>
            </div>
            <j-form
                ref="formRef"
                :model="formState"
                :rules="rules"
                name="basic"
                autocomplete="off"
                layout="vertical"
            >
                <j-form-item
                    label="最大值"
                    name="maxValue"
                    v-show="permission.includes('maxValue')"
                >
                    <j-input
                        v-model:value="formState.maxValue"
                        placeholder="请输入最大值"
                    />
                </j-form-item>
                <j-form-item
                    label="最小值"
                    name="minValue"
                    v-show="permission.includes('minValue')"
                >
                    <j-input
                        v-model:value="formState.minValue"
                        placeholder="请输入最小值"
                    />
                </j-form-item>
                <div
                    class="input-group"
                    v-show="
                        permission.includes('exceptionKey') &&
                        permission.includes('exceptionValue')
                    "
                >
                    <p class="label">异常值</p>
                    <div class="content">
                        <j-form-item name="exceptionKey">
                            <j-input
                                v-model:value="formState.exceptionKey"
                                placeholder="请输入异常值"
                            />
                        </j-form-item>
                        <span>-</span>
                        <j-form-item name="exceptionValue">
                            <j-input
                                v-model:value="formState.exceptionValue"
                                placeholder="请输入转换后的异常值"
                            />
                        </j-form-item>
                    </div>
                </div>

                <div
                    class="input-group"
                    v-show="
                        permission.includes('invalidKey') &&
                        permission.includes('invalidValue')
                    "
                >
                    <p class="label">无效值</p>
                    <div class="content">
                        <j-form-item name="invalidKey">
                            <j-input
                                v-model:value="formState.invalidKey"
                                placeholder="请输入无效值"
                            />
                        </j-form-item>
                        <span>-</span>
                        <j-form-item name="invalidValue">
                            <j-input
                                v-model:value="formState.invalidValue"
                                placeholder="请输入转换后的无效值"
                            />
                        </j-form-item>
                    </div>
                </div>

                <!--                <j-form-item label="说明" name="description">-->
                <!--                    <j-textarea-->
                <!--                        v-model:value="formState.description"-->
                <!--                        :rows="3"-->
                <!--                    />-->
                <!--                </j-form-item>-->
            </j-form>
        </j-spin>
    </j-modal>
</template>

<script setup lang="ts">
import { FormState } from '@/views/link/DataCleaning/typings';
import { useProductStore } from 'store/product';
import {
    copyFormData,
    metadata2Object,
    obj2Metadata,
} from '@/views/link/DataCleaning/utils';
import { _deploy, updateDevice } from '@/api/device/product';
import { message } from 'ant-design-vue/es';
import { Rule } from 'ant-design-vue/es/form';
import { FormInstance } from 'ant-design-vue';
import { onlyMessage } from '@/utils/comm';

const props = defineProps<{
    productId: string;
    visible: boolean;
    // property: string;
    info: { id: string; name: string; type: string };
    permission: string[];
    defaultData: FormState;
}>();

const emit = defineEmits(['update:visible']);

const productStore = useProductStore();

const formRef = ref<FormInstance>();
const isLoading = ref(false);

const formState = reactive<FormState>({
    maxValue: '',
    minValue: '',
    exceptionKey: '',
    exceptionValue: '',
    invalidKey: '',
    invalidValue: '',
    description: '',
});

const rules: Record<string, Rule[]> = {
    maxValue: [
        {
            validator: checkNumber,
            trigger: 'change',
        },
        {
            validator: checkMaxValue,
        },
    ],
    minValue: [
        {
            validator: checkNumber,
            trigger: 'change',
        },
        {
            validator: checkMinValue,
        },
    ],
    exceptionKey: [
        {
            required: true,
            validator: checkOtherInput,
            trigger: 'change',
        },
        {
            required: true,
            validator: checkMappingFactory(
                'exceptionValue',
                '请输入对应的异常值！',
            ),
        },
    ],
    exceptionValue: [
        {
            required: true,
            validator: checkOtherInputMapping,
            trigger: 'change',
        },
        {
            required: true,
            validator: checkMappingFactory(
                'exceptionKey',
                '请输入对应转换后的异常值！',
            ),
        },
    ],
    invalidKey: [
        {
            required: true,
            validator: checkOtherInput,
            trigger: 'change',
        },
        {
            required: true,
            validator: checkMappingFactory(
                'invalidValue',
                '请输入对应的无效值！',
            ),
        },
    ],
    invalidValue: [
        {
            required: true,
            validator: checkOtherInputMapping,
            trigger: 'change',
        },
        {
            required: true,
            validator: checkMappingFactory(
                'invalidKey',
                '请输入对应转换后的无效值！',
            ),
        },
    ],
};

// modal框的事件
const modalEvent = {
    // 确认事件
    confirm: async () => {
        let resp = await formRef.value?.validate();
        if (resp) {
            isLoading.value = true;
            // 获取到表单中的数据，去除不必要的数据
            const data = copyFormData(formState);
            // 获取到store中的metadata字符串
            const current = productStore.current;
            console.log('current', current);
            // 将字符串转为对象
            const metadata = metadata2Object(current.metadata);
            console.log('metadata', metadata);

            // 将弹窗表单中的数据传入metadata对应的属性中
            metadata.properties.find((item: any) => {
                if (item.id === props.info.id) {
                    for (const key in data) {
                        item.expands[key] = data[key];
                    }
                }
            });
            // 转换为字符串后重新赋值给current
            current.metadata = obj2Metadata(metadata);
            // 发送请求保存配置
            const resp = await updateDevice(current);
            if (resp.status === 200) {
                message.success('清洗规则保存成功！');

                // 物模型未启用的情况
                if (current.state === 0) {
                    message.error(
                        '由于物模型未启用，清洗规则已保存但未应用至物模型，请启用物模型后重试！',
                    );
                    isLoading.value = false;
                    emit('update:visible', false);
                    return;
                }

                // 将清洗规则应用到物模型
                const deployResp = await _deploy(productStore.current.id);
                if (deployResp.status === 200) {
                    message.success('清洗规则已应用至物模型！');
                    await productStore.refresh(productStore.current.id);
                } else {
                    message.error('清洗规则应用到物模型失败，请重试！');
                }
            } else {
                message.error('清洗规则保存失败！请重试！');
            }
            isLoading.value = false;
            emit('update:visible', false);
        } else {
            // 因为validate中出错直接抛出异常，所以这里的代码不会执行
            onlyMessage('请检查输入框中数据是否填写正确！', 'error');
        }
    },
    // 取消事件
    cancel() {
        emit('update:visible', false);
    },
};

async function checkNumber(_rule: Rule, value: string) {
    if (value !== '') {
        const regex = /^\d+(\.\d+)?$/;
        if (!regex.test(value)) {
            return Promise.reject('请输入正整数或正小数！');
        }
        return Promise.resolve();
    }
    return Promise.resolve();
}

async function checkMaxValue(_rule: Rule, value: string) {
    if (value !== '') {
        if (Number(value) <= Number(formState.minValue)) {
            return Promise.reject('最大值不能小于等于最小值！');
        }
        return Promise.resolve();
    }
    return Promise.resolve();
}

async function checkMinValue(_rule: Rule, value: string) {
    if (value !== '') {
        if (Number(value) >= Number(formState.maxValue)) {
            return Promise.reject('最小值不能大于等于最大值！');
        }
        return Promise.resolve();
    }
    return Promise.resolve();
}

async function checkOtherInput(_rule: Rule, value: string) {
    if (value !== '') {
        const regex = /^[a-zA-Z0-9,]*$/;
        if (!regex.test(value)) {
            return Promise.reject('请输入字母、数字或英文逗号！');
        }
        return Promise.resolve();
    }
    return Promise.resolve();
}

async function checkOtherInputMapping(_rule: Rule, value: string) {
    if (value !== '') {
        const regex = /^-?\d+$/;
        if (!regex.test(value)) {
            return Promise.reject('请输入整数！');
        }
        return Promise.resolve();
    }
}
type TKey = 'exceptionKey' | 'exceptionValue' | 'invalidKey' | 'invalidValue';

function checkMappingFactory(key: TKey, tips: string) {
    return async function (_rule: Rule, value: string) {
        if (value === '' && formState[key]) {
            return Promise.reject(tips);
        }
        return Promise.resolve();
    };
}

watch(
    () => props.defaultData,
    (newVal) => {
        for (const key in newVal) {
            formState[key] = newVal[key];
            formRef.value?.validate();
        }
    },
    {
        deep: true,
    },
);
</script>

<style scoped lang="less">
.modal-style {
    .input-group {
        .content {
            display: flex;
            gap: 16px;
            & > span {
                line-height: 32px;
            }

            :deep(.ant-form-item) {
                flex-grow: 1;

                .ant-form-item-control {
                    width: 100% !important;
                }
            }
        }
    }
}
.tag {
    font-size: 14px;
    color: #434343;
    border-left: 2px solid var(--ant-primary-color-hover);
    background-color: #fafafa;
    padding: 4px 24px;
    margin-bottom: 16px;
    & > p {
        margin-bottom: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>
