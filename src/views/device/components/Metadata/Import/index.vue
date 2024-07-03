<template>
    <j-modal
        :mask-closable="false"
        title="导入物模型"
        destroy-on-close
        v-model:visible="_visible"
        @cancel="close"
        @ok="handleImport"
        :confirm-loading="loading"
    >
        <div class="import-content">
            <p class="import-tip">
                <AIcon
                    type="ExclamationCircleOutlined"
                    style="margin-right: 5px"
                />
                <template v-if="type === 'product'">
                    导入的物模型会覆盖原来的属性、功能、事件、标签，请谨慎操作。
                </template>
                <template v-else>
                    导入时会根据标识跳过继承自产品物模型的属性、功能、事件、标签。
                </template>
            </p>
        </div>
        <j-form layout="vertical" ref="formRef" :model="formModel">
            <j-form-item
                v-if="type === 'product'"
                label="导入方式"
                name="type"
                :rules="[
                    {
                        required: true,
                        message: '请选择导入方式',
                    },
                ]"
            >
                <j-select v-model:value="formModel.type">
                    <j-select-option value="copy">拷贝产品</j-select-option>
                    <j-select-option value="import">导入物模型</j-select-option>
                </j-select>
            </j-form-item>
            <j-form-item
                label="选择产品"
                :rules="[
                    {
                        required: true,
                        message: '请选择产品',
                    },
                ]"
                name="copy"
                v-if="formModel.type === 'copy'"
            >
                <j-select
                    :options="productList"
                    v-model:value="formModel.copy"
                    option-filter-prop="label"
                    placeholder="请选择产品"
                    showSearch
                ></j-select>
            </j-form-item>
            <j-form-item
                label="物模型类型"
                :rules="[
                    {
                        required: true,
                        message: '请选择物模型类型',
                    },
                ]"
                name="metadata"
                v-if="type === 'device' || formModel.type === 'import'"
            >
                <j-select v-model:value="formModel.metadata">
                    <!-- <j-select-option value="jetlinks"
                        >Jetlinks物模型</j-select-option
                    >
                    <j-select-option value="alink"
                        >阿里云物模型TSL</j-select-option
                    > -->
                    <j-select-option v-for="i in codecs" :value="i.id">{{
                        i.name
                    }}</j-select-option>
                </j-select>
            </j-form-item>
            <j-form-item
                label="导入类型"
                :rules="[
                    {
                        required: true,
                        message: '请选择导入类型',
                    },
                ]"
                name="metadataType"
                v-if="type === 'device' || formModel.type === 'import'"
            >
                <j-select
                    v-model:value="formModel.metadataType"
                    @change="formModel.import = undefined"
                >
                    <j-select-option value="file">文件上传</j-select-option>
                    <j-select-option value="script">脚本</j-select-option>
                </j-select>
            </j-form-item>
            <j-form-item
                v-if="
                    formModel.type === 'import' &&
                    formModel.metadataType === 'file'
                "
                label="文件上传"
                name="import"
                :rules="[
                    {
                        required: true,
                        message: '请上传文件',
                    },
                ]"
            >
                <!-- <j-input v-model:value="formModel.upload">
                    <template #addonAfter>
                        <j-upload
                            v-model:file-list="fileList"
                            :before-upload="beforeUpload"
                            accept=".json"
                            :show-upload-list="false"
                            :action="FILE_UPLOAD"
                            @change="fileChange"
                            :headers="{ 'X-Access-Token': getToken() }"
                        >
                            <AIcon
                                type="UploadOutlined"
                                class="upload-button"
                            />
                        </j-upload>
                    </template>
                </j-input> -->
                <j-upload
                    v-model:file-list="fileList"
                    :before-upload="beforeUpload"
                    accept=".json"
                    :show-upload-list="false"
                    :action="FILE_UPLOAD"
                    @change="fileChange"
                    :headers="{ 'X-Access-Token': getToken() }"
                >
                    <j-button>
                        <template #icon
                            ><AIcon type="UploadOutlined"
                        /></template>
                        上传文件
                    </j-button>
                </j-upload>
                <div style="margin-left: 10px; color: rgba(0, 0, 0, 0.6)">
                    支持扩展名：.json
                </div>
            </j-form-item>
            <j-form-item
                :rules="[
                    {
                        required: true,
                        message: '请输入物模型',
                    },
                ]"
                name="import"
                v-if="
                    (type === 'device' || formModel.type === 'import') &&
                    formModel.metadataType === 'script'
                "
            >
                <template #label>
                    <j-space>
                        物模型
                        <j-tooltip title="在编辑器中编写物模型脚本">
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="color: rgb(136, 136, 136)"
                            />
                        </j-tooltip>
                    </j-space>
                </template>
                <JMonacoEditor
                    v-model:modelValue="formModel.import"
                    theme="vs"
                    style="height: 300px"
                    lang="json"
                ></JMonacoEditor>
            </j-form-item>
        </j-form>
    </j-modal>
