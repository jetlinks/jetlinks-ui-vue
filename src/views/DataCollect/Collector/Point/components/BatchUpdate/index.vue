<template>
    <j-modal
        title="批量编辑"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <div class="sizeText">
            将批量修改
            {{ data.length }} 条数据的访问类型、采集频率、只推送变化的数据
        </div>
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            ref="formRef"
        >
            <j-form-item label="访问类型" name="accessModes">
                <j-card-select
                    multiple
                    :showImage="false"
                    v-model:value="formData.accessModes"
                    :options="[
                        { label: '读', value: 'read' },
                        { label: '写', value: 'write' },
                        { label: '订阅', value: 'subscribe' },
                    ]"
                />
            </j-form-item>
            <j-form-item
                :name="['interval']"
                :rules="[
                    {
                        pattern: regOnlyNumber,
                        message: '请输入0或者正整数',
                    },
                ]"
            >
                <template #label>
                    <span>
                        采集频率
                        <j-tooltip title="采集频率为0时不执行轮询任务">
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </j-tooltip>
                    </span>
                </template>
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入采集频率"
                    v-model:value="formData.interval"
                    addon-after="ms"
                    :max="9999999999999998"
                />
            </j-form-item>

            <j-form-item :name="['features']">
                <j-checkbox-group v-model:value="formData.features">
                    <j-checkbox value="changedOnly" name="type"
                        >只推送变化的数据</j-checkbox
                    >
                </j-checkbox-group>
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">取消</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Collector:update`"
            >
                确认
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import { savePointBatch } from '@/api/data-collect/collector';
import { Rule } from 'ant-design-vue/lib/form';
import { cloneDeep, isObject } from 'lodash';
import { regOnlyNumber } from '../../../data';

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['change']);
const loading = ref(false);
const formRef = ref<FormInstance>();

const formData = ref({
    accessModes: [],
    interval: '',
    features: [],
});

const checkLength = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (value) {
            return String(value).length > 64
                ? reject('最多可输入64个字符')
                : resolve('');
        }
    });

const handleOk = async () => {
    const data = cloneDeep(formData.value);
    const { accessModes, features, interval } = data;
    const ischange =
        accessModes.length !== 0 || features.length !== 0 || !!interval;
    if (ischange) {
        const params = cloneDeep(props.data);
        params.forEach((i: any) => {
            if (accessModes.length !== 0) {
                i.accessModes = data.accessModes;
            } else {
                if (isObject(i.accessModes)) {
                    i.accessModes = i.accessModes.map(
                        (item: any) => item.value,
                    );
                }
            }
            features.length !== 0 && (i.features = data.features);
            if (!!interval) {
                i.interval = data.interval;
                i.configuration = {
                    ...i.configuration,
                    interval: data.interval,
                };
            }
        });
        loading.value = true;
        const response = await savePointBatch(params).catch(() => {});
        emit('change', response?.status === 200);
        loading.value = false;
    } else {
        emit('change', true);
    }
};

const handleCancel = () => {
    emit('change', false);
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
</script>

<style lang="less" scoped>
.sizeText {
    margin-bottom: 20px;
}
</style>
