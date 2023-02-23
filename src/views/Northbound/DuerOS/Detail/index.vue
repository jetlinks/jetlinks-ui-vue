<template>
    <page-container>
        <a-card>
            <a-row :gutter="24">
                <a-col :span="16">
                    <TitleComponent data="基本信息" />
                    <a-form
                        :layout="'vertical'"
                        ref="formRef"
                        :model="modelRef"
                    >
                        <a-row :gutter="24">
                            <a-col :span="24">
                                <a-form-item
                                    label="名称"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入名称',
                                        },
                                        {
                                            max: 64,
                                            message: '最多输入64个字符',
                                        },
                                    ]"
                                >
                                    <a-input
                                        placeholder="请输入名称"
                                        v-model:value="modelRef.name"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="产品"
                                    name="id"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请选择产品',
                                        },
                                    ]"
                                >
                                    <a-select
                                        :disabled="
                                            type !== 'edit' &&
                                            modelRef.id &&
                                            modelRef.id !== ':id'
                                        "
                                        placeholder="请选择产品"
                                        v-model:value="modelRef.id"
                                        show-search
                                        :filter-option="filterOption"
                                        @change="productChange"
                                    >
                                        <a-select-option
                                            v-for="item in productList"
                                            :key="item.id"
                                            :value="item.id"
                                            :label="item.name"
                                            >{{ item.name }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    name="applianceType"
                                    :rules="{
                                        required: true,
                                        message: '请选择设备类型',
                                    }"
                                >
                                    <template #label>
                                        <span>
                                            设备类型
                                            <a-tooltip
                                                title="DuerOS平台拟定的规范"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </a-tooltip>
                                        </span>
                                    </template>
                                    <a-select
                                        placeholder="请选择设备类型"
                                        v-model:value="modelRef.applianceType"
                                        show-search
                                        :filter-option="filterOption"
                                        @change="typeChange"
                                    >
                                        <a-select-option
                                            v-for="item in typeList"
                                            :key="item.id"
                                            :value="item.id"
                                            :label="item.name"
                                            >{{ item.name }}</a-select-option
                                        >
                                    </a-select>
                                </a-form-item>
                                <a-form-item
                                    name="productName"
                                    v-show="false"
                                    label="产品名称"
                                >
                                    <a-input
                                        v-model:value="modelRef.productName"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <p>动作映射</p>
                                <a-collapse
                                    v-if="modelRef.actionMappings.length"
                                    :activeKey="actionActiveKey"
                                    @change="onActionCollChange"
                                >
                                    <a-collapse-panel
                                        v-for="(
                                            item, index
                                        ) in modelRef.actionMappings"
                                        :key="index"
                                        :header="
                                            item.action
                                                ? getTypesActions(
                                                      item.action,
                                                  ).find(
                                                      (i) =>
                                                          i.id === item.action,
                                                  )?.name
                                                : `动作映射${index + 1}`
                                        "
                                    >
                                        <template #extra
                                            ><AIcon
                                                type="DeleteOutlined"
                                                @click="delItem(index)"
                                        /></template>
                                        <a-row :gutter="24">
                                            <a-col :span="12">
                                                <a-form-item
                                                    :name="[
                                                        'actionMappings',
                                                        index,
                                                        'action',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message: '请选择动作',
                                                    }"
                                                >
                                                    <template #label>
                                                        <span>
                                                            动作
                                                            <a-tooltip
                                                                title="DuerOS平台拟定的设备类型具有的相关动作"
                                                            >
                                                                <AIcon
                                                                    type="QuestionCircleOutlined"
                                                                />
                                                            </a-tooltip>
                                                        </span>
                                                    </template>
                                                    <a-select
                                                        placeholder="请选择动作"
                                                        v-model:value="
                                                            item.action
                                                        "
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                    >
                                                        <a-select-option
                                                            v-for="i in getTypesActions(
                                                                item.action,
                                                            )"
                                                            :key="i.id"
                                                            :value="i.id"
                                                            :label="i.name"
                                                            >{{
                                                                i.name
                                                            }}</a-select-option
                                                        >
                                                    </a-select>
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="12">
                                                <a-form-item
                                                    :name="[
                                                        'actionMappings',
                                                        index,
                                                        'actionType',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message: '请选择操作',
                                                    }"
                                                >
                                                    <template #label>
                                                        <span>
                                                            操作
                                                            <a-tooltip
                                                                title="映射物联网平台中所选产品具备的动作"
                                                            >
                                                                <AIcon
                                                                    type="QuestionCircleOutlined"
                                                                />
                                                            </a-tooltip>
                                                        </span>
                                                    </template>
                                                    <a-select
                                                        placeholder="请选择操作"
                                                        v-model:value="
                                                            item.actionType
                                                        "
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                    >
                                                        <a-select-option
                                                            value="command"
                                                            >下发指令</a-select-option
                                                        >
                                                        <a-select-option
                                                            value="latestData"
                                                            >获取历史数据</a-select-option
                                                        >
                                                    </a-select>
                                                </a-form-item>
                                            </a-col>
                                            <a-col
                                                :span="24"
                                                v-if="item.actionType"
                                            >
                                                <a-form-item
                                                    :name="[
                                                        'actionMappings',
                                                        index,
                                                        'command',
                                                    ]"
                                                >
                                                    <Command
                                                        ref="command"
                                                        :metadata="
                                                            findProductMetadata
                                                        "
                                                        v-model:modelValue="
                                                            item.command
                                                        "
                                                        :actionType="
                                                            item.actionType
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                        </a-row>
                                    </a-collapse-panel>
                                </a-collapse>
                            </a-col>
                            <a-col :span="24">
                                <a-button
                                    type="dashed"
                                    style="width: 100%; margin-top: 10px"
                                    @click="addItem"
                                >
                                    <AIcon
                                        type="PlusOutlined"
                                        style="margin-left: 2px"
                                    />新增动作
                                </a-button>
                            </a-col>
                            <a-col :span="24">
                                <p style="margin-top: 20px">属性映射</p>
                                <a-collapse
                                    v-if="modelRef.propertyMappings.length"
                                    :activeKey="propertyActiveKey"
                                    @change="onPropertyCollChange"
                                >
                                    <a-collapse-panel
                                        v-for="(
                                            item, index
                                        ) in modelRef.propertyMappings"
                                        :key="index"
                                        :header="
                                            item.source
                                                ? getDuerOSProperties(
                                                      item.source,
                                                  ).find(
                                                      (i) =>
                                                          i.id === item.source,
                                                  )?.name
                                                : `属性映射${index + 1}`
                                        "
                                    >
                                        <template #extra
                                            ><AIcon
                                                type="DeleteOutlined"
                                                @click="delPropertyItem(index)"
                                        /></template>
                                        <a-row :gutter="24">
                                            <a-col :span="12">
                                                <a-form-item
                                                    label="DuerOS属性"
                                                    :name="[
                                                        'propertyMappings',
                                                        index,
                                                        'source',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message:
                                                            '请选择DuerOS属性',
                                                    }"
                                                >
                                                    <a-select
                                                        placeholder="请选择DuerOS属性"
                                                        v-model:value="
                                                            item.source
                                                        "
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                    >
                                                        <a-select-option
                                                            v-for="i in getDuerOSProperties(
                                                                item.source,
                                                            )"
                                                            :key="i.id"
                                                            :value="i.id"
                                                            >{{
                                                                i.name
                                                            }}</a-select-option
                                                        >
                                                    </a-select>
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="12">
                                                <a-form-item
                                                    label="平台属性"
                                                    :name="[
                                                        'propertyMappings',
                                                        index,
                                                        'target',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message:
                                                            '请选择平台属性',
                                                    }"
                                                >
                                                    <a-select
                                                        placeholder="请选择平台属性"
                                                        v-model:value="
                                                            item.target
                                                        "
                                                        mode="tags"
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                    >
                                                        <a-select-option
                                                            v-for="i in getProductProperties(
                                                                item.target,
                                                            )"
                                                            :key="i.id"
                                                            :value="item.id"
                                                            >{{
                                                                i.name
                                                            }}</a-select-option
                                                        >
                                                    </a-select>
                                                </a-form-item>
                                            </a-col>
                                        </a-row>
                                    </a-collapse-panel>
                                </a-collapse>
                            </a-col>
                            <a-col :span="24">
                                <a-button
                                    type="dashed"
                                    style="width: 100%; margin-top: 10px"
                                    @click="addPropertyItem"
                                >
                                    <AIcon
                                        type="PlusOutlined"
                                        style="margin-left: 2px"
                                    />新增属性
                                </a-button>
                            </a-col>
                            <a-col :span="24" style="margin-top: 20px">
                                <a-form-item
                                    label="说明"
                                    name="description"
                                    :rules="{
                                        max: 200,
                                        message: '最多输入200个字符',
                                    }"
                                >
                                    <a-textarea
                                        v-model:value="modelRef.description"
                                        placeholder="请输入说明"
                                        showCount
                                        :maxlength="200"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-form>
                    <div v-if="type === 'edit'">
                        <PermissionButton
                            type="primary"
                            :loading="loading"
                            @click="saveBtn"
                            :hasPermission="['Northbound/DuerOS:add', 'Northbound/DuerOS:update']"
                        >
                            保存
                        </PermissionButton>
                    </div>
                </a-col>
                <a-col :span="8">
                    <Doc />
                </a-col>
            </a-row>
        </a-card>
    </page-container>
