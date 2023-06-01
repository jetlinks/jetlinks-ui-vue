<template>
    <j-modal
        visible
        :title="props.data.id ? '编辑' : '新增'"
        width="865px"
        :confirmLoading="loading"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
    >
        <j-form :model="form" layout="vertical" ref="formRef">
            <j-form-item
                label="名称"
                name="subscribeName"
                :rules="[
                    { required: true, message: '请输入名称' },
                    {
                        max: 64,
                        message: '最多可输入64个字符',
                    },
                ]"
            >
                <j-input
                    v-model:value="form.subscribeName"
                    placeholder="请输入名称"
                />
            </j-form-item>

            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item
                        label="类型"
                        name="topicProvider"
                        :rules="[{ required: true, message: '请选择类型' }]"
                    >
                        <j-select
                            v-model:value="form.topicProvider"
                            placeholder="请选择类型"
                            :options="typeList"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        label="告警规则"
                        :name="['topicConfig', 'alarmConfigId']"
                        :rules="[{ required: true, message: '请选择告警规则' }]"
                    >
                        <j-select
                            :value="form.topicConfig?.alarmConfigId?.split(',')"
                            :options="alarmList"
                            placeholder="请选择告警规则"
                            mode="multiple"
                            @change="onSelect"
                        ></j-select>
                    </j-form-item>
                </j-col>
            </j-row>
            <j-form-item
                name="notice"
                label="通知方式"
                :rules="[{ required: true, message: '请选择通知方式' }]"
            >
                <j-checkbox-group
                    v-model:value="form.notice"
                    name="checkboxgroup"
                    :options="[
                        {
                            label: '站内通知',
                            value: 1,
                        },
                    ]"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { rowType } from '../typing';
import {
    getTypeList_api,
    getAlarmList_api,
    save_api,
} from '@/api/account/notificationSubscription';
import { optionsType } from '@/views/system/Department/typing';
import { dictItemType } from '@/views/system/DataSource/typing';
import { optionItem } from '@/views/rule-engine/Scene/typings';
import { FormInstance, message } from 'ant-design-vue';

const emits = defineEmits(['ok', 'update:visible']);
const props = defineProps<{
    visible: boolean;
    data: rowType;
}>();

const loading = ref(false);
const initForm = {
    subscribeName: '',
    topicConfig: {},
    notice: [1],
};

const formRef = ref<FormInstance>();
const form = ref({
    ...initForm,
    ...props.data,
});
const confirm = () => {
    formRef.value &&
        formRef.value.validate().then(() => {
            loading.value = true;
            save_api(form.value)
                .then((resp) => {
                    if (resp.status === 200) {
                        message.success('操作成功');
                        emits('ok');
                        emits('update:visible', false);
                    }
                })
                .finally(() => (loading.value = false));
        });
};

const typeList = ref<optionsType>([]);
const alarmList = ref<optionsType>([]);

init();
function init() {
    getTypeList_api().then((resp: any) => {
        if (resp.status === 200)
            typeList.value = resp.result
                .map((item: dictItemType) => ({
                    label: item.name,
                    value: item.id,
                }))
                .filter((item: optionItem) => item.value === 'alarm');
    });
    getAlarmList_api().then((resp: any) => {
        if (resp.status === 200)
            alarmList.value = resp.result.map((item: dictItemType) => ({
                label: item.name,
                value: item.id,
            }));
    });
}

function onSelect(keys: string[], items: optionsType) {
    form.value.topicConfig = {
        alarmConfigId: keys.length ? keys.join(',') : undefined,
        alarmConfigName: items.length ? items.map((item) => item.label).join(',') : undefined,
    };
}
</script>

<style scoped></style>
