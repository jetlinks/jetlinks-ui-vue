<!-- Modal 弹窗，用于新增、修改数据 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="!!formData.id ? $t('Channel.Save.1174410-0') : $t('Channel.Save.1174410-1')"
        width="650px"
        :cancelText="$t('Channel.Save.1174410-2')"
        :okText="$t('Channel.Save.1174410-3')"
        @ok="handleSubmit"
        @cancel="handleCancel"
        :confirmLoading="loading"
    >
        <j-form ref="formRef" :model="formData" layout="vertical">
            <j-row :gutter="10">
                <j-col :span="12">
                    <j-form-item
                        name="channelId"
                        :rules="[
                            {
                                max: 64,
                                message: $t('Channel.Save.1174410-4'),
                            },
                            {
                                validator: validateChannelId,
                            },
                        ]"
                    >
                        <template #label>
                            {{ $t('Channel.Save.1174410-5') }}
                            <j-tooltip :title="$t('Channel.Save.1174410-6')">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </template>
                        <j-input
                            v-model:value="formData.channelId"
                            :disabled="!!formData.id"
                            :placeholder="$t('Channel.Save.1174410-7')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="name"
                        :label="$t('Channel.Save.1174410-8')"
                        :rules="[
                            { required: true, message: $t('Channel.Save.1174410-9') },
                            { max: 64, message: $t('Channel.Save.1174410-4') },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.name"
                            :placeholder="$t('Channel.Save.1174410-9')"
                        />
                    </j-form-item>
                </j-col>
                <j-col
                    :span="24"
                    v-if="typeOne"
                >
                    <j-form-item
                        :label="$t('Channel.Save.1174410-10')"
                        name="manufacturer"
                        :rules="[
                            { required: false, message: '' },
                            { max: 64, message: $t('Channel.Save.1174410-4') },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.manufacturer"
                            :placeholder="$t('Channel.Save.1174410-11')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24" v-if="typeTow">
                    <j-form-item
                        name="media_url"
                        :rules="[
                            { required: true, message: $t('Channel.Save.1174410-12') },
                            { max: 128, message: $t('Channel.Save.1174410-13') },
                            {
                                validator: validateUrl,
                            },
                        ]"
                    >
                        <template #label>
                            {{ $t('Channel.Save.1174410-14') }}
                            <j-tooltip
                                :title="$t('Channel.Save.1174410-15')"
                            >
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </template>
                        <j-input
                            v-model:value="formData.media_url"
                            :placeholder="$t('Channel.Save.1174410-12')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12" v-if="typeTow">
                    <j-form-item
                        name="media_username"
                        :label="$t('Channel.Save.1174410-16')"
                        :rules="{ max: 64, message: $t('Channel.Save.1174410-4') }"
                    >
                        <j-input
                            v-model:value="formData.media_username"
                            :placeholder="$t('Channel.Save.1174410-17')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12" v-if="typeTow">
                    <j-form-item
                        name="media_password"
                        :label="$t('Channel.Save.1174410-18')"
                        :rules="{ max: 64, message: $t('Channel.Save.1174410-4') }"
                    >
                        <j-input-password
                            v-model:value="formData.media_password"
                            :placeholder="$t('Channel.Save.1174410-19')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24">
                    <j-form-item
                        name="address"
                        :label="$t('Channel.Save.1174410-20')"
                        :rules="{ max: 64, message: $t('Channel.Save.1174410-4') }"
                    >
                        <j-input
                            v-model:value="formData.address"
                            :placeholder="$t('Channel.Save.1174410-21')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24" v-if="typeOne">
                    <j-form-item :label="$t('Channel.Save.1174410-22')" name="ptzType">
                        <j-select
                            v-model:value="formData.ptzType"
                            :options="[
                                { label: $t('Channel.Save.1174410-23'), value: 0 },
                                { label: $t('Channel.Save.1174410-24'), value: 1 },
                                { label: $t('Channel.Save.1174410-25'), value: 2 },
                                { label: $t('Channel.Save.1174410-26'), value: 3 },
                                { label: $t('Channel.Save.1174410-27'), value: 4 },
                            ]"
                            :placeholder="$t('Channel.Save.1174410-28')"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24">
                    <j-form-item name="description" :label="$t('Channel.Save.1174410-29')">
                        <j-textarea
                            v-model:value="formData.description"
                            :rows="4"
                            :maxlength="200"
                            showCount
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import ChannelApi from '@/api/media/channel';
import { PropType } from 'vue';
import type { Rule } from 'ant-design-vue/es/form';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const route = useRoute();

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'submit'): void;
};

