<template>
    <div class="wrapper">
        <a-select
            v-if="componentsType === 'select'"
            v-model:value="myValue"
            :options="options"
            allowClear
            style="width: 100%"
        />
        <a-date-picker
            v-else-if="componentsType === 'date'"
            v-model:value="myValue"
            allowClear
            showTime
            lang="cn"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
        />
        <a-input-number
            v-else-if="componentsType === 'inputNumber'"
            v-model:value="myValue"
            allowClear
            style="width: 100%"
        />
        <a-input
            allowClear
            v-else-if="componentsType === 'object'"
            v-model:value="myValue"
        >
            <template #addonAfter>
                <form-outlined @click="modalVis = true" />
            </template>
        </a-input>
        <GeoComponent
            v-else-if="componentsType === 'geoPoint'"
            v-model:point="myValue"
        />
        <a-input
            v-else-if="componentsType === 'file'"
            v-model:value="myValue"
            placeholder="请输入图片链接"
            allowClear
        >
            <template #addonAfter>
                <a-upload
                    name="file"
                    :action="action"
                    :headers="headers"
                    :showUploadList="false"
                    @change="handleFileChange"
                >
                    <cloud-upload-outlined />
                </a-upload>
            </template>
        </a-input>
        <a-input
            v-else
            allowClear
            type="text"
            v-model:value="myValue"
            style="width: 100%"
        />

        <!-- 代码编辑器弹窗 -->
        <a-modal
            title="编辑"
            ok-text="确认"
            cancel-text="取消"
            v-model:visible="modalVis"
            width="700px"
            @cancel="modalVis = false"
            @ok="handleItemModalSubmit"
        >
            <div style="width: 100%; height: 400px">
                <MonacoEditor v-model:modelValue="objectValue" />
            </div>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { FormOutlined, CloudUploadOutlined } from '@ant-design/icons-vue';
import { UploadChangeParam, UploadFile } from 'ant-design-vue';
import MonacoEditor from '@/components/MonacoEditor/index.vue';
import GeoComponent from '@/components/GeoComponent/index.vue';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';

type valueType = string | number | boolean | undefined;

interface Prop {
    itemData?: any;
    modelValue?: valueType;
}

interface EmitProps {
    (e: 'update:modelValue', data: valueType): void;
}

const props = defineProps({
    itemData: {
        type: Object,
        default: () => ({ type: 'object' }),
    },
    modelValue: {
        type: [Number, String],
        default: '',
    },
});
const emit = defineEmits<EmitProps>();

const componentsType = computed(() => {
    switch (props.itemData.type) {
        case 'int':
            return 'inputNumber';
        case 'long':
            return 'inputNumber';
        case 'float':
            return 'inputNumber';
        case 'double':
            return 'inputNumber';
        case 'string':
            return 'input';
        case 'array':
            return 'input';
        case 'password':
            return 'input';
        case 'enum':
            return 'select';
        case 'boolean':
            return 'select';
        case 'date':
            return 'date';
        case 'object':
            return 'object';
        case 'geoPoint':
            return 'geoPoint';
        case 'file':
            return 'file';
        default:
            return 'input';
    }
});

const options = computed(() => {
    if (props.itemData.type === 'boolean') {
        return [
            {
                label: 'true',
                value: true,
            },
            {
                label: 'false',
                value: false,
            },
        ];
    }
    return props.itemData.options
        ? props.itemData.options.map((m: any) => ({
              label: m.text,
              value: m.value,
          }))
        : [];
});
const myValue = computed({
    get: () => {
        return props.modelValue;
    },
    set: (val: any) => {
        objectValue.value = val;
        emit('update:modelValue', val);
    },
});

const handleValueData = (value: any) => {
    emit('update:modelValue', value);
};

// 代码编辑器弹窗
const modalVis = ref<boolean>(false);
const objectValue = ref<string>('');
const handleItemModalSubmit = () => {
    myValue.value = objectValue.value.replace(/[\r\n]\s*/g, '');
    modalVis.value = false;
};

// 文件上传
const action = ref<string>(`${BASE_API_PATH}/file/static`);
const headers = ref({ [TOKEN_KEY]: LocalStore.get(TOKEN_KEY) });
const handleFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
        const url = info.file.response?.result;
        myValue.value = url;
        handleValueData(url);
    }
};
</script>

<style lang="less" scoped></style>