</template>
<script setup lang="ts" name="Import">
import { getCodecs } from '@/api/device/product';
import { saveMetadata } from '@/api/device/instance';
import {
    queryNoPagingPost,
    convertMetadata,
    modify,
} from '@/api/device/product';
import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type {
    UploadProps,
    UploadFile,
    UploadChangeParam,
} from 'ant-design-vue/es';
import type { DeviceMetadata } from '@/views/device/Product/typings';
import { useInstanceStore } from '@/store/instance';
import { useProductStore } from '@/store/product';
import { FILE_UPLOAD } from '@/api/comm';
import { getToken, onlyMessage } from '@/utils/comm';
import { useMetadataStore } from '@/store/metadata';
import { omit } from 'lodash-es';
import { Modal } from 'jetlinks-ui-components';
import { testObject, testType, testAliType, testAliObject } from './valideta';

const route = useRoute();
const instanceStore = useInstanceStore();
const productStore = useProductStore();

interface Props {
    visible: boolean;
    type: 'device' | 'product';
}
interface Emits {
    (e: 'update:visible', data: boolean): void;
    (e: 'submit', data: any): void;
}
const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const loading = ref(false);
const codecs = ref<any>([]);
const _visible = computed({
    get: () => {
        return props.visible;
    },
    set: (val: any) => {
        emits('update:visible', val);
    },
});

const close = () => {
    emits('update:visible', false);
};

/** form表单 */
const formModel = reactive<Record<string, any>>({
    type: 'import',
    metadata: 'jetlinks',
    metadataType: 'script',
});
// const { validate, validateInfos } = useForm(formModel, rules);
const fileList = ref<UploadFile[]>([]);
const hasVirtualRule = ref(false);
const formRef = ref();

const productList = ref<DefaultOptionType[]>([]);

const loadData = async () => {
    const { id } = route.params || {};
    const product = (await queryNoPagingPost({
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'id$not', value: id }],
    })) as any;
    productList.value = product.result
        .filter((i: any) => i?.metadata)
        .map((item: any) => ({
            label: item.name,
            value: item.metadata,
            key: item.id,
        })) as DefaultOptionType[];
};
loadData();

// const propertiesSet = new Set(['id','name','expands','valueType']);

// const handleMadeDataNull = (data:any) =>{
//    return data?.properties?.some?.((item:any,index:number)=>{
//                 if(!item?.id){
//                     onlyMessage(`属性定义第${index + 1}个数组中缺失id属性`,'error');
//                     return true
//                 }
//                 if(!item?.name){
//                     onlyMessage(`属性定义第${index + 1}个数组中缺失name属性`,'error');
//                     return
//                 }
//                 if(!item?.expands?.source){
//                     onlyMessage(`属性定义第${index + 1}个数组中缺失expands.source属性`,'error');
//                     return
//                 }

