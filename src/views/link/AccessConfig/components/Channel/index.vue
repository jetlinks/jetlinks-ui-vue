<template>
    <div class="container">
        <div v-if="type === 'channel'" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component data="基本信息" />
                    <div>
                        <j-form
                            :model="formState"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            @finish="onFinish"
                        >
                            <j-form-item
                                label="名称"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入名称',
                                        trigger: 'blur',
                                    },
                                    { max: 64, message: '最多可输入64个字符' },
                                ]"
                            >
                                <j-input
                                    placeholder="请输入名称"
                                    v-model:value="formState.name"
                                />
                            </j-form-item>
                            <j-form-item label="说明" name="description">
                                <j-textarea
                                    placeholder="请输入说明"
                                    :rows="4"
                                    v-model:value="formState.description"
                                    show-count
                                    :maxlength="200"
                                />
                            </j-form-item>
                            <j-form-item>
                                <PermissionButton
                                    v-if="view === 'false'"
                                    type="primary"
                                    html-type="submit"
                                    :hasPermission="`link/AccessConfig:${
                                        id === ':id' ? 'add' : 'update'
                                    }`"
                                >
                                    保存
                                </PermissionButton>
                            </j-form-item>
                        </j-form>
                    </div>
                </j-col>
                <j-col :span="12">
                    <div class="config-right">
                        <div class="config-right-item">
                            <title-component data="配置概览" />
                            <div class="config-right-item-context">
                                接入方式：{{ provider.name }}
                            </div>
                            <div class="config-right-item-context">
                                {{ provider.description }}
                            </div>
                            <div class="config-right-item-context">
                                消息协议：{{ provider.id }}
                            </div>
                        </div>
                        <div class="config-right-item">
                            <title-component data="设备接入指引" />
                            <div class="config-right-item-context">
                                1、配置{{ provider.name }}通道
                            </div>
                            <div class="config-right-item-context">
                                2、创建{{ provider.name }}设备接入网关
                            </div>
                            <div class="config-right-item-context">
                                3、创建产品，并选中接入方式为{{ provider.name }}
                            </div>
                            <div class="config-right-item-context">
                                4、添加设备，单独为每一个设备进行数据点绑定
                            </div>
                        </div>
                    </div>
                </j-col>
            </j-row>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessChannel">
import { message } from 'ant-design-vue';
import { update, save } from '@/api/link/accessConfig';
import { ProtocolMapping } from '../../data';

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
});

const type = ref(props.provider.type);

const formState = ref<FormState>({
    name: '',
    description: '',
});
const onFinish = async (values: any) => {
    const providerId = props.provider.id;
    const params = {
        ...values,
        provider: providerId,
        protocol: providerId,
        transport: ProtocolMapping.get(providerId),
        channel: providerId === 'modbus-tcp' ? 'modbus' : 'opc-ua',
    };
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        message.success('操作成功！');
        history.back();
    }
};

onMounted(() => {
    if (id === ':id') {
        formState.value = {
            name: props.data.name,
            description: props.data?.description || '',
        };
    }
});
</script>

<style lang="less" scoped>
.container {
    margin: 20px;
}

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
.config-right {
    padding: 20px;

    .config-right-item {
        margin-bottom: 10px;

        .config-right-item-title {
            width: 100%;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .config-right-item-context {
            margin: 5px 0;
            color: rgba(0, 0, 0, 0.8);
        }
    }
}
</style>
