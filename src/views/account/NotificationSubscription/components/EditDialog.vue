<template>
    <a-modal
        visible
        :title="props.data.id ? '编辑' : '新增'"
        width="865px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
    >
        <a-form :model="form" layout="vertical" ref="formRef">
            <a-form-item
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
                <a-input
                    v-model:value="form.subscribeName"
                    placeholder="请输入名称"
                />
            </a-form-item>

            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item
                        label="类型"
                        name="topicProvider"
                        :rules="[{ required: true, message: '请选择类型' }]"
                    >
                        <a-select
                            v-model:value="form.topicProvider"
                            placeholder="请选择类型"
                            :options="typeList"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        label="告警规则"
                        :name="['topicConfig', 'alarmConfigId']"
                        :rules="[{ required: true, message: '请选择告警规则' }]"
                    >
                        <a-select
                            :value="form.topicConfig.alarmConfigId?.split(',')"
                            :options="alarmList"
                            placeholder="请选择告警规则"
                            mode="multiple"
                            @change="onSelect"
                        ></a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-form-item
                name="notice"
                label="通知方式"
                :rules="[{ required: true, message: '请选择通知方式' }]"
            >
                <a-checkbox-group
                    v-model:value="form.notice"
                    name="checkboxgroup"
                    :options="[
                        {
                            label: '站内通知',
                            value: 1,
                        },
                    ]"
                />
            </a-form-item>
        </a-form>
    </a-modal>
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
            save_api(form.value).then((resp) => {
                if (resp.status === 200) {
                    message.success('操作成功');
                    emits('ok')
                    emits('update:visible', false);
                }
            });
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
        alarmConfigId: keys.join(','),
        alarmConfigName: items.map((item) => item.label).join(','),
    };
}
</script>

<style scoped></style>
