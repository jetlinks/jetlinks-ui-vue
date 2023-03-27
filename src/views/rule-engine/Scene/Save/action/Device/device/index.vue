<template>
    <div>
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item
                name="selector"
                label="选择方式"
                v-show="!(list.length === 1)"
                :rules="[{ required: true, message: '请选择方式' }]"
            >
                <TopCard
                    :typeList="list"
                    v-model:value="modelRef.selector"
                    @change="onSelectorChange"
                />
            </j-form-item>
            <Device
                v-if="modelRef.selector === 'fixed'"
                :productId="productDetail.id"
                v-model:value="modelRef.selectorValues"
                @change="onDeviceChange"
            />
            <j-form-item
                v-else-if="modelRef.selector === 'relation'"
                label="关系"
                name="selectorValues"
                :rules="[{ required: true, message: '请选择关系' }]"
            >
                <RelationSelect
                    @change="onRelationChange"
                    v-model:value="modelRef.selectorValues"
                />
            </j-form-item>
            <j-form-item
                v-else-if="modelRef.selector === 'tag'"
                name="selectorValues"
                :rules="[{ required: true, message: '请选择标签' }]"
            >
                <Tag
                    v-model:value="modelRef.selectorValues"
                    :tagData="tagList"
                    @change="onTagChange"
                />
            </j-form-item>
            <j-form-item
                v-else
                name="selectorValues"
                label="变量"
                :rules="[{ required: true, message: '请选择' }]"
            >
                <j-tree-select
                    style="width: 100%; height: 100%"
                    :tree-data="builtInList"
                    v-model:value="modelRef.selectorValues"
                    placeholder="请选择参数"
                    @select="onVariableChange"
                    :fieldNames="{ label: 'name', value: 'id' }"
                >
                    <template #title="{ name, description }">
                        <j-space>
                            {{ name }}
                            <span style="color: grey; margin-left: 5px">{{
                                description
                            }}</span>
                        </j-space>
                    </template>
                </j-tree-select>
            </j-form-item>
        </j-form>
    </div>
</template>

<script setup lang='ts' name="Device">
import { useSceneStore } from '@/store/scene';
import TopCard from './TopCard.vue';
import { storeToRefs } from 'pinia';
import { getImage, onlyMessage } from '@/utils/comm';
import NoticeApi from '@/api/notice/config';
import Device from './Device.vue';
import Tag from './Tag.vue';
import RelationSelect from './RelationSelect.vue';
import { getParams } from '../../../util';
import { handleParamsData } from '../../../components/Terms/util';

const props = defineProps({
    values: {
        type: Object,
        default: () => {},
    },
    name: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    branchesName: {
        type: Number,
        default: 0,
    },
    parallel: {
        type: Boolean,
    },
    productDetail: {
        type: Object,
        default: () => {},
    },
});

// save保存deviceDetail
const emits = defineEmits(['save', 'cancel']);

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const formRef = ref();

const modelRef = reactive({
    selector: 'fixed',
    selectorValues: undefined,
    deviceId: '',
    source: '',
    upperKey: '',
});

const list = ref<any[]>([]);
const builtInList = ref<any[]>([]);
const tagList = ref<any[]>([]);

const TypeList = [
    {
        label: '自定义',
        value: 'fixed',
        image: getImage('/scene/device-custom.png'),
        tip: '自定义选择当前产品下的任意设备',
    },
    {
        label: '按关系',
        value: 'relation',
        image: getImage('/scene/device-relation.png'),
        tip: '选择与触发设备具有相同关系的设备',
    },
    {
        label: '按标签',
        value: 'tag',
        image: getImage('/scene/device-tag.png'),
        tip: '按标签选择产品下具有特定标签的设备',
    },
    {
        label: '按变量',
        value: 'variable',
        image: getImage('/scene/device-variable.png'),
        tip: '选择设备ID为上游变量值的设备',
    },
];

const filterTree = (nodes: any[]) => {
    if (!nodes?.length) {
        return nodes;
    }
    const arr = nodes.filter((it) => {
        if (
            it.children.find(
                (item: any) =>
                    item?.id?.indexOf(
                        'deviceId' || 'device_id' || 'device_Id',
                    ) > -1,
            ) &&
            !it.children.find((item: any) => item?.id.indexOf('boolean') > -1)
        ) {
            return true;
        }
        return false;
    });
    return arr.map((item) => {
        if (item.children) {
        }
        return {
            ...item,
            title: item.name,
            value: item.id,
            disabled: !!item.children,
        };
    });
};