//                 if((item?.expands?.source === 'device' ||    item?.expands?.source === 'rule') && !item?.expands?.type){
//                     onlyMessage(`属性定义第${index + 1}个数组中缺失type属性`,'error');
//                     return
//                 }
//         }) || false
// }
const requiredCheck = (data: any) => {
    let check: boolean = false;
    if (data?.properties && !check) {
        data.properties.some((item: any, index: number) => {
            if (!item?.id) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中缺失id属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中id属性不能包含中文`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中缺失name属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.valueType?.type) {
                onlyMessage(
                    `标签定义第${index + 1}个数组中缺失valueType.type属性`,
                    'error',
                );
                check = true;
                return;
            } else {
                check = testType(item.valueType, index);
            }
            if (!item?.expands?.source) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中缺失expands.source属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (
                (item?.expands?.source === 'device' ||
                    item?.expands?.source === 'rule') &&
                !item?.expands?.type
            ) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中缺失type属性`,
                    'error',
                );
                check = true;
                return;
            }
        });
    }
    if (data?.functions && !check) {
        data?.functions.forEach((item: any, index: number) => {
            if (!item?.id) {
                onlyMessage(
                    `方法定义第${index + 1}个数组中缺失id属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    `方法定义第${index + 1}个数组中id属性不能包含中文`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    `方法定义第${index + 1}个数组中缺失name属性`,
                    'error',
                );
                check = true;
                return;
            }
            // if(!item?.async && item?.async !== false){
            //         onlyMessage(`方法定义第${index + 1}个数组中缺失async属性`,'error');
            //         check = true
            //         return
            // }
            if (item?.inputs) {
                testObject(item.inputs, index);
                // item.inputs.forEach((i:any)=>{
                //     if(!i?.expands?.required && i?.expands?.required !== false){
                //         onlyMessage(`方法定义inputs第${index+1}个数组中缺失expands.required属性`,'error')
                //         check = true
                //         return
                //     }
                // })
            }
        });
    }
    if (data?.events && !check) {
        data?.events.forEach((item: any, index: number) => {
            if (!item?.id) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中缺失id属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中id属性不能包含中文`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中缺失name属性`,
                    'error',
                );
                check = true;
                return;
            }
            // if(!item?.async && item?.async !== false){
            //         onlyMessage(`事件定义第${index + 1}个数组中缺失async属性`,'error');
            //         check = true
            //         return
            // }
            if (!item?.valueType?.type) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中缺失valueType.type属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.expands?.level) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中缺失expands.level属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!check) {
                if (item?.valueType?.properties) {
                    item?.valueType?.properties.forEach(
                        (i: any, number: number) => {
                            if (!i?.id) {
                                onlyMessage(
                                    `事件定义第${
                                        index + 1
                                    }个数组中缺失valueType.properties数组第${
                                        number + 1
                                    }项的id属性`,
                                    'error',
                                );
                                check = true;
                                return;
                            }
                            if (!i?.name) {
                                onlyMessage(
                                    `事件定义第${
                                        index + 1
                                    }个数组中缺失valueType.properties数组第${
                                        number + 1
                                    }项的name属性`,
                                    'error',
                                );
                                check = true;
                                return;
                            }
                            if (!i?.valueType?.type) {
                                onlyMessage(
                                    `事件定义第${
                                        index + 1
                                    }个数组中缺失valueType.properties数组第${
                                        number + 1
                                    }项的valueType.type属性`,
                                    'error',
                                );
                                check = true;
                                return;
                            }
                        },
                    );
                } else {
                    onlyMessage(
                        `事件定义第${
                            index + 1
                        }个数组中缺失valueType.properties数组`,
                        'error',
                    );
                    check = true;
                    return;
                }
            }
        });
    }
    if (data?.tags && !check) {
        data?.tags.forEach((item: any, index: number) => {
            if (!item?.id) {
                onlyMessage(
                    `标签定义第${index + 1}个数组中缺失id属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    `标签定义第${index + 1}个数组中id属性不能包含中文`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    `标签定义第${index + 1}个数组中缺失name属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.valueType?.type) {
                onlyMessage(
                    `标签定义第${index + 1}个数组中缺失valueType.type属性`,
                    'error',
                );
                check = true;
                return;
            } else {
                testType(item?.valueType, index);
            }
            // if (!item?.expands?.type) {
            //     onlyMessage(
            //         `标签定义第${index + 1}个数组中缺失expands.type属性`,
            //         'error',
            //     );
            //     check = true;
            //     return;
            // }
        });
    }
    return check;
};

const aliCheck = (data: any) => {
    let check: boolean = false;
    if (data?.properties && !check) {
        data.properties.some((item: any, index: number) => {
            if (!item?.identifier) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中缺失identifier属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中缺失name属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.dataType?.type) {
                onlyMessage(
                    `属性定义第${index + 1}个数组中缺失dataType.type属性`,
                    'error',
                );
                check = true;
                return;
            } else {
                testAliType(item, index);
            }
        });
    }
    if (data?.functions && !check) {
        data?.functions.forEach((item: any, index: number) => {
            if (!item?.identifier) {
                onlyMessage(
                    `方法定义第${index + 1}个数组中缺失identifier属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    `方法定义第${index + 1}个数组中缺失name属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.callType) {
                onlyMessage(
                    `方法定义第${index + 1}个数组中缺失callType属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (item?.inputData) {
                testAliObject(item.inputData, index);
            }
        });
    }
    if (data?.events && !check) {
        data?.events.forEach((item: any, index: number) => {
            if (!item?.identifier) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中缺失identifier属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中缺失name属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.type) {
                onlyMessage(
                    `事件定义第${index + 1}个数组中缺失type属性`,
                    'error',
                );
                check = true;
                return;
            }
            if (!check) {
                if (item?.outputData) {
                    item?.outputData?.forEach((i: any, number: number) => {
                        if (!i?.identifier) {
                            onlyMessage(
                                `事件定义第${
                                    index + 1
                                }个数组中缺失outputData数组第${
                                    number + 1
                                }项的id属性`,
                                'error',
                            );
                            check = true;
                            return;
                        }
                        if (!i?.name) {
                            onlyMessage(
                                `事件定义第${
                                    index + 1
                                }个数组中缺失outputData数组第${
                                    number + 1
                                }项的name属性`,
                                'error',
                            );
                            check = true;
                            return;
                        }
                        if (!i?.dataType?.type) {
                            onlyMessage(
                                `事件定义第${
                                    index + 1
                                }个数组中缺失outputData数组第${
                                    number + 1
                                }项的dataType.type属性`,
                                'error',
                            );
                            check = true;
                            return;
                        }
                        if (!i?.dataType?.specs) {
                            onlyMessage(
                                `事件定义第${
                                    index + 1
                                }个数组中缺失outputData数组第${
                                    number + 1
                                }项的dataType.specs属性`,
                                'error',
                            );
                            check = true;
                            return;
                        }
                    });
                } else {
                    onlyMessage(
                        `事件定义第${index + 1}个数组中缺失outputData数组`,
                        'error',
                    );
                    check = true;
                    return;
                }
            }
        });
    }
    return check;
};
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (file.type === 'application/json') {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (json) => {
            if (json.target?.result) {
                const data = JSON.parse(json.target?.result);
                let check =
                    formModel.metadata === 'jetlinks'
                        ? requiredCheck(data)
                        : aliCheck(data);
                if (!check) {
                    onlyMessage('操作成功！');
                    formModel.import = json.target?.result;
                }
            } else {
                onlyMessage('文件内容不能为空', 'error');
            }
        };
    } else {
        onlyMessage('请上传json格式的文件', 'error');
    }
};
const fileChange = (info: UploadChangeParam) => {
    if (info.file.status === 'done') {
        const { response } = info.file;
        if (response.status === 200) {
            formModel.upload = response.result;
        }
    }
};

