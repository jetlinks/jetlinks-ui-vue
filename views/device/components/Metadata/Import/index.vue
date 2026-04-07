<template>
    <a-modal
        :mask-closable="false"
        :title="$t('Import.index.603910-0')"
        destroy-on-close
        v-model:open="_visible"
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
                    {{ $t('Import.index.603910-1') }}
                </template>
                <template v-else>
                    {{ $t('Import.index.603910-2') }}
                </template>
            </p>
        </div>
        <a-form layout="vertical" ref="formRef" :model="formModel">
            <a-form-item
                v-if="type === 'product'"
                :label="$t('Import.index.603910-3')"
                name="type"
                :rules="[
                    {
                        required: true,
                        message: $t('Import.index.603910-4'),
                    },
                ]"
            >
                <a-select v-model:value="formModel.type">
                    <a-select-option value="copy">{{ $t('Import.index.603910-5') }}</a-select-option>
                    <a-select-option value="import">{{ $t('Import.index.603910-0') }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :label="$t('Import.index.603910-6')"
                :rules="[
                    {
                        required: true,
                        message: $t('Import.index.603910-7'),
                    },
                ]"
                name="copy"
                v-if="formModel.type === 'copy'"
            >
                <a-select
                    :options="productList"
                    v-model:value="formModel.copy"
                    option-filter-prop="label"
                    :placeholder="$t('Import.index.603910-7')"
                    showSearch
                ></a-select>
            </a-form-item>
            <a-form-item
                :label="$t('Import.index.603910-8')"
                :rules="[
                    {
                        required: true,
                        message: $t('Import.index.603910-9'),
                    },
                ]"
                name="metadata"
                v-if="type === 'device' || formModel.type === 'import'"
            >
                <a-select v-model:value="formModel.metadata">
                    <!-- <a-select-option value="jetlinks"
                        >Jetlinks{{ $t('Import.index.603910-18') }}</a-select-option
                    >
                    <a-select-option value="alink"
                        >阿里云物模型TSL</a-select-option
                    > -->
                    <a-select-option v-for="i in codecs" :value="i.id">{{
                        i.name
                    }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                :label="$t('Import.index.603910-10')"
                :rules="[
                    {
                        required: true,
                        message: $t('Import.index.603910-11'),
                    },
                ]"
                name="metadataType"
                v-if="type === 'device' || formModel.type === 'import'"
            >
                <a-select
                    v-model:value="formModel.metadataType"
                    @change="formModel.import = undefined"
                >
                    <a-select-option value="file">{{ $t('Import.index.603910-12') }}</a-select-option>
                    <a-select-option value="script">{{ $t('Import.index.603910-13') }}</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item
                v-if="
                    formModel.type === 'import' &&
                    formModel.metadataType === 'file'
                "
                :label="$t('Import.index.603910-12')"
                name="import"
                :rules="[
                    {
                        required: true,
                        message: $t('Import.index.603910-14'),
                    },
                ]"
            >
                <!-- <a-input v-model:value="formModel.upload">
                    <template #addonAfter>
                        <a-upload
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
                        </a-upload>
                    </template>
                </a-input> -->
                <a-upload
                    v-model:file-list="fileList"
                    :before-upload="beforeUpload"
                    accept=".json"
                    :show-upload-list="false"
                    :action="FileStaticPath()"
                    :headers="getUploadHeaders()"
                    @change="fileChange"
                >
                    <a-button>
                        <template #icon
                            ><AIcon type="UploadOutlined"
                        /></template>
                        {{ $t('Import.index.603910-15') }}
                    </a-button>
                </a-upload>
                <div style="margin-left: 10px; color: rgba(0, 0, 0, 0.6)">
                    {{ $t('Import.index.603910-16') }}
                </div>
            </a-form-item>
            <a-form-item
                :rules="[
                    {
                        required: true,
                        message: $t('Import.index.603910-17'),
                    },
                ]"
                name="import"
                v-if="
                    (type === 'device' || formModel.type === 'import') &&
                    formModel.metadataType === 'script'
                "
            >
                <template #label>
                    <a-space>
                        {{ $t('Import.index.603910-18') }}
                        <a-tooltip :title="$t('Import.index.603910-19')">
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="color: rgb(136, 136, 136)"
                            />
                        </a-tooltip>
                    </a-space>
                </template>
                <MonacoEditor
                    v-model:modelValue="formModel.import"
                    theme="vs"
                    style="height: 300px"
                    lang="json"
                ></MonacoEditor>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts" name="Import">