const sourceChangeEvent = async () => {
    const _params = {
        branch: props.thenName,
        branchGroup: props.branchesName,
        action: props.name - 1,
    };
    //判断相同产品才有按变量
    const productId =
        data.value?.branches?.[props.branchesName].then?.[props.thenName]
            ?.actions?.[props.name > 0 ? props.name - 1 : 0]?.device?.productId;
    if (productId === props?.productDetail?.id) {
        const _data = await getParams(_params, unref(data));
        builtInList.value = handleParamsData(filterTree(_data), 'id');
    } else {
        builtInList.value = [];
    }
};

const filterType = async (newVal: any) => {
    const _list = TypeList.filter((item) => item.value === 'fixed');
    if (unref(data)?.trigger?.type === 'device') {
        //关系
        const res = await NoticeApi.getRelationUsers({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                { termType: 'eq', column: 'objectTypeName', value: '设备' },
            ],
        });
        if (res.status === 200 && res.result.length !== 0) {
            const array = TypeList.filter((item) => item.value === 'relation');
            _list.push(...array);
        }
        //标签
        const tag = JSON.parse(newVal?.metadata || '{}')?.tags;
        if (tag && tag.length !== 0) {
            tagList.value = tag || [];
            const array = TypeList.filter((item) => item.value === 'tag');
            _list.push(...array);
        }
        //变量
        if (
            builtInList.value.length !== 0 &&
            !props.parallel &&
            props.name !== 0
        ) {
            const array = TypeList.filter((item) => item.value === 'variable');
            _list.push(...array);
        }
        list.value = _list;
    } else {
        if (
            builtInList.value.length !== 0 &&
            !props.parallel &&
            props.name !== 0
        ) {
            const array = TypeList.filter((item) => item.value === 'variable');
            _list.push(...array);
        }
        list.value = _list;
    }
};

const onSelectorChange = (val: string) => {
    modelRef.selectorValues = undefined;
    modelRef.selector = val;
};

const onDeviceChange = (_detail: any) => {
    if (_detail) {
        if (_detail.id) {
            modelRef.deviceId = _detail?.id;
            modelRef.selectorValues = [
                { value: _detail.id, name: _detail.name },
            ] as any;
        } else {
            modelRef.deviceId = '';
            modelRef.selectorValues = [] as any;
        }
        emits('save', unref(modelRef), { name: _detail.name });
    }
};

const onRelationChange = (val: any, options: any) => {
    modelRef.deviceId = 'deviceId';
    modelRef.source = 'upper';
    modelRef.selectorValues = val;
    modelRef.upperKey = 'scene.deviceId';
    emits('save', unref(modelRef), { relationName: options.label });
};

const onTagChange = (val: any[], arr: any[]) => {
    if (val) {
        modelRef.deviceId = 'deviceId';
        modelRef.source = 'fixed';
    }
    const tagName = arr.map((i, _index) => {
        return `${_index !== 0 && _index !== (arr || []).length && i.type}${
            i.name
        }为${i.value}`;
    });
    emits(
        'save',
        unref(modelRef),
        {},
        arr ? { tagName: tagName.join('') } : {},
    );
};

const onVariableChange = (val: any, node: any) => {
    modelRef.deviceId = val;
    modelRef.selectorValues = [{ value: val, name: node.description }] as any;
    emits('save', unref(modelRef), { name: node.description });
};

watch(
    () => props.values,
    (newVal) => {
        Object.assign(modelRef, newVal);
    },
    {
        immediate: true,
        deep: true,
    },
);

watch(
    () => props.productDetail,
    async (newVal) => {
        await sourceChangeEvent();
        if (newVal) {
            filterType(newVal);
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

watch(
    () => [props.values, builtInList.value],
    ([newVal1, newVal2]) => {
        if (newVal2 && newVal2.length) {
            const param = newVal1?.selectorValues?.[0]?.value;
            const isVariable = (newVal2 || [])?.find((item: any) => {
                return item.children.find((i: any) => i.id === param);
            });
            if (isVariable) {
                modelRef.selector = 'variable';
            }
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

const onFormSave = () => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(async (_data: any) => {
                if (modelRef.selector === 'fixed') {
                    if (!modelRef?.selectorValues?.[0]?.value) {
                        onlyMessage('请选择设备', 'error');
                        reject(false);
                    } else {
                        resolve({
                            ..._data,
                            selectorValues: modelRef.selectorValues,
                        });
                    }
                } else {
                    resolve(_data);
                }
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

defineExpose({ onFormSave });
</script>

<style scoped lang='less'>
</style>