</template>

<script lang="ts" setup>
import Doc from './doc.vue';
import Command from './command/index.vue';
import {
    queryProductList,
    queryTypes,
    savePatch,
    detail,
} from '@/api/northbound/dueros';
import _ from 'lodash';
import { message } from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

const formRef = ref();

const modelRef = reactive({
    id: undefined,
    name: undefined,
    applianceType: undefined,
    productName: undefined,
    actionMappings: [
        {
            actionType: undefined,
            action: undefined,
            command: {
                messageType: undefined,
                message: {
                    properties: undefined,
                    functionId: undefined,
                    inputs: [],
                },
            },
        },
    ],
    propertyMappings: [
        {
            source: undefined,
            target: [],
        },
    ],
    description: undefined,
});

const productList = ref<Record<string, any>[]>([]);
const typeList = ref<Record<string, any>[]>([]);
const command = ref([]);
const loading = ref<boolean>(false);
const type = ref<'edit' | 'view'>('edit');
const actionActiveKey = ref<string[]>(['0']);
const propertyActiveKey = ref<string[]>(['0']);

const onPropertyCollChange = (_key: string[]) => {
    propertyActiveKey.value = _key;
};

const onActionCollChange = (_key: string[]) => {
    actionActiveKey.value = _key;
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const addItem = () => {
    actionActiveKey.value.push(String(modelRef.actionMappings.length));
    modelRef.actionMappings.push({
        actionType: undefined,
        action: undefined,
        command: {
            messageType: undefined,
            message: {
                properties: undefined,
                functionId: undefined,
                inputs: [],
            },
        },
    });
};

const delItem = (index: number) => {
    modelRef.actionMappings.splice(index, 1);
};

const addPropertyItem = () => {
    propertyActiveKey.value.push(String(modelRef.propertyMappings.length));
    modelRef.propertyMappings.push({
        source: undefined,
        target: [],
    });
};

const delPropertyItem = (index: number) => {
    modelRef.propertyMappings.splice(index, 1);
};

const productChange = (value: string) => {
    modelRef.propertyMappings = modelRef.propertyMappings.map((item) => {
        return { source: item.source, target: [] };
    });
    const item = productList.value.find((item) => item.id === value);
    if (item) {
        modelRef.productName = item.name;
    }
};

const typeChange = () => {
    modelRef.propertyMappings = modelRef.propertyMappings.map((item) => {
        return { source: undefined, target: item.target };
    });
    modelRef.actionMappings = modelRef.actionMappings.map((item) => {
        return { ...item, action: undefined };
    });
};

const findApplianceType = computed(() => {
    if (!modelRef.applianceType) return;
    return typeList.value.find((item) => item.id === modelRef.applianceType);
});

const findProductMetadata = computed(() => {
    if (!modelRef.id) return;
    const _product = productList.value?.find(
        (item: any) => item.id === modelRef.id,
    );
    return _product?.metadata && JSON.parse(_product.metadata || '{}');
});

// 查询产品列表
const getProduct = async (id?: string) => {
    const resp = await queryProductList(id);
    if (resp.status === 200) {
        productList.value = resp?.result as Record<string, any>[];
    }
};

const getTypes = async () => {
    const resp = await queryTypes();
    if (resp.status === 200) {
        typeList.value = resp?.result as Record<string, any>[];
    }
};

const getDuerOSProperties = (val: string) => {
    const arr = modelRef.propertyMappings.map((item) => item?.source) || [];
    const checked = _.cloneDeep(arr);
    const _index = checked.findIndex((i) => i === val);
    // 去掉重复的
    checked.splice(_index, 1);
    const targetList = findApplianceType.value?.properties;
    const list = targetList?.filter(
        (i: { id: string }) => !checked.includes(i?.id as any),
    );
    return list || [];
};

const getProductProperties = (val: string[]) => {
    const items =
        modelRef.propertyMappings.map((item: { target: string[] }) =>
            item?.target.map((j) => j),
        ) || [];
    const checked = _.flatMap(items);
    const _checked: any[] = [];
    checked.map((_item) => {
        if (!val.includes(_item)) {
            _checked.push(_item);
        }
    });
    const sourceList = findProductMetadata.value?.properties;
    const list = sourceList?.filter(
        (i: { id: string }) => !_checked.includes(i.id),
    );
    return list || [];
};

const getTypesActions = (val: string) => {
    const items = modelRef.actionMappings.map((item) => item?.action) || [];
    const checked = _.cloneDeep(items);
    const _index = checked.findIndex((i) => i === val);
    checked.splice(_index, 1);
    const actionsList = findApplianceType.value?.actions || [];
    const list = actionsList?.filter(
        (i: { id: string; name: string }) => !checked.includes(i?.id as any),
    );
    return list || [];
};
const saveBtn = async () => {
    const tasks: any[] = [];
    for (let i = 0; i < command.value.length; i++) {
        const res = await (command.value[i] as any)?.saveBtn();
        if (!res || (res?.errorFields && res.errorFields.length)) {
            actionActiveKey.value.push(String(i));
            tasks.push(false);
        } else {
            tasks.push(res);
        }
    }
    formRef.value
        .validate()
        .then(async (data: any) => {
            if (tasks.every((item) => item) && data) {
                loading.value = true;
                const resp = await savePatch(data);
                loading.value = false;
                if (resp.status === 200) {
                    message.success('操作成功！');
                    formRef.value.resetFields();
                    router.push('/iot/northbound/DuerOS/');
                }
            }
        })
        .catch((err: any) => {
            const _arr = err.errorFields.map((item: any) => item.name);
            _arr.map((item: string | any[]) => {
                if (item.length >= 3) {
                    if (
                        item[0] === 'propertyMappings' &&
                        !propertyActiveKey.value.includes(item[1])
                    ) {
                        propertyActiveKey.value.push(item[1]);
                    }
                    if (
                        item[0] === 'actionMappings' &&
                        !actionActiveKey.value.includes(item[1])
                    ) {
                        actionActiveKey.value.push(item[1]);
                    }
                }
            });
        });
};
watch(
    () => route.params?.id,
    async (newId) => {
        if (newId) {
            getProduct(newId as string);
            getTypes();
            if (newId === ':id') return;
            const resp = await detail(newId as string);
            const _data: any = resp.result;
            if (_data) {
                _data.applianceType = _data?.applianceType?.value;
            }
            Object.assign(modelRef, _data);
        }
    },
    { immediate: true, deep: true },
);

watch(
    () => route.query.type,
    (newVal) => {
        if (newVal) {
            type.value = newVal as 'edit' | 'view';
        }
    },
    { immediate: true, deep: true },
);
</script>