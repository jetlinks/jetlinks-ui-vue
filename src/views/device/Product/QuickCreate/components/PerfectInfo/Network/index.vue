<template>
    <a-form :model="formData" layout="vertical" ref="formRef">
        <a-row :gutter="[12, 12]">
            <a-col :span="24">
                <a-form-item
                    :label="
                        isVisible('secure', netWorkType)
                            ? '开启DTLS'
                            : '开启TLS'
                    "
                    name="secure"
                    :rules="Rules.secure"
                >
                    <a-radio-group
                        v-model:value="formData.secure"
                        @change="changeSecure"
                    >
                        <a-radio :value="true">是</a-radio>
                        <a-radio :value="false">否</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-col>
            <template v-if="formData.secure">
                <a-col :span="12">
                    <a-form-item label="证书" name="certId">
                        <a-select
                            v-model:value="formData.certId"
                            :options="certIdOptions"
                            placeholder="请选择证书"
                            allowClear
                            show-search
                            :filter-option="filterOption"
                    /></a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item label="私钥别名" name="privateKeyAlias"
                        ><a-input
                            v-model:value="formData.privateKeyAlias"
                            placeholder="请输入私钥别名"
                    /></a-form-item>
                </a-col>
            </template>
            <a-col :span="24" v-if="isVisible('parserType', netWorkType)">
                <a-form-item name="parserType" :rules="Rules.parserType">
                    <template #label>
                        粘拆包规则
                        <a-tooltip title="处理TCP粘拆包的方式">
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </a-tooltip>
                    </template>
                    <a-select
                        style="width: 48.5%"
                        v-model:value="formData.parserType"
                        :options="ParserTypeOptions"
                        placeholder="请选择粘拆包规则"
                        allowClear
                        show-search
                        :filter-option="filterOption"
                        @change="changeParserType"
                    />
                </a-form-item>
            </a-col>
            <a-col
                :span="12"
                v-if="isVisible('delimited', formData.parserType)"
            >
                <a-form-item
                    label="分隔符"
                    :name="['parserConfiguration', 'delimited']"
                    :rules="Rules.delimited"
                    class="form2-left"
                >
                    <a-input
                        v-model:value="formData.parserConfiguration.delimited"
                        placeholder="请输入分隔符"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="24" v-if="isVisible('script', formData.parserType)">
                <a-form-item
                    label="解析脚本"
                    :name="['parserConfiguration', 'script']"
                    :rules="Rules.script"
                    class="form2-left form2-right"
                >
                    <div style="width: 100%; height: 400px">
                        <j-monaco-editor
                            theme="vs"
                            v-model:modelValue="
                                formData.parserConfiguration.script
                            "
                            language="javascript"
                            :init="editorInit"
                            :registrationTypescript="typescriptTip"
                        />
                    </div>
                </a-form-item>
            </a-col>

            <a-col :span="12" v-if="isVisible('size', formData.parserType)">
                <a-form-item
                    label="长度值"
                    :name="['parserConfiguration', 'size']"
                    :rules="Rules.size"
                    class="form2-left"
                >
                    <a-input-number
                        style="width: 100%"
                        v-model:value="formData.parserConfiguration.size"
                        placeholder="请输入长度值"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12" v-if="isVisible('length', formData.parserType)">
                <a-form-item
                    label="字节长度"
                    :name="['parserConfiguration', 'length']"
                    :rules="Rules.length"
                    class="form2-left"
                >
                    <a-select
                        style="width: 100%"
                        v-model:value="formData.parserConfiguration.length"
                        :options="LengthOptions"
                        placeholder="请选择长度"
                        allowClear
                        show-search
                        :filter-option="filterOption"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12" v-if="isVisible('offset', formData.parserType)">
                <a-form-item
                    label="偏移量"
                    :name="['parserConfiguration', 'offset']"
                    :rules="Rules.offset"
                    class="form2-right"
                >
                    <a-input-number
                        style="width: 100%"
                        v-model:value="formData.parserConfiguration.offset"
                        placeholder="请输入偏移量"
                        :min="0"
                        :max="65535"
                    />
                </a-form-item>
            </a-col>
            <a-col :span="12" v-if="isVisible('little', formData.parserType)">
                <a-form-item
                    label="大小端"
                    :name="['parserConfiguration', 'little']"
                    class="form2-left"
                >
                    <a-select
                        style="width: 100%"
                        v-model:value="formData.parserConfiguration.little"
                        :options="LittleOptions"
                        placeholder="请选择大小端"
                        allowClear
                        show-search
                        :filter-option="filterOption"
                    />
                </a-form-item>
            </a-col>
        </a-row>
    </a-form>
</template>

<script setup>
import {
    isVisible,
    ParserTypeOptions,
    ParserConfiguration,
    LengthOptions,
    LittleOptions,
    Rules,
} from '../../../data';
import { certificates } from '@/api/link/type';
import { NetworkTypeMapping } from '@/views/link/AccessConfig/data';
import { cloneDeep } from 'lodash-es';
import { defineExpose } from 'vue';
const props = defineProps({
    accessData: {
        type: Object,
        default: () => {},
    },
});

const formData = reactive({
    secure: false,
    certId: '',
    privateKeyAlias: '',
    parserType: undefined,
    parserConfiguration: ParserConfiguration,
});

const formRef = ref();

const certIdOptions = ref([]);

const typescriptTip = reactive({
    typescript: '',
});

const netWorkType = ref('');

const getCertificates = async () => {
    const resp = await certificates();
    if (resp.status === 200) {
        certIdOptions.value = resp.result.map((i) => ({
            value: i.id,
            label: i.name,
        }));
    }
};

const editorInit = (editor, monaco) => {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        allowJs: true,
        checkJs: true,
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        strictNullChecks: false,
        strictPropertyInitialization: true,
        strictFunctionTypes: true,
        strictBindCallApply: true,
        useDefineForClassFields: true, //permit class static fields with private name to have initializer
        moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        typeRoots: ['types'],
        lib: ['esnext'],
    });
};

const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const changeParserType = (value) => {
    formData.parserConfiguration = cloneDeep(ParserConfiguration);
    value === 'SCRIPT'
        ? (formData.parserConfiguration.lang = 'javascript')
        : '';
};

const changeSecure = () => {
    formData.certId = undefined;
    formData.privateKeyAlias = '';
};

const submitData = () => {
    return new Promise((res, rej) => {
        formRef.value
            .validate()
            .then((formData) => {
                // const data = toRaw(formData);
                res(formData);
            })
            .catch((err) => {
                rej(err);
            });
    });
};
defineExpose({
    submitData,
});

watch(
    () => props.accessData,
    () => {
        console.log(props.accessData)
        netWorkType.value = NetworkTypeMapping.get(props.accessData.provider)
    },
    {
        deep: true,
        immediate: true,
    },
);

onMounted(() => {
    getCertificates();
});
</script>
<style lang="less" scoped></style>
