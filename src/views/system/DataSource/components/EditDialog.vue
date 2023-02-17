<template>
    <a-modal
        class="edit-dialog-container"
        :title="dialog.title"
        width="1050px"
        @ok="dialog.handleOk"
        :confirmLoading="dialog.loading.value"
        cancelText="取消"
        okText="确定"
        v-model:visible="dialog.visible.value"
    >
        <a-form ref="formRef" :model="form.data" layout="vertical">
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        name="name"
                        label="名称"
                        :rules="[
                            { required: true, message: '请输入名称' },
                            { max: 64, message: '最多可输入64个字符' },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.name"
                            placeholder="请输入名称"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        name="typeId"
                        label="类型"
                        :rules="[{ required: true, message: '请选择类型' }]"
                    >
                        <a-select
                            v-model:value="form.data.typeId"
                            style="width: 120px"
                            :options="form.typeOptions"
                            placeholder="请选择类型"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.data.typeId === 'rdb'">
                <a-col :span="24">
                    <a-form-item
                        :name="['shareConfig', 'url']"
                        label="URL"
                        :rules="[{ required: true, message: '请输入URL' }]"
                    >
                        <a-input
                            v-model:value="form.data.shareConfig.url"
                            placeholder="请输入r2bdc或者jdbc连接地址，示例：r2dbc:mysql://127.0.0.1:3306/test"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <a-col :span="24">
                    <a-form-item
                        :name="['shareConfig', 'adminUrl']"
                        label="管理地址"
                        :rules="[{ required: true, message: '请输入管理地址' }]"
                    >
                        <a-input
                            v-model:value="form.data.shareConfig.adminUrl"
                            placeholder="请输入管理地址，示例：http://localhost:15672"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <a-col :span="24">
                    <a-form-item
                        :name="['shareConfig', 'addresses']"
                        label="链接地址"
                        :rules="[{ required: true, message: '请输入链接地址' }]"
                    >
                        <a-input
                            v-model:value="form.data.shareConfig.addresses"
                            placeholder="请输入链接地址，示例：localhost:5672"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        :name="['shareConfig', 'username']"
                        label="用户名"
                        :rules="[
                            { required: true, message: '请输入用户名' },
                            {
                                max: 64,
                                message: '最多可输入64个字符',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.shareConfig.username"
                            placeholder="请输入用户名"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        :name="['shareConfig', 'password']"
                        label="密码"
                        :rules="[
                            { required: true, message: '请输入密码' },
                            {
                                max: 64,
                                message: '最多可输入64个字符',
                            },
                        ]"
                    >
                        <a-input-password
                            v-model:value="form.data.shareConfig.password"
                            placeholder="请输入密码"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <a-col :span="24">
                    <a-form-item
                        :name="['shareConfig', 'virtualHost']"
                        label="虚拟域"
                        :rules="[
                            { required: true, message: '请输入虚拟域' },
                            {
                                max: 64,
                                message: '最多可输入64个字符',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.shareConfig.virtualHost"
                            placeholder="请输入虚拟域"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24" v-if="form.data.typeId === 'rdb'">
                <a-col :span="24">
                    <a-form-item
                        :name="['shareConfig', 'schema']"
                        label="schema"
                        :rules="[
                            { required: true, message: '请输入schema' },
                            {
                                max: 64,
                                message: '最多可输入64个字符',
                            },
                        ]"
                    >
                        <a-input
                            v-model:value="form.data.shareConfig.schema"
                            placeholder="请输入schema"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item name="description" label="说明">
                        <a-textarea
                            v-model:value="form.data.description"
                            placeholder="请输入说明"
                            :rows="3"
                            showCount
                            :maxlength="200"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import { getDataTypeDict_api } from '@/api/system/dataSource';
import type { dictItemType, optionItemType, sourceItemType } from '../typing';

// 弹窗相关
const dialog = {
    title: '',
    loading: ref<boolean>(false),
    visible: ref<boolean>(false),
    handleOk: () => {},
    // 打开弹窗
    changeVisible: (row: sourceItemType) => {
        if (row.id) dialog.title = '编辑数据源';
        else dialog.title = '新增数据源';
        form.data = { ...row };
        dialog.visible.value = true;
    },
};
// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});

const form = reactive({
    data: {
        shareConfig: {},
    } as sourceItemType,

    typeOptions: [] as optionItemType[],

    getTypeOption: () => {
        getDataTypeDict_api().then((resp: any) => {
            const result = resp.result as dictItemType[];
            form.typeOptions = result.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        });
    },
});
form.getTypeOption();
</script>

<style scoped></style>
