<template>
    <j-modal
        title="查看"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        width="550px"
        :confirmLoading="loading"
    >
        <j-form layout="vertical" :model="form" ref="formRef">
            <j-form-item label="清洗规则" class="item_title">
                <j-form-item label="最大值" v-if="form.maxValue ? true : false"
                    ><j-input-number
                        v-model:value="form.maxValue"
                        :disabled="isDisabled"
                        style="width: 95%"
                /></j-form-item>
                <j-form-item label="最小值" v-if="form.minValue ? true : false"
                    ><j-input-number
                        v-model:value="form.minValue"
                        :disabled="isDisabled"
                        style="width: 95%"
                /></j-form-item>
                <div
                    class="input-group"
                    style="width: 95%"
                    v-if="
                        form.exceptionKey | form.exceptionValue ? true : false
                    "
                >
                    <p class="label">异常值</p>
                    <div class="content">
                        <j-form-item name="exceptionKey">
                            <j-input
                                v-model:value="form.exceptionKey"
                                :disabled="isDisabled"
                                placeholder="异常值"
                            />
                        </j-form-item>
                        <span>-</span>
                        <j-form-item name="exceptionValue">
                            <j-input
                                v-model:value="form.exceptionValue"
                                :disabled="isDisabled"
                                placeholder="转换后的异常值"
                            />
                        </j-form-item>
                    </div>
                </div>
                <div
                    class="input-group"
                    style="width: 95%"
                    v-if="form.invalidKey | form.invalidValue ? true : false"
                >
                    <p class="label">无效值</p>
                    <div class="content">
                        <j-form-item name="invalidKey">
                            <j-input
                                v-model:value="form.invalidKey"
                                :disabled="isDisabled"
                                placeholder="请输入无效值"
                            />
                        </j-form-item>
                        <span>-</span>
                        <j-form-item name="invalidValue">
                            <j-input
                                v-model:value="form.invalidValue"
                                :disabled="isDisabled"
                                placeholder="请输入转换后的无效值"
                            />
                        </j-form-item>
                    </div>
                </div>
            </j-form-item>
            <j-form-item label="上报数据" class="item_title" style="width: 95%">
                <j-textarea
                    v-model:value="form.originJson"
                    placeholder="这里回显设备上报数据json"
                    :rows="8"
                    :maxlength="6"
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="close">取消</j-button>
        </template>
    </j-modal>
</template>

<script setup lang="ts">
const visible = ref(false);
const loading = ref(false);
const formRef = ref();
const isDisabled = ref(true);

const form = ref<any>({});

/**
 * 显示弹窗
 */
const show = (data: any) => {
    visible.value = true;
    if (data.cleanRule) {
        // console.log('data.cleanRule', typeof data.cleanRule);
        const cleanRuleData = JSON.parse(data.cleanRule);
        form.value = {
            maxValue: cleanRuleData?.maxValue,
            minValue: cleanRuleData?.minValue,
            exceptionKey: cleanRuleData?.exceptionKey,
            exceptionValue: cleanRuleData?.exceptionValue,
            invalidKey: cleanRuleData?.invalidKey,
            invalidValue: cleanRuleData?.invalidValue,
            originJson: data?.originJson,
        };
    } else {
        form.value = {
            maxValue: undefined,
            minValue: undefined,
            exceptionValue: undefined,
            invalidValue: undefined,
            originJson: data?.originJson,
        };
    }
};

defineExpose({
    show: show,
});

const close = () => {
    visible.value = false;
};
</script>

<style lang="less" scoped>
.ant-form-item {
    margin-bottom: 12px;
}

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
:deep(.item_title > .ant-form-item-label > label) {
    font-size: 16px;
}
</style>