const uniqArray = (arr: any[]) => {
    const _map = new Map();
    for (let item of arr) {
        _map.set(item.id, item);
    }
    return [..._map.values()];
};

const operateLimits = (mdata: DeviceMetadata) => {
    hasVirtualRule.value = false;
    const obj: DeviceMetadata = { ...mdata };
    const old = JSON.parse(
        (props.type === 'device'
            ? instanceStore.detail?.metadata
            : productStore.detail?.metadata) || '{}',
    );
    const fid = instanceStore.detail?.features?.map((item) => item.id);
    const _data: DeviceMetadata = {
        properties: [],
        events: [],
        functions: [],
        tags: [],
    };
    _data.properties = uniqArray([
        ...(old?.properties || []),
        ...uniqArray(obj?.properties || []),
    ]);
    _data.events = uniqArray([
        ...(old?.events || []),
        ...uniqArray(obj?.events || []),
    ]);
    _data.functions = uniqArray([
        ...(old?.functions || []),
        ...uniqArray(obj?.functions || []),
    ]);
    _data.tags = uniqArray([
        ...(old?.tags || []),
        ...uniqArray(obj?.tags || []),
    ]);

    if (fid?.includes('eventNotModifiable')) {
        _data.events = old?.events || [];
    }
    if (fid?.includes('propertyNotModifiable')) {
        _data.properties = old?.properties || [];
    }

    (_data?.properties || []).map((item) => {
        if (item.expands?.source === 'rule') {
            hasVirtualRule.value = true;
            item.expands = omit(item.expands, ['virtualRule']);
        }
        return item;
    });
    return _data;
};
const metadataStore = useMetadataStore();

