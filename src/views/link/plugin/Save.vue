<template>
    <j-modal
        :maskClosable="false"
        :visible="true"
        :title="!!data?.id ? $t('plugin.Save.688243-0') : $t('plugin.Save.688243-1')"
        :confirmLoading="loading"
        @ok="handleSave"
        @cancel="handleCancel"
        width="650px"
    >
        <div>
            <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
                <j-form-item name="id" :rules="IdRules">
                    <template #label>
                        <span>
                            {{ $t('plugin.Save.688243-2') }}
                            <j-tooltip :title="$t('plugin.Save.688243-3')">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </span>
                    </template>
                    <j-input
                        :placeholder="$t('plugin.Save.688243-4')"
                        v-model:value="modelRef.id"
                        :disabled="!!data.id"
                    />
                </j-form-item>
                <j-form-item :label="$t('plugin.Save.688243-5')" name="name" :rules="nameRules">
                    <j-input
                        :placeholder="$t('plugin.Save.688243-6')"
                        v-model:value="modelRef.name"
                    />
                </j-form-item>
                <j-form-item :label="$t('plugin.Save.688243-7')" name="version" :rules="versionRule">
                    <UploadFile
                        v-model:modelValue="modelRef.version"
                        @change="uploadChange"
                        :fileName="data.filename"
                    />
                </j-form-item>
                <div v-if="modelRef.version" class="file-detail">
                    <div>
                        <span>{{ $t('plugin.Save.688243-8') }}</span>
                        <span class="file-detail-item">{{
                            TypeMap[modelRef.type]
                        }}</span>
                    </div>
                    <div>
                        <span>{{ $t('plugin.Save.688243-9') }}</span>
                        <span class="file-detail-item">{{
                            modelRef.version
                        }}</span>
                    </div>
                </div>
                <j-form-item
                    :label="$t('plugin.Save.688243-10')"
                    name="describe"
                    :rules="Max_Length_200"
                >
                    <j-textarea
                        v-model:value="modelRef.description"
                        :placeholder="$t('plugin.Save.688243-11')"
                        showCount
                        :maxlength="200"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script setup lang="ts" name="PluginSave">
import {
    ID_Rule,
    Max_Length_64,
    Max_Length_200,
    RequiredStringFn,
} from '@/components/Form/rules';
import UploadFile from './UploadFile.vue';
import { FileUploadResult } from '@/views/link/plugin/typings';
import { add, update, vailIdFn } from '@/api/link/plugin';
import { TypeMap } from './util';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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

const vailId = async (_: any, value: string) => {
    if (!props.data.id && value) {
        // 新增校验
        const resp = await vailIdFn(value);
        if (resp.success && resp.result && !resp.result.passed) {
            return Promise.reject($t('plugin.Save.688243-12'));
        }
    }
    return Promise.resolve();
};

const nameRules = [RequiredStringFn($t('plugin.Save.688243-5')), ...Max_Length_64];

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
        message: $t('plugin.Save.688243-13'),
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
    //     return Promise.reject($t('plugin.Save.688243-13'))
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
            onlyMessage($t('plugin.Save.688243-14'));
            if (route.query.save && (window as any).onTabSaveSuccess) {
                (window as any).onTabSaveSuccess(resp);
                setTimeout(() => window.close(), 300);
                return;
            }
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
