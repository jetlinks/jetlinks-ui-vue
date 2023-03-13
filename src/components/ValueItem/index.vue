<!-- 参数类型输入组件 -->
<template>
    <div class="wrapper">
        <j-select
            v-if="typeMap.get(itemType) === 'select'"
            v-model:value="myValue"
            :options="options"
            allowClear
            style="width: 100%"
            @change='selectChange'
        />
        <j-time-picker
          v-else-if="typeMap.get(itemType) === 'time'"
          v-model:value="myValue"
          allowClear
          format="HH:mm:ss"
          style="width: 100%"
          @change='timeChange'
        />
        <j-date-picker
            v-else-if="typeMap.get(itemType) === 'date'"
            v-model:value="myValue"
            allowClear
            showTime
            lang="cn"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            @change='dateChange'
        />
        <j-input-number
            v-else-if="typeMap.get(itemType) === 'inputNumber'"
            v-model:value="myValue"
            allowClear
            style="width: 100%"
            @change='inputChange'
        />
        <j-input
            allowClear
            v-else-if="typeMap.get(itemType) === 'object'"
            v-model:value="myValue"
            @change='inputChange'
        >
            <template #addonAfter>
                <AIcon type="FormOutlined" @click="modalVis = true" />
            </template>
        </j-input>
        <GeoComponent
            v-else-if="typeMap.get(itemType) === 'geoPoint'"
            v-model:point="myValue"
        />
        <j-input
            v-else-if="typeMap.get(itemType) === 'file'"
            v-model:value="myValue"
            placeholder="请输入图片链接"
            allowClear
        >
            <template #addonAfter>
                <j-upload
                    name="file"
                    :action="FILE_UPLOAD"
                    :headers="headers"
                    :showUploadList="false"
                    @change="handleFileChange"
                >
                    <AIcon type="UploadOutlined" />
                </j-upload>
            </template>
        </j-input>
        <j-input
            v-else
            allowClear
            type="text"
            v-model:value="myValue"
            style="width: 100%"
            @change='inputChange'
        />

        <!-- 代码编辑器弹窗 -->
        <j-modal
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
        </j-modal>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { UploadChangeParam, UploadFile } from 'ant-design-vue';
import { DefaultOptionType } from 'ant-design-vue/lib/select';
import MonacoEditor from '@/components/MonacoEditor/index.vue';
import GeoComponent from '@/components/GeoComponent/index.vue';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore } from '@/utils/comm';
import { ItemData, ITypes } from './types';
import { FILE_UPLOAD } from '@/api/comm';

type Emits = {
    (e: 'update:modelValue', data: string | number | boolean): void;
    (e: 'change', data: any, item?: any): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    itemData: {
        type: Object as PropType<ItemData>,
        default: () => ({}),
    },
    // 组件双向绑定的值
    modelValue: {
        type: [Number, String],
        default: '',
    },
    // 组件类型
    itemType: {
        type: String,
        default: () => 'string',
    },
    // 下拉选择框下拉数据
    options: {
        type: Array as PropType<DefaultOptionType[]>,
        default: () => [],
    },
});
// type Props = {
//     itemData?: Object;
//     modelValue?: string | number | boolean;
// };
// const props = withDefaults(defineProps<Props>(), {
//     itemData: () => ({ type: 'object' }),
//     modelValue: '',
// });

const componentsType = ref<ITypes>({
    int: 'inputNumber',
    long: 'inputNumber',
    float: 'inputNumber',
    double: 'inputNumber',
    string: 'input',
    array: 'input',
    password: 'input',
    enum: 'select',
    boolean: 'select',
    date: 'date',
    object: 'object',
    geoPoint: 'geoPoint',
    file: 'file',
});
const typeMap = new Map(Object.entries(componentsType.value));

const myValue = computed({
    get: () => {
        return props.modelValue;
    },
    set: (val: any) => {
        objectValue.value = val;
        emit('update:modelValue', val);
    },
});

// 代码编辑器弹窗
const modalVis = ref<boolean>(false);
const objectValue = ref<string>('');
const handleItemModalSubmit = () => {
    myValue.value = objectValue.value.replace(/[\r\n]\s*/g, '');
    modalVis.value = false;
};

// 文件上传
const headers = ref({ [TOKEN_KEY]: LocalStore.get(TOKEN_KEY) });
const handleFileChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
        const url = info.file.response?.result;
        myValue.value = url;
        emit('update:modelValue', url);
    }
};

const selectChange = (e: string, option: any) => {
  emit('change', e, option)
}

const timeChange = (e: any) => {
  emit('change', e)
}

const inputChange = (e: any) => {
  emit('change', e.target.value)
}

const dateChange = (e: any) => {
  emit('change', e)
}

</script>

<style lang="less" scoped></style>