const handleImport = async () => {
    formRef.value.validate().then(async (data: any) => {
        let check;
        if (
            (props.type === 'device' || formModel.type === 'import') &&
            formModel.metadataType === 'script'
        ) {
            check =
                formModel.metadata === 'jetlinks'
                    ? requiredCheck(JSON.parse(formModel.import))
                    : aliCheck(JSON.parse(formModel.import));
        }
        if (!check) {
            const { id } = route.params || {};
            if (data.metadata === 'alink') {
                try {
                    const _import = omit(JSON.parse(data.import), [
                        'schema',
                        'profile',
                    ]);
                    Object.keys(_import).forEach((i: any) => {
                        const map = new Map();
                        _import[i].forEach((item: any) =>
                            map.set(item.identifier, item),
                        );
                        _import[i] = [...map.values()];
                    });
                    loading.value = true;
                    const res = await convertMetadata(
                        'from',
                        'alink',
                        _import,
                    ).catch((err) => err);
                    if (res.status === 200) {
                        // const metadata = operateLimits(res.result); // 导入取并集逻辑
                        const metadata = res.result;
                        let result;
                        if (props?.type === 'device') {
                            result = await saveMetadata(
                                id as string,
                                metadata,
                            ).catch((err) => err);
                        } else {
                            result = await modify(id as string, {
                                id,
                                metadata: JSON.stringify(metadata),
                            }).catch((err) => err);
                        }
                        if (result.success) {
                            onlyMessage('导入成功');
                        }
                        loading.value = false;
                    } else {
                        loading.value = false;
                        return;
                    }
                    if (props?.type === 'device') {
                        await instanceStore.refresh(id as string);
                    } else {
                        await productStore.getDetail(id as string);
                    }
                    metadataStore.set('importMetadata', true);
                    close();
                } catch (e) {
                    onlyMessage(
                        e === 'error'
                            ? '物模型数据不正确'
                            : '上传json格式的物模型文件',
                        'error',
                    );
                }
            } else {
                try {
                    const _object = JSON.parse(
                        data[data?.type === 'copy' ? 'copy' : 'import'] || '{}',
                    );
                    if (data?.type !== 'copy') {
                        Object.keys(_object).forEach((i: any) => {
                            const map = new Map();
                            _object[i].forEach((item: any) =>
                                map.set(item.id, item),
                            );
                            _object[i] = [...map.values()];
                        });
                    }
                    if (
                        !(
                            !!_object?.properties ||
                            !!_object?.events ||
                            !!_object?.functions ||
                            !!_object?.tags
                        )
                    ) {
                        onlyMessage('物模型数据不正确', 'error');
                        loading.value = false;
                        return;
                    }
                    const { id } = route.params || {};
                    // const copyOperateLimits = operateLimits(
                    //     _object as DeviceMetadata,
                    // );
                    // console.log(copyOperateLimits,_object); // 导入取并集逻辑
                    Object.keys(_object).forEach((i: any) => {
                        if (i === 'functions') {
                            _object[i].forEach((a: any) => {
                                a?.inputs?.forEach((item: any) => {
                                    item.expands = {
                                        required: false,
                                    };
                                });
                            });
                        }
                    });
                    const params = {
                        id,
                        metadata: JSON.stringify(_object),
                    };
                    const paramsDevice = _object;
                    let resp = undefined;
                    loading.value = true;
                    if (props?.type === 'device') {
                        resp = await saveMetadata(id as string, paramsDevice);
                    } else {
                        resp = await modify(id as string, params);
                    }
                    loading.value = false;
                    if (resp.success) {
                        onlyMessage('导入成功');
                        if (hasVirtualRule.value) {
                            setTimeout(() => {
                                Modal.info({
                                    title: '导入数据存在虚拟属性，请及时添加虚拟属性计算规则。',
                                    okText: '确认',
                                });
                            }, 300);
                        }
                    }
                    if (props?.type === 'device') {
                        await instanceStore.refresh(id as string);
                    } else {
                        await productStore.getDetail(id as string);
                    }
                    metadataStore.set('importMetadata', true);
                    close();
                } catch (e) {
                    loading.value = false;
                    onlyMessage(
                        e === 'error'
                            ? '物模型数据不正确'
                            : '上传json格式的物模型文件',
                        'error',
                    );
                }
            }
        }
    });
};

onMounted(async () => {
    const res = await getCodecs();
    if (res.status === 200) {
        codecs.value = [{ id: 'jetlinks', name: '标准物模型' }].concat(
            res.result,
        );
    }
});
// const showProduct = computed(() => formModel.type === 'copy')
</script>
<style scoped lang="less">
.import-content {
    background: rgb(236, 237, 238);

    .import-tip {
        padding: 10px;
    }
}

.upload-button {
    width: 37px;
    height: 30px;
    line-height: 30px;
    margin: 0 -11px;
}
</style>