const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    channelData: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

const typeOne = computed(()=>{
    return ['gb28181-2016', 'onvif'].includes(route.query.type)
})
const typeTow = computed(()=>{
    return ['fixed-media'].includes(route.query.type)
})
const formRef = ref();
const formData = ref({
    id: undefined,
    address: '',
    channelId: '',
    description: '',
    deviceId: route.query.id,
    name: '',
    manufacturer: '',
    ptzType: '',
    // 以下字段, 提交时需提取到others字段当中
    media_password: '',
    media_url: '',
    media_username: '',
});

const loading = ref<boolean>(false);
watch(
    () => props.channelData,
    (val: any) => {
        const {
            id,
            address,
            channelId,
            description,
            deviceId,
            name,
            manufacturer,
            ptzType,
            others,
            ...extra
        } = val;
        formData.value = {
            id,
            address,
            channelId,
            description,
            deviceId,
            name,
            manufacturer,
            ptzType: ptzType?.value || 0,
            ...others,
        };
    },
    { deep: true },
);

/**
 * 通道ID字段验证是否存在
 * @param _rule
 * @param value
 */
const validateChannelId = async (_rule: Rule, value: string) => {
    // ID非必填, 没有输入ID时, 不校验ID是否存在
    if (!value) return;
    // 编辑时不校验唯一性
    if (!!formData.value?.id) return;
    const { result } = await ChannelApi.validateField({
        deviceId: route.query.id,
        channelId: value,
    });

    if (!result.passed) {
        return Promise.reject($t('Channel.Save.1174410-30'));
    } else {
        return Promise.resolve();
    }
};

/**
 * 校验视频地址
 * @param _rule
 * @param value
 */
const validateUrl = async (_rule: Rule, value: string) => {
    console.log('value: ', value);
    const reg = /(http|https|rtsp|rtmp):\/\/([\w.]+\/?)\S*/;
    return new Promise((resolve, reject) => {
        reg.test(value) || !value
            ? resolve('')
            : reject($t('Channel.Save.1174410-31'));
    });
};

/**
 * 提交
 */
const handleSubmit = () => {
    formRef.value
        .validate()
        .then(async () => {
            loading.value = true;
            const {
                media_url,
                media_password,
                media_username,
                // manufacturer,
                // ptzType,
                ...extraFormData
            } = formData.value;

            extraFormData.others = {
                media_url,
                media_password,
                media_username,
            };

            const res = formData.value.id
                ? await ChannelApi.update(
                      formData.value.id,
                      extraFormData,
                  ).finally(() => {
                      loading.value = false;
                  })
                : await ChannelApi.save(extraFormData).finally(() => {
                      loading.value = false;
                  });
            if (res.success) {
                onlyMessage($t('Channel.Save.1174410-32'));
                _vis.value = false;
                loading.value = false;
                emit('submit');
            } else {
                loading.value = false;
                onlyMessage($t('Channel.Save.1174410-33'), 'error');
            }
        })
        .catch((err: any) => {
            loading.value = false;
            console.log('err: ', err);
        });
};
const handleCancel = () => {
    _vis.value = false;
};
watch(
    () => _vis.value,
    (val) => {
        if (!val) {
            formRef.value?.resetFields(); // resetFields没有生效
            // 以下字段非表单所填, 重置字段需手动置空
            Object.keys(formData.value).forEach((key: string) => {
                if (key === 'id') formData.value.id = undefined;
                else if (key === 'deviceId')
                    formData.value.deviceId = route.query.id;
                else formData.value[key] = '';
            });
        }
    },
);
</script>
