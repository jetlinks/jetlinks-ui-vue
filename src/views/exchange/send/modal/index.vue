<template>
    <j-modal
            :visible="modalState.openView"
            :title="modalState.title"
            :maskClosable="false"
            destroy-on-close
            width="500px"
            @ok="modalState.confirm"
            @cancel="modalState.cancel"
            :confirmLoading="modalState.confirmLoading"
            cancelText="取消"
            okText="确定"
        >
            <div style="margin-top: 10px">
                <j-form
                    layout="vertical"
                    :model="form"
                    :rules="rules"
                    ref="formRef"
                >
                    <j-row type="flex">
                        <j-col flex="auto">
                            <j-form-item label="名称" name="name">
                                <j-input
                                    v-model:value="form.name"
                                    placeholder="请输入名称"
                                />
                            </j-form-item>
                            <j-form-item label="Topic" name="topic">
                                <j-input
                                    v-model:value="form.topic"
                                    :disabled="!!form?.id"
                                    placeholder="请输入Topic"
                                />
                            </j-form-item>
                            <j-form-item name="productId">
                                <template #label>
                                    <span
                                        >选择产品
                                        <j-tooltip
                                            title="只能选择“正常”状态的产品"
                                        >
                                            <AIcon
                                                type="QuestionCircleOutlined"
                                                style="margin-left: 2px"
                                            />
                                        </j-tooltip>
                                    </span>
                                </template>
                                <j-select
                                    showSearch
                                    :disabled="!!form?.id"
                                    @change="curProductChange"
                                    v-model:value="form.productId"
                                    placeholder="请选择状态为“正常”的产品"
                                    mode="multiple"
                                >
                                    <j-select-option
                                        v-for="item in productList"
                                        :value="item.id"
                                        :key="item.id"
                                        :label="item.name"
                                        >{{ item.name }}</j-select-option
                                    >
                                </j-select>
                            </j-form-item>
                            <j-form-item name="deviceIds">
                                <template #label>
                                    <span>选择设备 </span>
                                </template>
                                <j-select
                                    showSearch
                                    v-model:value="form.deviceIds"
                                    placeholder="请选择设备"
                                    mode="multiple"
                                >
                                    <j-select-option
                                        v-for="item in deviceList"
                                        :value="item.id"
                                        :key="item.id"
                                        :label="item.name"
                                        >{{ item.name }}</j-select-option
                                    >
                                </j-select>
                            </j-form-item>
                        </j-col>
                    </j-row>
                    <j-form-item label="说明" name="description">
                        <j-textarea
                            :maxlength="200"
                            showCount
                            :auto-size="{ minRows: 4, maxRows: 5 }"
                            v-model:value="form.description"
                            placeholder="请输入说明"
                        />
                    </j-form-item>
                </j-form>
            </div>
        </j-modal>
</template>
<script lang="ts" setup>
</script>
<style lang="less" scoped></style>