import { saveMetadata } from '../../../../../api/instance';
import {
    queryNoPagingPost,
    convertMetadata,
    modify,
  getCodecs
} from '../../../../../api/product';
import type { DefaultOptionType } from 'ant-design-vue/es/select';
import type {
    UploadProps,
    UploadFile,
    UploadChangeParam,
} from 'ant-design-vue/es';
import type { DeviceMetadata } from '../../../Product/typings';
import { useInstanceStore } from '../../../../../store/instance';
import { useProductStore } from '../../../../../store/product';
import {FileStaticPath } from '@jetlinks-web-core/api/comm';
import { onlyMessage } from '@jetlinks-web/utils';
import { useMetadataStore } from '../../../../../store/metadata';
import { omit } from 'lodash-es';
import { Modal } from 'ant-design-vue';
import { testObject, testType, testAliType, testAliObject } from './valideta';
import { useI18n } from 'vue-i18n';
import { getUploadHeaders } from '@jetlinks-web-core/utils'

const { t: $t } = useI18n();

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
const productMetadataMap = new Map()
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
        .map((item: any) => {
            productMetadataMap.set(item.id,item.metadata)
            return {
            label: item.name,
            value: item.id,
            key: item.id,
        }
        }) as DefaultOptionType[];
};
loadData();

// const propertiesSet = new Set(['id','name','expands','valueType']);

// const handleMadeDataNull = (data:any) =>{
//    return data?.properties?.some?.((item:any,index:number)=>{
//                 if(!item?.id){
//                     onlyMessage($t('Import.index.603910-20', [index + 1]),'error');
//                     return true
//                 }
//                 if(!item?.name){
//                     onlyMessage($t('Import.index.603910-22', [index + 1]),'error');
//                     return
//                 }
//                 if(!item?.expands?.source){
//                     onlyMessage($t('Import.index.603910-24', [index + 1]),'error');
//                     return
//                 }

