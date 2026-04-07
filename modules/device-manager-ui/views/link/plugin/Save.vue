<template>
    <a-modal
        :maskClosable="false"
        :open="true"
        :title="!!data?.id ? $t('plugin.Save.128565-0') : $t('plugin.Save.128565-1')"
        :confirmLoading="loading || uploading"
        @ok="handleSave"
        @cancel="handleCancel"
        width="650px"
    >
        <div>
            <a-form :layout="'vertical'" ref="formRef" :model="modelRef">
                <a-form-item name="id" :rules="IdRules">
                    <template #label>
                        <span>
                            {{ $t('plugin.Save.128565-2') }}
                            <a-tooltip :title="$t('plugin.Save.128565-3')">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </a-tooltip>
                        </span>
                    </template>
                    <a-input
                        :placeholder="$t('plugin.Save.128565-4')"
                        v-model:value="modelRef.id"
                        :disabled="!!data.id"
                    />
                </a-form-item>
                <a-form-item :label="$t('plugin.Save.128565-5')" name="name" :rules="nameRules">
                    <a-input
                        :placeholder="$t('plugin.Save.128565-6')"
                        v-model:value="modelRef.name"
                    />
                </a-form-item>
                <a-form-item :label="$t('plugin.Save.128565-7')" name="version" :rules="versionRule">
                    <UploadFile
                        v-model:modelValue="modelRef.version"
                        v-model:uploading="uploading"
                        @change="uploadChange"
                        :fileName="data.filename"
                    />
                </a-form-item>
                <div v-if="modelRef.version" class="file-detail">
                    <div>
                        <span>{{ $t('plugin.Save.128565-8') }}</span>
                        <span class="file-detail-item">{{
                            TypeMap[modelRef.type]
                        }}</span>
                    </div>
                    <div>
                        <span>{{ $t('plugin.Save.128565-9') }}</span>
                        <span class="file-detail-item">{{
                            modelRef.version
                        }}</span>
                    </div>
                </div>
                <a-form-item
                    :label="$t('plugin.Save.128565-10')"
                    name="describe"
                    :rules="Max_Length_200"
                >
                    <a-textarea
                        v-model:value="modelRef.description"
                        :placeholder="$t('plugin.Save.128565-11')"
                        showCount
                        :maxlength="200"
                    />
                </a-form-item>
            </a-form>
        </div>
    </a-modal>
</template>

<script setup lang="ts" name="PluginSave">
import {
    ID_Rule,
    Max_Length_64,
    Max_Length_200,
    RequiredStringFn,
} from '../components/Form/rules';
import UploadFile from './UploadFile.vue';
import { FileUploadResult } from '../plugin/typings';
import { add, update, vailIdFn } from '../../../api/link/plugin';
import { TypeMap } from './util';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';
import { useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits(['cancel', 'ok']);
const route = useRoute();
const formRef = ref();
const fileType = ref(props.data.type);
const loading = ref(false);
const uploading = ref(false)

const { onBack } = useTabSaveSuccessBack()

const vailId = async (_: any, value: string) => {
    if (!props.data.id && value) {
        // 新增校验
        const resp = await vailIdFn(value);
        if (resp.success && resp.result && !resp.result.passed) {
            return Promise.reject($t('plugin.Save.128565-12'));
        }
    }
    return Promise.resolve();
};

const nameRules = [RequiredStringFn($t('plugin.Save.128565-5')), ...Max_Length_64];

const IdRules = [
    ...ID_Rule,
    {
        validator: vailId,
        trigger: 'blur',
    },
];

const versionRule = [
    {
        required: true,
        message: $t('plugin.Save.128565-13'),
        trigger: 'blur',
    },
    // {
    //   validator(_: any, value: any) {
    //     if (value) {
    //       if (value?.err) {
    //         return Promise.reject('文件上传失败，请重新上传')
    //       }
    //       return Promise.resolve()
    //     }
    //     return Promise.reject($t('plugin.Save.128565-13'))
    //   }
    // }
];

const modelRef = reactive<any>({
    id: props.data.id,
    name: props.data.name,
    description: props.data.description,
    type: props.data.type,
    provider: props.data.provider || 'jar',
    version: props.data.version,
    filename: props.data.filename,
    configuration: props.data.configuration || {},
});

const uploadChange = (data: FileUploadResult) => {
    modelRef.type = data.type.value;
    modelRef.filename = data.filename;
    modelRef.configuration.location = data.accessUrl;
};

const handleSave = async () => {
    const data = await formRef.value.validate();
    if (data) {
        loading.value = true;
        modelRef.id = modelRef.id ? modelRef.id : null;
        const resp = props.data.id
            ? await update(modelRef).catch(() => {
                  success: false;
              })
            : await add(modelRef).catch(() => {
                  success: false;
              });
        loading.value = false;
        if (resp.success) {
            onlyMessage($t('plugin.Save.128565-14'));
            onBack(resp)
            emit('ok');
            formRef.value.resetFields();
        }
    }
};

const handleCancel = () => {
    emit('cancel');
};
</script>

<style scoped lang="less">
.file-detail {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 16px;

    .file-detail-item {
        color: #4f4f4f;
    }
}
</style>
