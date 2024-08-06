<template>
    <j-modal
        :visible="visible"
        title="清洗规则"
        @ok="modalEvent.confirm"
        @cancel="modalEvent.cancel"
        class="modal-style"
    >
        <j-spin :spinning="isLoading">
            <j-form
                :model="formState"
                name="basic"
                autocomplete="off"
                layout="vertical"
            >
                <j-form-item
                    label="最大值"
                    name="maxValue"
                    :rules="[{ required: false, message: '请输入最大值!' }]"
                >
                    <j-input v-model:value="formState.maxVal" />
                </j-form-item>
                <j-form-item
                    label="最小值"
                    name="minValue"
                    :rules="[{ required: false, message: '请输入最小值!' }]"
                >
                    <j-input v-model:value="formState.minVal" />
                </j-form-item>
                <div class="input-group">
                    <p class="label">异常值</p>
                    <div class="content">
                        <j-form-item
                            name="exceptionVal"
                            :rules="[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]"
                        >
                            <j-input v-model:value="formState.exceptionVal" />
                        </j-form-item>
                        <span>-</span>
                        <j-form-item
                            name="transitionedExceptionVal"
                            :rules="[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="
                                    formState.transitionedExceptionVal
                                "
                            />
                        </j-form-item>
                    </div>
                </div>

                <div class="input-group">
                    <p class="label">无效值</p>
                    <div class="content">
                        <j-form-item
                            name="invalidVal"
                            :rules="[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]"
                        >
                            <j-input v-model:value="formState.invalidVal" />
                        </j-form-item>
                        <span>-</span>
                        <j-form-item
                            name="transitionedInvalidVal"
                            :rules="[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]"
                        >
                            <j-input
                                v-model:value="formState.transitionedInvalidVal"
                            />
                        </j-form-item>
                    </div>
                </div>

                <j-form-item label="说明" name="description">
                    <j-textarea
                        v-model:value="formState.description"
                        :rows="3"
                    />
                </j-form-item>
            </j-form>
        </j-spin>
    </j-modal>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { FormState } from '@/views/link/DataCleaning/typings';

const props = defineProps<{
    visible: boolean;
    data: Record<string, any>;
}>();

const emit = defineEmits(['update:visible']);

const modalEvent = {
    confirm() {
        // todo 提交数据到后台
        onlyMessage('保存成功', 'success');
        emit('update:visible', false);
    },
    cancel() {
        emit('update:visible', false);
    },
};

const isLoading = ref(false);

const formState = reactive<FormState>({
    maxVal: '',
    minVal: '',
    exceptionVal: '',
    transitionedExceptionVal: '',
    invalidVal: '',
    transitionedInvalidVal: '',
    description: '',
});

// 当modal框被打开时查询当前属性下的规则
watch(
    () => props.visible,
    (val) => {
        if (val) {
            //
            isLoading.value = true;
            // todo 发送请求查询当前存在的规则
            setTimeout(() => {
                isLoading.value = false;
            }, 1000);
        }
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
</style>