//                 if((item?.expands?.source === 'device' ||    item?.expands?.source === 'rule') && !item?.expands?.type){
//                     onlyMessage($t('Import.index.603910-25', [index + 1]),'error');
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
                    $t('Import.index.603910-20', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    $t('Import.index.603910-21', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    $t('Import.index.603910-22', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.valueType?.type) {
                onlyMessage(
                    $t('Import.index.603910-23', [index + 1]),
                    'error',
                );
                check = true;
                return;
            } else {
                check = testType(item.valueType, index);
            }
            if (!item?.expands?.source) {
                onlyMessage(
                    $t('Import.index.603910-24', [index + 1]),
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
                    $t('Import.index.603910-25', [index + 1]),
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
                    $t('Import.index.603910-26', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    $t('Import.index.603910-27', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    $t('Import.index.603910-28', [index + 1]),
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
                    $t('Import.index.603910-29', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    $t('Import.index.603910-30', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    $t('Import.index.603910-31', [index + 1]),
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
                    $t('Import.index.603910-32', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.expands?.level) {
                onlyMessage(
                    $t('Import.index.603910-33', [index + 1]),
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
                                onlyMessage($t('Import.index.727422-0', [index + 1,number + 1]),'error');
                                check = true;
                                return;
                            }
                            if (!i?.name) {
                                onlyMessage($t('Import.index.727422-1', [index + 1,number + 1]),'error');
                                check = true;
                                return;
                            }
                            if (!i?.valueType?.type) {
                                onlyMessage($t('Import.index.727422-2', [index + 1,number + 1]),'error');
                                check = true;
                                return;
                            }
                        },
                    );
                } else {
                    onlyMessage(
                        $t('Import.index.603910-37', []),
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
                    $t('Import.index.603910-38', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (/[\u4e00-\u9fa5]/.test(item.id)) {
                onlyMessage(
                    $t('Import.index.603910-39', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    $t('Import.index.603910-40', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.valueType?.type) {
                onlyMessage(
                    $t('Import.index.603910-23', [index + 1]),
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
                    $t('Import.index.603910-41', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    $t('Import.index.603910-22', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.dataType?.type) {
                onlyMessage(
                    $t('Import.index.603910-42', [index + 1]),
                    'error',
                );
                check = true;
                return;
            } else {
              check = testAliType(item, index);
            }
        });
    }
    if (data?.functions && !check) {
        data?.functions.forEach((item: any, index: number) => {
            if (!item?.identifier) {
                onlyMessage(
                    $t('Import.index.603910-43', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    $t('Import.index.603910-28', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.callType) {
                onlyMessage(
                    $t('Import.index.603910-44', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (item?.inputData) {
              check = testAliObject(item.inputData, index);
            }
        });
    }
    if (data?.events && !check) {
        data?.events.forEach((item: any, index: number) => {
            if (!item?.identifier) {
                onlyMessage(
                    $t('Import.index.603910-45', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.name) {
                onlyMessage(
                    $t('Import.index.603910-31', [index + 1]),
                    'error',
                );
                check = true;
                return;
            }
            if (!item?.type) {
                onlyMessage(
                    $t('Import.index.603910-46', [index + 1]),
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
                                $t('Import.index.727422-3', [index + 1,number + 1]),'error');
                            check = true;
                            return;
                        }
                        if (!i?.name) {
                            onlyMessage(
                                $t('Import.index.727422-4', [index + 1,number + 1]),'error');
                            check = true;
                            return;
                        }
                        if (!i?.dataType?.type) {
                            onlyMessage(
                                $t('Import.index.727422-5', [ index + 1,number + 1]),'error');
                            check = true;
                            return;
                        }
                        if (!i?.dataType?.specs) {
                            onlyMessage(
                                $t('Import.index.727422-6', [index + 1,number + 1]),'error');
                            check = true;
                            return;
                        }
                    });
                } else {
                    onlyMessage(
                        $t('Import.index.603910-51', [index + 1]),
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
                        : false // aliCheck(data);

                if (!check) {
                    onlyMessage($t('Import.index.603910-52'));
                    formModel.import = json.target?.result;
                }
            } else {
                onlyMessage($t('Import.index.603910-53'), 'error');
            }
        };
    } else {
        onlyMessage($t('Import.index.603910-54'), 'error');
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
                    : false // aliCheck(JSON.parse(formModel.import));
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
                        Object.keys(metadata).forEach((i: any) => {
                            if (i === 'properties') {
                                metadata[i].filter((a: any) => {
                                    if (a?.expands?.source === 'rule') {
                                        hasVirtualRule.value = true;
                                        return;
                                    }
                                });
                            }
                        });
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
                            onlyMessage($t('Import.index.603910-55'));
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
                            ? $t('Import.index.603910-56')
                            : $t('Import.index.603910-57'),
                        'error',
                    );
                }
            } else {
                try {
                    const _object = JSON.parse(
                        (data?.type === 'copy' ? productMetadataMap.get(data.copy) : data.import) || '{}'
                    );
                    if (data?.type !== 'copy') {
                        Object.keys(_object)?.forEach((i: any) => {
                            const map = new Map();
                            if(Array.isArray(_object[i])){
                                _object[i]?.forEach((item: any) =>
                                map.set(item.id, item),
                            );
                                _object[i] = [...map.values()];
                            }
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
                        onlyMessage($t('Import.index.603910-56'), 'error');
                        loading.value = false;
                        return;
                    }
                    const { id } = route.params || {};
                    // const copyOperateLimits = operateLimits(
                    //     _object as DeviceMetadata,
                    // );
                    // console.log(copyOperateLimits,_object); // 导入取并集逻辑
                    Object.keys(_object)?.forEach((i: any) => {
                        if (i === 'functions') {
                            _object[i]?.forEach((a: any) => {
                                a?.inputs?.forEach((item: any) => {
                                    item.expands = {
                                        required: false,
                                        ...(item.expands || {})
                                    };
                                });
                            });
                        }
                        if (i === 'properties') {
                            _object[i]?.filter((a: any) => {
                                if (a?.expands?.source === 'rule') {
                                    hasVirtualRule.value = true;
                                    return;
                                }
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
                        onlyMessage($t('Import.index.603910-55'));
                        if (hasVirtualRule.value) {
                            setTimeout(() => {
                                Modal.info({
                                    title: $t('Import.index.603910-58'),
                                    okText: $t('Import.index.603910-59'),
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
                    if (e?.name === 'AxiosError') {
                        return;
                    }
                    onlyMessage(
                        e === 'error'
                            ? $t('Import.index.603910-56')
                            : $t('Import.index.603910-57'),
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
        codecs.value = [{ id: 'jetlinks', name: $t('Import.index.603910-60') }].concat(
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
